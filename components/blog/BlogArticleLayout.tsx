import type { ReactNode } from "react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog/registry";
import { BlogCoverArt, BlogCoverCredit } from "@/components/blog/BlogCoverArt";
import { seriesOf, episodeNumber, postsInSeries } from "@/lib/blog/series";
import { SITE_URL } from "@/lib/site-url";

export function BlogArticleLayout({
  post,
  children,
}: {
  post: BlogPostMeta;
  children: ReactNode;
}) {
  const series = seriesOf(post);
  const episode = episodeNumber(post);
  const siblings = series ? postsInSeries(series.id).filter((p) => p.slug !== post.slug).slice(-3).reverse() : [];

  const published = new Date(post.publishedAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
      { "@type": "ListItem", position: 1, name: "Ana sayfa", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pb-20">
      <nav className="pt-8 text-xs text-muted-foreground" aria-label="İçerik konumu">
        <ol className="flex flex-wrap items-center gap-x-1.5">
          <li>
            <Link href="/" className="transition hover:text-foreground">
              Ana sayfa
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
        <header className="mx-auto max-w-3xl border-b border-foreground/15 pb-8 pt-8 md:pt-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {series ? (
              <>
                {series.name}
                {episode ? <span className="opacity-60"> · Bölüm {episode}</span> : null}
              </>
            ) : (
              post.categoryLabel
            )}
          </p>
          <h1 className="mt-4 text-3xl font-black leading-[1.03] tracking-[-0.035em] md:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">{post.description}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            noqta journal · {published}
          </p>
        </header>

        {/* Kapak */}
        <figure className="mx-auto mt-8 max-w-5xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
            <BlogCoverArt post={post} priority sizes="(min-width: 1024px) 64rem, 100vw" />
          </div>
          <figcaption className="mt-2 flex justify-end">
            <BlogCoverCredit post={post} />
          </figcaption>
        </figure>

        {/* Gövde */}
        <div
          className="
            mx-auto mt-10 max-w-[42rem] text-[1.0625rem] leading-[1.75] text-foreground/85
            md:text-[1.125rem] md:leading-[1.8]
            [&>p]:mt-5
            [&>p:first-child]:mt-0
            [&>p:first-child]:text-xl [&>p:first-child]:leading-[1.6] [&>p:first-child]:text-foreground
            [&>h2]:mt-12 [&>h2]:text-2xl [&>h2]:font-black [&>h2]:tracking-[-0.02em] [&>h2]:text-foreground md:[&>h2]:text-3xl
            [&>h3]:mt-8 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:tracking-[-0.01em] [&>h3]:text-foreground md:[&>h3]:text-xl
            [&>ul]:mt-5 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-5
            [&>ol]:mt-5 [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:pl-5
            [&_strong]:font-semibold [&_strong]:text-foreground
            [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-foreground/30 hover:[&_a]:decoration-foreground
          "
        >
          {children}
        </div>

        {/* Dizi kutusu */}
        {series ? (
          <section className="mx-auto mt-16 max-w-[42rem] border-t-2 border-foreground pt-6">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h2 className="text-lg font-black tracking-[-0.02em]">{series.name}</h2>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {series.cadence} · devam eden dizi
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{series.tagline}</p>
            {siblings.length > 0 ? (
              <ul className="mt-4 divide-y divide-foreground/10 border-t border-foreground/10">
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

        {/* Alt bant */}
        <aside className="mx-auto mt-16 max-w-[42rem] border-t border-foreground/15 pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            noqta&apos;da devam et
          </h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {[
              { href: "/academy", label: "Academy — eğitim ve atölyeler" },
              { href: "/events", label: "Yaklaşan etkinlikler" },
              { href: "/booking", label: "DJ booking ve etkinlik müziği" },
              { href: "/blog", label: "Journal'daki tüm yazılar" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="border-b border-foreground/20 pb-0.5 transition hover:border-foreground"
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
