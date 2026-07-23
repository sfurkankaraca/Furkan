import type { MetadataRoute } from "next";
import { blogSlugs } from "@/lib/blog/registry";
import { artistSlugs } from "@/lib/artists/registry";
import { CITY_DJ_ROUTE_SLUGS_LIST } from "@/lib/city-dj-pages/registry";
import { SITE_URL } from "@/lib/site-url";

function cityDjSitemapEntry(slug: string): {
  path: string;
  changeFrequency: MetadataRoute.ChangeFrequency;
  priority: number;
} {
  if (slug === "kayseri-dj") {
    return { path: `/${slug}`, changeFrequency: "weekly", priority: 0.84 };
  }
  return { path: `/${slug}`, changeFrequency: "monthly", priority: 0.78 };
}

/** Genel pazarlama ve SEO sayfaları — admin / auth hariç */
const PATHS: { path: string; changeFrequency: MetadataRoute.ChangeFrequency; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/booking", changeFrequency: "weekly", priority: 0.9 },
  { path: "/b2b", changeFrequency: "weekly", priority: 0.85 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.82 },
  ...blogSlugs().map((slug) => ({
    path: `/blog/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.76,
  })),
  { path: "/sanatcilar", changeFrequency: "weekly", priority: 0.8 },
  ...artistSlugs().map((slug) => ({
    path: `/sanatcilar/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })),
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/events", changeFrequency: "weekly", priority: 0.85 },
  { path: "/radio", changeFrequency: "weekly", priority: 0.75 },
  { path: "/collective", changeFrequency: "monthly", priority: 0.8 },
  { path: "/academy", changeFrequency: "weekly", priority: 0.85 },
  { path: "/noqta-club", changeFrequency: "weekly", priority: 0.85 },
  { path: "/hakkimizda", changeFrequency: "monthly", priority: 0.7 },
  { path: "/furkan-karaca", changeFrequency: "monthly", priority: 0.72 },
  { path: "/teslimat-ve-iade-sartlari", changeFrequency: "yearly", priority: 0.4 },
  { path: "/mesafeli-satis-sozlesmesi", changeFrequency: "yearly", priority: 0.4 },
  ...CITY_DJ_ROUTE_SLUGS_LIST.map((slug) => cityDjSitemapEntry(slug)),
  { path: "/kayseri-dj-booking", changeFrequency: "monthly", priority: 0.65 },
  { path: "/kayseri-etkinlik-organizasyonu", changeFrequency: "monthly", priority: 0.65 },
  { path: "/gizlilik-politikasi", changeFrequency: "yearly", priority: 0.3 },
  { path: "/kvkk-aydinlatma", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cerez-politikasi", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PATHS.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
