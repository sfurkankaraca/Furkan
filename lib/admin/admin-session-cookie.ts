import type { NextResponse } from "next/server";

/** Admin `admin=1` çerezi: login / logout aynı seçenekleri kullanmalı (özellikle domain). */
export type AdminCookieOpts = {
  httpOnly: true;
  sameSite: "lax";
  path: string;
  secure: boolean;
  maxAge: number;
  domain?: string;
};

export function adminCookieDomain(): string | undefined {
  const d = process.env.ADMIN_COOKIE_DOMAIN?.trim();
  return d && d.length > 0 ? d : undefined;
}

export function adminSessionCookieOpts(secure: boolean): AdminCookieOpts {
  const domain = adminCookieDomain();
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge: 60 * 60 * 24 * 14,
    ...(domain ? { domain } : {}),
  };
}

export function clearAdminSessionCookieOpts(secure: boolean): AdminCookieOpts {
  return { ...adminSessionCookieOpts(secure), maxAge: 0 };
}

export function adminLoginSecureFromRequest(req: { headers: Headers }): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  return (
    forwarded === "https" || process.env.VERCEL === "1" || process.env.NODE_ENV === "production"
  );
}

/** Normal kullanıcı girişinde eski admin oturumunu sil (aynı tarayıcıda yanlışlıkla Admin göstermesin). */
export function clearAdminSessionOnResponse(res: NextResponse, req: Request) {
  const secure = adminLoginSecureFromRequest(req);
  res.cookies.set("admin", "", clearAdminSessionCookieOpts(secure));
}
