import type { ReactNode } from "react";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog/registry";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { SITE_URL } from "@/lib/site-url";

export function BlogArticleLayout({
  post,
  heroSources,
  posterUrl,
  children,
}: {
  post: BlogPostMeta;
  heroSources: readonly string[];
  posterUrl: string;
  children: ReactNode;
}) {
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
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <main>
      <PageHeroVideo
        sources={heroSources}
        poster={posterUrl}
        posterAlt={`${post.title} — noqta blog arka plan görseli`}
      >
        <div className="h-6 md:h-8" aria-hidden="true" />
        <PageShell withGlow={false}>
        <nav className="text-xs text-white/45 mb-6" aria-label="İçerik konumu">
          <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <li>
              <Link href="/" className="hover:text-white/70 transition">
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/blog" className="hover:text-white/70 transition">
                Blog
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-white/60 line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        <article className="max-w-3xl">
          <header className="mb-10 grid gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300/90">{post.categoryLabel}</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl md:leading-tight">{post.title}</h1>
            <p className="text-sm text-white/55">{published}</p>
            <p className="text-base leading-relaxed text-white/70">{post.description}</p>
          </header>

          <div className="space-y-5 text-[15px] leading-relaxed text-white/80 md:text-base md:leading-relaxed">
            {children}
          </div>

          <aside className="mt-12 rounded-2xl border border-white/12 bg-white/[0.04] p-5 md:p-6">
            <h2 className="text-sm font-semibold text-white mb-3">Devam etmek için</h2>
            <ul className="grid gap-2 text-sm text-cyan-200/90">
              <li>
                <Link href="/booking" className="hover:underline underline-offset-4">
                  DJ booking ve etkinlik müziği teklifi
                </Link>
              </li>
              <li>
                <Link href="/academy" className="hover:underline underline-offset-4">
                  Noqta Academy — eğitim ve atölyeler
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:underline underline-offset-4">
                  Marka ve B2B iş birlikleri
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:underline underline-offset-4">
                  Yaklaşan etkinlikler
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline underline-offset-4">
                  İletişim ve özel sorular
                </Link>
              </li>
            </ul>
          </aside>
        </article>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
