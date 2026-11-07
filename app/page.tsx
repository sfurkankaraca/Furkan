import type { Metadata } from "next";
import Link from "next/link";
import { LegacyAcademyHashRedirect } from "@/components/home/LegacyAcademyHashRedirect";
import { ClubRadioShell } from "@/components/club-radio/ClubRadioShell";
import { HeroVideo } from "@/components/club-radio/HeroVideo";
import { VideoCard } from "@/components/club-radio/VideoCard";
import { Photo } from "@/components/club-radio/Photo";
import {
  INSTAGRAM_URL,
  KNOWN_SET_VIDEOS,
  NOQT_SOCIAL,
  SOUNDCLOUD_URL,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/club-radio/content";
import { getSetVideos } from "@/lib/club-radio/sets";
import { eventDateParts, eventHasTicket, eventLineupNames, getPastEvents, getUpcomingEvents } from "@/lib/club-radio/events";
import { NOQTA_SPOTIFY_CURATED_PLAYLISTS, NOQTA_SPOTIFY_PROFILE_URL } from "@/lib/noqta-spotify-curated";
import type { PublicEvent } from "@/lib/event-types";
import { EventPoster } from "@/components/events/EventPoster";
import { getDict } from "@/lib/club-radio/i18n/server";
import type { Dict } from "@/lib/club-radio/i18n/dict";
import type { Lang } from "@/lib/club-radio/i18n/lang";
import { rich } from "@/lib/club-radio/i18n/rich";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    title: t.meta.homeTitle,
    description: t.meta.homeDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: t.meta.homeTitle,
      description: t.meta.homeOgDescription,
      type: "website",
      locale: t.meta.ogLocale,
      images: [{ url: "/club-radio/gece-kalabalik.jpg", width: 1800, height: 1013, alt: t.meta.homeOgAlt }],
    },
  };
}

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

/** Kart bağlantısının DIŞINDA durur (iç içe <a> geçersiz olur). */
function SocialMiniLink({ e, t, className = "" }: { e: PublicEvent; t: Dict; className?: string }) {
  if (!e.socialUrl) return null;
  return (
    <a
      href={e.socialUrl}
      target="_blank"
      rel="noopener"
      className={`cr-ul text-[13px] font-semibold text-[#C9CBC3] hover:text-[#DDF76A] ${className}`}
    >
      {rich(t.home.viewOnSocial)}
    </a>
  );
}

