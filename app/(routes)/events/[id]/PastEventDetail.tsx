"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ChevronLeft } from "lucide-react";
import { useState } from "react";
import type { PublicEvent } from "@/lib/event-types";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAuth } from "@/lib/auth-context";

function mapsHref(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export default function PastEventDetail({ event }: { event: PublicEvent }) {
  const { locale } = useI18n();
  const { isLoggedIn } = useAuth();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  const photos = (event.photos || []) as { url: string }[];
  const playlists = (event.playlists ?? []) as {
    djName: string;
    description?: string;
    avatarUrl?: string;
    spotifyEmbedUrl: string;
  }[];

  const dateLabel = event.date
    ? new Date(event.date).toLocaleString(locale === "en" ? "en-US" : "tr-TR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const mapQuery = [event.venue, event.venueAddress, event.city].filter(Boolean).join(", ");

  async function submitMemory(formData: FormData) {
    const file = (formData.get("file") as File) || null;
    const note = String(formData.get("note") || "").trim();
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/blob/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      await fetch("/api/events/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, memberPhotosAdd: [{ url, description: note }] }),
      });
      setShowMemoryForm(false);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hata");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-5 py-10 space-y-10">

        {/* Back */}
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="size-4" />
          {locale === "en" ? "All events" : "Tüm etkinlikler"}
        </Link>

        {/* Hero card */}
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          {event.image ? (
            <div className="relative aspect-[16/7] w-full overflow-hidden">
              <Image
                src={event.image}
                alt={`${event.title} kapak görseli`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 896px) 100vw, 896px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-block rounded-md bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 mb-3">
                  {locale === "en" ? "Past event" : "Geçmiş etkinlik"}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{event.title}</h1>
                {event.subtitle ? <p className="mt-2 text-white/80 text-sm md:text-base max-w-2xl">{event.subtitle}</p> : null}
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 border-b border-border">
              <span className="inline-block rounded-md bg-muted text-muted-foreground text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 mb-3">
                {locale === "en" ? "Past event" : "Geçmiş etkinlik"}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{event.title}</h1>
              {event.subtitle ? <p className="mt-2 text-muted-foreground text-sm md:text-base">{event.subtitle}</p> : null}
            </div>
          )}

          {/* Meta row */}
          <div className="p-5 md:p-6 flex flex-wrap gap-4 text-sm text-muted-foreground border-t border-border">
            {dateLabel ? (
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0 text-muted-foreground/60" />
                <span>{dateLabel}</span>
              </div>
            ) : null}
            {(event.venue || event.city) ? (
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-muted-foreground/60" />
                <span>{[event.venue, event.city].filter(Boolean).join(" · ")}</span>
              </div>
            ) : null}
            {event.membersOnly ? (
              <span className="rounded-md border border-amber-400/45 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1">
                Kulüp etkinliği
              </span>
            ) : null}
          </div>
        </div>

        {/* About */}
        {event.description ? (
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-base font-semibold text-foreground mb-4">{locale === "en" ? "About" : "Etkinlik hakkında"}</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </section>
        ) : null}

        {/* Genres */}
        {event.genres && event.genres.length > 0 ? (
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">{locale === "en" ? "Genres" : "Türler"}</h2>
            <div className="flex flex-wrap gap-2">
              {event.genres.map((g) => (
                <span key={g} className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-foreground/80">{g}</span>
              ))}
            </div>
          </section>
        ) : null}

        {/* Line-up */}
        {event.lineup && event.lineup.length > 0 ? (
          <section>
            <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Line-up</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {event.lineup.map((a, i) => {
                const card = (
                  <div className="text-center p-3">
                    <div className="relative mx-auto w-16 h-16 rounded-full overflow-hidden border border-border bg-muted mb-2">
                      {a.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.imageUrl} alt={a.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">◆</div>
                      )}
                    </div>
                    {a.slot ? <div className="text-[10px] text-noqt-lime-ink uppercase tracking-wide mb-0.5">{a.slot}</div> : null}
                    <div className="text-xs font-medium text-foreground line-clamp-2">{a.name}</div>
                  </div>
                );
                return (
                  <div key={`${a.name}-${i}`} className="rounded-2xl border border-border bg-card hover:border-noqt-lime/60 transition-colors">
                    {a.href ? <a href={a.href} target="_blank" rel="noopener noreferrer">{card}</a> : card}
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Photos + Playlists */}
        {(photos.length > 0 || playlists.length > 0) ? (
          <div className="grid md:grid-cols-2 gap-6">
            {photos.length > 0 ? (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                  {locale === "en" ? "Photos" : "Fotoğraflar"}
                  <span className="ml-2 text-muted-foreground font-normal normal-case tracking-normal text-xs">{photos.length}</span>
                </h2>
                <div className="columns-2 sm:columns-3 gap-2 space-y-2">
                  {photos.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIdx(i)}
                      className="block w-full break-inside-avoid rounded-xl overflow-hidden border border-border group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.url}
                        alt={`${event.title} fotoğraf ${i + 1}`}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {playlists.length > 0 ? (
              <section className="rounded-2xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                  DJ {locale === "en" ? "Playlists" : "Playlistleri"}
                </h2>
                <div className="space-y-4">
                  {playlists.map((pl, i) => (
                    <article key={i} className="rounded-xl border border-border bg-muted/30 p-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border bg-muted shrink-0">
                          {pl.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={pl.avatarUrl} alt={pl.djName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full grid place-items-center text-[10px] text-muted-foreground">DJ</div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{pl.djName}</div>
                          {pl.description ? <div className="text-muted-foreground text-xs">{pl.description}</div> : null}
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
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        {/* Venue */}
        {(event.venue || event.venueAddress) ? (
          <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">{locale === "en" ? "Venue" : "Mekan"}</h2>
            <div className="font-medium text-foreground">{event.venue}</div>
            {event.venueAddress ? <p className="text-sm text-muted-foreground mt-1">{event.venueAddress}</p> : null}
            {mapQuery ? (
              <a href={mapsHref(mapQuery)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-noqt-lime-ink hover:text-noqt-lime-ink">
                {locale === "en" ? "Open in Google Maps" : "Google Haritalar'da aç"} ↗
              </a>
            ) : null}
          </section>
        ) : null}

        {/* Rules */}
        {event.rules ? (
          <section className="rounded-2xl border border-border bg-muted/30 p-5 md:p-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">{locale === "en" ? "Rules" : "Kurallar"}</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              {event.rules.split("\n").filter(Boolean).map((l, i) => (
                <li key={i}>{l.replace(/^-\s*/, "")}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Memory upload */}
        {isLoggedIn ? (
          <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">{locale === "en" ? "Leave a memory" : "Anı bırak"}</h2>
            {!showMemoryForm ? (
              <button
                type="button"
                onClick={() => setShowMemoryForm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition"
              >
                {locale === "en" ? "Upload a photo" : "Fotoğraf yükle"}
              </button>
            ) : (
              <form action={submitMemory} className="space-y-3 max-w-sm">
                <input name="file" type="file" accept="image/*" required className="text-sm text-muted-foreground" />
                <textarea
                  name="note"
                  rows={2}
                  placeholder={locale === "en" ? "Note (optional)" : "Not (opsiyonel)"}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90">
                    {locale === "en" ? "Submit" : "Gönder"}
                  </button>
                  <button type="button" onClick={() => setShowMemoryForm(false)} className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted">
                    {locale === "en" ? "Cancel" : "Vazgeç"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : null}

        {/* DJ Booking CTA */}
        <section className="rounded-2xl border border-border bg-muted/30 p-5 md:p-6">
          <h2 className="text-base font-semibold text-foreground mb-1">{locale === "en" ? "Book a DJ for your event" : "Kendi etkinliğin için DJ"}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {locale === "en"
              ? "Private celebrations, brand nights or club formats — we plan music flow across Türkiye."
              : "Özel davet, marka gecesi veya kulüp formatı — Türkiye genelinde müzik akışını birlikte kuruyoruz."}
          </p>
          <Link href="/booking" className="inline-flex rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition">
            {locale === "en" ? "DJ booking" : "DJ booking sayfası"}
          </Link>
        </section>

      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && photos.length > 0 ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-4"
          onClick={() => setLightboxIdx(null)}
          role="presentation"
        >
          <div className="relative max-w-5xl w-full grid place-items-center" onClick={(e) => e.stopPropagation()} role="presentation">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[lightboxIdx]!.url}
              alt={`${event.title} fotoğraf`}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-xl"
            />
            <button type="button" onClick={() => setLightboxIdx(null)} className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black grid place-items-center text-sm font-bold">×</button>
            {photos.length > 1 ? (
              <>
                <button type="button" onClick={() => setLightboxIdx((lightboxIdx - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-black grid place-items-center">‹</button>
                <button type="button" onClick={() => setLightboxIdx((lightboxIdx + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 text-black grid place-items-center">›</button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
