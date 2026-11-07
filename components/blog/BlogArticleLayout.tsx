import type { ReactNode } from "react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog/registry";
import { BlogCoverArt, BlogCoverCredit } from "@/components/blog/BlogCoverArt";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { seriesOf, episodeNumber, postsInSeries } from "@/lib/blog/series";
import { SITE_URL } from "@/lib/site-url";
import { getDict } from "@/lib/club-radio/i18n/server";
import { formatDate } from "@/lib/club-radio/i18n/lang";

export async function BlogArticleLayout({
  post,
  children,
}: {
  post: BlogPostMeta;
  children: ReactNode;
}) {
  const { lang, t } = await getDict();
  const series = seriesOf(post);
  const episode = episodeNumber(post);
  const siblings = series ? postsInSeries(series.id).filter((p) => p.slug !== post.slug).slice(-3).reverse() : [];

  const published = formatDate(post.publishedAt, lang, { day: "numeric", month: "long", year: "numeric" });

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "noqta", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "noqta",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/og.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.blog.home, item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pb-20">
      <nav className="pt-8 text-xs text-muted-foreground" aria-label={t.blog.breadcrumb}>
        <ol className="flex flex-wrap items-center gap-x-1.5">
          <li>
            <Link href="/" className="transition hover:text-foreground">
              {t.blog.home}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/blog" className="transition hover:text-foreground">
              Journal
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="line-clamp-1 text-foreground/70">{post.title}</li>
        </ol>
      </nav>

      <article>
        {/* Başlık bloğu */}
        <header className="mx-auto max-w-3xl border-b border-border pb-8 pt-8 md:pt-12">
          <p className="cr-eyebrow m-0 text-noqt-lime">
            {series ? (
              <>
                {series.name}
                {episode ? <span className="opacity-60"> · {t.blog.episode} {episode}</span> : null}
              </>
            ) : (
              (t.blog.categories[post.category] ?? post.categoryLabel)
            )}
          </p>
          <h1 className="cr-sentence mt-4 text-3xl font-black leading-[1.08] tracking-[-0.01em] md:text-5xl" style={{ fontStretch: "100%" }}>{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">{post.description}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            noqta journal · {published}
          </p>
        </header>

        {/* Kapak */}
        <figure className="mx-auto mt-8 max-w-5xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-card">
            <BlogCoverArt post={post} priority sizes="(min-width: 1024px) 64rem, 100vw" />
          </div>
          <figcaption className="mt-2 flex justify-end">
            <BlogCoverCredit post={post} />
          </figcaption>
        </figure>

        {/* Gövde */}
        <div
          className="
            mx-auto mt-10 max-w-[45rem] text-[1.125rem] leading-[1.7] text-[#D9DBD3]
            md:text-[1.125rem] md:leading-[1.7]
            [&>p]:mt-5
            [&>p:first-child]:mt-0
            [&>p:first-child]:text-xl [&>p:first-child]:leading-[1.6] [&>p:first-child]:text-foreground
            [&>h2]:mt-12 [&>h2]:font-[family-name:var(--font-cr-archivo)] [&>h2]:text-2xl [&>h2]:font-black [&>h2]:tracking-[-0.01em] [&>h2]:text-foreground md:[&>h2]:text-3xl
            [&>h3]:mt-8 [&>h3]:font-[family-name:var(--font-cr-archivo)] [&>h3]:text-lg [&>h3]:font-bold [&>h3]:tracking-[-0.01em] [&>h3]:text-foreground md:[&>h3]:text-xl
            [&>ul]:mt-5 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5
            [&>ol]:mt-5 [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-5
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-noqt-lime [&_a]:decoration-2 hover:[&_a]:text-noqt-lime
          "
        >
          {children}
        </div>

        {/* Dizi kutusu */}
        {series ? (
          <section className="mx-auto mt-16 max-w-[42rem] border-t-2 border-noqt-lime pt-6">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h2 className="text-lg font-black tracking-[-0.02em]">{series.name}</h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {series.cadence} · {t.blog.seriesOngoing}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{series.tagline}</p>
            {siblings.length > 0 ? (
              <ul className="mt-4 divide-y divide-border border-t border-border">
                {siblings.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="block py-3 text-sm transition hover:opacity-70">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        {/* Bülten */}
        <div className="mx-auto mt-16 max-w-[42rem]">
          <NewsletterSignup source={`article:${post.slug}`} />
        </div>

        {/* Alt bant */}
        <aside className="mx-auto mt-16 max-w-[42rem] border-t border-border pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {t.blog.continueAt}
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {[
              { href: "https://academy.noqt.club/#fiyatlar", label: t.blog.link1 },
              { href: "/events", label: t.blog.link2 },
              { href: "/booking", label: t.blog.link3 },
              { href: "/blog", label: t.blog.link4 },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="border-b border-noqt-lime/50 pb-0.5 transition hover:border-noqt-lime"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
