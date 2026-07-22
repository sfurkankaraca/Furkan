import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

function readGenres(data: Record<string, unknown>): string[] {
  const raw = data.musicGenres;
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.map((x) => String(x).trim()).filter((s) => s.length > 0))];
}

function str(data: Record<string, unknown>, k: string) {
  return String(data[k] ?? "").trim();
}

function optStr(data: Record<string, unknown>, k: string) {
  const v = str(data, k);
  return v === "" ? null : v;
}

const BIO_MAX = 500;

/** @ veya tam URL kabul eder; DB’de @ olmadan saklanır */
function normalizeInstagramHandle(raw: string): { ok: true; value: string | null } | { ok: false; error: string } {
  const s = raw.trim();
  if (s === "") return { ok: true, value: null };
  let t = s.replace(/^@+/, "");
  const urlMatch = t.match(/instagram\.com\/([A-Za-z0-9._]+)/i);
  if (urlMatch) t = urlMatch[1];
  t = t.split(/[/?#]/)[0] ?? t;
  t = t.trim();
  if (!/^[A-Za-z0-9._]{1,30}$/.test(t)) {
    return { ok: false, error: "Geçerli bir Instagram kullanıcı adı girin" };
  }
  return { ok: true, value: t };
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Veritabanı yok" }, { status: 503 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { profile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı yok" }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    name: user.name,
    image: user.image,
    needsOnboarding: user.profileCompletedAt == null,
    profile: user.profile,
  });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Veritabanı yok" }, { status: 503 });
  }

  let body: {
    mode?: string;
    step?: number;
    data?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  if (body.mode === "settings") {
    const me = await prisma.user.findUnique({
      where: { id: session.sub },
      include: { profile: true },
    });
    if (!me?.profileCompletedAt) {
      return NextResponse.json({ error: "Önce profil kurulumunu tamamlayın" }, { status: 400 });
    }
    const data = body.data || {};
    const genres = readGenres(data);
    const favoriteArtists = optStr(data, "favoriteArtists");
    const musicNotes = optStr(data, "musicNotes");
    const imageUrl = str(data, "image");
    const bioRaw = str(data, "bio");
    const igRaw = str(data, "instagramHandle");

    if (bioRaw.length > BIO_MAX) {
      return NextResponse.json({ error: `Biyo en fazla ${BIO_MAX} karakter olabilir` }, { status: 400 });
    }
    const bio = bioRaw === "" ? null : bioRaw;
    const igNorm = normalizeInstagramHandle(igRaw);
    if (!igNorm.ok) {
      return NextResponse.json({ error: igNorm.error }, { status: 400 });
    }

    if (!me.profile) {
      return NextResponse.json({ error: "Profil kaydı yok" }, { status: 400 });
    }

    await prisma.userProfile.update({
      where: { userId: session.sub },
      data: {
        musicGenres: genres,
        favoriteArtists,
        musicNotes,
        bio,
        instagramHandle: igNorm.value,
      },
    });

    const wantsImageUpdate = Object.prototype.hasOwnProperty.call(data, "image");
    if (wantsImageUpdate) {
      if (imageUrl === "") {
        await prisma.user.update({
          where: { id: session.sub },
          data: { image: null },
        });
      } else if (imageUrl) {
        if (!/^https?:\/\/.+/i.test(imageUrl)) {
          return NextResponse.json({ error: "Geçerli bir fotoğraf URL’si girin (https://...)" }, { status: 400 });
        }
        await prisma.user.update({
          where: { id: session.sub },
          data: { image: imageUrl },
        });
      }
    }

    const fresh = await prisma.user.findUnique({
      where: { id: session.sub },
      include: { profile: true },
    });

    return NextResponse.json({
      ok: true,
      needsOnboarding: fresh?.profileCompletedAt == null,
      profile: fresh?.profile,
      email: fresh?.email,
      name: fresh?.name,
      image: fresh?.image,
    });
  }

  const step = Number(body.step);
  const data = body.data || {};
  if (![1, 2, 3, 4, 5].includes(step)) {
    return NextResponse.json({ error: "Geçersiz adım" }, { status: 400 });
  }

  const existingProfile = await prisma.userProfile.findUnique({
    where: { userId: session.sub },
  });
  if (!existingProfile && step > 1) {
    return NextResponse.json({ error: "Önce müzik profili adımını tamamlayın" }, { status: 400 });
  }

  if (step === 1) {
    const genres = readGenres(data);
    if (genres.length < 1) {
      return NextResponse.json({ error: "En az bir müzik türü seçin" }, { status: 400 });
    }
    const favoriteArtists = optStr(data, "favoriteArtists");
    const musicNotes = optStr(data, "musicNotes");
    const imageUrl = str(data, "image");
    if (imageUrl) {
      if (!/^https?:\/\/.+/i.test(imageUrl)) {
        return NextResponse.json({ error: "Geçerli bir fotoğraf URL’si girin (https://...)" }, { status: 400 });
      }
      await prisma.user.update({
        where: { id: session.sub },
        data: { image: imageUrl },
      });
    }
    await prisma.userProfile.upsert({
      where: { userId: session.sub },
      create: {
        userId: session.sub,
        musicGenres: genres,
        favoriteArtists,
        musicNotes,
        onboardingStep: 1,
      },
      update: {
        musicGenres: genres,
        favoriteArtists,
        musicNotes,
        onboardingStep: 1,
      },
    });
  } else if (step === 2) {
    const firstName = str(data, "firstName");
    const lastName = str(data, "lastName");
    const phone = str(data, "phone");
    if (firstName.length < 1 || lastName.length < 1) {
      return NextResponse.json({ error: "Ad ve soyad gerekli" }, { status: 400 });
    }
    if (phone.length < 10) {
      return NextResponse.json({ error: "Geçerli bir telefon girin" }, { status: 400 });
    }
    let birthDate: Date | null = null;
    const bd = str(data, "birthDate");
    if (bd) {
      const d = new Date(bd);
      if (!Number.isNaN(d.getTime())) birthDate = d;
    }
    await prisma.user.update({
      where: { id: session.sub },
      data: { name: `${firstName} ${lastName}`.trim() },
    });
    await prisma.userProfile.update({
      where: { userId: session.sub },
      data: {
        firstName,
        lastName,
        phone,
        birthDate,
        onboardingStep: 2,
      },
    });
  } else if (step === 3) {
    const city = str(data, "city");
    if (city.length < 2) {
      return NextResponse.json({ error: "Şehir gerekli" }, { status: 400 });
    }
    await prisma.userProfile.update({
      where: { userId: session.sub },
      data: {
        city,
        district: optStr(data, "district"),
        addressLine: optStr(data, "addressLine"),
        postalCode: optStr(data, "postalCode"),
        country: optStr(data, "country") || "TR",
        onboardingStep: 3,
      },
    });
  } else if (step === 4) {
    await prisma.userProfile.update({
      where: { userId: session.sub },
      data: {
        companyName: optStr(data, "companyName"),
        taxNumber: optStr(data, "taxNumber"),
        taxOffice: optStr(data, "taxOffice"),
        invoiceEmail: optStr(data, "invoiceEmail"),
        onboardingStep: 4,
      },
    });
  } else if (step === 5) {
    if (!data.termsAccepted) {
      return NextResponse.json({ error: "Şartları kabul etmelisiniz" }, { status: 400 });
    }
    await prisma.userProfile.update({
      where: { userId: session.sub },
      data: {
        marketingEmailConsent: Boolean(data.marketingEmailConsent),
        termsAcceptedAt: new Date(),
        onboardingStep: 5,
      },
    });
    await prisma.user.update({
      where: { id: session.sub },
      data: { profileCompletedAt: new Date() },
    });
  }

  const fresh = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { profile: true },
  });

  return NextResponse.json({
    ok: true,
    needsOnboarding: fresh?.profileCompletedAt == null,
    profile: fresh?.profile,
  });
}
