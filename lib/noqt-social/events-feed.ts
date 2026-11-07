import fs from "node:fs/promises";
import path from "node:path";

/**
 * noqt social etkinlik akışı (Firebase `clubEventsFeed` fonksiyonu).
 * Yalnız herkese açık alanlar gelir; hata durumunda HER ZAMAN boş liste
 * döner — site bu uca bağımlı olarak kırılmamalı.
 */

export const DEFAULT_FEED_URL = "https://europe-west1-eventmatch-bd8ad.cloudfunctions.net/clubEventsFeed";

export type SocialFeedEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt: string | null;
  city: string;
  district: string | null;
  venueName: string | null;
  placeText: string | null;
  description: string | null;
  genres: string[];
  eventKind: string;
  imageUrl: string | null;
  priceText: string | null;
  artistNames: string[];
  ticketUrl: string | null;
  socialUrl: string;
};

const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);
const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(str).filter((x): x is string => x !== null) : [];
const isoOrNull = (v: unknown): string | null => {
  const s = str(v);
  return s && Number.isFinite(Date.parse(s)) ? s : null;
};
const httpsOrNull = (v: unknown): string | null => {
  const s = str(v);
  return s && s.startsWith("https://") ? s : null;
};

/** Tek kaydı savunmacı biçimde doğrular; geçersizse null. */
export function parseFeedEvent(raw: unknown): SocialFeedEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = str(r.id);
  const title = str(r.title);
  const startAt = isoOrNull(r.startAt);
  const city = str(r.city);
  if (!id || !ID_PATTERN.test(id) || !title || !startAt || !city) return null;
  return {
    id,
    title,
    startAt,
    endAt: isoOrNull(r.endAt),
    city,
    district: str(r.district),
    venueName: str(r.venueName),
    placeText: str(r.placeText),
    description: str(r.description),
    genres: strList(r.genres),
    eventKind: str(r.eventKind) ?? "other",
    imageUrl: httpsOrNull(r.imageUrl),
    priceText: str(r.priceText),
    artistNames: strList(r.artistNames),
    ticketUrl: httpsOrNull(r.ticketUrl),
    socialUrl: httpsOrNull(r.socialUrl) ?? `https://link.noqt.social/etkinlik/${id}`,
  };
}

export function parseFeedPayload(json: unknown): SocialFeedEvent[] {
  if (!json || typeof json !== "object") return [];
  const events = (json as { events?: unknown }).events;
  if (!Array.isArray(events)) return [];
  const seen = new Set<string>();
  const out: SocialFeedEvent[] = [];
  for (const raw of events) {
    const ev = parseFeedEvent(raw);
    if (ev && !seen.has(ev.id)) {
      seen.add(ev.id);
      out.push(ev);
    }
  }
  return out;
}

/** Akıştaki tüm etkinlikler (başlangıca göre artan). Hatada []. */
export async function fetchSocialFeedEvents(): Promise<SocialFeedEvent[]> {
  const url = process.env.NOQT_SOCIAL_EVENTS_FEED_URL ?? DEFAULT_FEED_URL;
  try {
    if (url.startsWith("fixture:")) {
      // Yalnız yerel geliştirme; üretimde yok sayılır.
      if (process.env.NODE_ENV === "production") return [];
      const file = path.resolve(process.cwd(), url.slice("fixture:".length));
      const json = JSON.parse(await fs.readFile(file, "utf8"));
      return parseFeedPayload(json).sort((a, b) => a.startAt.localeCompare(b.startAt));
    }
    const res = await fetch(url, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    return parseFeedPayload(await res.json()).sort((a, b) => a.startAt.localeCompare(b.startAt));
  } catch (e) {
    console.warn("[noqt-social] etkinlik akışı okunamadı", e);
    return [];
  }
}
