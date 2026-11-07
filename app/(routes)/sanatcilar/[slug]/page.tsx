import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { artistSlugs, BADGE_LABEL } from "@/lib/artists/registry";
import { getArtistBySlug } from "@/lib/artists/noqt-events";
import { YouTubeLazyEmbed } from "@/components/social/YouTubeLazyEmbed";
import { SITE_URL } from "@/lib/site-url";
import { getDict } from "@/lib/club-radio/i18n/server";
import { GenreChips } from "@/components/artists/GenreChips";
import { ArtistPhoto } from "@/components/artists/ArtistPhoto";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export function generateStaticParams() {
  return artistSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { t } = await getDict();
  const a = await getArtistBySlug(slug);
  if (!a) return { title: t.meta.artistNotFound };
  return {
    title: `${a.name} — ${a.role} | noqta`,
    description: a.tagline,
    alternates: { canonical: a.canonicalUrl ?? `/sanatcilar/${a.slug}` },
    openGraph: {
      type: "profile",
      title: a.name,
      description: a.tagline,
      url: `/sanatcilar/${a.slug}`,
    },
  };
}

function Monogram({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-[#1c1c1c] text-5xl font-black tracking-tight text-[#3f3f3f]">
      {initials}
    </div>
  );
}

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;
  const { t } = await getDict();
  const a = await getArtistBySlug(slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: a.name,
    description: a.tagline,
    url: a.canonicalUrl ?? `${SITE_URL}/sanatcilar/${a.slug}`,
    ...(a.imageUrl ? { image: a.imageUrl } : {}),
    jobTitle: a.role,
    address: a.city,
  };

  return (
    <main className="container mx-auto max-w-5xl px-4 pb-20">
      <nav className="pt-8 text-xs text-muted-foreground" aria-label={t.artists.breadcrumb}>
        <ol className="flex flex-wrap items-center gap-x-1.5">
          <li>
            <Link href="/" className="transition hover:text-foreground">{t.artists.home}</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/sanatcilar" className="transition hover:text-foreground">{t.artists.title}</Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/70">{a.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 pt-8 md:grid-cols-[18rem_1fr] md:gap-12">
        {/* Sol: görsel + rozetler + linkler */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="relative overflow-hidden rounded-2xl">
            {a.imageUrl ? (
              <div className="relative aspect-square w-full">
                <ArtistPhoto src={a.imageUrl} alt={a.name} sizes="(min-width: 768px) 360px, 100vw" className="contrast-105" priority />
              </div>
            ) : (
              <Monogram name={a.name} />
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {a.badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {BADGE_LABEL[b]}
              </span>
            ))}
          </div>

          {/* Sosyal bağlantı / iletişim gösterilmez — yalnız site içi linkler */}
          {a.links.some((l) => l.href.startsWith("/")) ? (
            <ul className="mt-5 grid gap-2 text-sm">
              {a.links.filter((l) => l.href.startsWith("/")).map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="border-b border-noqt-lime/50 pb-0.5 transition hover:border-noqt-lime"
                    {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label} ↗
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {a.badges.includes("booking") ? (
            <Link
              href={a.bookingUrl ?? "/booking"}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-noqt-lime px-5 py-3 text-sm font-bold uppercase tracking-wide text-[#0A0A0A] transition hover:brightness-95"
            >
              {t.artists.bookingRequest}
            </Link>
          ) : null}
        </aside>

        {/* Sağ: bio */}
        <div>
          {a.affiliation ? (
            <p className="cr-eyebrow m-0 text-noqt-lime">
              {a.affiliation}
            </p>
          ) : null}
          <h1 className="mt-2 text-3xl font-black leading-[1.03] tracking-[-0.02em] md:text-6xl">{a.name}</h1>
          <p className="mt-3 text-base text-muted-foreground">{a.role}</p>
          {a.city ? <p className="mt-1 text-sm text-muted-foreground">{a.city}</p> : null}

          {a.genres.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="cr-eyebrow m-0 text-[#A6A9A0]">{t.artists.mainGenres}</span>
              <GenreChips genres={a.genres} label={t.artists.mainGenres} chipClassName="border-noqt-lime/40 text-noqt-lime text-xs !px-3 !py-1" />
            </div>
          ) : null}

          <p className="mt-6 text-lg leading-relaxed text-foreground md:text-xl">{a.tagline}</p>

          <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.75] text-foreground/85">
            {a.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {a.videos?.length ? (
            <section className="mt-10" aria-labelledby="videos-heading">
              <h2 id="videos-heading" className="text-2xl font-black tracking-tight">{t.artists.videos}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {a.videos.map((v) =>
                  v.kind === "file" ? (
                    <video
                      key={v.src}
                      src={v.src}
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-video w-full rounded-xl bg-black object-contain"
                    />
                  ) : (
                    <YouTubeLazyEmbed key={v.src} url={v.src} title={t.artists.videoOf(a.name)} className="rounded-xl" />
                  ),
                )}
              </div>
            </section>
          ) : null}

          {a.embedUrl ? (
            <div className="mt-8 overflow-hidden rounded-xl">
              <iframe
                src={a.embedUrl}
                className="h-40 w-full"
                loading="lazy"
                title={t.artists.listenOf(a.name)}
                allow="autoplay"
              />
            </div>
          ) : null}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
