import type { Metadata } from "next";
import { notFound } from "next/navigation";

/** Blob’daki yeni etkinlikler anında görünsün; önbellekte 404 kalmasın */
export const dynamic = "force-dynamic";
import type { PublicEvent } from "@/lib/event-types";
import { getEventById } from "@/lib/server/events-store";
import EventDetailClient from "./EventDetailClient";

const SITE = "https://noqta.club";

function metaTitle(e: PublicEvent): string {
  const suffix = " | noqta";
  const maxCore = 58 - suffix.length;
  let core = e.city ? `${e.title} – ${e.city}` : e.title;
  if (core.length > maxCore) core = `${core.slice(0, maxCore - 1)}…`;
  return core + suffix;
}

function metaDescription(e: PublicEvent): string {
  const raw = (e.subtitle || e.description || "").replace(/\s+/g, " ").trim();
  const fallback = `${e.title}: elektronik müzik ve DJ performansı${e.city ? ` — ${e.city}` : ""}. Noqta etkinlik detayı.`;
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
  const event = await getEventById(id);
  if (!event) {
    return { title: "Etkinlik bulunamadı", description: "Aradığınız etkinlik bulunamadı veya kaldırılmış olabilir." };
  }
  return {
    title: metaTitle(event),
    description: metaDescription(event),
    alternates: { canonical: `/events/${id}` },
    openGraph: {
      title: metaTitle(event),
      description: metaDescription(event),
      url: `/events/${id}`,
      images: event.image ? [{ url: absUrl(event.image) }] : undefined,
    },
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

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
      <EventDetailClient />
    </>
  );
}
