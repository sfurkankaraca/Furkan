import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etkinlikler – Yaklaşan Buluşmalar ve Arşiv",
  description:
    "Noqta etkinlikleri: yaklaşan DJ ve elektronik müzik buluşmaları, geçmiş performanslar ve arşiv. Türkiye genelinde planlanan deneyimleri takip edin.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Etkinlikler | Noqta",
    description: "Yaklaşan buluşmalar ve geçmiş etkinlik arşivi.",
    url: "/events",
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
