import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolvePageHeroSources } from "@/lib/page-hero-videos";
import { BookingHero } from "@/components/booking/BookingHero";
import { BookingSections } from "@/components/booking/BookingSections";
import { BOOKING_FAQ_ITEMS } from "@/lib/booking-faq";
import { BOOKING_MEDIA_SLOT_IDS, BOOKING_PORTFOLIO_VIDEO_SLOT_IDS } from "@/lib/site-images/registry";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import { FurkanBioCard } from "@/components/people/FurkanBioCard";
import { PortfolioVideoCard } from "@/components/social/PortfolioVideoCard";
import { YouTubeEmbed } from "@/components/social/YouTubeEmbed";
import { readSiteConfigBlob, resolveBookingYoutubeUrls } from "@/lib/site-config-read";
import { parseYoutubeUrl } from "@/lib/youtube/embed";
import { RelatedBlogPosts } from "@/components/seo/RelatedBlogPosts";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "DJ Booking — Etkinlik Müziği ve Profesyonel DJ | noqta",
  description:
    "Türkiye genelinde DJ booking: düğün, kurumsal gece ve özel davetlerde etkinlik müziği ve müzik kurgusu. Teklif al veya WhatsApp’tan yaz.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "DJ Booking & Etkinlik Müziği | noqta",
    description:
      "Düğün, kurumsal gece ve özel etkinliklerde DJ performansı ve müzik kurgusu. Türkiye genelinde planlama ve uygulama.",
    url: "/booking",
  },
  keywords: [
    "DJ booking",
    "düğün DJ",
    "kurumsal etkinlik DJ",
    "özel etkinlik DJ",
    "event music",
    "etkinlik müziği",
    "DJ hizmeti",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "noqta",
      url: SITE_URL,
      logo: `${SITE_URL}/noqt_siyah_asf.png`,
      areaServed: { "@type": "Country", name: "Türkiye" },
      description:
        "DJ booking ve etkinlik müziği: düğün, kurumsal etkinlik ve özel davetlerde profesyonel DJ performansı. Türkiye genelinde planlama.",
    },
    {
      "@type": "Service",
      serviceType: "DJ Booking / Event Music",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Türkiye" },
      description: "Etkinliğe özel müzik kurgusu ve sahne uygulaması; teklif ve brif süreciyle net iletişim.",
    },
    {
      "@type": "FAQPage",
      mainEntity: BOOKING_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
};

export default async function BookingPage() {
  const heroSources = resolvePageHeroSources("booking");
  const overrides = await readSiteImageOverrides();
  const siteCfg = await readSiteConfigBlob();
  const bookingYoutubeUrls = resolveBookingYoutubeUrls(siteCfg).filter((url) => parseYoutubeUrl(url));
  const bookingPoster = resolveSiteImageUrl("booking_hero_poster", overrides) ?? "/og.png";
  const mediaImageUrls = BOOKING_MEDIA_SLOT_IDS.map((id) => resolveSiteImageUrl(id, overrides));
  const portfolioVideos = BOOKING_PORTFOLIO_VIDEO_SLOT_IDS.map((id) => resolveSiteImageUrl(id, overrides)).filter(
    (x): x is string => Boolean(x),
  );

  return (
    <main>
      <PageHeroVideo
        sources={heroSources}
        poster={bookingPoster}
        posterAlt="Noqta DJ booking — etkinlik müziği kahraman görseli"
      >
        <BookingHero />
        <PageShell withGlow={false}>
          <p className="sr-only">
            DJ hizmeti, düğün DJ, kurumsal etkinlik DJ, özel etkinlik DJ, event music services ve booking talepleri için
            teklif ve iletişim sayfası. Türkiye genelinde müzik kurgusu ve sahne uygulaması.
          </p>
          <div className="mx-auto mb-10 max-w-3xl px-4 md:mb-12">
            <FurkanBioCard variant="booking" />
          </div>
          {portfolioVideos.length > 0 ? (
            <section className="mx-auto mb-10 max-w-5xl px-4 md:mb-14" aria-labelledby="booking-portfolio-videos">
              <h2 id="booking-portfolio-videos" className="text-lg md:text-xl font-medium text-white mb-3">
                Portfolyo videoları
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {portfolioVideos.map((src, i) => (
                  <PortfolioVideoCard key={`${src}-${i}`} src={src} title={`Booking portfolyo video ${i + 1}`} />
                ))}
              </div>
            </section>
          ) : null}
          <BookingSections mediaImageUrls={mediaImageUrls} />
          {bookingYoutubeUrls.length > 0 ? (
            <section
              className="mx-auto mb-10 max-w-5xl px-4 md:mb-14"
              aria-labelledby="booking-youtube-sets"
            >
              <h2 id="booking-youtube-sets" className="mb-3 text-lg font-medium text-white md:text-xl">
                Set kayıtları
              </h2>
              <p className="mb-5 max-w-2xl text-sm text-white/65">
                YouTube kanalındaki canlı ve stüdyo setlerden seçkiler.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {bookingYoutubeUrls.map((url, i) => (
                  <YouTubeEmbed key={`${url}-${i}`} url={url} title={`Set kaydı ${i + 1}`} />
                ))}
              </div>
            </section>
          ) : null}
          <div className="mx-auto max-w-3xl px-4 mb-10 md:mb-12">
            <RelatedBlogPosts topic="booking" />
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
