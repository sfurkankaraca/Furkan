import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  title: {
    default: "Noqta – DJ Eğitimi, Elektronik Müzik Topluluğu ve Etkinlikler",
    template: "%s | noqta",
  },
  description:
    "Noqta; DJ ve prodüksiyon eğitimi, elektronik müzik topluluğu ve etkinlik deneyimi sunan Türkiye merkezli bir kolektiftir. Academy, Club, Radio ve Collective ile topluluğa katıl.",
  metadataBase: new URL("https://noqta.club"),
  openGraph: {
    title: "Noqta – DJ Eğitimi ve Elektronik Müzik Topluluğu",
    description:
      "DJ öğren, topluluğa katıl, etkinlikleri keşfet. Academy, Club, Radio ve Collective — Türkiye'nin elektronik müzik platformu.",
    images: [{ url: "/og.png" }],
    type: "website",
  },
  alternates: { canonical: "https://noqta.club" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "noqta",
    url: "https://noqta.club",
  };

  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {plausibleDomain ? (
          <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" />
        ) : null}
        <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <AuthProvider>
          <Navbar />
          {children}
          <Analytics />
          <SpeedInsights />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
