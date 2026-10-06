import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PageShell, PageBlockTitle } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolvePageHeroSources } from "@/lib/page-hero-videos";
import { getCityDjContent } from "@/lib/city-dj-pages/registry";
import type { CityDjRouteSlug } from "@/lib/city-dj-pages/types";
import { Button } from "@/components/ui/button";
import { teklifHref } from "@/lib/teklif-href";
import { CityDjPageSections } from "./CityDjPageSections";

const WHATSAPP_BASE = "https://wa.me/905417997973?text=";
const SITE = "https://noqt.club";
const ORG_ID = `${SITE}/#organization`;

export function CityDjLanding({ routeSlug }: { routeSlug: CityDjRouteSlug }) {
  const c = getCityDjContent(routeSlug);
  const heroSources = resolvePageHeroSources("events");
  const whatsappHref = WHATSAPP_BASE + encodeURIComponent(c.whatsappPrefill);
  const canonicalPath = `/${routeSlug}`;
  const canonicalUrl = `${SITE}${canonicalPath}`;
  const webpageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const webPageAndBreadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: canonicalUrl,
        name: c.seo.title,
        headline: c.hero.h1,
        description: c.seo.description,
        inLanguage: "tr-TR",
        isPartOf: { "@type": "WebSite", name: "Noqta", url: SITE },
        about: { "@type": "Thing", name: c.serviceSchemaName },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/og.png`,
        },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ana sayfa",
            item: `${SITE}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: c.breadcrumbLabel,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: c.serviceSchemaName,
    description: c.seo.description,
    provider: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "noqta",
      url: SITE,
      logo: `${SITE}/noqt_siyah_asf.png`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        url: `${SITE}/contact`,
        availableLanguage: ["Turkish"],
      },
    },
    areaServed: [
      { "@type": "City", name: c.schemaCity, containedInPlace: { "@type": "Country", name: "Türkiye" } },
      { "@type": "Country", name: "Türkiye" },
    ],
    serviceType: [...c.serviceType],
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
    },
  };

  const professionalJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: c.professionalServiceName,
    image: `${SITE}/og.png`,
    url: canonicalUrl,
    description: c.seo.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.schemaCity,
      addressCountry: "TR",
    },
    areaServed: [
      { "@type": "City", name: c.schemaCity, containedInPlace: { "@type": "Country", name: "Türkiye" } },
      { "@type": "Country", name: "Türkiye" },
    ],
    parentOrganization: { "@type": "Organization", "@id": ORG_ID, name: "noqta", url: SITE },
    knowsAbout: [...c.knowsAbout],
  };

  return (
    <main>
      <PageHeroVideo sources={heroSources} posterAlt={c.heroPosterAlt}>
        <div className="container mx-auto max-w-4xl px-4 py-14 md:py-24">
          <nav className="sr-only" aria-label="İçerik yolu">
            <ol>
              <li>
                <Link href="/">Ana sayfa</Link>
              </li>
              <li aria-current="page">{c.breadcrumbLabel}</li>
            </ol>
          </nav>
          <div className="mx-auto text-center">
            <p className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
              {c.hero.eyebrow}
            </p>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white md:text-[2.35rem] md:leading-[1.15] lg:text-5xl">
              {c.hero.h1}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-white/70 md:text-base">
              {c.hero.lead}
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-xl border-0 bg-white text-black shadow-lg shadow-white/10 transition hover:bg-white/90 hover:shadow-xl"
              >
                <Link href={`#${c.leadAnchorId}`}>Teklif al</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/25 bg-white/5 hover:bg-white/10">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2">
                  <MessageCircle className="size-4" aria-hidden />
                  WhatsApp’tan ulaş
                </a>
              </Button>
            </div>

            <ul className="mx-auto mt-10 max-w-xl space-y-2.5 text-left text-sm text-white/65 md:mx-auto md:max-w-2xl md:text-center">
              {c.hero.bullets.map((line) => (
                <li key={line} className="flex gap-3 md:justify-center">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-noqt-lime to-noqt-sky"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <PageShell withGlow={false}>
          <CityDjPageSections content={c} />
          <div id={c.leadAnchorId} className="scroll-mt-28 mx-auto max-w-3xl space-y-5 pb-12">
            <PageBlockTitle title={c.lead.title} description={c.lead.description} sectionId={`${c.sectionPrefix}-lead-h`} />
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-white text-black transition hover:bg-white/90 hover:shadow-md"
              >
                <Link href={teklifHref({ kaynak: "booking" })}>Teklif talebi oluştur</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl border-white/25 bg-white/5 hover:bg-white/10">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2">
                  <MessageCircle className="size-4" aria-hidden />
                  WhatsApp’tan hızlı ulaş
                </a>
              </Button>
            </div>
            <p className="text-xs text-white/45 leading-relaxed">
              Etkinliğinizi paylaşın: tarih, mekân tipi ve misafir profili yeterli; kısa sürede dönüş yapılır.
            </p>
          </div>

          <p className="sr-only">
            {c.schemaCity} bölgesinde düğün, kurumsal etkinlik ve özel davetler için DJ hizmeti özeti; hizmet alanları,
            süreç, rehber metinleri ve sık sorulanlar sayfada. Teklif bölümü sayfa sonundadır.
          </p>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageAndBreadcrumbJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalJsonLd) }} />
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
