import { JOIN_TIER_SLOT_IDS } from "@/lib/site-images/registry";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import { readClubPackages } from "@/lib/club-subscription/packages";
import { JoinPageClient } from "./JoinPageClient";

export default async function JoinPage() {
  const overrides = await readSiteImageOverrides();
  const tierImageUrls = JOIN_TIER_SLOT_IDS.map((id) => resolveSiteImageUrl(id, overrides));
  const packages = await readClubPackages();
  return <JoinPageClient tierImageUrls={tierImageUrls} packages={packages} />;
}
