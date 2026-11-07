"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { YouTubeLazyEmbed } from "@/components/social/YouTubeLazyEmbed";
import { SITE_URL } from "@/lib/site-url";
import type { EventItem } from "@/components/EventCard";
import { EventFlyerCard } from "@/components/events/EventFlyerCard";
import { useT } from "@/lib/club-radio/i18n/client";

export function EventsSiteClient() {
  const t = useT();
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: "private-meteor-party-2025-08-12",
      title: "Private Meteor Party",
      date: "2025-08-12T21:00:00+03:00",
      city: "Kayseri",
      venue: "Somewhere near Felahiye",
      ctaUrl: "/events/apply",
      image: "/events/perseid.jpeg",
    },
  ]);
  const [eventsYoutubeUrls, setEventsYoutubeUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (response.ok) {
          const latestEvents = await response.json();
          setEvents(latestEvents);
          localStorage.setItem("noqta-events", JSON.stringify(latestEvents));
          return;
        }
      } catch {
        /* fallback */
      }
      const storedEvents = localStorage.getItem("noqta-events");
      if (storedEvents) {
        try {
          setEvents(JSON.parse(storedEvents));
        } catch {
          /* noop */
        }
      }
    };
    fetchLatestEvents();

    const handleImageUpdate = (e: CustomEvent) => {
      setEvents(e.detail.updatedEvents);
      localStorage.setItem("noqta-events", JSON.stringify(e.detail.updatedEvents));
      if (e.detail.eventsBlobUrl) {
        localStorage.setItem("noqta-events-blob-url", e.detail.eventsBlobUrl);
      }
    };
    window.addEventListener("eventImageUpdated", handleImageUpdate as EventListener);
    return () => window.removeEventListener("eventImageUpdated", handleImageUpdate as EventListener);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/site", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const raw = data?.eventsYoutubeUrls;
        const list = Array.isArray(raw)
          ? raw.filter((u: unknown): u is string => typeof u === "string" && u.trim().length > 0)
          : [];
        if (!cancelled) setEventsYoutubeUrls(list);
      } catch {
        /* noop */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcoming = useMemo(() => {
    const t = Date.now();
    return events
      .filter((e) => !e.date || new Date(e.date).getTime() >= t)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);
  const past = useMemo(() => {
    const t = Date.now();
    return events
      .filter((e) => e.date && new Date(e.date).getTime() < t)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events]);

  const site = SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: e.title,
        startDate: e.date || undefined,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: (e as { venue?: string }).venue || e.city,
          address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: "TR" },
        },
        url: `${site}/events/${e.id}`,
        image: e.image
          ? [e.image.startsWith("http") ? e.image : `${site}${e.image.startsWith("/") ? "" : "/"}${e.image}`]
          : undefined,
      },
    })),
  };

  return (
    <main className="relative isolate min-h-screen min-w-0 overflow-x-clip">
      <div className="mx-auto max-w-[1360px] px-6 pb-24 pt-10 min-[901px]:pt-16">
        <header className="mb-12 flex flex-col gap-3">
          <p className="cr-eyebrow m-0 text-[#DDF76A]">{t.events.eyebrow}</p>
          <h1 className="cr-display m-0 text-[34px] leading-[0.95] min-[420px]:text-[44px] min-[901px]:text-[96px]" style={{ fontStretch: "125%" }}>
            {t.events.title}
          </h1>
          <p className="m-0 max-w-[560px] text-[17px] text-[#C9CBC3]">{t.events.intro}</p>
        </header>

        <section aria-labelledby="yaklasan-baslik">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="yaklasan-baslik" className="cr-display m-0 text-[32px] min-[901px]:text-[48px]">{t.events.upcoming}</h2>
            <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#A6A9A0]">{t.events.count(upcoming.length)}</span>
          </div>
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-[14px] border border-[#2A2A2A] bg-[#161616] p-8">
              <span className="cr-display text-[28px] min-[901px]:text-[40px]">{t.events.soonTitle}</span>
              <p className="m-0 text-[17px] text-[#C9CBC3]">
                {t.events.announce}{" "}
                <a href="https://www.instagram.com/noqtclubradio" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                  @noqtclubradio ↗
                </a>
              </p>
              <Link href="/booking" className="mt-2 inline-flex min-h-11 items-center rounded-full bg-[#DDF76A] px-6 py-3 text-[14px] font-bold uppercase tracking-[0.5px] !text-[#0A0A0A] no-underline">
                {t.events.djBooking}
              </Link>
            </div>
          ) : (
            <ul className="m-0 grid list-none gap-6 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr))]">
              {upcoming.map((e) => (
                <li key={e.id} className="min-w-0">
                  <EventFlyerCard event={e} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="gecmis-baslik" className="mt-24">
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="gecmis-baslik" className="cr-display m-0 text-[32px] min-[901px]:text-[48px]">{t.events.past}</h2>
            <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#A6A9A0]">{t.events.count(past.length)}</span>
          </div>
          {past.length === 0 ? (
            <p className="m-0 text-[#A6A9A0]">{t.events.noPast}</p>
          ) : (
            <ul className="m-0 grid list-none gap-6 p-0 [grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))]">
              {past.map((e) => (
                <li key={e.id} className="min-w-0">
                  <EventFlyerCard event={e} archived />
                </li>
              ))}
            </ul>
          )}
        </section>

        {eventsYoutubeUrls.length > 0 ? (
          <section className="mt-24" aria-labelledby="kayit-baslik">
            <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="kayit-baslik" className="cr-display m-0 text-[32px] min-[901px]:text-[48px]">{t.events.recordings}</h2>
              <Link href="/#setler" className="cr-sec-link">{t.events.allSets}</Link>
            </div>
            <ul className="m-0 grid list-none gap-8 p-0 md:grid-cols-2">
              {eventsYoutubeUrls.map((url, i) => (
                <li key={`${url}-${i}`} className="flex flex-col gap-3">
                  <p className="cr-mono m-0 text-[12px] uppercase tracking-[1px] text-[#DDF76A]">{t.events.recording(String(i + 1).padStart(2, "0"))}</p>
                  <YouTubeLazyEmbed url={url} title={t.events.recordingTitle(i + 1)} className="rounded-xl border border-[#2A2A2A]" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
