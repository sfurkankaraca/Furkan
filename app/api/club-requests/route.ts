import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitClubRequest } from "@/lib/security/rate-limit";
import { sendClubRequestMail } from "@/lib/mail/send";
import { describeClubPayload, parseClubRequest } from "@/lib/club-requests";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  let en = false;
  const m = (tr: string, enText: string) => (en ? enText : tr);
  try {
    const ip = getClientIp(req);
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
    }
    en = (body as { lang?: unknown } | null)?.lang === "en";

    // Honeypot: bot doldurmuşsa sessizce başarılı say, kaydetme.
    const honeypot = (body as { website?: unknown } | null)?.website;
    if (typeof honeypot === "string" && honeypot.trim()) {
      return NextResponse.json({ ok: true });
    }

    const parsed = parseClubRequest(body, en ? "en" : "tr");
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }
    if ((body as { consent?: unknown }).consent !== true) {
      return NextResponse.json({ ok: false, error: m("Devam etmek için KVKK aydınlatma metnini onaylaman gerekiyor.", "You need to accept the KVKK privacy notice to continue.") }, { status: 400 });
    }

    const rl = await rateLimitClubRequest(ip);
    if (!rl.success) {
      return NextResponse.json(
        { ok: false, error: m("Kısa sürede çok fazla deneme yapıldı. Biraz sonra tekrar dene.", "Too many attempts in a short time. Please try again in a bit.") },
        { status: 429, headers: { "retry-after": String(rl.retryAfterSec) } },
      );
    }

    const prisma = getPrisma();
    if (!prisma) {
      return NextResponse.json(
        { ok: false, error: m("Şu an talebini kaydedemiyoruz. Lütfen WhatsApp üzerinden bize ulaş.", "We can't save your request right now. Please reach us on WhatsApp.") },
        { status: 503 },
      );
    }

    const d = parsed.data;
    await prisma.clubRequest.create({
      data: {
        kind: d.kind,
        name: d.name,
        email: d.email,
        phone: d.phone,
        payload: d.payload,
        consentAt: new Date(),
        ip: ip === "unknown" ? null : ip,
      },
    });

    // E-posta hatası talebi düşürmesin.
    try {
      await sendClubRequestMail({
        kind: d.kind,
        name: d.name,
        email: d.email,
        phone: d.phone,
        rows: describeClubPayload(d.kind, d.payload),
      });
    } catch (e) {
      console.error("[club-requests] mail", e);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[club-requests]", error);
    return NextResponse.json({ ok: false, error: m("Sunucu hatası. Lütfen biraz sonra tekrar dene.", "Server error. Please try again shortly.") }, { status: 500 });
  }
}
