import type { Metadata } from "next";
import Link from "next/link";
import { BADGE_LABEL, type ArtistProfile } from "@/lib/artists/registry";
import { getAllArtists } from "@/lib/artists/noqt-events";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Sanatçılar — DJ ve prodüktör ağı | noqta",
  description:
    "noqta sanatçı ve DJ ağı: elektronik müzik sahnesinden profiller, türler, booking ve mentorluk fırsatları. Keşfet, bağlan, birlikte üret.",
  alternates: { canonical: "/sanatcilar" },
  openGraph: {
    title: "noqta sanatçı ağı",
    description: "Elektronik müzik sahnesinden DJ ve prodüktör profilleri.",
    url: "/sanatcilar",
  },
};

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex aspect-square w-full items-center justify-center bg-foreground/[0.06] text-3xl font-black tracking-tight text-foreground/40">
      {initials}
    </div>
  );
}

function ArtistCard({ a }: { a: ArtistProfile }) {
  return (
    <Link
      href={`/sanatcilar/${a.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-foreground/12 transition hover:border-foreground/30"
    >
      <div className="relative overflow-hidden">
        {a.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.imageUrl} alt={a.name} loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <Monogram name={a.name} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg font-bold tracking-[-0.02em] transition group-hover:opacity-70">{a.name}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{a.role}</p>
        {a.city ? <p className="mt-1 text-xs text-muted-foreground">{a.city}</p> : null}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {a.badges.slice(0, 3).map((b) => (
            <span
              key={b}
              className="rounded-full border border-foreground/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
            >
              {BADGE_LABEL[b]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export const revalidate = 21600;

export default async function ArtistsPage() {
  const artists = await getAllArtists();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "noqta sanatçı ağı",
    url: `${SITE_URL}/sanatcilar`,
    hasPart: artists.map((a) => ({
      "@type": "Person",
      name: a.name,
      url: `${SITE_URL}/sanatcilar/${a.slug}`,
    })),
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pb-20">
      <header className="border-b border-foreground/15 pt-10 pb-6 md:pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Sanatçı & DJ ağı
        </p>
        <h1 className="mt-3 text-5xl font-black leading-[0.9] tracking-[-0.04em] md:text-7xl">Sanatçılar</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Elektronik müzik sahnesinden profiller. Keşfet, dinle, booking ve mentorluk için doğrudan bağlan.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-3 lg:grid-cols-4">
        {artists.map((a) => (
          <ArtistCard key={a.slug} a={a} />
        ))}

        {/* Listelen CTA kartı */}
        <Link
          href="/join"
          className="flex flex-col items-start justify-center rounded-2xl border border-dashed border-foreground/25 p-6 transition hover:border-foreground/50"
        >
          <span className="text-2xl font-black text-foreground/40">+</span>
          <h2 className="mt-2 text-lg font-bold tracking-[-0.02em]">Sen de listelen</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            DJ ya da prodüktörsen profilini oluştur, sahneye ve booking'e görün.
          </p>
          <span className="mt-3 text-sm font-semibold underline-offset-4 group-hover:underline">Başvur →</span>
        </Link>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
