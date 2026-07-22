import { ContentCard } from "@/components/layout/PageShell";
import { SITE_IMAGE_SLOTS } from "@/lib/site-images/registry";
import { sortSiteImageSlotsByPage } from "@/lib/site-images/page-groups";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import {
  readSiteConfigBlob,
  getStoredBookingYoutubeUrls,
  getStoredEventsYoutubeUrls,
} from "@/lib/site-config-read";
import { SiteImagesForm } from "./SiteImagesForm";
import { SiteYoutubeSettingsForm } from "./SiteYoutubeSettingsForm";

export const metadata = { title: "Admin — Site görselleri | noqta" };

export default async function AdminSiteImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; slot?: string }>;
}) {
  const sp = await searchParams;
  const siteCfg = await readSiteConfigBlob();
  const eventsYoutubeLinesInitial = getStoredEventsYoutubeUrls(siteCfg).join("\n");
  const bookingYoutubeLinesInitial = getStoredBookingYoutubeUrls(siteCfg).join("\n");
  const overrides = await readSiteImageOverrides();
  const sorted = sortSiteImageSlotsByPage(SITE_IMAGE_SLOTS);
  const rows = sorted.map((s) => ({
    ...s,
    savedUrl: overrides[s.id] ?? "",
    effectiveUrl: resolveSiteImageUrl(s.id, overrides),
  }));

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="grid gap-6 mb-8">
        <div>
          <h2 className="text-xl font-medium">Site görselleri</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Görseller sayfa gruplarına göre sıralanır (Ana sayfa, Booking, B2B, Academy, Etkinlikler, Radio, Collective, Club,
            Katıl, Biz kimiz, İletişim). Her satırda alanın başlığı ve nerede kullanıldığı yazar; URL yapıştır veya Blob ile yükle.
          </p>
        </div>
        {sp.err === "url" ? (
          <p className="text-sm text-amber-600 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            Geçersiz URL{sp.slot ? ` (${sp.slot})` : ""}. https ile başlayan tam adres veya / ile başlayan site içi yol kullan.
          </p>
        ) : null}
        {sp.err === "invalid" ? (
          <p className="text-sm text-red-400 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2">
            Bilinmeyen alan anahtarı.
          </p>
        ) : null}
      </div>
      <div className="mb-10">
        <SiteYoutubeSettingsForm
          eventsYoutubeLinesInitial={eventsYoutubeLinesInitial}
          bookingYoutubeLinesInitial={bookingYoutubeLinesInitial}
        />
      </div>
      <SiteImagesForm rows={rows} />
    </ContentCard>
  );
}
