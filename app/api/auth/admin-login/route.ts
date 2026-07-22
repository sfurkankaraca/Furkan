import { NextRequest, NextResponse } from "next/server";
import {
  adminLoginSecureFromRequest,
  adminSessionCookieOpts,
} from "@/lib/admin/admin-session-cookie";

export const runtime = "nodejs";

/**
 * Admin şifre girişi. Tek Response içinde Set-Cookie + redirect.
 */
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.redirect(new URL("/admin/login?e=1", req.url));
  }

  const password = String(form.get("password") || "").trim();
  const nextRaw = String(form.get("next") || "/admin");
  const nextPath =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/admin";

  const envPass = process.env.ADMIN_PASSWORD?.trim();
  const expected = envPass && envPass.length > 0 ? envPass : "noqta";
  if (password !== expected) {
    return NextResponse.redirect(new URL("/admin/login?e=1", req.url));
  }

  const dest = new URL(nextPath, req.url);
  const res = NextResponse.redirect(dest, 303);

  const secure = adminLoginSecureFromRequest(req);
  res.cookies.set("admin", "1", adminSessionCookieOpts(secure));

  return res;
}
