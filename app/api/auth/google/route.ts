import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { buildGoogleAuthUrl } from "@/lib/auth/google-oauth";
import { getSiteUrl } from "@/lib/site-url";

const STATE_COOKIE = "google_oauth_state";

export async function GET() {
  const site = getSiteUrl();
  try {
    const state = randomBytes(24).toString("hex");
    const url = buildGoogleAuthUrl(state);
    const res = NextResponse.redirect(url);
    res.cookies.set(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    });
    return res;
  } catch {
    return NextResponse.redirect(`${site}/login?error=google_config`);
  }
}
