import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { artistSlugs, BADGE_LABEL } from "@/lib/artists/registry";
import { getArtistBySlug } from "@/lib/artists/noqt-events";
import { YouTubeLazyEmbed } from "@/components/social/YouTubeLazyEmbed";
import { SITE_URL } from "@/lib/site-url";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export function generateStaticParams() {
  return artistSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArtistBySlug(slug);
  if (!a) return { title: "Sanatçı bulunamadı" };
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
    <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-foreground/[0.06] text-5xl font-black tracking-tight text-foreground/40">
      {initials}
    </div>
  );
}

export default async function ArtistProfilePage({ params }: Props) {
  const { slug } = await params;
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
    sameAs: a.links.filter((l) => l.href.startsWith("http")).map((l) => l.href),
  };

  return (
    <main className="container mx-auto max-w-5xl px-4 pb-20">
      <nav className="pt-8 text-xs text-muted-foreground" aria-label="İçerik konumu">
        <ol className="flex flex-wrap items-center gap-x-1.5">
          <li>
            <Link href="/" className="transition hover:text-foreground">Ana sayfa</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/sanatcilar" className="transition hover:text-foreground">Sanatçılar</Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/70">{a.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 pt-8 md:grid-cols-[18rem_1fr] md:gap-12">
        {/* Sol: görsel + rozetler + linkler */}
        <aside className="md:sticky md:top-24 md:self-start">
          <div className="overflow-hidden rounded-2xl">
            {a.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.imageUrl} alt={a.name} className="aspect-square w-full object-cover" />
            ) : (
              <Monogram name={a.name} />
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {a.badges.map((b) => (
              <span
                key={b}
                className="rounded-full border border-foreground/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {BADGE_LABEL[b]}
              </span>
            ))}
          </div>

          {a.links.length > 0 ? (
            <ul className="mt-5 grid gap-2 text-sm">
              {a.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="border-b border-foreground/20 pb-0.5 transition hover:border-foreground"
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
              {...(a.bookingUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90"
            >
              Booking talebi
            </Link>
          ) : null}
        </aside>

        {/* Sağ: bio */}
        <div>
          {a.affiliation ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {a.affiliation}
            </p>
          ) : null}
          <h1 className="mt-2 text-3xl font-black leading-[1.03] tracking-[-0.035em] md:text-5xl">{a.name}</h1>
          <p className="mt-3 text-base text-muted-foreground">{a.role}</p>
          {a.city ? <p className="mt-1 text-sm text-muted-foreground">{a.city}</p> : null}

          <div className="mt-5 flex flex-wrap gap-1.5">
            {a.genres.map((g) => (
              <span key={g} className="rounded-full bg-foreground/[0.06] px-3 py-1 text-xs text-foreground/70">
                {g}
              </span>
            ))}
          </div>

          <p className="mt-6 text-lg leading-relaxed text-foreground md:text-xl">{a.tagline}</p>

          <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.75] text-foreground/85">
            {a.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {a.videos?.length ? (
            <section className="mt-10" aria-labelledby="videos-heading">
              <h2 id="videos-heading" className="text-xl font-bold tracking-tight">Videolar</h2>
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
                    <YouTubeLazyEmbed key={v.src} url={v.src} title={`${a.name} — video`} className="rounded-xl" />
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
                title={`${a.name} — dinle`}
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
