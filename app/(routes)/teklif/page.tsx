import type { Metadata } from "next";
import { Suspense } from "react";
import { ContentCard, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import { OzelEtkinlikTeklifWizard } from "@/components/offers/OzelEtkinlikTeklifWizard";
import { submitOzelEtkinlikTeklif } from "./actions";

export const metadata: Metadata = {
  title: "Özel etkinlik teklif formu | noqta",
  description:
    "Booking ve B2B için adım adım özel etkinlik teklif talebi. İletişim, etkinlik detayı, müzik ve teknik soruları tek akışta.",
  alternates: { canonical: "/teklif" },
};

function TeklifFallback() {
  return (
    <ContentCard className="p-6 md:p-10 animate-pulse">
      <div className="mx-auto max-w-xl space-y-4">
        <div className="h-6 w-48 rounded-lg bg-white/10" />
        <div className="h-2 w-full rounded-full bg-white/10" />
        <div className="h-32 rounded-xl bg-white/[0.06]" />
      </div>
    </ContentCard>
  );
}

export default async function TeklifPage() {
  const overrides = await readSiteImageOverrides();
  const poster = resolveSiteImageUrl("contact_hero_poster", overrides) ?? "/og.png";

  return (
    <main className="dark bg-background text-foreground">
      <PageHeroVideo sources={resolveRandomHeroSources("/teklif")} poster={poster} posterAlt="Noqta teklif formu">
        <PageShell withGlow={false}>
          <ContentCard className="p-6 md:p-10">
            <Suspense fallback={<TeklifFallback />}>
              <OzelEtkinlikTeklifWizard action={submitOzelEtkinlikTeklif} />
            </Suspense>
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