function EventsSection({ events, past, t, lang }: { events: PublicEvent[]; past: PublicEvent[]; t: Dict; lang: Lang }) {
  const [first, ...rest] = events;
  const more = rest.slice(0, 4);

  return (
    <section id="etkinlikler" aria-labelledby="etkinlikler-baslik" className={`${SECTION} scroll-mt-4 pt-28`}>
      <div className={SEC_HEAD}>
        <h2 id="etkinlikler-baslik" className="cr-display cr-sec-title m-0">{t.home.eventsTitle}</h2>
        <Link href="/events" className="cr-sec-link">{t.home.allEvents} →</Link>
      </div>

      {!first ? (
        <div className="flex flex-col items-start gap-3 rounded-[14px] border border-[#2A2A2A] bg-[#161616] p-8">
          <span className="cr-display text-[28px] min-[901px]:text-[40px]">{t.home.soonTitle}</span>
          <p className="m-0 text-[17px] text-[#C9CBC3]">
            {t.home.announce}{" "}
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="cr-ul font-semibold">
              @noqtclubradio ↗
            </a>
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-7">
          <div className="relative flex min-w-0 flex-[1_1_440px] flex-col">
          <EventLink e={first} className="relative flex min-h-[460px] min-w-0 flex-1 flex-col justify-end overflow-hidden rounded-[14px] bg-[#141414] no-underline min-[901px]:min-h-[560px]">
            <EventPoster
              image={first.image}
              title={first.title}
              alt={t.poster.alt(first.title)}
              showFallbackTitle={false}
              objectPosition="40% 30%"
              sizes="(max-width: 900px) 100vw, 50vw"
            />
            <span aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,10,0) 30%, rgba(10,10,10,0.92) 100%)" }} />
            <span className="relative flex flex-col gap-2.5 p-5 min-[560px]:p-7">
              <span className="self-start rounded-full bg-[#DDF76A] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.5px] text-[#0A0A0A]">
                {(() => {
                  const p = eventDateParts(first.date, lang);
                  return `${p.day} ${p.monthShort} ${p.weekdayLong}${eventHasTicket(first) ? t.home.ticketSuffix : ""}`;
                })()}
              </span>
              <span className="cr-display break-words text-[34px] normal-case leading-[0.95] min-[560px]:text-[52px]">{first.title}</span>
              {(() => {
                const names = eventLineupNames(first);
                const place = [first.venue, first.city].filter(Boolean).join(", ");
                const line = [names, place].filter(Boolean).join(" — ");
                return line ? <span className="text-[16px] text-[#D9DBD3]">{line}</span> : null;
              })()}
            </span>
          </EventLink>
          {first.socialUrl ? (
            <span className="absolute right-4 top-4 z-10 rounded-full bg-[#0A0A0A]/80 px-3 py-1.5 backdrop-blur-sm">
              <SocialMiniLink e={first} t={t} />
            </span>
          ) : null}
          </div>

          {more.length > 0 ? (
            <ul className="m-0 flex min-w-0 flex-[1_1_420px] list-none flex-col p-0">
              {more.map((e, i) => {
                const p = eventDateParts(e.date, lang);
                const ticket = eventHasTicket(e);
                const sub = [e.venue, e.city, p.time].filter(Boolean).join(" · ");
                return (
                  <li key={e.id} className={`border-t border-[#262626] ${i === more.length - 1 ? "border-b" : ""}`}>
                    <EventLink e={e} className="flex items-center gap-4 py-[18px] no-underline min-[560px]:gap-5">
                      <span className="relative block aspect-[4/5] w-[52px] flex-none overflow-hidden rounded-md bg-[#141414] min-[560px]:w-[60px]">
                        <EventPoster image={e.image} title={e.title} alt={t.poster.alt(e.title)} compact sizes="60px" />
                      </span>
                      <span className="flex flex-none basis-[56px] flex-col min-[560px]:basis-[72px]">
                        <span className="cr-display text-[28px] leading-none" style={{ fontStretch: "110%" }}>{p.day}</span>
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
                        {ticket ? t.common.ticket : t.common.detail}
                      </span>
                    </EventLink>
                    <SocialMiniLink e={e} t={t} className="-mt-2 inline-block pb-4 pl-[72px] min-[560px]:pl-[80px]" />
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      )}
      <PastStrip events={past} t={t} lang={lang} />
    </section>
  );
}

function NextEventCard({ event, t, lang }: { event?: PublicEvent; t: Dict; lang: Lang }) {
  if (!event) {
    return (
      <div className="flex flex-col items-start gap-2.5 rounded-[14px] border border-[#2A2A2A] bg-[#161616] p-5">
        <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#DDF76A]">{t.home.nextEvent}</span>
        <span className="cr-display text-[24px] leading-[1.05]">{t.home.soonTitle}</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="cr-ul text-[15px] font-semibold text-[#C9CBC3]">
          {t.home.announceShort}
        </a>
      </div>
    );
  }
  const p = eventDateParts(event.date, lang);
  const ticket = eventHasTicket(event);
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  return (
    <div className="flex flex-col gap-2.5">
    <EventLink e={event} className="flex gap-4 rounded-[14px] border border-[#2A2A2A] bg-[#161616] p-5 no-underline hover:border-[#DDF76A]">
      <span className="relative block aspect-[4/5] w-[88px] flex-none self-start overflow-hidden rounded-lg bg-[#141414] min-[420px]:w-[104px]">
        <EventPoster image={event.image} title={event.title} alt={t.poster.alt(event.title)} compact sizes="104px" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-2.5">
        <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#DDF76A]">{t.home.nextEvent}</span>
        <span className="self-start rounded-full bg-[#DDF76A] px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.5px] text-[#0A0A0A]">
          {p.day} {p.monthShort} {p.weekdayLong}
          {p.time ? ` · ${p.time}` : ""}
        </span>
        <span className="cr-display break-words text-[24px] normal-case leading-[1.05]">{event.title}</span>
        {place ? <span className="text-[14px] text-[#C9CBC3]">{place}</span> : null}
        <span className="text-[14px] font-bold uppercase tracking-[0.5px] text-[#DDF76A]">{ticket ? t.home.buyTicketArrow : t.home.detailArrow}</span>
      </span>
    </EventLink>
    <SocialMiniLink e={event} t={t} className="self-start" />
    </div>
  );
}

function PastStrip({ events, t, lang }: { events: PublicEvent[]; t: Dict; lang: Lang }) {
  if (events.length === 0) return null;
  return (
    <div className="mt-14">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="cr-eyebrow m-0 font-normal text-[#A6A9A0]">{t.home.pastTitle}</h3>
        <Link href="/events" className="cr-sec-link">{t.home.allArchive}</Link>
      </div>
      <ul className="m-0 grid list-none gap-4 p-0 grid-cols-2 min-[901px]:grid-cols-4">
        {events.map((e) => {
          const p = eventDateParts(e.date, lang);
          return (
            <li key={e.id} className="min-w-0">
              <EventLink e={e} className="flex flex-col gap-2.5 no-underline">
                <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-[#161616]">
                  <EventPoster image={e.image} title={e.title} alt={t.poster.alt(e.title)} grayscale showFallbackTitle={false} sizes="(max-width: 900px) 50vw, 25vw" />
                </span>
                <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#A6A9A0]">
                  {p.day} {p.monthShort} {p.year}
                </span>
                <span className="text-[16px] font-semibold leading-snug">{e.title}</span>
              </EventLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function HomePage() {
  const { lang, t } = await getDict();
  const [events, pastEvents, setVideos] = await Promise.all([
    getUpcomingEvents(5),
    getPastEvents(4),
    getSetVideos(),
  ]);
  const featured = setVideos[0] ?? KNOWN_SET_VIDEOS._HhoBgmEHPs;
  const playlists = PLAYLIST_TILES.map((t) => ({ t, item: NOQTA_SPOTIFY_CURATED_PLAYLISTS.find((p) => p.id === t.id) })).filter(
    (x): x is { t: (typeof PLAYLIST_TILES)[number]; item: NonNullable<(typeof x)["item"]> } => Boolean(x.item),
  );

  return (
    <ClubRadioShell>
      <LegacyAcademyHashRedirect />

      <main>
        {/* HERO: izlenebilir video */}
        <section id="ust" aria-label={t.home.watchAria}>
          <h1 className="sr-only">{t.home.h1}</h1>
          <div className="mx-auto flex max-w-[1360px] flex-wrap items-start gap-x-10 gap-y-8 px-6 pb-4 pt-8">
            <div className="min-w-0 flex-[1_1_620px]">
              <HeroVideo video={featured} />
            </div>
            <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
              <div className="flex flex-col gap-2">
                <span className="cr-mono text-[12px] uppercase tracking-[1.5px] text-[#DDF76A]">{t.home.watchNow}</span>
                <h2 lang="en" className="cr-display m-0 text-[30px] leading-[1.02] min-[901px]:text-[40px]" style={{ fontStretch: "112%" }}>
                  {featured.title}
                </h2>
                {featured.artists ? <p className="m-0 text-[16px] text-[#C9CBC3]">{featured.artists}</p> : null}
              </div>
              <NextEventCard event={events[0]} t={t} lang={lang} />
              <div className="flex flex-wrap gap-3">
                <Link href="/events" className="cr-pill cr-pill-lime">{t.home.allEvents}</Link>
                <Link href="/#setler" className="cr-pill cr-pill-line-light">{t.home.setVideosLink}</Link>
              </div>
            </div>
          </div>
        </section>

        <EventsSection events={events} past={pastEvents} t={t} lang={lang} />

        {/* SETLER */}
        <section id="setler" aria-labelledby="setler-baslik" className={`${SECTION} scroll-mt-4 pt-28`}>
          <div className={SEC_HEAD}>
            <h2 id="setler-baslik" className="cr-display cr-sec-title m-0">{t.home.setsTitle}</h2>
            <span className="flex flex-wrap gap-x-6 gap-y-2">
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="cr-sec-link">{t.home.youtubeChannel}</a>
              {SOUNDCLOUD_URL ? (
                <a href={SOUNDCLOUD_URL} target="_blank" rel="noopener noreferrer" className="cr-sec-link">{t.home.soundcloud}</a>
              ) : null}
            </span>
          </div>
          <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
            {setVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>

        {/* PLAYLISTLER */}
        {playlists.length > 0 ? (
          <section id="playlistler" aria-labelledby="playlistler-baslik" className={`${SECTION} pt-28`}>
            <div className={SEC_HEAD}>
              <h2 id="playlistler-baslik" className="cr-display cr-sec-title m-0">{t.home.playlistsTitle}</h2>
              <a href={NOQTA_SPOTIFY_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="cr-sec-link">{rich(t.home.allOnSpotify)}</a>
            </div>
            <ul className="m-0 grid list-none gap-5 p-0 grid-cols-2 md:[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
              {playlists.map(({ t, item }) => (
                <li key={item.id}>
                  <a href={item.spotifyUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-2.5 no-underline">
                    <span
                      className={`flex aspect-square flex-col justify-between rounded-[10px] p-4 md:p-5 ${t.extra ?? ""}`}
                      style={{ background: t.bg, color: t.fg }}
                    >
                      <span lang="en" className="cr-mono text-[12px] uppercase tracking-[1px]" style={t.labelColor ? { color: t.labelColor } : undefined}>
                        {t.label}
                      </span>
                      <span lang="en" className="cr-display text-[20px] min-[420px]:text-[26px] md:text-[clamp(30px,3vw,44px)] leading-[0.92] [overflow-wrap:normal]">{t.word}</span>
                    </span>
                    <span className="text-[14px] text-[#A6A9A0]">{item.title} · <span lang="en">Spotify</span></span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* NOQT SOCIAL */}
        <section id="social" aria-labelledby="social-baslik" className={`${SECTION} pt-28`}>
          <div className="flex flex-wrap overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#161616]">
            <div className="flex flex-[1_1_460px] flex-col justify-center gap-[18px] p-6 min-[560px]:p-11">
              <span className="cr-eyebrow text-[#DDF76A]">{t.home.socialEyebrow}</span>
              <h2 id="social-baslik" lang="en" className="cr-display m-0 text-[40px] leading-[0.95] min-[560px]:text-[52px]">noqt social</h2>
              <p className="m-0 max-w-[460px] text-[18px] text-[#D9DBD3]">
                {t.home.socialText}
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
                    className="inline-flex min-h-11 items-center gap-2.5 rounded-xl bg-[#F4F4EE] px-[22px] py-3.5 text-[15px] font-bold !text-[#0A0A0A] no-underline"
                  >
                    {t.home.socialGo}
                  </a>
                )}
              </div>
            </div>
            <div className="relative min-h-[300px] flex-[1_1_420px] min-[901px]:min-h-[400px]">
              <Photo src="/club-radio/gece-dj-masasi.jpg" alt="" fill sizes="(max-width: 900px) 100vw, 40vw" position="50% 40%" />
            </div>
          </div>
        </section>

        {/* DJ DAVETİ */}
        <section id="djler" className={`${SECTION} pt-28`}>
          <div className="flex flex-wrap items-end justify-between gap-x-14 gap-y-8 rounded-2xl border border-[#DDF76A] bg-[#0A0A0A] p-6 min-[560px]:p-12">
            <div className="flex flex-[2_1_480px] flex-col gap-[18px]">
              <span className="cr-eyebrow text-[#DDF76A]">{t.home.djEyebrow}</span>
              <h2 className="cr-display cr-band-title m-0" style={{ fontStretch: "125%", lineHeight: 0.86, letterSpacing: "-1px" }}>
                {t.home.djTitleA}
                <br />
                <span className="text-[#DDF76A]">{t.home.djTitleB}</span>
              </h2>
            </div>
            <div className="flex flex-[1_1_340px] flex-col gap-5">
              <p className="m-0 text-[19px] leading-[1.45] text-[#D9DBD3]">
                {t.home.djText}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/djler-icin#basvuru" className="cr-pill cr-pill-lime">{t.home.djSend}</Link>
                <Link href="/djler-icin" className="cr-pill cr-pill-line-light">{t.home.djWhat}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* MARKALAR */}
        <section id="isbirlikleri" className={`${SECTION} pt-10 pb-6`}>
          <div className="flex flex-wrap items-center justify-between gap-x-14 gap-y-7 border-y border-[#262626] py-12">
            <div className="flex flex-[2_1_520px] flex-col gap-3">
              <span className="cr-eyebrow text-[#DDF76A]">{t.home.brandEyebrow}</span>
              <h2 className="cr-display m-0 text-[32px] leading-[0.98] min-[560px]:text-[44px]">{t.home.brandTitle}</h2>
              <p className="m-0 max-w-[620px] text-[17px] text-[#D9DBD3]">
                {t.home.brandText}
              </p>
            </div>
            <Link href="/isbirlikleri#teklif" className="cr-pill cr-pill-line-lime flex-none px-[26px]">{t.home.brandCta}</Link>
          </div>
        </section>
      </main>
    </ClubRadioShell>
  );
}

function StoreButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2.5 rounded-xl bg-[#F4F4EE] px-[22px] py-3.5 text-[15px] font-bold !text-[#0A0A0A] no-underline"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="3" />
        <path d="M11 18h2" />
      </svg>
      {label}
    </a>
  );
}
