import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeGoogleCode, fetchGoogleUserInfo } from "@/lib/auth/google-oauth";
import { getPrisma } from "@/lib/prisma";
import { SESSION_COOKIE, sessionCookieBase, signSession } from "@/lib/auth/session";
import { getSiteUrl } from "@/lib/site-url";
import { clearAdminSessionOnResponse } from "@/lib/admin/admin-session-cookie";

export const runtime = "nodejs";

const STATE_COOKIE = "google_oauth_state";

export async function GET(req: Request) {
  const site = getSiteUrl();
  const fail = (code: string) => NextResponse.redirect(`${site}/login?error=${code}`);

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const gErr = url.searchParams.get("error");

  if (gErr) return fail("google_denied");
  if (!code || !state) return fail("google_invalid");

  const jar = await cookies();
  const expected = jar.get(STATE_COOKIE)?.value;
  if (!expected || expected !== state) {
    return fail("google_state");
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.redirect(`${site}/login?error=no_db`);
  }

  let access: string;
  try {
    const t = await exchangeGoogleCode(code);
    access = t.access_token;
  } catch {
    return fail("google_token");
  }

  let gUser: Awaited<ReturnType<typeof fetchGoogleUserInfo>>;
  try {
    gUser = await fetchGoogleUserInfo(access);
  } catch {
    return fail("google_profile");
  }

  if (!gUser.email_verified) {
    return fail("google_unverified");
  }

  let user = await prisma.user.findFirst({ where: { googleSub: gUser.sub } });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { image: gUser.picture || user.image, name: gUser.name || user.name },
    });
  } else {
    const byEmail = await prisma.user.findUnique({ where: { email: gUser.email.toLowerCase() } });
    if (byEmail) {
      if (byEmail.googleSub && byEmail.googleSub !== gUser.sub) {
        return fail("google_email_conflict");
      }
      user = await prisma.user.update({
        where: { id: byEmail.id },
        data: {
          googleSub: gUser.sub,
          image: gUser.picture || byEmail.image,
          name: gUser.name || byEmail.name,
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email: gUser.email.toLowerCase(),
          googleSub: gUser.sub,
          name: gUser.name || null,
          image: gUser.picture || null,
          profileCompletedAt: null,
        },
      });
    }
  }

  const token = await signSession({ sub: user.id, email: user.email });
  if (!token) {
    return NextResponse.redirect(`${site}/login?error=no_auth_secret`);
  }

  const target = user.profileCompletedAt != null ? `${site}/events` : `${site}/onboarding`;

  const out = NextResponse.redirect(target);
  clearAdminSessionOnResponse(out, req);
  out.cookies.set(STATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  out.cookies.set(SESSION_COOKIE, token, sessionCookieBase);
  return out;
}
