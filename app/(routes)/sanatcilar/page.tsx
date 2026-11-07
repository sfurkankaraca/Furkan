import type { Metadata } from "next";
import Link from "next/link";
import { BADGE_LABEL, type ArtistProfile } from "@/lib/artists/registry";
import { getAllArtists } from "@/lib/artists/noqt-events";
import { SITE_URL } from "@/lib/site-url";
import { getDict } from "@/lib/club-radio/i18n/server";
import type { Dict } from "@/lib/club-radio/i18n/dict";
import { GenreChips } from "@/components/artists/GenreChips";
import { ArtistPhoto } from "@/components/artists/ArtistPhoto";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    title: t.meta.artistsTitle,
    description: t.meta.artistsDescription,
    alternates: { canonical: "/sanatcilar" },
    openGraph: {
      title: t.meta.artistsOgTitle,
      description: t.meta.artistsOgDescription,
      url: "/sanatcilar",
    },
  };
}

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex aspect-square w-full items-center justify-center bg-[#1c1c1c] text-3xl font-black tracking-tight text-[#3f3f3f]">
      {initials}
    </div>
  );
}

function ArtistCard({ a, t }: { a: ArtistProfile; t: Dict }) {
  return (
    <Link
      href={`/sanatcilar/${a.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-noqt-lime/60"
    >
      <div className="relative aspect-square overflow-hidden">
        {a.imageUrl ? (
          <ArtistPhoto src={a.imageUrl} alt={a.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" className="grayscale contrast-110 transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
        ) : (
          <Monogram name={a.name} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg font-bold tracking-[-0.02em] transition group-hover:text-noqt-lime">{a.name}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{a.role}</p>
        <GenreChips genres={a.genres} label={t.artists.mainGenres} className="mt-2" chipClassName="border-noqt-lime/40 text-noqt-lime" />
        {a.city ? <p className="mt-1 text-xs text-muted-foreground">{a.city}</p> : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.badges.slice(0, 3).map((b) => (
            <span
              key={b}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {BADGE_LABEL[b]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export const revalidate = 300;

export default async function ArtistsPage() {
  const { t } = await getDict();
  const artists = await getAllArtists();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.artists.ldName,
    url: `${SITE_URL}/sanatcilar`,
    hasPart: artists.map((a) => ({
      "@type": "Person",
      name: a.name,
      url: `${SITE_URL}/sanatcilar/${a.slug}`,
    })),
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pb-20">
      <header className="border-b border-border pt-10 pb-8 md:pt-16">
        <p className="cr-eyebrow m-0 text-noqt-lime">{t.artists.eyebrow}</p>
        <h1 className="mt-3 text-[34px] font-black leading-[0.9] tracking-[-0.02em] min-[420px]:text-5xl md:text-8xl" style={{ fontStretch: "125%" }}>{t.artists.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {t.artists.intro}
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-3 lg:grid-cols-4">
        {artists.map((a) => (
          <ArtistCard key={a.slug} a={a} t={t} />
        ))}

        {/* Listelen CTA kartı */}
        <a
          href="https://www.noqt.events/basvuru/sanatci"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-noqt-lime/50 p-6 transition hover:border-noqt-lime"
        >
          <span className="text-2xl font-black text-noqt-lime">{t.artists.joinPlus}</span>
          <h2 className="mt-2 text-lg font-bold tracking-[-0.02em]">{t.artists.joinTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t.artists.joinText}
          </p>
          <span className="mt-3 text-sm font-semibold uppercase tracking-wide text-noqt-lime">{t.artists.joinCta}</span>
        </a>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
