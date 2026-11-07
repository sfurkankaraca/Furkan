import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LANG_COOKIE, isLang } from "@/lib/club-radio/i18n/lang";

/** Sık taranan yollar — anında 404, uygulama mantığına sokulmaz. */
const BLOCKED_PATH_PREFIXES = [
  "/.env",
  "/.git",
  "/wp-admin",
  "/wp-login.php",
  "/wp-includes",
  "/phpmyadmin",
  "/pma",
  "/.aws",
  "/config.json",
  "/actuator",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.toLowerCase();

  for (const prefix of BLOCKED_PATH_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  if (path.includes("%2e%2e")) {
    return new NextResponse(null, { status: 400 });
  }
  // Yalnızca gerçek path segmenti ".." (foo..bar gibi slug’ları engelleme)
  for (const seg of path.split("/")) {
    if (seg === "..") {
      return new NextResponse(null, { status: 400 });
    }
  }

  // ?lang=en|tr → noqt_lang çerezi yaz, parametresiz aynı adrese yönlendir (yalnız sayfa GET istekleri).
  const langParam = request.nextUrl.searchParams.get("lang");
  if (isLang(langParam) && (request.method === "GET" || request.method === "HEAD") && !request.nextUrl.pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    const redirect = NextResponse.redirect(url);
    redirect.cookies.set(LANG_COOKIE, langParam, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return redirect;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Güvenlik başlıkları
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (request.nextUrl.protocol === "https:") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff2?)$).*)",
  ],
};
