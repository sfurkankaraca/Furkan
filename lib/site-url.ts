/**
 * Kanonik kök URL (sitemap, JSON-LD, metadataBase).
 * Vercel’de: NEXT_PUBLIC_SITE_URL=https://www.noqta.club
 */
const raw = typeof process.env.NEXT_PUBLIC_SITE_URL === "string" ? process.env.NEXT_PUBLIC_SITE_URL.trim() : "";
export const SITE_URL = (
  raw && /^https?:\/\//i.test(raw) ? raw.replace(/\/$/, "") : "https://www.noqta.club"
) as string;
