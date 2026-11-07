import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, type BlogCategory, type BlogPostMeta } from "@/lib/blog/registry";
import { BlogCoverArt } from "@/components/blog/BlogCoverArt";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { SERIES, SERIES_ORDER, postsInSeries } from "@/lib/blog/series";
import { SITE_URL } from "@/lib/site-url";
import { getDict } from "@/lib/club-radio/i18n/server";
import { formatDate, type Lang } from "@/lib/club-radio/i18n/lang";
import { rich } from "@/lib/club-radio/i18n/rich";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    title: t.meta.blogTitle,
    description: t.meta.blogDescription,
    alternates: { canonical: "/blog" },
    openGraph: {
      title: t.meta.blogOgTitle,
      description: t.meta.blogOgDescription,
      url: "/blog",
    },
  };
}

const ORDER: BlogCategory[] = ["haber", "efsaneler", "sahne", "dj", "produksiyon", "booking", "egitim", "b2b"];


function byDateDesc(a: BlogPostMeta, b: BlogPostMeta) {
  return a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0;
}

export default async function BlogIndexPage() {
  const { lang, t } = await getDict();
  const fmtDate = (iso: string) => formatDate(iso, lang as Lang, { day: "numeric", month: "long", year: "numeric" });
  const catLabel = (c: BlogCategory, fallback: string) => t.blog.categories[c] ?? fallback;
  const all = [...BLOG_POSTS].sort(byDateDesc);
  const [lead, ...others] = all;
  const secondary = others.slice(0, 4);
  const grouped = ORDER.map((cat) => ({
    cat,
    label: t.blog.categories[cat] ?? cat,
    posts: all.filter((p) => p.category === cat),
  })).filter((g) => g.posts.length > 0);

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "noqta journal",
    description: t.meta.blogDescription,
    url: `${SITE_URL}/blog`,
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
    })),
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pb-20">
      {/* Masthead */}
      <header className="border-b border-border pt-10 pb-8 md:pt-16">
        <p className="cr-eyebrow m-0 text-noqt-lime">{rich(t.blog.eyebrowA)}</p>
        <h1 lang="en" className="mt-3 text-5xl font-black leading-[0.9] tracking-[-0.02em] md:text-8xl" style={{ fontStretch: "125%" }}>Journal</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {t.blog.intro}
        </p>
        {t.blog.turkishNote ? <p className="mt-3 text-sm text-muted-foreground">{t.blog.turkishNote}</p> : null}
      </header>

      {/* Kategori şeridi */}
      <nav aria-label={t.blog.sections} className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border py-3">
        {grouped.map((g) => (
          <a
            key={g.cat}
            href={`#bolum-${g.cat}`}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-foreground"
          >
            {g.label}
            <span className="ml-1 tabular-nums opacity-50">{g.posts.length}</span>
          </a>
        ))}
      </nav>

      {/* Manşet */}
      {lead ? (
        <section className="grid gap-8 border-b border-border py-10 md:grid-cols-12 md:py-14">
          <Link href={`/blog/${lead.slug}`} className="group md:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-card">
              <BlogCoverArt post={lead} priority sizes="(min-width: 768px) 58vw, 100vw" />
            </div>
          </Link>
          <div className="flex flex-col justify-center md:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-noqt-lime">
              {catLabel(lead.category, lead.categoryLabel)} · {fmtDate(lead.publishedAt)}
            </p>
            <h2 className="mt-3 text-3xl font-black leading-[1.05] tracking-[-0.01em] md:text-5xl">
              <Link href={`/blog/${lead.slug}`} className="transition hover:text-noqt-lime">
                {lead.title}
              </Link>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{lead.description}</p>
            <Link
              href={`/blog/${lead.slug}`}
              className="mt-6 w-fit border-b-2 border-noqt-lime pb-0.5 text-sm font-bold uppercase tracking-wide text-noqt-lime transition hover:text-noqt-lime"
            >
              {t.blog.readPost}
            </Link>
          </div>
        </section>
      ) : null}

      {/* İkincil ızgara */}
      {secondary.length > 0 ? (
        <section className="grid gap-x-6 gap-y-10 border-b border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
          {secondary.map((p) => (
            <article key={p.slug} className="group">
              <Link href={`/blog/${p.slug}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <BlogCoverArt post={p} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" />
                </div>
              </Link>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {catLabel(p.category, p.categoryLabel)}
              </p>
              <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-[-0.02em]">
                <Link href={`/blog/${p.slug}`} className="transition hover:text-noqt-lime">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </article>
          ))}
        </section>
      ) : null}

      {/* Bülten */}
      <div className="border-b border-border py-10">
        <NewsletterSignup source="journal-index" />
      </div>

      {/* Devam eden diziler */}
      <section aria-labelledby="diziler" className="border-b border-border py-10">
        <div className="flex items-baseline justify-between border-b-2 border-noqt-lime pb-2">
          <h2 id="diziler" className="text-xl font-black uppercase tracking-[-0.01em] md:text-2xl">
            {t.blog.ongoing}
          </h2>
          <span className="text-xs text-muted-foreground">{t.blog.regular}</span>
        </div>
        <div className="grid gap-x-6 gap-y-8 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERIES_ORDER.map((id) => {
            const meta = SERIES[id];
            const posts = postsInSeries(id);
            const latest = posts[posts.length - 1];
            return (
              <article key={id} className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-bold tracking-[-0.02em]">{meta.name}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {meta.cadence}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{meta.tagline}</p>
                {latest ? (
                  <p className="mt-3 text-sm">
                    <span className="text-muted-foreground">{t.blog.lastEpisode}</span>
                    <Link href={`/blog/${latest.slug}`} className="font-medium underline-offset-4 hover:underline">
                      {latest.title}
                    </Link>
                  </p>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">{t.blog.firstSoon}</p>
                )}
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t.blog.episodes(posts.length)}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Bölümler */}
      <div className="grid gap-14 py-12">
        {grouped.map(({ cat, label, posts }) => (
          <section key={cat} id={`bolum-${cat}`} aria-labelledby={`baslik-${cat}`} className="scroll-mt-24">
            <div className="flex items-baseline justify-between border-b-2 border-noqt-lime pb-2">
              <h2 id={`baslik-${cat}`} className="text-xl font-black uppercase tracking-[-0.01em] md:text-2xl">
                {label}
              </h2>
              <span className="text-xs tabular-nums text-muted-foreground">{t.blog.posts(posts.length)}</span>
            </div>

            <ul className="divide-y divide-border">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group grid gap-4 py-5 sm:grid-cols-[2rem_9rem_1fr] sm:items-start"
                  >
                    <span className="hidden text-sm tabular-nums text-muted-foreground sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="relative aspect-[4/3] w-32 overflow-hidden rounded-lg bg-muted sm:w-36">
                      <BlogCoverArt post={p} sizes="9rem" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] transition group-hover:text-noqt-lime md:text-xl">
                        {p.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {fmtDate(p.publishedAt)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }} />
    </main>
  );
}
