import type { PublicEvent } from "@/lib/event-types";
import { readEventsJson, getEventById } from "@/lib/server/events-store";
import { fetchSocialFeedEvents, type SocialFeedEvent } from "@/lib/noqt-social/events-feed";
import { readSocialEventSettings, type SocialEventSetting } from "@/lib/server/social-event-settings-store";

/**
 * Herkese açık + ödeme tarafının TEK etkinlik kaynağı: Blob etkinlikleri +
 * noqt social akışından "sitede göster" işaretlenenler. Bilet fiyatı/kontenjanı
 * yalnız site yönetiminde girilen ayardan gelir (akıştaki priceText ödemede
 * ASLA kullanılmaz). Admin düzenleme sayfaları blob'u doğrudan okumaya devam eder.
 */

export const SOCIAL_ID_PREFIX = "ns-";

export function socialPublicId(socialId: string): string {
  return `${SOCIAL_ID_PREFIX}${socialId}`;
}

/** `ns-<id>` → `<id>`; değilse null. */
export function parseSocialPublicId(id: string): string | null {
  if (!id.startsWith(SOCIAL_ID_PREFIX)) return null;
  const rest = id.slice(SOCIAL_ID_PREFIX.length);
  return /^[A-Za-z0-9_-]{1,128}$/.test(rest) ? rest : null;
}

export function mapSocialEvent(ev: SocialFeedEvent, setting?: SocialEventSetting): PublicEvent {
  const ticketing = setting?.ticketing;
  const subtitle = setting?.subtitle || (!ticketing?.enabled && ev.priceText ? ev.priceText : undefined);
  const venue = ev.venueName ?? ev.placeText ?? undefined;
  return {
    id: socialPublicId(ev.id),
    title: ev.title,
    date: ev.startAt,
    ...(ev.endAt ? { endDate: ev.endAt } : {}),
    city: ev.city,
    ...(venue ? { venue } : {}),
    ...(ev.district ? { venueAddress: `${ev.district}, ${ev.city}` } : {}),
    ...(ev.imageUrl ? { image: ev.imageUrl } : {}),
    ...(ev.description ? { description: ev.description } : {}),
    ...(ev.genres.length ? { genres: ev.genres } : {}),
    ...(ev.artistNames.length ? { lineup: ev.artistNames.map((name) => ({ name })) } : {}),
    ...(subtitle ? { subtitle } : {}),
    ...(ticketing ? { ticketing } : {}),
    organizer: { name: "noqt club" },
    source: "noqt_social",
    socialEventId: ev.id,
    socialUrl: ev.socialUrl,
  };
}

async function listSocialPublicEvents(): Promise<PublicEvent[]> {
  const [feed, settings] = await Promise.all([fetchSocialFeedEvents(), readSocialEventSettings()]);
  return feed.filter((e) => settings[e.id]?.listed === true).map((e) => mapSocialEvent(e, settings[e.id]));
}

export async function listPublicEvents(): Promise<PublicEvent[]> {
  const [site, social] = await Promise.all([
    readEventsJson(),
    listSocialPublicEvents().catch((e) => {
      console.warn("[public-events] noqt social etkinlikleri alınamadı", e);
      return [] as PublicEvent[];
    }),
  ]);
  // `ns-` öneki noqt social'a ayrılmıştır; blob'da öyle bir kimlik varsa yok sayılır.
  const siteOnly = site.filter((e) => !e.id.startsWith(SOCIAL_ID_PREFIX));
  return [...siteOnly, ...social];
}

export async function getPublicEventById(id: string): Promise<PublicEvent | undefined> {
  let decoded = id;
  try {
    decoded = decodeURIComponent(id);
  } catch {
    /* ham değer */
  }
  const socialId = parseSocialPublicId(decoded);
  if (socialId) {
    const [feed, settings] = await Promise.all([fetchSocialFeedEvents(), readSocialEventSettings()]);
    const ev = feed.find((e) => e.id === socialId);
    const setting = settings[socialId];
    if (!ev || setting?.listed !== true) return undefined;
    return mapSocialEvent(ev, setting);
  }
  return getEventById(id);
}
