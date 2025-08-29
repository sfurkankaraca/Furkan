import EventCard, { EventItem } from "@/components/EventCard";
import Section from "@/components/Section";
import fs from "node:fs/promises";
import path from "node:path";

async function getEvents(): Promise<EventItem[]> {
  const file = path.join(process.cwd(), "data", "events.json");
  const json = await fs.readFile(file, "utf8");
  return JSON.parse(json);
}

export const metadata = {
  title: "Etkinlikler | noqta",
};

export default async function EventsPage() {
  const events = await getEvents();
  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = events
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        startDate: e.date,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: (e as any).venue || e.city,
          address: e.city,
        },
        url: (e as any).ctaUrl || "https://noqta.ai/events",
        image: e.image ? [e.image] : undefined,
      },
    })),
  };

  return (
    <>
      <Section title="Yaklaşan Etkinlikler" description="Sıradaki buluşmalar.">
        {upcoming.length === 0 ? (
          <p className="text-white/60">Yaklaşan etkinlik yok.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {upcoming.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </Section>

      <Section title="Geçmiş Etkinlikler" description="Arşivden seçkiler.">
        {past.length === 0 ? (
          <p className="text-white/60">Henüz geçmiş etkinlik yok.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {past.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
