/**
 * Yeni şehir: slug’ı buraya ekleyin → `content/{şehir}.ts` içinde tam `CityDjContent` yazın →
 * `registry.ts` içinde `CITY_DJ_REGISTRY`’e ekleyin → `app/(routes)/{slug}/page.tsx` oluşturun.
 * Sitemap `CITY_DJ_ROUTE_SLUGS` üzerinden otomatik dolar.
 */
export const CITY_DJ_ROUTE_SLUGS = ["kayseri-dj", "nevsehir-dj", "ankara-dj"] as const;
export type CityDjRouteSlug = (typeof CITY_DJ_ROUTE_SLUGS)[number];

export type CityDjChapter = { id: string; title: string; paragraphs: readonly string[] };
export type CityDjServiceCard = { title: string; text: string };
export type CityDjWhyItem = { title: string; text: string };
export type CityDjFaqItem = { q: string; a: string };
export type CityDjProcessStep = { title: string; text: string };
/**
 * `image` yoksa kesik çerçeveli placeholder.
 * Dosya: `web/public/...` altına koyun; `src` public kökünden, örn. `/media/city-dj/kayseri/dugun-1.jpg`.
 */
export type CityDjMediaPlaceholder = {
  label: string;
  hint: string;
  image?: { src: string; alt: string };
};

export type CityDjContent = {
  routeSlug: CityDjRouteSlug;
  /** Schema.org addressLocality, görünen şehir adı */
  schemaCity: string;
  /** Bölüm id önekleri (ör. kayseri-services-h) */
  sectionPrefix: string;
  leadAnchorId: string;
  seo: { title: string; description: string };
  hero: {
    eyebrow: string;
    h1: string;
    lead: string;
    bullets: readonly string[];
  };
  services: {
    title: string;
    description: string;
    items: readonly CityDjServiceCard[];
  };
  why: {
    title: string;
    description: string;
    items: readonly CityDjWhyItem[];
  };
  seoBody: { title: string; paragraphs: readonly string[] };
  chapters: readonly CityDjChapter[];
  media: {
    title: string;
    description: string;
    placeholders: readonly CityDjMediaPlaceholder[];
    instagramUrl: string;
  };
  process: { title: string; steps: readonly CityDjProcessStep[] };
  faq: { title: string; items: readonly CityDjFaqItem[] };
  lead: { title: string; description: string };
  contact: { subject: string; message: string };
  whatsappPrefill: string;
  heroPosterAlt: string;
  serviceSchemaName: string;
  professionalServiceName: string;
  serviceType: readonly string[];
  knowsAbout: readonly string[];
  /** BreadcrumbList ve site içi kısa etiket */
  breadcrumbLabel: string;
  /** “Site içinde devam” bloğuna özgün giriş (iç link sinyali) */
  internalLinksIntro: string;
};
