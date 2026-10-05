/**
 * Kanonik kök URL (sitemap, JSON-LD, metadataBase).
 * Vercel’de: NEXT_PUBLIC_SITE_URL=https://noqt.club
 */
const raw = typeof process.env.NEXT_PUBLIC_SITE_URL === "string" ? process.env.NEXT_PUBLIC_SITE_URL.trim() : "";
export const SITE_URL = (
  raw && /^https?:\/\//i.test(raw) ? raw.replace(/\/$/, "") : "https://noqt.club"
) as string;
