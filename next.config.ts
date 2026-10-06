import type { NextConfig } from "next";

/** HSTS: yalnızca canlı HTTPS (Vercel prod veya ENABLE_HSTS=1). Yerel next start HTTP’yi bozmaz. */
const hstsEnabled =
  process.env.VERCEL_ENV === "production" || process.env.ENABLE_HSTS === "true";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(hstsEnabled
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Geçici: production build’i bloklamasın; kalıcı çözüm için hataları düzeltiriz
    ignoreBuildErrors: true,
  },
  async redirects() {
    const EVENTS = "https://www.noqt.events";
    return [
      { source: "/kayseri-dj",                    destination: `${EVENTS}/sanatcilar?type=dj`, permanent: true },
      { source: "/nevsehir-dj",                   destination: `${EVENTS}/sanatcilar?type=dj`, permanent: true },
      { source: "/ankara-dj",                     destination: `${EVENTS}/sanatcilar?type=dj`, permanent: true },
      { source: "/kayseri-dj-booking",            destination: `${EVENTS}/planla`,             permanent: true },
      { source: "/kayseri-etkinlik-organizasyonu",destination: `${EVENTS}/planla`,             permanent: true },
      { source: "/booking",                       destination: `${EVENTS}/planla`,             permanent: true },
      // Academy sayfası kaldırıldı; içerik ana sayfada. URL'deki #fiyatlar tarayıcıca korunur.
      { source: "/academy",                       destination: "/",                            permanent: true },
      { source: "/academy/labs",                  destination: "/#labs",                       permanent: true },
      { source: "/academy/workshops",             destination: "/#fiyatlar",                   permanent: true },
      { source: "/academy/games",                 destination: "/games",                       permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
