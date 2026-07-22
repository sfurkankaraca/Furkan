import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createRadioChatMessage, listRadioChatMessages, sanitizeRadioChatBody } from "@/lib/radio-chat";
import { getPrisma } from "@/lib/prisma";
import { rateLimitRadioChatPost } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

export async function GET() {
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ messages: [], db: false });
  }
  const messages = await listRadioChatMessages();
  return NextResponse.json({ messages, db: true });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sohbet için giriş yapmalısınız." }, { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Sohbet şu an kullanılamıyor." }, { status: 503 });
  }

  const rl = await rateLimitRadioChatPost(session.sub);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Çok hızlı yazıyorsunuz. Bir dakika sonra deneyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: { body?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const raw = String(body.body ?? "");
  const clean = sanitizeRadioChatBody(raw);
  if (!clean) {
    return NextResponse.json({ error: "Mesaj boş olamaz." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "Hesap bulunamadı." }, { status: 401 });
  }

  const msg = await createRadioChatMessage(user.id, clean);
  if (!msg) {
    return NextResponse.json({ error: "Mesaj kaydedilemedi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: msg });
}
