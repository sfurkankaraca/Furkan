import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAdsGtag } from "@/components/GoogleAdsGtag";
import { ClubRadioHeader } from "@/components/club-radio/ClubRadioHeader";
import { ClubRadioFooter } from "@/components/club-radio/ClubRadioFooter";
import ThemeScope from "@/components/club-radio/ThemeScope";
import { CR_FONT_VARS } from "@/components/club-radio/fonts";
import "@/components/club-radio/club-radio.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/lib/auth-context";
import { SITE_URL } from "@/lib/site-url";
import { LangProvider } from "@/lib/club-radio/i18n/client";
import { getDict } from "@/lib/club-radio/i18n/server";

const inter = Inter({ subsets: ["latin"] });
// Labs vurgusu (menü) için ayrı karakter
const spaceMono = Space_Mono({ subsets: ["latin"], weight: "700", variable: "--font-space-mono" });
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    title: {
      default: t.meta.rootTitle,
      template: "%s",
    },
    description: t.meta.rootDescription,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: t.meta.rootTitle,
      description: t.meta.rootOgDescription,
      images: [{ url: "/og.png" }],
      type: "website",
      locale: t.meta.ogLocale,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await getDict();
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
      "https://www.instagram.com/noqtclub",
      "https://www.youtube.com/@noqtclubradio",
      "https://open.spotify.com/user/31jte7ldctopxvipofwgucvts5sm",
    ],
  };

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.className} ${spaceMono.variable} ${CR_FONT_VARS} bg-background text-foreground antialiased`}>
        <GoogleAdsGtag />
        {plausibleDomain ? (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
        ) : null}
        <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <LangProvider lang={lang}>
        <AuthProvider>
          <Suspense fallback={null}>
            <ClubRadioHeader />
          </Suspense>
          <ThemeScope>{children}</ThemeScope>
          <Analytics />
          <SpeedInsights />
          <ClubRadioFooter />
        </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
