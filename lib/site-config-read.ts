import { list } from "@vercel/blob";
import { parseYoutubeUrl } from "@/lib/youtube/embed";

const KEY = "site-config.json";

export async function readSiteConfigBlob(): Promise<Record<string, unknown>> {
  try {
    const { blobs } = await list({ prefix: KEY });
    const exact = blobs.find((b) => b.pathname === KEY) || blobs.at(-1);
    if (!exact) return {};
    const res = await fetch(exact.url, { cache: "no-store" });
    if (!res.ok) return {};
    const json = await res.json().catch(() => ({}));
    return typeof json === "object" && json ? (json as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/** Çözümlenmiş geçerli URL listesi: önce `eventsYoutubeUrls`, yoksa tek `eventsYoutubeUrl`, sonra env. */
export function resolveEventsYoutubeUrls(cfg: Record<string, unknown>): string[] {
  const raw = cfg.eventsYoutubeUrls;
  if (Array.isArray(raw) && raw.length > 0) {
    const list = raw.map((s) => String(s || "").trim()).filter(Boolean);
    return list.filter((u) => parseYoutubeUrl(u));
  }
  const legacy = String(cfg.eventsYoutubeUrl ?? "").trim();
  if (legacy && parseYoutubeUrl(legacy)) return [legacy];
  const env = String(process.env.NEXT_PUBLIC_EVENTS_YOUTUBE_URL ?? "").trim();
  if (env && parseYoutubeUrl(env)) return [env];
  return [];
}

/**
 * Dizi veya virgül/satır ile ayrılmış string; blob `bookingYoutubeUrls`.
 * Env: NEXT_PUBLIC_BOOKING_YOUTUBE_URLS (virgül veya satır ile çoklu URL).
 */
export function resolveBookingYoutubeUrls(cfg: Record<string, unknown>): string[] {
  const raw = cfg.bookingYoutubeUrls;
  if (Array.isArray(raw)) {
    return raw.map((s) => String(s || "").trim()).filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  }
  const env = process.env.NEXT_PUBLIC_BOOKING_YOUTUBE_URLS ?? "";
  return env.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

/** Admin formu: blob’daki satırlar; `eventsYoutubeUrls` veya eski tek `eventsYoutubeUrl`. */
export function getStoredEventsYoutubeUrls(cfg: Record<string, unknown>): string[] {
  const raw = cfg.eventsYoutubeUrls;
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((s) => String(s || "").trim()).filter(Boolean);
  }
  const legacy = String(cfg.eventsYoutubeUrl ?? "").trim();
  return legacy ? [legacy] : [];
}

export function getStoredBookingYoutubeUrls(cfg: Record<string, unknown>): string[] {
  const raw = cfg.bookingYoutubeUrls;
  if (Array.isArray(raw)) {
    return raw.map((s) => String(s || "").trim()).filter(Boolean);
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}
