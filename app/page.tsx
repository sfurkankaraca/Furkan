

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
      {/* HERO: Full-bleed background video (muted) with centered CTAs */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <video
            className="w-full h-full object-cover"
            src="/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            poster="/og.png"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid place-items-center text-center gap-6">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-satoshi">noqta</h1>
            <p className="text-lg text-white/80">lost in loops. together, we listen.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-xl">
                <Link href={(process.env.NEXT_PUBLIC_BMC_URL as string) || "https://buymeacoffee.com/noqta"} target="_blank" rel="noopener noreferrer">Buy me a coffee</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/join">Klube Katıl</Link>
              </Button>
            </div>
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
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Yaklaşan Etkinlikler</h2>
            <Link href="/events" className="text-sm text-white/70 hover:text-white">Tümü</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev as any} />
            ))}
          </div>
        </div>
      </section>

      {/* Geçmiş Etkinlikler */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Geçmiş Etkinlikler</h2>
            <Link href="/events" className="text-sm text-white/70 hover:text-white">Tümü</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
            {events
              .filter((e) => e.date && new Date(e.date).getTime() < Date.now())
              .slice(0, 3)
              .map((ev) => (
                <EventCard key={ev.id} event={ev as any} />
              ))}
          </div>
        </div>
      </section>

      {/* Academy */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Academy</h3>
            <p className="text-white/70 mt-2">DJ ve prodüksiyon için atölyeler, birebir dersler ve paylaşımlar.</p>
            <div className="mt-4">
              <Link href="/academy" className="underline">Detaylar</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-white/80">Yakında atölyeler ve kayıt bağlantıları burada.</div>
          </div>
        </div>
      </section>

      {/* Collective */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Collective</h3>
            <p className="text-white/70 mt-2">Topluluk, üretim ve sakin alan: birlikte kaybolmak için.</p>
            <div className="mt-4">
              <Link href="/collective" className="underline">Keşfet</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-white/80">Etkinlikten kareler, playlistler ve hikayeler.</div>
          </div>
        </div>
      </section>

      

    </main>
  );
}
