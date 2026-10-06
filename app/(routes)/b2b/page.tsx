import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { PageShell, PageBlockTitle } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolvePageHeroSources } from "@/lib/page-hero-videos";
import { B2BOfferFlow } from "@/components/offers/B2BOfferFlow";
import { B2BPageSections } from "@/components/b2b/B2BPageSections";
import { B2B_FAQ, B2B_HERO, B2B_LEAD, B2B_SEO } from "@/lib/b2b-content";
import { Button } from "@/components/ui/button";
import { teklifHref } from "@/lib/teklif-href";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import { B2B_PHOTO_SLOT_IDS, B2B_PORTFOLIO_VIDEO_SLOT_IDS } from "@/lib/site-images/registry";
import { RelatedBlogPosts } from "@/components/seo/RelatedBlogPosts";
import { SITE_URL } from "@/lib/site-url";

const WHATSAPP_HREF = "https://wa.me/905417997973";
export const metadata: Metadata = {
  title: B2B_SEO.title,
  description: B2B_SEO.description,
  alternates: { canonical: "/b2b" },
  openGraph: {
    title: B2B_SEO.title,
    description: B2B_SEO.description,
    url: "/b2b",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: B2B_FAQ.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "noqta",
  url: SITE_URL,
  description: B2B_SEO.description,
  areaServed: { "@type": "Country", name: "Türkiye" },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Marka iş birlikleri, etkinlik kurgusu ve içerik destekli deneyim",
  provider: { "@type": "Organization", name: "noqta", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Türkiye" },
  serviceType: [
    "Marka etkinliği DJ",
    "Kurumsal etkinlik müziği",
    "B2B DJ ve event music",
    "Lansman ve marka aktivasyonu",
    "Mekân müziği ve venue experience",
    "Etkinlik içerik üretimi",
  ],
  description: B2B_SEO.description,
};

export default async function B2BPage() {
  const heroSources = resolvePageHeroSources("b2b");
  const overrides = await readSiteImageOverrides();
  const poster = resolveSiteImageUrl("b2b_hero_poster", overrides) ?? "/og.png";
  const b2bPhotoUrls = B2B_PHOTO_SLOT_IDS.map((id) => resolveSiteImageUrl(id, overrides)).filter(
    (x): x is string => Boolean(x),
  );
  const b2bVideoUrls = B2B_PORTFOLIO_VIDEO_SLOT_IDS.map((id) => resolveSiteImageUrl(id, overrides)).filter(
    (x): x is string => Boolean(x),
  );

  return (
    <main className="dark bg-background text-foreground">
      <PageHeroVideo
        sources={heroSources}
        poster={poster}
        posterAlt="Noqta B2B — marka iş birlikleri ve etkinlik kurgusu arka plan görseli"
      >
        <div className="container mx-auto max-w-4xl px-4 py-14 md:py-24">
          <div className="mx-auto text-center">
            <p className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
              <Sparkles className="size-3.5 text-noqt-lime" aria-hidden />
              {B2B_HERO.eyebrow}
            </p>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white md:text-5xl md:leading-[1.12]">
              {B2B_HERO.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-white/70 md:text-base">
              {B2B_HERO.lead}
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-xl border-0 bg-white text-black shadow-lg shadow-white/10 transition hover:bg-white/90 hover:shadow-xl hover:shadow-white/15"
              >
                <Link href="#b2b-lead">
                  İş birliği başlat
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/25 bg-white/5 hover:bg-white/10">
                <Link href={teklifHref({ kaynak: "b2b" })}>Teklif al</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-xl text-white/85 hover:bg-white/10 hover:text-white">
                <Link href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                  <MessageCircle className="size-4" aria-hidden />
                  WhatsApp’tan ulaş
                </Link>
              </Button>
            </div>

            <ul className="mx-auto mt-10 grid max-w-xl gap-3 text-left text-sm text-white/65 md:mx-auto md:max-w-2xl md:grid-cols-1 md:text-center">
              {B2B_HERO.bullets.map((line) => (
                <li key={line} className="flex gap-3 md:justify-center">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-noqt-lime to-noqt-sky" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-xs text-white/45">
              Başkent’te kurumsal davet ve lansman DJ ihtiyacı için{" "}
              <Link
                href="/ankara-dj"
                className="text-white/60 underline-offset-4 transition hover:text-white/85 hover:underline"
              >
                Ankara DJ hizmeti
              </Link>{" "}
              sayfasına bakın. Kayseri merkezli kurumsal ve düğün DJ planları için{" "}
              <Link href="/kayseri-dj" className="text-white/60 underline-offset-4 transition hover:text-white/85 hover:underline">
                Kayseri DJ hizmeti
              </Link>{" "}
              sayfasını inceleyebilirsiniz.
            </p>
          </div>
        </div>

        <PageShell withGlow={false}>
          <B2BPageSections b2bPhotoUrls={b2bPhotoUrls} b2bVideoUrls={b2bVideoUrls} />
          <div className="mx-auto max-w-3xl px-4 pb-10 md:pb-12">
            <RelatedBlogPosts topic="b2b" />
          </div>
          <div id="b2b-lead" className="scroll-mt-28 mx-auto max-w-3xl space-y-5 pb-10">
            <PageBlockTitle title={B2B_LEAD.title} description={B2B_LEAD.description} sectionId="b2b-lead-h" />
            <B2BOfferFlow />
          </div>

          <p className="sr-only">
            Noqta B2B: marka iş birlikleri, kurumsal ve lansman etkinlikleri için DJ ve event music, mekân müziği,
            Instagram TikTok YouTube içerik üretimi, marka aktivasyonu ve paylaşılabilir deneyim kurgusu. Türkiye geneli
            projeler.
          </p>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
