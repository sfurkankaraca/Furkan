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
  const all = await getEvents();
  const now = Date.now();
  const upcoming = all
    .filter((e) => {
      const t = new Date(e.date).getTime();
      return !Number.isNaN(t) && t >= now;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = all
    .filter((e) => {
      const t = new Date(e.date).getTime();
      return !Number.isNaN(t) && t < now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: all.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        startDate: e.date,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: e.venue || e.city,
          address: e.city,
        },
        url: e.ctaUrl || "https://noqta.ai/events",
        image: e.image ? [e.image] : undefined,
      },
    })),
  };

  return (
    <>
      <Section title="Etkinlikler" description="Yaklaşan etkinlikler ve geçmişten seçkiler.">
        {all.length === 0 ? (
          <p className="text-white/60">Henüz etkinlik yok.</p>
        ) : (
          <div className="grid gap-10">
            <div>
              <h3 className="text-xl font-medium mb-3">Yaklaşan</h3>
              {upcoming.length === 0 ? (
                <p className="text-white/60">Yaklaşan etkinlik yok.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {upcoming.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">Geçmiş</h3>
              {past.length === 0 ? (
                <p className="text-white/60">Geçmiş etkinlik yok.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {past.map((e) => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
