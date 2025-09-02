"use client";

import EventCard, { EventItem } from "@/components/EventCard";
import Section from "@/components/Section";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState([
    {
      "id": "private-meteor-party-2025-08-12",
      "title": "Private Meteor Party",
      "date": "2025-08-12T21:00:00+03:00",
      "city": "Kayseri",
      "venue": "Somewhere near Felahiye",
      "ctaUrl": "/events/apply",
      "image": "/events/perseid.jpeg"
    }
  ]);

  useEffect(() => {
    // Önce veritabanından güncel veriyi çekmeye çalış
    const fetchLatestEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const latestEvents = await response.json();
          setEvents(latestEvents);
          localStorage.setItem('noqta-events', JSON.stringify(latestEvents));
          console.log("Latest events fetched from database:", latestEvents);
          return;
        }
      } catch (error) {
        console.log("Could not fetch from database, using localStorage fallback");
      }
      
      // Fallback: Local storage'dan güncel veriyi al
      const storedEvents = localStorage.getItem('noqta-events');
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          setEvents(parsedEvents);
        } catch (error) {
          console.error('Error parsing stored events:', error);
        }
      }
    };

    fetchLatestEvents();

    // Listen for image updates
    const handleImageUpdate = (e: CustomEvent) => {
      setEvents(e.detail.updatedEvents);
      console.log("Events page updated with new events:", e.detail.updatedEvents);
      
      // Also update localStorage with the new data
      localStorage.setItem('noqta-events', JSON.stringify(e.detail.updatedEvents));
      
      // Update blob URL if available
      if (e.detail.eventsBlobUrl) {
        localStorage.setItem('noqta-events-blob-url', e.detail.eventsBlobUrl);
      }
    };

    window.addEventListener('eventImageUpdated', handleImageUpdate as EventListener);

    return () => {
      window.removeEventListener('eventImageUpdated', handleImageUpdate as EventListener);
    };
  }, []);
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
        url: `/events/${e.id}`,
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
              <Link key={e.id} href={`/events/${e.id}`} className="block">
                <EventCard event={e} />
              </Link>
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
              <Link key={e.id} href={`/events/${e.id}`} className="block">
                <EventCard event={e} />
              </Link>
            ))}
          </div>
        )}
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
