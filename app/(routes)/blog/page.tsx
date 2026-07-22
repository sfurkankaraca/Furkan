import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, type BlogCategory, type BlogPostMeta } from "@/lib/blog/registry";
import { BlogCoverArt } from "@/components/blog/BlogCoverArt";
import { SITE_URL } from "@/lib/site-url";

const BLOG_INDEX_DESCRIPTION =
  "Elektronik müzik dergisi: haberler ve duyurular, türün efsaneleri, sahne ve kültür yazıları, DJ'lik ve prodüksiyon rehberleri.";

export const metadata: Metadata = {
  title: "Journal — Elektronik müzik dergisi | noqta",
  description: BLOG_INDEX_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "noqta journal — elektronik müzik dergisi",
    description: "Elektronik müzik dünyasından haberler, efsane portreleri, sahne yazıları ve rehberler.",
    url: "/blog",
  },
};

const ORDER: BlogCategory[] = ["haber", "efsaneler", "sahne", "dj", "produksiyon", "booking", "egitim", "b2b"];

const LABEL: Record<BlogCategory, string> = {
  haber: "Haberler & duyurular",
  efsaneler: "Efsaneler",
  sahne: "Sahne & kültür",
  dj: "DJ & performans",
  produksiyon: "Prodüksiyon",
  booking: "Booking & etkinlik",
  egitim: "Eğitim",
  b2b: "İş birlikleri",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

function byDateDesc(a: BlogPostMeta, b: BlogPostMeta) {
  return a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0;
}

export default function BlogIndexPage() {
  const all = [...BLOG_POSTS].sort(byDateDesc);
  const [lead, ...others] = all;
  const secondary = others.slice(0, 4);
  const grouped = ORDER.map((cat) => ({
    cat,
    label: LABEL[cat],
    posts: all.filter((p) => p.category === cat),
  })).filter((g) => g.posts.length > 0);

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "noqta journal",
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
    <main className="container mx-auto max-w-7xl px-4 pb-20">
      {/* Masthead */}
      <header className="border-b border-foreground/15 pt-10 pb-6 md:pt-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Online elektronik müzik dergisi
        </p>
        <h1 className="mt-3 text-5xl font-black leading-[0.9] tracking-[-0.04em] md:text-8xl">Journal</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Haberler ve duyurular, türün efsaneleri, sahne ve kültür yazıları, DJ&apos;lik ve prodüksiyon rehberleri.
        </p>
      </header>

      {/* Kategori şeridi */}
      <nav aria-label="Bölümler" className="flex flex-wrap gap-x-5 gap-y-2 border-b border-foreground/10 py-3">
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
        <section className="grid gap-8 border-b border-foreground/10 py-10 md:grid-cols-12 md:py-14">
          <Link href={`/blog/${lead.slug}`} className="group md:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted">
              <BlogCoverArt post={lead} priority sizes="(min-width: 768px) 58vw, 100vw" />
            </div>
          </Link>
          <div className="flex flex-col justify-center md:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {lead.categoryLabel} · {fmtDate(lead.publishedAt)}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-[-0.03em] md:text-5xl">
              <Link href={`/blog/${lead.slug}`} className="transition hover:opacity-70">
                {lead.title}
              </Link>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{lead.description}</p>
            <Link
              href={`/blog/${lead.slug}`}
              className="mt-6 w-fit border-b-2 border-foreground pb-0.5 text-sm font-semibold transition hover:opacity-60"
            >
              Yazıyı oku
            </Link>
          </div>
        </section>
      ) : null}

      {/* İkincil ızgara */}
      {secondary.length > 0 ? (
        <section className="grid gap-x-6 gap-y-10 border-b border-foreground/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {secondary.map((p) => (
            <article key={p.slug} className="group">
              <Link href={`/blog/${p.slug}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <BlogCoverArt post={p} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 100vw" />
                </div>
              </Link>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {p.categoryLabel}
              </p>
              <h3 className="mt-1.5 text-lg font-bold leading-snug tracking-[-0.02em]">
                <Link href={`/blog/${p.slug}`} className="transition hover:opacity-70">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </article>
          ))}
        </section>
      ) : null}

      {/* Bölümler */}
      <div className="grid gap-14 py-12">
        {grouped.map(({ cat, label, posts }) => (
          <section key={cat} id={`bolum-${cat}`} aria-labelledby={`baslik-${cat}`} className="scroll-mt-24">
            <div className="flex items-baseline justify-between border-b-2 border-foreground pb-2">
              <h2 id={`baslik-${cat}`} className="text-xl font-black uppercase tracking-[-0.01em] md:text-2xl">
                {label}
              </h2>
              <span className="text-xs tabular-nums text-muted-foreground">{posts.length} yazı</span>
            </div>

            <ul className="divide-y divide-foreground/10">
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
                      <h3 className="text-lg font-bold leading-snug tracking-[-0.02em] transition group-hover:opacity-70 md:text-xl">
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
