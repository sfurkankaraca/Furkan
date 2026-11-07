import type { Metadata } from "next";
import { notFound } from "next/navigation";

/** Blob’daki yeni etkinlikler anında görünsün; önbellekte 404 kalmasın */
export const dynamic = "force-dynamic";
import type { PublicEvent } from "@/lib/event-types";
import { getPublicEventById } from "@/lib/server/public-events";
import EventDetailClient from "./EventDetailClient";
import { getDict } from "@/lib/club-radio/i18n/server";
import type { Dict } from "@/lib/club-radio/i18n/dict";
import { getAllArtists, slugifyTr } from "@/lib/artists/noqt-events";

const SITE = "https://noqt.club";

function metaTitle(e: PublicEvent): string {
  const suffix = " | noqta";
  const maxCore = 58 - suffix.length;
  let core = e.city ? `${e.title} – ${e.city}` : e.title;
  if (core.length > maxCore) core = `${core.slice(0, maxCore - 1)}…`;
  return core + suffix;
}

function metaDescription(e: PublicEvent, t: Dict): string {
  const raw = (e.subtitle || e.description || "").replace(/\s+/g, " ").trim();
  const fallback = t.meta.eventFallbackDescription(e.title, e.city);
  const snippet = raw.length >= 80 ? raw : fallback;
  if (snippet.length <= 160) return snippet;
  return `${snippet.slice(0, 157)}…`;
}

function absUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  return `${SITE}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { t } = await getDict();
  const event = await getPublicEventById(id);
  if (!event) {
    return { title: t.meta.eventNotFoundTitle, description: t.meta.eventNotFoundDescription };
  }
  return {
    title: metaTitle(event),
    description: metaDescription(event, t),
    alternates: { canonical: `/events/${id}` },
    openGraph: {
      title: metaTitle(event),
      description: metaDescription(event, t),
      url: `/events/${id}`,
      images: event.image ? [{ url: absUrl(event.image) }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getPublicEventById(id);
  if (!event) notFound();

  // Line-up'taki adlar sanatçı listesindeki biriyle eşleşirse ana türleri gösterilir (eşleşme: slugifyTr(ad)).
  const lineupGenres: Record<string, string[]> = {};
  if (event.lineup?.length) {
    const artists = await getAllArtists().catch(() => []);
    for (const l of event.lineup) {
      const key = slugifyTr(l.name);
      const a = artists.find((x) => x.slug === key || x.slug === `${key}-dj`);
      if (a && a.genres.length > 0) lineupGenres[l.name] = a.genres.slice(0, 3);
    }
  }

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: (event.description || event.subtitle || `${event.title} — Noqta etkinliği`).slice(0, 500),
    ...(event.date ? { startDate: event.date } : {}),
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue || event.city || "Türkiye",
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city || undefined,
        addressCountry: "TR",
      },
    },
    ...(event.image ? { image: [absUrl(event.image)] } : {}),
    url: `${SITE}/events/${id}`,
    organizer: { "@type": "Organization", name: "noqta", url: SITE },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />
      <EventDetailClient lineupGenres={lineupGenres} />
    </>
  );
}
