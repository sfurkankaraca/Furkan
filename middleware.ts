import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
