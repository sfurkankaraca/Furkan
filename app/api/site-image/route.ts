import { NextRequest, NextResponse } from "next/server";
import { SITE_IMAGE_SLOTS } from "@/lib/site-images/registry";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";

export const dynamic = "force-dynamic";

/** Tek bir site görseli slotu için çözülmüş URL (client sayfalar için). */
export async function GET(req: NextRequest) {
  const slot = req.nextUrl.searchParams.get("slot")?.trim();
  if (!slot) {
    return NextResponse.json({ error: "slot gerekli" }, { status: 400 });
  }
  if (!SITE_IMAGE_SLOTS.some((s) => s.id === slot)) {
    return NextResponse.json({ error: "bilinmeyen slot" }, { status: 404 });
  }
  const overrides = await readSiteImageOverrides();
  const url = resolveSiteImageUrl(slot, overrides);
  return NextResponse.json({ url: url ?? null });
}
