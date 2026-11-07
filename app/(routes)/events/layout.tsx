import type { Metadata } from "next";
import { getDict } from "@/lib/club-radio/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    title: t.meta.eventsTitle,
    description: t.meta.eventsDescription,
    alternates: { canonical: "/events" },
    openGraph: {
      title: t.meta.eventsOgTitle,
      description: t.meta.eventsOgDescription,
      url: "/events",
    },
  };
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
