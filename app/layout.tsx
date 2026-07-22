import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { GoogleAdsGtag } from "@/components/GoogleAdsGtag";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/lib/auth-context";
import { SITE_URL } from "@/lib/site-url";

const inter = Inter({ subsets: ["latin"] });
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  title: {
    default: "Noqta — Elektronik Müzik ve Etkinlik",
    template: "%s",
  },
  description:
    "Noqta; DJ performansları, etkinlikler, eğitim ve içerikle elektronik müziği topluluk deneyimine dönüştüren Türkiye merkezli bir oluşumdur.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Noqta — Elektronik Müzik ve Etkinlik",
    description:
      "DJ performansı, kolektif kültür, Academy ve Radio ile aynı frekansta buluş. Türkiye genelinde projeler.",
    images: [{ url: "/og.png" }],
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "noqta",
    alternateName: "Noqta Club",
    url: SITE_URL,
    logo: `${SITE_URL}/noqt_siyah_asf.png`,
    description:
      "Elektronik müzik kolektifi: DJ performansı, etkinlik kürasyonu, Academy eğitimleri, Radio playlistleri ve marka iş birlikleri. Türkiye genelinde hizmet; operasyon merkezi Kayseri.",
    areaServed: { "@type": "Country", name: "Türkiye" },
    sameAs: [
      "https://www.instagram.com/noqtaverse",
      "https://youtube.com/@noqtarecords",
      "https://open.spotify.com/user/31jte7ldctopxvipofwgucvts5sm",
    ],
  };

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <GoogleAdsGtag />
        {plausibleDomain ? (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
        ) : null}
        <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <AuthProvider>
          <Suspense fallback={null}>
            <ConditionalNavbar />
          </Suspense>
          {children}
          <Analytics />
          <SpeedInsights />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
