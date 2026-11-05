import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitClubRequest } from "@/lib/security/rate-limit";
import { sendClubRequestMail } from "@/lib/mail/send";
import { describeClubPayload, parseClubRequest } from "@/lib/club-requests";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
    }

    // Honeypot: bot doldurmuşsa sessizce başarılı say, kaydetme.
    const honeypot = (body as { website?: unknown } | null)?.website;
    if (typeof honeypot === "string" && honeypot.trim()) {
      return NextResponse.json({ ok: true });
    }

    const parsed = parseClubRequest(body);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }
    if ((body as { consent?: unknown }).consent !== true) {
      return NextResponse.json({ ok: false, error: "Devam etmek için KVKK aydınlatma metnini onaylaman gerekiyor." }, { status: 400 });
    }

    const rl = await rateLimitClubRequest(ip);
    if (!rl.success) {
      return NextResponse.json(
        { ok: false, error: "Kısa sürede çok fazla deneme yapıldı. Biraz sonra tekrar dene." },
        { status: 429, headers: { "retry-after": String(rl.retryAfterSec) } },
      );
    }

    const prisma = getPrisma();
    if (!prisma) {
      return NextResponse.json(
        { ok: false, error: "Şu an talebini kaydedemiyoruz. Lütfen WhatsApp üzerinden bize ulaş." },
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
    return NextResponse.json({ ok: false, error: "Sunucu hatası. Lütfen biraz sonra tekrar dene." }, { status: 500 });
  }
}
