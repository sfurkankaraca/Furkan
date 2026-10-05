import type { Metadata } from "next";
import type { CityDjRouteSlug } from "./types";
import { getCityDjContent } from "./registry";

const SITE = "https://noqt.club";
const OG_IMAGE = `${SITE}/og.png`;

export function cityDjMetadata(slug: CityDjRouteSlug): Metadata {
  const c = getCityDjContent(slug);
  const path = `/${slug}`;
  const canonical = `${SITE}${path}`;

  return {
    title: c.seo.title,
    description: c.seo.description,
    alternates: { canonical },
    openGraph: {
      title: c.seo.title,
      description: c.seo.description,
      url: canonical,
      siteName: "Noqta",
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${c.breadcrumbLabel} — Noqta etkinlik ve DJ hizmeti`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: c.seo.title,
      description: c.seo.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
