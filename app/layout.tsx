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
    default: "noqta",
    template: "%s | noqta",
  },
  description: "A sound collective for people who feel in loops.",
  metadataBase: new URL("https://noqta.club"),
  openGraph: {
    title: "noqta",
    description: "A sound collective for people who feel in loops.",
    images: [{ url: "/og.png" }],
    type: "website",
  },
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
