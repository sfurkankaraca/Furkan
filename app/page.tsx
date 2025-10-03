

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import DotRing from "@/components/DotRing";
import EventCard, { EventItem } from "@/components/EventCard";
import { useState, useEffect } from "react";

export default function Home() {
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
    const fetchLatestEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const latestEvents = await response.json();
          setEvents(latestEvents);
          localStorage.setItem('noqta-events', JSON.stringify(latestEvents));
          return;
        }
      } catch {}
      const storedEvents = localStorage.getItem('noqta-events');
      if (storedEvents) {
        try { setEvents(JSON.parse(storedEvents)); } catch {}
      }
    };

    fetchLatestEvents();
  }, []);

  const upcoming = events.filter((e) => !e.date || new Date(e.date).getTime() >= Date.now());

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">noqta.</h1>
            <p className="mt-4 text-lg text-white/70 max-w-prose">lost in loops. together, we listen.</p>
            <div className="mt-8 flex gap-3">
              <Button asChild className="rounded-xl">
                <Link href="/login">Giriş</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/join">Kaybol</Link>
              </Button>
            </div>
          </div>
          <div className="grid place-items-center">
            <DotRing size={260} />
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <p className="text-white/70">quiet energy. deep rhythm. we experiment, we share.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[{ href: "/events", title: "Events", desc: "What’s next" }, { href: "/collective", title: "Collective", desc: "Why we gather" }, { href: "/academy", title: "Academy", desc: "Learning space" }].map((c) => (
              <Link key={c.href} href={c.href} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition block">
                <div className="text-xl font-medium">{c.title}</div>
                <div className="text-white/60 mt-1">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Yaklaşan Etkinlikler</h2>
            <Link href="/events" className="text-sm text-white/70 hover:text-white">Tümü</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev as any} />
            ))}
          </div>
        </div>
      </section>

      

    </main>
  );
}
