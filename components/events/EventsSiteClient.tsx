"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, Youtube } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { YouTubeLazyEmbed } from "@/components/social/YouTubeLazyEmbed";
import { SITE_URL } from "@/lib/site-url";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EventItem } from "@/components/EventCard";
import { EventTicketRow } from "@/components/events/EventTicketRow";
import { useAuth } from "@/lib/auth-context";

type Tab = "upcoming" | "past";

export function EventsSiteClient() {
  const { isLoggedIn, club } = useAuth();
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
  const [heroPoster, setHeroPoster] = useState("/og.png");
  const [eventsYoutubeUrls, setEventsYoutubeUrls] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("upcoming");

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
        const res = await fetch("/api/site-image?slot=events_hero_poster", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data?.url === "string" && data.url) {
          setHeroPoster(data.url);
        }
      } catch {
        /* noop */
      }
    })();
    return () => {
      cancelled = true;
    };
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

  const spotlight = upcoming[0];
  const listUpcoming = upcoming.slice(1);
  const spotlightMembersOnly = Boolean(spotlight?.membersOnly);
  const spotlightCanBuy =
    spotlight?.ticketing?.enabled &&
    spotlight.ticketing.priceTry > 0 &&
    (!spotlightMembersOnly || club?.fullMember);

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

  const tabList: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Yaklaşan", count: upcoming.length },
    { id: "past", label: "Geçmiş", count: past.length },
  ];

  return (
    <main className="relative isolate min-h-screen min-w-0 overflow-x-hidden bg-background text-foreground">
      <h1 className="sr-only">Etkinlikler</h1>

      <PageShell withGlow={false}>
        <div className="mx-auto max-w-6xl space-y-12 py-8 md:space-y-16 md:py-12">
          {/* Öne çıkan — en üstte */}
          {spotlight ? (
            <section aria-labelledby="spotlight-heading" className="pt-2 md:pt-4">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 id="spotlight-heading" className="text-lg font-semibold text-foreground md:text-xl">
                  Öne çıkan
                </h2>
                <span className="text-xs text-muted-foreground">Bu gece önerilen</span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
              >
                <div className="grid lg:grid-cols-12 lg:gap-0">
                  <Link
                    href={`/events/${spotlight.id}`}
                    className="relative block aspect-[16/10] min-h-[200px] lg:col-span-7 lg:aspect-auto lg:min-h-[340px]"
                  >
                    {spotlight.image ? (
                      <Image
                        src={spotlight.image}
                        alt={`${spotlight.title} — görsel`}
                        fill
                        className="object-cover transition duration-700 hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        priority
                      />
                    ) : (
                      <div className="absolute inset-0 bg-zinc-900" />
                    )}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/90 lg:via-black/25 lg:to-transparent"
                      aria-hidden
                    />
                  </Link>
                  <div className="flex flex-col justify-center gap-4 p-6 md:p-8 lg:col-span-5">
                    <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-600">
                      {spotlight.date
                        ? new Date(spotlight.date).toLocaleDateString("tr-TR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Tarih yakında"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-balance text-2xl font-semibold leading-tight md:text-3xl">{spotlight.title}</h3>
                      {spotlightMembersOnly ? (
                        <span className="shrink-0 rounded-md border border-amber-400/45 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                          Kulüp etkinliği
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {[spotlight.venue, spotlight.city].filter(Boolean).join(" · ") || spotlight.city}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button asChild className="rounded-xl bg-foreground text-background hover:opacity-90">
                        <Link href={`/events/${spotlight.id}`}>Etkinlik sayfası</Link>
                      </Button>
                      {spotlightCanBuy ? (
                        <Button asChild variant="outline" className="rounded-xl border-border bg-muted/50 hover:bg-muted">
                          <Link href={`/events/${spotlight.id}/bilet`}>
                            Bilet al — ₺{Number(spotlight.ticketing!.priceTry).toLocaleString("tr-TR")}
                          </Link>
                        </Button>
                      ) : spotlight.ticketing?.enabled && spotlight.ticketing.priceTry > 0 && spotlightMembersOnly ? (
                        <Button asChild variant="outline" className="rounded-xl border-amber-400/40 bg-amber-500/10 text-amber-800 hover:bg-amber-500/15">
                          <Link
                            href={isLoggedIn ? "/account/club" : `/login?next=${encodeURIComponent(`/events/${spotlight.id}/bilet`)}`}
                          >
                            {isLoggedIn ? "Kulüp üyeliği gerekir" : "Giriş · kulüp üyeliği"}
                          </Link>
                        </Button>
                      ) : spotlight.ctaUrl ? (
                        <Button asChild variant="outline" className="rounded-xl border-border bg-muted/50 hover:bg-muted">
                          <Link href={spotlight.ctaUrl}>Başvur</Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          ) : null}

          {/* Sekmeli liste */}
          <section aria-label="Etkinlik listesi">
            <div className="flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex rounded-2xl border border-border bg-muted p-1">
                {tabList.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative rounded-xl px-4 py-2.5 text-sm font-medium transition",
                      tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
                    )}
                  >
                    {tab === t.id ? (
                      <motion.span
                        layoutId="events-tab-pill"
                        className="absolute inset-0 rounded-xl bg-background shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {t.id === "upcoming" ? <CalendarRange className="size-4 opacity-70" aria-hidden /> : null}
                      {t.label}
                      <span className="rounded-md bg-foreground/10 px-1.5 py-0.5 text-[11px] tabular-nums text-muted-foreground">
                        {t.count}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {tab === "upcoming" ? "Tarihe göre sıralı · Bilet varsa satırda gösterilir." : "Geçmiş performanslar ve arşiv."}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mt-6 space-y-3"
              >
                {tab === "upcoming" ? (
                  upcoming.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
                      <p className="text-sm text-muted-foreground">Yaklaşan etkinlik yok. Takvim güncellendiğinde burada listelenir.</p>
                      <Button asChild className="mt-6 rounded-xl bg-foreground text-background hover:opacity-90">
                        <Link href="/booking">DJ booking</Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      {listUpcoming.map((e) => (
                        <EventTicketRow key={e.id} event={e} />
                      ))}
                    </>
                  )
                ) : past.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">Henüz arşivlenmiş etkinlik yok.</p>
                ) : (
                  past.map((e) => <EventTicketRow key={e.id} event={e} archived />)
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* YouTube — sayfa sonu, editoryal blok (kaydırmalı şerit değil) */}
          {eventsYoutubeUrls.length > 0 ? (
            <section
              className="rounded-3xl border border-border bg-muted/30 px-5 py-10 md:px-10 md:py-14"
              aria-label="Set kayıtları ve videolar"
            >
              <div className="mx-auto max-w-3xl text-center">
                <Youtube className="mx-auto size-10 text-red-500/90" aria-hidden />
                <h2 className="mt-4 text-xl font-semibold text-foreground md:text-2xl">Sahnede kayıtlar</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Gece özetleri ve set kayıtları — tıklayınca oynatılır (YouTube).
                </p>
              </div>
              <ul className="mx-auto mt-10 grid max-w-5xl list-none gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-12">
                {eventsYoutubeUrls.map((url, i) => (
                  <li key={`${url}-${i}`} className="flex flex-col gap-3">
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                      Kayıt {String(i + 1).padStart(2, "0")}
                    </p>
                    <YouTubeLazyEmbed url={url} title={`Noqta set kaydı ${i + 1}`} className="rounded-xl border border-border shadow-sm" />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </PageShell>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
