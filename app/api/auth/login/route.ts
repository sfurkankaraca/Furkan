import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { SESSION_COOKIE, sessionCookieBase, signSession } from "@/lib/auth/session";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitLogin } from "@/lib/security/rate-limit";
import { clearAdminSessionOnResponse } from "@/lib/admin/admin-session-cookie";

export const runtime = "nodejs";

function tooMany(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Çok fazla deneme. Lütfen bir süre sonra tekrar deneyin." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
  );
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = await rateLimitLogin(ip);
  if (!rl.success) return tooMany(rl.retryAfterSec);

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Veritabanı yapılandırılmadı (DATABASE_URL)" }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
  }
  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "Bu hesap Google ile açıldı. Lütfen «Google ile devam et» kullanın." },
      { status: 401 }
    );
  }
  if (!(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "E-posta veya şifre hatalı" }, { status: 401 });
  }

  const token = await signSession({ sub: user.id, email: user.email });
  if (!token) {
    return NextResponse.json({ error: "Oturum anahtarı yapılandırılmadı (AUTH_SECRET)" }, { status: 500 });
  }

  const needsOnboarding = user.profileCompletedAt == null;
  const res = NextResponse.json({
    ok: true,
    needsOnboarding,
    user: { id: user.id, email: user.email, name: user.name },
  });
  clearAdminSessionOnResponse(res, req);
  res.cookies.set(SESSION_COOKIE, token, sessionCookieBase);
  return res;
}
