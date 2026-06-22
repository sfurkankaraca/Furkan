"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { useState, useEffect } from "react";

export default function Home() {
  const [events, setEvents] = useState([
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
      } catch {}
      const storedEvents = localStorage.getItem("noqta-events");
      if (storedEvents) {
        try {
          setEvents(JSON.parse(storedEvents));
        } catch {}
      }
    };
    fetchLatestEvents();
  }, []);

  const upcoming = events.filter(
    (e) => !e.date || new Date(e.date).getTime() >= Date.now()
  );

  return (
    <main>
      {/* HERO */}
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
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid place-items-center text-center gap-6">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              noqta
            </h1>
            <p className="text-lg text-white/80 max-w-xl">
              DJ eğitimi, elektronik müzik topluluğu ve etkinlik deneyimi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-xl">
                <Link href="/events">Etkinlikleri Keşfet</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/academy">Academy</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { href: "/academy", title: "Academy", desc: "DJ ve prodüksiyon eğitimi — atölyeler ve birebir dersler." },
              { href: "/collective", title: "Collective", desc: "Topluluğa katıl, sahne kazan, üretimini paylaş." },
              { href: "/events", title: "Etkinlikler", desc: "Noqta etkinliklerini keşfet ve topluluğu sahada gör." },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition block"
              >
                <div className="text-xl font-medium">{c.title}</div>
                <div className="text-white/60 mt-1 text-sm">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Yaklaşan Etkinlikler</h2>
            <Link href="/events" className="text-sm text-white/70 hover:text-white">
              Tümü
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center">
            {upcoming.map((ev) => (
              <EventCard key={ev.id} event={ev as any} />
            ))}
          </div>
        </div>
      </section>

      {/* Past events */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-semibold">Geçmiş Etkinlikler</h2>
            <Link href="/events" className="text-sm text-white/70 hover:text-white">
              Tümü
            </Link>
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

      {/* Academy CTA */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Academy</h3>
            <p className="text-white/70 mt-2">
              DJ ve prodüksiyon için pratik odaklı atölyeler, birebir dersler ve paylaşımlar.
            </p>
            <div className="mt-4">
              <Link href="/academy" className="underline">
                Detaylar
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-white/80">Yakında atölyeler ve kayıt bağlantıları burada.</div>
          </div>
        </div>
      </section>

      {/* noqt.events CTA */}
      <section className="py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-white/15 bg-white/[0.07] px-6 py-7 text-center">
            <p className="text-sm text-white/60 mb-4">
              Düğün, organizasyon veya özel etkinlik için profesyonel DJ hizmeti mi arıyorsunuz?
            </p>
            <a
              href="https://www.noqt.events"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              noqt.events'i ziyaret et
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
