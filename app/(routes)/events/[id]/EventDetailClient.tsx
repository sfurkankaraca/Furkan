"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/useI18n";
import type { PublicEvent } from "@/lib/event-types";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import PastEventDetail from "./PastEventDetail";

function formatTry(price: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(price);
}

function mapsHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function EventDetailClient() {
  const params = useParams();
  const id = String(params.id || "");
  const { isLoggedIn, club } = useAuth();
  const { locale } = useI18n();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${encodeURIComponent(id)}`, {
          cache: "no-store",
          credentials: "include",
        });
        if (response.ok) {
          const foundEvent: PublicEvent = await response.json();
          setEvent(foundEvent);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIdx === null || !event?.photos?.length) return;
      const len = (event.photos as { url: string }[]).length;
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? 0 : (i + 1) % len));
      if (e.key === "ArrowLeft") setLightboxIdx((i) => (i === null ? 0 : (i - 1 + len) % len));
    },
    [lightboxIdx, event?.photos]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  if (loading)
    return (
      <PageHeroVideo sources={[]} posterAlt="Noqta etkinlik detayı — arka plan görseli">
        <PageShell withGlow={false}>
          <div>Yükleniyor...</div>
        </PageShell>
      </PageHeroVideo>
    );
  if (!event)
    return (
      <PageHeroVideo sources={[]} posterAlt="Noqta etkinlik detayı — arka plan görseli">
        <PageShell withGlow={false}>
          <div>Etkinlik bulunamadı.</div>
        </PageShell>
      </PageHeroVideo>
    );

  const loc = locale === "en" ? "en-US" : "tr-TR";
  const start = event.date ? new Date(event.date) : null;
  const end = event.endDate ? new Date(event.endDate) : null;
  const now = new Date();
  const isPastEvent =
    start && !Number.isNaN(start.getTime()) ? (end && !Number.isNaN(end.getTime()) ? end < now : start < now) : false;

  const fmtFull = (d: Date) =>
    d.toLocaleString(loc, {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  let dateLabel = start && !Number.isNaN(start.getTime()) ? fmtFull(start) : locale === "en" ? "Date TBA" : "Tarih yakında";
  if (start && end && !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
    const sameCalDay = start.toDateString() === end.toDateString();
    if (sameCalDay) {
      dateLabel = `${fmtFull(start)} — ${end.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" })}`;
    } else {
      dateLabel = `${fmtFull(start)} — ${fmtFull(end)}`;
    }
  }

  const photos = (event.photos || []) as { url: string }[];
  const mapQuery = (event.venueMapQuery || event.venueAddress || [event.venue, event.city].filter(Boolean).join(", ")).trim();
  const rulesLines = event.rules
    ? event.rules
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  // İyzico başvurusu için: `ticketing.enabled=true` iken fiyat yoksa bile butonda "Bilet al" görünmeli.
  const ticketEnabled = !isPastEvent && event.ticketing?.enabled;
  const membersOnly = Boolean(event.membersOnly);
  const canBuyTicketWithClub = !membersOnly || club?.fullMember;
  const priceLabel =
    ticketEnabled && (event.ticketing?.priceTry ?? 0) > 0
      ? locale === "en"
        ? `From ${formatTry(event.ticketing!.priceTry, locale)}`
        : `${formatTry(event.ticketing!.priceTry, locale)} başlayan fiyatlar`
      : null;

  async function submitMemberPhoto(formData: FormData) {
    if (!event) return;
    const file = (formData.get("file") as File) || null;
    const note = String(formData.get("note") || "").trim();
    if (!file) {
      alert(locale === "en" ? "Photo required" : "Fotoğraf zorunlu");
      return;
    }
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blob/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      const updateRes = await fetch("/api/events/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, memberPhotosAdd: [{ url, description: note }] }),
      });
      if (!updateRes.ok) throw new Error("Update failed");
      const updated = await updateRes.json();
      setEvent(updated.updatedEvents.find((e: PublicEvent) => e.id === event.id));
      setShowMemoryForm(false);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error");
    }
  }

  const primaryCta =
    ticketEnabled && canBuyTicketWithClub ? (
    <Link
      href={`/events/${id}/bilet`}
      className="inline-flex rounded-full p-[2px] bg-gradient-to-r from-noqt-lime via-noqt-lime to-noqt-sky shadow-lg shadow-noqt-lime/20"
    >
      <span className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium">
        {locale === "en" ? "Buy ticket" : "Bilet al"}
      </span>
    </Link>
  ) : ticketEnabled && membersOnly ? (
    <Link
      href={isLoggedIn ? "/account/club" : `/login?next=${encodeURIComponent(`/events/${id}/bilet`)}`}
      className="inline-flex rounded-full p-[2px] bg-gradient-to-r from-amber-500/90 via-amber-600/80 to-amber-700/90 shadow-lg shadow-amber-950/30"
    >
      <span className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium">
        {locale === "en"
          ? isLoggedIn
            ? "Noqta Club required"
            : "Sign in · Club required"
          : isLoggedIn
            ? "Kulüp üyeliği gerekir"
            : "Giriş yap · kulüp üyeliği"}
      </span>
    </Link>
  ) : !isPastEvent ? (
    <a
      href={event.ctaUrl || "/events/apply"}
      className="inline-flex rounded-full p-[2px] bg-gradient-to-r from-noqt-lime via-noqt-lime to-noqt-sky"
    >
      <span className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium">
        {locale === "en" ? "RSVP" : "Etkinliğe başvur"}
      </span>
    </a>
  ) : (
    <span className="inline-block px-3 py-1.5 rounded-full text-xs bg-white/10 text-white/70">
      {locale === "en" ? "Past event" : "Geçmiş etkinlik"}
    </span>
  );

  if (isPastEvent) {
    return <PastEventDetail event={event} />;
  }

  return (
    <PageHeroVideo
      sources={[]}
      poster={event.image || "/og.png"}
      posterAlt="Noqta etkinlik detayı — arka plan görseli"
      overlayClassName="bg-black/50"
    >
      <PageShell withGlow={false}>
      <div className="grid gap-8 md:gap-10">
      {/* Hero */}
      <div className="grid md:grid-cols-[minmax(0,220px),1fr] gap-6 items-start">
        {/* Kapak (sol, 4:5) */}
        <div className="relative w-full max-w-[200px] md:max-w-[220px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 bg-white/5 self-start">
          {event.image ? (
            <>
              <Image
                src={event.image}
                alt={`${event.title} etkinliği kapak görseli${event.city ? ` — ${event.city}` : ""}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-noqt-lime/10 via-zinc-950 to-noqt-sky/10" />
          )}
        </div>

        {/* Bilgiler (sağ) */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 flex flex-col justify-between gap-6">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-white/70">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">{event.city || "—"}</span>
              {membersOnly ? (
                <span className="rounded-full border border-amber-400/45 bg-amber-500/15 px-3 py-1 text-amber-100/95 normal-case tracking-normal">
                  {locale === "en" ? "Club event" : "Kulüp etkinliği"}
                </span>
              ) : null}
              {priceLabel ? (
                <span className="rounded-full border border-noqt-lime/40 bg-noqt-lime/15 px-3 py-1 text-noqt-lime">
                  {priceLabel}
                </span>
              ) : null}
            </div>

            <div>
              <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-white">{event.title}</h1>
              {event.subtitle ? (
                <p className="mt-2 text-white/80 text-sm md:text-base max-w-2xl whitespace-pre-wrap">{event.subtitle}</p>
              ) : null}
              <p className="mt-3 text-white/75 text-sm md:text-base">{dateLabel}</p>
            </div>

            {/* Butonlar (Bilet al / Satın al tarzı) */}
            <div className="flex flex-wrap items-center gap-3">{primaryCta}</div>
          </div>
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-3 items-start">
          <div className="rounded-lg bg-white/10 p-2 text-noqt-lime">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="text-xs text-white/50 uppercase tracking-wide">{locale === "en" ? "Venue" : "Mekan"}</div>
            <div className="font-medium text-white mt-0.5">{event.venue || "—"}</div>
            {event.venueAddress ? <div className="text-sm text-white/65 mt-1 leading-snug">{event.venueAddress}</div> : null}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex gap-3 items-start">
          <div className="rounded-lg bg-white/10 p-2 text-cyan-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-white/50 uppercase tracking-wide">{locale === "en" ? "When" : "Zaman"}</div>
            <div className="text-sm text-white/85 mt-1 leading-relaxed">{dateLabel}</div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col justify-center gap-2">
          <div className="text-xs text-white/50 uppercase tracking-wide">{locale === "en" ? "Tickets" : "Bilet"}</div>
          {primaryCta}
        </div>
      </div>

      {mapQuery ? (
        <a
          href={mapsHref(mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-cyan-300/90 hover:text-cyan-200 w-fit"
        >
          <span>{locale === "en" ? "Open in Google Maps" : "Google Haritalar’da aç"}</span>
          <span aria-hidden>↗</span>
        </a>
      ) : null}

      {/* Açıklama */}
      {event.description ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
          <h2 className="text-lg font-medium text-white mb-4">
            {locale === "en" ? "About" : "Giriş bilgileri"}
          </h2>
          <div className="text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">{event.description}</div>
        </section>
      ) : null}

      {/* Türler */}
      {event.genres && event.genres.length > 0 ? (
        <section>
          <h2 className="text-lg font-medium text-white mb-3">{locale === "en" ? "Genres" : "Türler"}</h2>
          <div className="flex flex-wrap gap-2">
            {event.genres.map((g) => (
              <span
                key={g}
                className="rounded-full border border-noqt-lime/35 bg-noqt-lime/10 px-3 py-1 text-xs text-noqt-lime/95"
              >
                {g}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Line-up */}
      {event.lineup && event.lineup.length > 0 ? (
        <section>
          <h2 className="text-lg font-medium text-white mb-4">Line-up</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {event.lineup.map((a, i) => {
              const inner = (
                <>
                  <div className="relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/15 bg-white/5">
                    {a.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.imageUrl}
                        alt={`${a.name} — ${event.title} etkinliği line-up görseli`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-xs text-white/40">◆</div>
                    )}
                  </div>
                  {a.slot ? <div className="text-[10px] md:text-xs text-noqt-lime/80 mt-2 uppercase tracking-wide">{a.slot}</div> : null}
                  <div className="text-sm font-medium text-white mt-1 line-clamp-2">{a.name}</div>
                </>
              );
              return (
                <div
                  key={`${a.name}-${i}`}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center hover:border-noqt-lime/30 transition-colors"
                >
                  {a.href ? (
                    <a href={a.href} target="_blank" rel="noopener noreferrer" className="block">
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Organizatör + mekan */}
      {event.organizer?.name || event.organizer?.imageUrl || event.venue ? (
        <div className="grid md:grid-cols-2 gap-4">
          {event.organizer?.name || event.organizer?.imageUrl ? (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5 flex gap-4 items-center">
              <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/15 shrink-0 bg-black/40">
                {event.organizer?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.organizer.imageUrl}
                    alt={`${event.organizer?.name || "Organizatör"} — ${event.title} etkinliği`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full grid place-items-center text-white/40 text-xs">Org</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs text-white/50 uppercase">{locale === "en" ? "Organizer" : "Organizatör"}</div>
                {event.organizer?.href ? (
                  <a href={event.organizer.href} className="font-medium text-white hover:text-noqt-lime truncate block" target="_blank" rel="noopener noreferrer">
                    {event.organizer?.name || "—"}
                  </a>
                ) : (
                  <div className="font-medium text-white">{event.organizer?.name || "—"}</div>
                )}
              </div>
            </section>
          ) : null}
          {event.venue ? (
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-white/50 uppercase mb-1">{locale === "en" ? "Venue" : "Mekan"}</div>
              <div className="font-medium text-white">{event.venue}</div>
              {event.venueAddress ? <p className="text-sm text-white/70 mt-2">{event.venueAddress}</p> : null}
              {mapQuery ? (
                <a href={mapsHref(mapQuery)} target="_blank" rel="noopener noreferrer" className="text-sm text-cyan-300/90 mt-2 inline-block hover:text-cyan-200">
                  {locale === "en" ? "Directions" : "Yol tarifi"}
                </a>
              ) : null}
            </section>
          ) : null}
        </div>
      ) : null}

      {/* Kurallar */}
      {rulesLines.length > 0 ? (
        <section className="rounded-2xl border border-white/10 bg-black/25 p-5 md:p-6">
          <h2 className="text-lg font-medium text-white mb-3">{locale === "en" ? "Rules" : "Kurallar"}</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-white/75">
            {rulesLines.map((line, i) => (
              <li key={i}>{line.replace(/^\-\s*/, "")}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{locale === "en" ? "Photos" : "Fotoğraflar"}</h2>
            {photos.length > 8 ? (
              <span className="text-xs text-white/50">
                {photos.length} {locale === "en" ? "photos" : "fotoğraf"}
              </span>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIdx(i)}
                className="aspect-square relative rounded-xl overflow-hidden border border-white/10 group"
              >
                <Image
                  src={p.url}
                  alt={`${event.title} etkinliği fotoğrafı ${i + 1}${event.city ? ` — ${event.city}` : ""}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-3">
          <h2 className="text-xl font-medium">
            DJ {locale === "en" ? "playlists" : "playlistleri"}
          </h2>
          <div className="grid gap-4">
            {(event.playlists ?? []).map((raw, i) => {
              const pl = raw as {
                djName: string;
                description?: string;
                avatarUrl?: string;
                spotifyEmbedUrl: string;
              };
              return (
              <article key={i} className="grid gap-3 p-3 rounded-xl border border-white/10 bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/20">
                    {pl.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pl.avatarUrl} alt={pl.djName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-[10px] text-white/60">DJ</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{pl.djName}</div>
                    {pl.description ? <div className="text-white/70 text-xs">{pl.description}</div> : null}
                  </div>
                </div>
                <iframe
                  src={pl.spotifyEmbedUrl}
                  width="100%"
                  height="80"
                  title={pl.djName}
                  className="rounded-lg border-0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </article>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 transition duration-300 hover:border-white/16">
        <h2 className="text-lg font-medium text-white mb-2">{locale === "en" ? "Book a DJ" : "Kendi etkinliğin için DJ"}</h2>
        <p className="text-sm text-white/65 mb-4 leading-relaxed">
          {locale === "en"
            ? "Private celebrations, brand nights or club formats — we plan music flow across Türkiye."
            : "Özel davet, marka gecesi veya kulüp formatı fark etmez; Türkiye genelinde müzik akışını birlikte kuruyoruz."}
        </p>
        <Link
          href="/booking"
          className="inline-flex rounded-xl bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition active:scale-[0.99]"
        >
          {locale === "en" ? "DJ booking" : "DJ booking sayfası"}
        </Link>
      </section>

      {isLoggedIn ? (
        <div className="grid place-items-center pt-2">
          {!showMemoryForm ? (
            <button
              type="button"
              onClick={() => setShowMemoryForm(true)}
              className="inline-flex rounded-full p-[2px] bg-gradient-to-r from-noqt-lime via-noqt-lime to-noqt-sky"
            >
              <span className="px-4 py-2 rounded-full bg-black text-white text-sm">
                {locale === "en" ? "Leave a memory" : "Anı bırak"}
              </span>
            </button>
          ) : (
            <form action={submitMemberPhoto} className="w-full max-w-md grid gap-2 rounded-xl border border-white/10 p-3">
              <div className="text-sm text-white/80">
                {locale === "en" ? "Upload a photo (required), note (optional)" : "Fotoğraf yükle (zorunlu), not (opsiyonel)"}
              </div>
              <input name="file" type="file" accept="image/*" required className="text-sm" />
              <textarea name="note" rows={2} placeholder={locale === "en" ? "Note (optional)" : "Not (opsiyonel)"} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white text-sm" />
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">
                  {locale === "en" ? "Submit" : "Gönder"}
                </button>
                <button type="button" onClick={() => setShowMemoryForm(false)} className="rounded-xl border border-white/20 px-3 py-1.5 text-sm">
                  {locale === "en" ? "Cancel" : "Vazgeç"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}

      {lightboxIdx !== null && photos.length > 0 ? (
        <div className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-4" onClick={() => setLightboxIdx(null)} role="presentation">
          <div className="relative max-w-5xl w-full grid place-items-center" onClick={(e) => e.stopPropagation()} role="presentation">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightboxIdx].url}
              alt={`${event.title} etkinlik fotoğrafı${event.city ? ` — ${event.city}` : ""}`}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl border border-white/10"
            />
            <button type="button" onClick={() => setLightboxIdx(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black grid place-items-center text-sm">
              ×
            </button>
            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-black grid place-items-center"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIdx((lightboxIdx + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-black grid place-items-center"
                >
                  ›
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
      </div>
    </PageShell>
    </PageHeroVideo>
  );
}
