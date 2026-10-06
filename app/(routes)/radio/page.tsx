import { Sparkles, Headphones, ExternalLink } from "lucide-react";
import RadioPlaylistsExplorer from "@/components/radio/RadioPlaylistsExplorer";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolvePageHeroSources } from "@/lib/page-hero-videos";
import { listPlaylistsForPublic } from "@/lib/playlists";
import { mergeWithNoqtaSpotifyPlaylists, NOQTA_SPOTIFY_PROFILE_URL } from "@/lib/noqta-spotify-curated";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/layout/PageShell";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import { RadioLivePlayer } from "@/components/radio/RadioLivePlayer";
import { getPublicRadioLiveForPlayer } from "@/lib/radio-live-config";
import Link from "next/link";

export const metadata = {
  title: "Noqta Radio — Elektronik Müzik Playlistleri",
  description:
    "Noqta Radio: Tech House, Techno, R&B ve Rock odaklı Spotify kürasyonları. Türkiye merkezli elektronik müzik kolektifinden dinleme önerileri.",
  alternates: { canonical: "/radio" },
};

export const dynamic = "force-dynamic";

export default async function RadioPage() {
  let rows: Awaited<ReturnType<typeof listPlaylistsForPublic>> = [];
  try {
    rows = await listPlaylistsForPublic();
  } catch (err) {
    // DB/Prisma hatası sayfayı komple patlatmasın; kullanıcıya boş-state gösterelim.
    console.error("RadioPage: listPlaylistsForPublic failed", err);
    rows = [];
  }
  const items = mergeWithNoqtaSpotifyPlaylists(
    rows.map((r) => ({
      id: r.id,
      title: r.title,
      spotifyUrl: r.spotifyUrl,
      coverImage: r.coverImage,
      category: r.category,
      featured: r.featured,
      sortOrder: r.sortOrder,
    })),
  );

  const heroSources = resolvePageHeroSources("radio");
  const overrides = await readSiteImageOverrides();
  const poster = resolveSiteImageUrl("radio_hero_poster", overrides) ?? "/og.png";

  const live = await getPublicRadioLiveForPlayer();
  const { isLive, streamUrl: liveStreamUrl, title: liveTitle } = live;

  return (
    <main>
      <PageHeroVideo
        sources={heroSources}
        poster={poster}
        posterAlt="Noqta Radio — müzik kürasyonu ve playlist kahraman görseli"
      >
        <div className="container mx-auto max-w-7xl px-4 py-14 md:py-20">
          <section className="rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="grid gap-3">
                <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
                  <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
                  noqta.radio
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl md:leading-tight">Noqta Radio</h1>
                <p className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                  <span className="bg-gradient-to-r from-noqt-lime via-noqt-lime to-noqt-sky bg-clip-text text-transparent font-medium">
                    Türlere göre kürasyon
                  </span>{" "}
                  playlistleri: Tech House, Techno, R&amp;B, Rock ve daha fazlası. Her kart Spotify&apos;ya gider.
                </p>

                <div className="flex flex-wrap gap-2 text-sm text-white/50">
                  {["Tech House", "Techno", "R&B", "Rock"].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:justify-end sm:text-right">
                <Button
                  asChild
                  className="rounded-xl border-0 bg-[#1DB954] text-black hover:bg-[#1ed760] shadow-sm shadow-black/20"
                >
                  <a
                    href={NOQTA_SPOTIFY_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="size-4 shrink-0" aria-hidden />
                    Spotify’da noqta — tüm listeler
                  </a>
                </Button>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 sm:ml-auto sm:w-fit">
                  <span
                    className={`size-2 rounded-full ${isLive ? "animate-pulse bg-emerald-400" : "bg-white/30"}`}
                    aria-hidden
                  />
                  {isLive ? "On air" : "On air (yakında)"}
                </div>
                {isLive && liveStreamUrl ? (
                  <RadioLivePlayer streamUrl={liveStreamUrl} title={liveTitle} className="sm:ml-auto sm:max-w-md" />
                ) : (
                  <Button
                    variant="outline"
                    className="rounded-xl border-white/20 bg-white/5 text-white/90 hover:bg-white/10 sm:ml-auto"
                    disabled
                  >
                    <Headphones className="size-4" aria-hidden />
                    Canlı dinleme (yakında)
                  </Button>
                )}
                <Link
                  href="/radio/chat"
                  className="text-sm text-cyan-300/90 hover:text-cyan-200 underline-offset-2 hover:underline sm:ml-auto"
                >
                  Canlı sohbet →
                </Link>
                <div className="text-sm text-white/45">Aşağıdaki koleksiyonlar Spotify profilimizle senkron.</div>
              </div>
            </div>
          </section>
        </div>
        <PageShell withGlow={false}>
          <ContentCard className="p-0 bg-transparent shadow-none border-0">
            <RadioPlaylistsExplorer items={items} spotifyProfileUrl={NOQTA_SPOTIFY_PROFILE_URL} />
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
