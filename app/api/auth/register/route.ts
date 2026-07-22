import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, sessionCookieBase, signSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitRegister } from "@/lib/security/rate-limit";
import { clearAdminSessionOnResponse } from "@/lib/admin/admin-session-cookie";

export const runtime = "nodejs";

function tooMany(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Bu ağdan çok kayıt denemesi yapıldı. Lütfen daha sonra deneyin." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimitRegister(ip);
  if (!rl.success) return tooMany(rl.retryAfterSec);

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Veritabanı yapılandırılmadı (DATABASE_URL)" }, { status: 503 });
  }

  let body: { email?: string; password?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim() || undefined;

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Geçerli bir e-posta girin" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Şifre en az 8 karakter olmalı" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Kayıt tamamlanamadı. E-posta kullanımda olabilir veya bilgileri kontrol edin." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, profileCompletedAt: null },
  });

  const token = await signSession({ sub: user.id, email: user.email });
  if (!token) {
    return NextResponse.json({ error: "Oturum anahtarı yapılandırılmadı (AUTH_SECRET)" }, { status: 500 });
  }

  const res = NextResponse.json({
    ok: true,
    needsOnboarding: true,
    user: { id: user.id, email: user.email, name: user.name },
  });
  clearAdminSessionOnResponse(res, req);
  res.cookies.set(SESSION_COOKIE, token, sessionCookieBase);
  return res;
}
