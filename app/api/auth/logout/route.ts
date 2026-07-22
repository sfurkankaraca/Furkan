import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { clearAdminSessionCookieOpts, adminLoginSecureFromRequest } from "@/lib/admin/admin-session-cookie";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  const h = await headers();
  const secure = adminLoginSecureFromRequest({ headers: h });
  res.cookies.set("admin", "", clearAdminSessionCookieOpts(secure));
  return res;
}
