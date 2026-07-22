import { getSiteUrl } from "@/lib/site-url";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export function getGoogleRedirectUri(): string {
  return `${getSiteUrl()}/api/auth/google/callback`;
}

/** Vercel’de sık yazım hatası: OOGLE_CLIENT_SECRET */
function googleClientSecret(): string | undefined {
  const a = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (a) return a;
  const typo = process.env.OOGLE_CLIENT_SECRET?.trim();
  return typo || undefined;
}

export function assertGoogleConfigured() {
  if (!process.env.GOOGLE_CLIENT_ID?.trim() || !googleClientSecret()) {
    throw new Error("GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET tanımlı olmalı");
  }
}

export function buildGoogleAuthUrl(state: string): string {
  assertGoogleConfigured();
  const redirectUri = getGoogleRedirectUri();
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "offline",
  });
  return `${AUTH_URL}?${p.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<{ access_token: string }> {
  assertGoogleConfigured();
  const redirectUri = getGoogleRedirectUri();
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: googleClientSecret()!,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error || "Google token alınamadı");
  }
  return { access_token: data.access_token };
}

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await res.json()) as GoogleUserInfo;
  if (!res.ok || !data.sub || !data.email) {
    throw new Error("Google profil okunamadı");
  }
  return data;
}
