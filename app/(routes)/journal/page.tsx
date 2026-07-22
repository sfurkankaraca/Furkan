import type { Metadata } from "next";
import Link from "next/link";
import { journalPosts } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal — Elektronik Müzik Rehberleri",
  description:
    "DJ'lik, prodüksiyon ve elektronik müzik kültürü üzerine rehberler, karşılaştırmalar ve sahne yazıları. noqta'nın yeni nesil dergisi.",
  alternates: { canonical: "https://noqta.club/journal" },
  openGraph: {
    title: "noqta journal",
    description: "Elektronik müzik dünyasından rehberler ve sahne yazıları.",
    url: "https://noqta.club/journal",
    type: "website",
  },
};

const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default function JournalPage() {
  const sorted = [...journalPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  const featured = sorted.find((p) => p.featured) ?? sorted[0];
  const rest = sorted.filter((p) => p.slug !== featured.slug);
  const categories = Array.from(new Set(sorted.map((p) => p.category)));

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">journal.</h1>
        <p className="mt-4 text-lg text-white/70 max-w-prose">
          Elektronik müzik dünyasından rehberler, karşılaştırmalar ve sahne yazıları.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c} className="text-xs uppercase tracking-widest text-white/50 border border-white/10 rounded-full px-3 py-1">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Featured */}
      <Link href={`/journal/${featured.slug}`} className="group block mb-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition p-8 md:p-12">
          <span className="text-xs uppercase tracking-widest text-white/50">{featured.category}</span>
          <h2 className="text-2xl md:text-4xl mt-3 font-semibold tracking-tight group-hover:text-white text-white/90 transition">
            {featured.title}
          </h2>
          <p className="text-white/60 mt-4 max-w-3xl leading-relaxed">{featured.excerpt}</p>
          <div className="flex items-center gap-3 mt-6 text-xs text-white/40">
            <span>{featured.readTime} okuma</span>
            <span>{dateFmt(featured.publishedAt)}</span>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {rest.map((post) => (
          <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition p-6">
              <span className="text-xs uppercase tracking-widest text-white/50">{post.category}</span>
              <h3 className="mt-2 font-medium text-white/90 group-hover:text-white transition leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-white/50 mt-3 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-white/40">
                <span>{post.readTime}</span>
                <span>{dateFmt(post.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
