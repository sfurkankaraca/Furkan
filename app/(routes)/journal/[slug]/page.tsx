import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { journalPosts, getPost } from "@/lib/journal";

type Props = { params: Promise<{ slug: string }> };

const BASE = "https://noqta.club";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Yazı Bulunamadı" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `${BASE}/journal/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${BASE}/journal/${slug}`,
      publishedTime: post.publishedAt,
      locale: "tr_TR",
      siteName: "noqta journal",
    },
  };
}

export default async function JournalPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${BASE}/journal/${slug}`,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "noqta", url: BASE },
    publisher: { "@type": "Organization", name: "noqta", url: BASE },
    inLanguage: "tr",
  };

  const others = journalPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <Link href="/journal" className="text-sm text-white/50 hover:text-white transition">
        ← journal
      </Link>

      <div className="mt-8 mb-10">
        <span className="text-xs uppercase tracking-widest text-white/50">{post.category}</span>
        <h1 className="text-3xl md:text-5xl mt-3 font-semibold tracking-tight leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 mt-4 text-sm text-white/40">
          <span>{post.readTime} okuma</span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      <article className="space-y-4">
        {post.content.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("## ")) {
            return (
              <h2 key={i} className="text-2xl font-semibold tracking-tight mt-10 mb-4">
                {paragraph.slice(3)}
              </h2>
            );
          }
          if (paragraph.startsWith("### ")) {
            return (
              <h3 key={i} className="text-lg font-medium mt-6 mb-3 text-white/90">
                {paragraph.slice(4)}
              </h3>
            );
          }
          return (
            <p key={i} className="text-white/70 leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      {others.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="text-sm uppercase tracking-widest text-white/50 mb-6">Benzer yazılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {others.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className="group block rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition p-5">
                <span className="text-xs uppercase tracking-widest text-white/50">{p.category}</span>
                <h3 className="mt-2 text-sm font-medium text-white/90 group-hover:text-white transition leading-snug">{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
