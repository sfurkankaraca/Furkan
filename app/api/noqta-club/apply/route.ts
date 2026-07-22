import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitNoqtaClubApply } from "@/lib/security/rate-limit";
import {
  getNoqtaClubApplicationByEmail,
  upsertNoqtaClubApplication,
} from "@/lib/admin/store";
import { sendNoqtaClubApplicationMail } from "@/lib/mail/send";
import {
  NOQTA_CLUB_MAIN_REASON_OPTIONS,
  NOQTA_CLUB_MUSIC_INTEREST_OPTIONS,
  NOQTA_CLUB_REFERRAL_SOURCE_OPTIONS,
  isAllowedOption,
} from "@/lib/noqta-club/apply-options";
import {
  birthDateNotInFuture,
  isAtLeastAge,
  parseIsoBirthDate,
} from "@/lib/noqta-club/birth-date";

export const dynamic = "force-dynamic";

function isValidEmail(v: string) {
  const s = v.trim();
  // Basic check; daha kapsamlı doğrulama gerekirse arttırırız.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const body = (await req.json()) as any;

    const honeypot = String(body?.website || "").trim();
    if (honeypot) {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const city = String(body?.city || "").trim();
    const birthDateRaw = String(body?.birthDate || "").trim();
    const instagram = String(body?.instagram || "").trim();
    const referrer = String(body?.referrer || "").trim();
    const referralSourceRaw = String(body?.referralSource || "").trim();
    const mainReasonKey = String(body?.mainReason || "").trim();
    const mainReasonOther = String(body?.mainReasonOther || "").trim();
    const musicKey = String(body?.musicInterest || "").trim();
    const musicOther = String(body?.musicInterestOther || "").trim();
    const consentKvkk = body?.consentKvkk === true;
    const consentMarketing = body?.consentMarketing === true;

    if (!name || !email || !city || !birthDateRaw || !instagram || !referrer || !referralSourceRaw) {
      return NextResponse.json({ ok: false, error: "Lütfen zorunlu alanları doldurun" }, { status: 400 });
    }
    if (!isAllowedOption(referralSourceRaw, NOQTA_CLUB_REFERRAL_SOURCE_OPTIONS)) {
      return NextResponse.json({ ok: false, error: "Geçersiz “nasıl ulaştın” seçimi" }, { status: 400 });
    }
    if (!isAllowedOption(mainReasonKey, NOQTA_CLUB_MAIN_REASON_OPTIONS)) {
      return NextResponse.json({ ok: false, error: "Geçersiz katılım amacı seçimi" }, { status: 400 });
    }
    if (mainReasonKey === "Diğer" && mainReasonOther.length < 3) {
      return NextResponse.json({ ok: false, error: "Katılım amacı için kısa bir açıklama yazın" }, { status: 400 });
    }
    if (!isAllowedOption(musicKey, NOQTA_CLUB_MUSIC_INTEREST_OPTIONS)) {
      return NextResponse.json({ ok: false, error: "Geçersiz müzik ilgisi seçimi" }, { status: 400 });
    }
    if (musicKey === "Diğer" && musicOther.length < 3) {
      return NextResponse.json({ ok: false, error: "Müzik ilgisi için kısa bir açıklama yazın" }, { status: 400 });
    }

    const mainReason = mainReasonKey === "Diğer" ? `Diğer: ${mainReasonOther.trim()}` : mainReasonKey;
    const musicInterest = musicKey === "Diğer" ? `Diğer: ${musicOther.trim()}` : musicKey;
    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "E‑posta formatı hatalı" }, { status: 400 });
    }
    const birthParsed = parseIsoBirthDate(birthDateRaw);
    if (!birthParsed) {
      return NextResponse.json({ ok: false, error: "Geçerli bir doğum tarihi girin (GG.AA.YYYY)" }, { status: 400 });
    }
    if (!birthDateNotInFuture(birthParsed)) {
      return NextResponse.json({ ok: false, error: "Doğum tarihi gelecekte olamaz" }, { status: 400 });
    }
    if (!isAtLeastAge(birthParsed, 18)) {
      return NextResponse.json({ ok: false, error: "18+ onayı gerekiyor" }, { status: 400 });
    }
    if (!consentKvkk) {
      return NextResponse.json({ ok: false, error: "KVKK onayı zorunludur" }, { status: 400 });
    }

    const rl = await rateLimitNoqtaClubApply(ip, email);
    if (!rl.success) {
      return NextResponse.json(
        { ok: false, error: "Çok fazla deneme yaptınız. Lütfen sonra tekrar deneyin." },
        { status: 429, headers: { "retry-after": String(rl.retryAfterSec) } }
      );
    }

    const existing = await getNoqtaClubApplicationByEmail(email);
    if (existing && (existing.status === "pending" || existing.status === "approved")) {
      return NextResponse.json({ ok: false, error: "Bu e‑posta ile zaten aktif bir başvuru var." }, { status: 409 });
    }

    const record = await upsertNoqtaClubApplication({
      name,
      email,
      phone: phone || undefined,
      city,
      birthDate: birthDateRaw,
      instagram,
      referrer,
      referralSource: referralSourceRaw,
      mainReason,
      musicInterest,
      consentKvkk,
      consentMarketing: consentMarketing || undefined,
      tier: "standard",
    });

    // Admin'e bildirim (opsiyonel; RESEND yoksa otomatik devre dışı)
    await sendNoqtaClubApplicationMail({
      name: record.name,
      email: record.email,
      phone: record.phone,
      city: record.city,
      birthDate: record.birthDate,
      instagram: record.instagram,
      referrer: record.referrer,
      referralSource: record.referralSource,
      mainReason: record.mainReason,
      musicInterest: record.musicInterest,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[noqta-club/apply]", error);
    return NextResponse.json({ ok: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

