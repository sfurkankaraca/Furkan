import Link from "next/link";
import { blogPostBySlug } from "@/lib/blog/registry";

const TOPIC_SLUGS = {
  booking: [
    "dugun-ve-kurumsal-etkinlik-icin-dj-secimi",
    "etkinlik-muzigi-brif-rehberi",
    "turkiye-genelinde-dj-booking-sureci",
  ],
  b2b: ["marka-etkinliginde-muzik-deneyim-tasarimi", "etkinlik-muzigi-brif-rehberi"],
  academy: ["dj-egitimi-pratik-ve-akademi", "dj-olarak-sahneye-cikmak-ilk-adimlar"],
} as const;

export type RelatedBlogTopic = keyof typeof TOPIC_SLUGS;

/** Ana menüde blog yok; Google için yüksek değerli sayfalardan iç bağlantı. */
export function RelatedBlogPosts({
  topic,
  className = "",
}: {
  topic: RelatedBlogTopic;
  className?: string;
}) {
  const slugs = TOPIC_SLUGS[topic];
  const items = slugs
    .map((slug) => {
      const p = blogPostBySlug(slug);
      return p ? { slug, title: p.title } : null;
    })
    .filter(Boolean) as { slug: string; title: string }[];

  if (items.length === 0) return null;

  return (
    <aside
      className={`rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 md:px-6 md:py-6 ${className}`}
      aria-label="İlgili blog yazıları"
    >
      <h2 className="text-sm font-semibold text-white mb-1">Rehber yazılar</h2>
      <p className="text-xs text-white/50 mb-4 leading-relaxed">
        Süreç, brif ve sahne pratiği hakkında uzun form içerikler — sayfa altından veya site aramasıyla erişebilirsin.
      </p>
      <ul className="grid gap-2.5">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/blog/${item.slug}`}
              className="text-sm text-cyan-200/90 hover:text-cyan-100 underline-offset-4 hover:underline leading-snug"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/40">
        <Link href="/blog" className="text-white/50 hover:text-white/70 underline-offset-2 hover:underline">
          Tüm yazılar
        </Link>
      </p>
    </aside>
  );
}
