import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, type BlogCategory } from "@/lib/blog/registry";
import { PageShell, PageHeader } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import { resolveBlogIndexPoster } from "@/lib/blog/hero";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import { SITE_URL } from "@/lib/site-url";

const BLOG_INDEX_DESCRIPTION =
  "Düğün ve kurumsal etkinlik DJ seçimi, etkinlik müziği brifi, DJ eğitimi, marka geceleri ve Türkiye geneli booking hakkında rehber yazılar.";

export const metadata: Metadata = {
  title: "Blog — DJ, etkinlik müziği, Academy ve B2B | noqta",
  description: BLOG_INDEX_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "noqta blog",
    description: "DJ performansı, etkinlik müziği, eğitim ve iş birlikleri için SEO odaklı rehber içerikler.",
    url: "/blog",
  },
};

const ORDER: BlogCategory[] = ["dj", "produksiyon", "sahne", "booking", "egitim", "b2b"];

const LABEL: Record<BlogCategory, string> = {
  booking: "Booking & etkinlik",
  egitim: "Eğitim",
  dj: "DJ & performans",
  produksiyon: "Prodüksiyon",
  sahne: "Sahne & kültür",
  b2b: "İş birlikleri",
};

export default async function BlogIndexPage() {
  const overrides = await readSiteImageOverrides();
  const posterUrl = resolveBlogIndexPoster(overrides);
  const heroSources = resolveRandomHeroSources("blog-index");

  const grouped = ORDER.map((cat) => ({
    cat,
    label: LABEL[cat],
    posts: BLOG_POSTS.filter((p) => p.category === cat),
  })).filter((g) => g.posts.length > 0);

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "noqta blog",
    description: BLOG_INDEX_DESCRIPTION,
    url: `${SITE_URL}/blog`,
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.publishedAt,
    })),
  };

  return (
    <main>
      <PageHeroVideo
        sources={heroSources}
        poster={posterUrl}
        posterAlt="Noqta blog — DJ, etkinlik müziği ve Academy rehberleri arka plan görseli"
      >
        <div className="h-6 md:h-8" aria-hidden="true" />
        <PageShell withGlow={false}>
        <PageHeader
          eyebrow={<span className="text-xs font-medium uppercase tracking-wider text-white/50">Rehber & SEO</span>}
          title="Blog"
          description="Düğün ve kurumsal DJ, etkinlik müziği brifi, Academy, sahne pratiği ve marka iş birlikleri için stratejik yazılar. İç bağlantılarla booking, B2B ve eğitim sayfalarımıza bağlanır."
        />

        <div className="mt-12 grid gap-12">
          {grouped.map(({ cat, label, posts }) => (
            <section key={cat} aria-labelledby={`blog-cat-${cat}`}>
              <h2 id={`blog-cat-${cat}`} className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">
                {label}
              </h2>
              <ul className="grid gap-4 md:gap-5">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
                    >
                      <p className="text-[11px] font-medium uppercase tracking-wider text-fuchsia-300/85 mb-1">
                        {p.categoryLabel}
                      </p>
                      <h3 className="text-base font-semibold text-white group-hover:text-cyan-100/95 transition md:text-lg">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-2">{p.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListJsonLd) }} />
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
