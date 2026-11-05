import type { Metadata } from "next";
import Link from "next/link";
import { LegacyAcademyHashRedirect } from "@/components/home/LegacyAcademyHashRedirect";
import { ClubRadioShell } from "@/components/club-radio/ClubRadioShell";
import { ClubRadioHeader } from "@/components/club-radio/ClubRadioHeader";
import { ClubRadioFooter } from "@/components/club-radio/ClubRadioFooter";
import { HeroPlayer } from "@/components/club-radio/HeroPlayer";
import { VideoCard } from "@/components/club-radio/VideoCard";
import { Photo } from "@/components/club-radio/Photo";
import {
  INSTAGRAM_URL,
  NOQT_SOCIAL,
  SET_VIDEOS,
  SOUNDCLOUD_URL,
  YOUTUBE_CHANNEL_URL,
  youtubeWatchUrl,
} from "@/lib/club-radio/content";
import { eventDateParts, eventHasTicket, eventLineupNames, getUpcomingEvents } from "@/lib/club-radio/events";
import { NOQTA_SPOTIFY_CURATED_PLAYLISTS, NOQTA_SPOTIFY_PROFILE_URL } from "@/lib/noqta-spotify-curated";
import type { PublicEvent } from "@/lib/event-types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "noqt club radio — DJ setleri, playlistler ve geceler",
  description: "noqt club radio: stüdyo DJ setleri, Spotify playlistleri ve Kayseri'deki noqt geceleri. Setini gönder, markanla birlikte çalışalım.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "noqt club radio — DJ setleri, playlistler ve geceler",
    description: "Stüdyo DJ setleri, playlistler ve noqt geceleri.",
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/club-radio/gece-kalabalik.jpg", width: 1800, height: 1013, alt: "Bir noqt gecesinde elleri havada dans eden kalabalık" }],
  },
};

const SECTION = "mx-auto max-w-[1360px] px-6";
const SEC_HEAD = "mb-7 flex flex-wrap items-baseline justify-between gap-3";

const PLAYLIST_TILES: { id: string; word: string; label: string; bg: string; fg: string; extra?: string; labelColor?: string }[] = [
  { id: "noqt-house-collection", word: "House", label: "noqt collection", bg: "#DDF76A", fg: "#0A0A0A" },
  { id: "noqt-hardgroove-collection", word: "Hard​groove", label: "noqt collection", bg: "#F4F4EE", fg: "#0A0A0A" },
  { id: "noqt-afro-house-collection", word: "Afro house", label: "noqt collection", bg: "#6EC0F3", fg: "#0A0A0A" },
  { id: "noqt-for-ladies", word: "Ladies", label: "noqt for", bg: "#1A1A1A", fg: "#F4F4EE", extra: "border border-[#333]", labelColor: "#DDF76A" },
];

function EventLink({ e, className, children }: { e: PublicEvent; className: string; children: React.ReactNode }) {
  return (
    <Link href={`/events/${encodeURIComponent(e.id)}`} className={className}>
      {children}
    </Link>
  );
}

function EventsSection({ events }: { events: PublicEvent[] }) {
  const [first, ...rest] = events;
  const more = rest.slice(0, 4);

  return (
    <section id="etkinlikler" aria-labelledby="etkinlikler-baslik" className={`${SECTION} pt-[104px]`}>
      <div className={SEC_HEAD}>
        <h2 id="etkinlikler-baslik" className="cr-display cr-sec-title m-0">Sıradaki geceler</h2>
        <Link href="/events" className="cr-sec-link">Geçmiş geceler →</Link>
      </div>

      {!first ? (
        <div className="flex flex-col items-start gap-3 rounded-[14px] border border-[#2A2A2A] bg-[#161616] p-8">
          <span className="cr-display text-[28px] min-[901px]:text-[40px]">Yeni geceler yakında.</span>
          <p className="m-0 text-[17px] text-[#C9CBC3]">
            Tarihler açıklandığında ilk Instagram&apos;da duyuruyoruz.{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="cr-ul font-semibold">
              @noqtclub ↗
            </a>
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-7">
          <EventLink e={first} className="cr-keep relative flex min-h-[460px] min-w-0 flex-[1_1_440px] flex-col justify-end overflow-hidden rounded-[14px] no-underline min-[901px]:min-h-[560px]">
            {first.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={first.image} alt="" loading="lazy" className="cr-bw absolute inset-0 size-full object-cover" style={{ objectPosition: "40% 30%" }} />
            ) : (
              <Photo src="/club-radio/gece-kirmizi.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 50vw" position="40% 30%" />
            )}
            <span aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0) 30%, rgba(10,10,10,0.92) 100%)" }} />
            <span className="relative flex flex-col gap-2.5 p-5 min-[560px]:p-7">
              <span className="self-start rounded-full bg-[#DDF76A] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.5px] text-[#0A0A0A]">
                {(() => {
                  const p = eventDateParts(first.date);
                  return `${p.day} ${p.monthShort} ${p.weekdayLong}${eventHasTicket(first) ? " · Bilet" : ""}`;
                })()}
              </span>
              <span className="cr-display break-words text-[34px] leading-[0.95] min-[560px]:text-[52px]">{first.title}</span>
              {(() => {
                const names = eventLineupNames(first);
                const place = [first.venue, first.city].filter(Boolean).join(", ");
                const line = [names, place].filter(Boolean).join(" — ");
                return line ? <span className="text-[16px] text-[#D9DBD3]">{line}</span> : null;
              })()}
            </span>
          </EventLink>

          {more.length > 0 ? (
            <ul className="m-0 flex min-w-0 flex-[1_1_420px] list-none flex-col p-0">
              {more.map((e, i) => {
                const p = eventDateParts(e.date);
                const ticket = eventHasTicket(e);
                const sub = [e.venue, e.city, p.time].filter(Boolean).join(" · ");
                return (
                  <li key={e.id} className={`border-t border-[#262626] ${i === more.length - 1 ? "border-b" : ""}`}>
                    <EventLink e={e} className="cr-keep flex items-center gap-5 py-[22px] no-underline">
                      <span className="flex flex-none basis-[72px] flex-col min-[560px]:basis-[84px]">
                        <span className="cr-display text-[30px] leading-none" style={{ fontStretch: "110%" }}>{p.day}</span>
                        <span className="cr-mono text-[12px] text-[#A6A9A0]">{p.rowLabel}</span>
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-[19px] font-semibold">{e.title}</span>
                        {sub ? <span className="text-[14px] text-[#A6A9A0]">{sub}</span> : null}
                      </span>
                      <span
                        className={`flex-none rounded-full px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.5px] ${
                          ticket ? "bg-[#DDF76A] text-[#0A0A0A]" : "border border-[#F4F4EE]"
                        }`}
                      >
                        {ticket ? "Bilet" : "Detay"}
                      </span>
                    </EventLink>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      )}
    </section>
  );
}

export default async function HomePage() {
  const events = await getUpcomingEvents(5);
  const latest = SET_VIDEOS[0];
  const playlists = PLAYLIST_TILES.map((t) => ({ t, item: NOQTA_SPOTIFY_CURATED_PLAYLISTS.find((p) => p.id === t.id) })).filter(
    (x): x is { t: (typeof PLAYLIST_TILES)[number]; item: NonNullable<(typeof x)["item"]> } => Boolean(x.item),
  );
  const halloween = SET_VIDEOS[1];

  return (
    <ClubRadioShell>
      <LegacyAcademyHashRedirect />
      <ClubRadioHeader current="home" />

      <main>
        {/* HERO */}
        <section id="ust" className="cr-on-lime bg-[#DDF76A] text-[#0A0A0A]">
          <div className="mx-auto max-w-[1360px] px-6 pb-[72px] pt-6">
            <h1 lang="en" className="cr-display cr-wm cr-wm-home m-0">
              noqt club
              <br />
              radio
            </h1>
            <div className="mt-12 flex flex-wrap items-stretch gap-x-12 gap-y-8">
              <div className="flex flex-[1_1_420px] flex-col justify-between gap-7">
                <div className="flex flex-col gap-[22px]">
                  <p className="cr-display m-0 max-w-[520px] text-[24px] leading-[1.12] min-[560px]:text-[30px]" style={{ fontWeight: 800, fontStretch: "100%", lineHeight: 1.12 }}>
                    DJ setleri, playlistler ve noqt geceleri.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/#etkinlikler" className="cr-pill cr-pill-dark">
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                      </svg>
                      Sıradaki gece
                    </Link>
                    <Link href="/#setler" className="cr-pill cr-pill-line-dark">
                      Arşive göz at →
                    </Link>
                  </div>
                </div>
                <HeroPlayer video={latest} />
              </div>
              <figure className="m-0 flex min-w-0 flex-[1_1_520px] flex-col gap-2">
                <Photo
                  src="/club-radio/gece-kalabalik.jpg"
                  alt="Bir noqt gecesinde DJ'in önünde elleri havada dans eden kalabalık"
                  sizes="(max-width: 900px) 100vw, 50vw"
                  position="50% 40%"
                  priority
                  className="aspect-[4/3]"
                />
                <figcaption className="cr-mono text-[12px] uppercase tracking-[1px]">Bir noqt gecesi</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <EventsSection events={events} />

        {/* SETLER */}
        <section id="setler" aria-labelledby="setler-baslik" className={`${SECTION} pt-28`}>
          <div className={SEC_HEAD}>
            <h2 id="setler-baslik" className="cr-display cr-sec-title m-0">Set videoları</h2>
            <span className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="cr-sec-link">YouTube kanalı ↗</a>
              {SOUNDCLOUD_URL ? (
                <a href={SOUNDCLOUD_URL} target="_blank" rel="noopener noreferrer" className="cr-sec-link">SoundCloud ↗</a>
              ) : null}
            </span>
          </div>
          <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            {SET_VIDEOS.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>

        {/* PLAYLISTLER */}
        {playlists.length > 0 ? (
          <section id="playlistler" aria-labelledby="playlistler-baslik" className={`${SECTION} pt-28`}>
            <div className={SEC_HEAD}>
              <h2 id="playlistler-baslik" className="cr-display cr-sec-title m-0">Playlistler</h2>
              <a href={NOQTA_SPOTIFY_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="cr-sec-link"><span lang="en">Spotify</span>&apos;da tümü ↗</a>
            </div>
            <ul className="m-0 grid list-none gap-5 p-0 grid-cols-2 md:[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
              {playlists.map(({ t, item }) => (
                <li key={item.id}>
                  <a href={item.spotifyUrl} target="_blank" rel="noopener noreferrer" className="cr-keep flex flex-col gap-2.5 no-underline">
                    <span
                      className={`flex aspect-square flex-col justify-between rounded-[10px] p-4 md:p-5 ${t.extra ?? ""}`}
                      style={{ background: t.bg, color: t.fg }}
                    >
                      <span lang="en" className="cr-mono text-[12px] uppercase tracking-[1px]" style={t.labelColor ? { color: t.labelColor } : undefined}>
                        {t.label}
                      </span>
                      <span lang="en" className="cr-display text-[20px] min-[420px]:text-[26px] md:text-[clamp(30px,3vw,44px)] leading-[0.92] [overflow-wrap:normal]">{t.word}</span>
                    </span>
                    <span className="text-[14px] text-[#A6A9A0]">{item.title} · Spotify</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ÖNCEKİ GECELER */}
        <section aria-labelledby="galeri-baslik" className={`${SECTION} pt-28`}>
          <div className={SEC_HEAD}>
            <h2 id="galeri-baslik" className="cr-display cr-sec-title m-0">Önceki geceler</h2>
            <Link href="/events" className="cr-sec-link">Tüm geceler →</Link>
          </div>
          <div className="grid auto-rows-[320px] grid-cols-1 gap-3 min-[560px]:grid-cols-2 min-[901px]:auto-rows-[440px] min-[901px]:grid-cols-3">
            <a href={youtubeWatchUrl(halloween.id)} target="_blank" rel="noopener noreferrer" className="cr-keep relative block min-w-0 overflow-hidden rounded-[10px] min-[560px]:col-span-2">
              <Photo src="/club-radio/gece-dj-masasi.jpg" alt="Bir noqt gecesinde DJ masasının çevresinde dans eden kalabalık" fill sizes="(max-width: 900px) 100vw, 66vw" position="50% 40%" />
              <span className="absolute bottom-4 left-4 flex items-center gap-2.5 rounded-full bg-[#0A0A0A]/80 py-2 pl-2 pr-3.5 text-[14px] font-semibold">
                <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-[#DDF76A] text-[#0A0A0A]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                </span>
                Geceden görüntüler
              </span>
            </a>
            <div className="relative min-w-0 overflow-hidden rounded-[10px]">
              <Photo src="/club-radio/studyo-b2b.jpg" alt="İki DJ birlikte çalıyor, arkada kalabalık" fill sizes="(max-width: 900px) 100vw, 34vw" position="45% 40%" />
            </div>
            <div className="relative min-w-0 overflow-hidden rounded-[10px]">
              <Photo src="/club-radio/gece-kirmizi.jpg" alt="Güneş gözlüklü iki kişi kırmızı ışıkta dans ediyor" fill sizes="(max-width: 900px) 100vw, 34vw" position="35% 30%" />
            </div>
            <div className="relative min-w-0 overflow-hidden rounded-[10px] min-[560px]:col-span-2">
              <Photo src="/club-radio/gece-kalabalik.jpg" alt="Mor ışıkta elleri havada kalabalık" fill sizes="(max-width: 900px) 100vw, 66vw" position="55% 40%" />
            </div>
          </div>
        </section>

        {/* NOQT SOCIAL */}
        <section id="social" aria-labelledby="social-baslik" className={`${SECTION} pt-28`}>
          <div className="flex flex-wrap overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616]">
            <div className="flex flex-[1_1_460px] flex-col justify-center gap-[18px] p-6 min-[560px]:p-11">
              <span className="cr-eyebrow text-[#DDF76A]">Uygulama</span>
              <h2 id="social-baslik" lang="en" className="cr-display m-0 text-[40px] leading-[0.95] min-[560px]:text-[52px]">noqt social</h2>
              <p className="m-0 max-w-[460px] text-[18px] text-[#D9DBD3]">
                Gecelere kiminle gideceğini bul, biletini uygulamadan al, tanıştığın insanlarla gece bittikten sonra da bağlantıda kal.
              </p>
              <div className="mt-1 flex flex-wrap gap-3">
                {NOQT_SOCIAL.appStore || NOQT_SOCIAL.googlePlay ? (
                  <>
                    {NOQT_SOCIAL.appStore ? <StoreButton href={NOQT_SOCIAL.appStore} label="App Store" /> : null}
                    {NOQT_SOCIAL.googlePlay ? <StoreButton href={NOQT_SOCIAL.googlePlay} label="Google Play" /> : null}
                  </>
                ) : (
                  <a
                    href={NOQT_SOCIAL.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cr-keep inline-flex min-h-11 items-center gap-2.5 rounded-xl bg-[#F4F4EE] px-[22px] py-3.5 text-[15px] font-bold text-[#0A0A0A] no-underline"
                  >
                    noqt.social&apos;a git ↗
                  </a>
                )}
              </div>
            </div>
            <div className="relative min-h-[300px] flex-[1_1_420px] min-[901px]:min-h-[400px]">
              <Photo src="/club-radio/gece-dj-masasi.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 40vw" position="50% 40%" />
            </div>
          </div>
        </section>

        {/* DJ BANDI */}
        <section id="djler" className="pt-28">
          <div className="cr-on-lime bg-[#DDF76A] text-[#0A0A0A]">
            <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-x-14 gap-y-8 px-6 py-[72px]">
              <div className="flex flex-[2_1_560px] flex-col gap-[18px]">
                <span className="cr-eyebrow">DJ misin?</span>
                <h2 className="cr-display cr-band-title m-0" style={{ fontStretch: "125%", lineHeight: 0.86, letterSpacing: "-1px" }}>
                  noqt&apos;ta
                  <br />
                  çal
                </h2>
              </div>
              <div className="flex flex-[1_1_340px] flex-col gap-5">
                <p className="m-0 text-[19px] leading-[1.45]">
                  Setini gönder, dinleyelim. Stüdyoya ya da bir geceye çağıralım; kayıt, fotoğraf ve topluluk bizden.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/djler-icin#basvuru" className="cr-pill cr-pill-dark">Set gönder</Link>
                  <Link href="/djler-icin" className="cr-pill cr-pill-line-dark">Neler sunuyoruz →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKALAR */}
        <section id="isbirlikleri" className={`${SECTION} pt-24`}>
          <div className="flex flex-wrap items-center justify-between gap-x-14 gap-y-7 border-y border-[#262626] py-12">
            <div className="flex flex-[2_1_520px] flex-col gap-3">
              <span className="cr-eyebrow text-[#DDF76A]">Markalar için</span>
              <h2 className="cr-display m-0 text-[32px] leading-[0.98] min-[560px]:text-[44px]">Bir gece birlikte yapalım</h2>
              <p className="m-0 max-w-[620px] text-[17px] text-[#D9DBD3]">
                Partiler, stüdyo yayınları ve set videolarında markanla birlikte çalışalım: ortak etkinlik, yayın sponsorluğu, ürün ve mekân işbirlikleri.
              </p>
            </div>
            <Link href="/isbirlikleri#teklif" className="cr-pill cr-pill-line-light flex-none px-[26px]">İşbirliği teklif et →</Link>
          </div>
        </section>
      </main>

      <ClubRadioFooter />
    </ClubRadioShell>
  );
}

function StoreButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cr-keep inline-flex min-h-11 items-center gap-2.5 rounded-xl bg-[#F4F4EE] px-[22px] py-3.5 text-[15px] font-bold text-[#0A0A0A] no-underline"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M11 18h2" />
      </svg>
      {label}
    </a>
  );
}
