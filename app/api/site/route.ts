import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";
import {
  readSiteConfigBlob,
  resolveBookingYoutubeUrls,
  resolveEventsYoutubeUrls,
} from "@/lib/site-config-read";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const KEY = "site-config.json";

export async function GET() {
  const cfg = await readSiteConfigBlob();
  const overrides = await readSiteImageOverrides();
  const heroPosterUrl = resolveSiteImageUrl("home_hero_poster", overrides);
  const eventsYoutubeUrls = resolveEventsYoutubeUrls(cfg);
  const bookingYoutubeUrls = resolveBookingYoutubeUrls(cfg);
  return NextResponse.json({
    ...cfg,
    ...(heroPosterUrl ? { heroPosterUrl } : {}),
    ...(eventsYoutubeUrls.length ? { eventsYoutubeUrls } : {}),
    ...(bookingYoutubeUrls.length ? { bookingYoutubeUrls } : {}),
  });
}

export async function POST(request: Request) {
  try {
    const jar = await cookies();
    if (jar.get("admin")?.value !== "1") {
      return NextResponse.json({ ok: false, error: "Yetkisiz" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    const curr = await readSiteConfigBlob();
    const patch: Record<string, unknown> = { ...curr };
    if ("eventsYoutubeUrls" in body && Array.isArray(body.eventsYoutubeUrls)) {
      patch.eventsYoutubeUrls = body.eventsYoutubeUrls.map((s) => String(s ?? "").trim()).filter(Boolean);
      delete patch.eventsYoutubeUrl;
    } else if ("eventsYoutubeUrl" in body && typeof body.eventsYoutubeUrl === "string") {
      const t = body.eventsYoutubeUrl.trim();
      if (t) {
        patch.eventsYoutubeUrl = t;
        delete patch.eventsYoutubeUrls;
      } else {
        patch.eventsYoutubeUrl = "";
        patch.eventsYoutubeUrls = [];
      }
    }
    if ("bookingYoutubeUrls" in body) {
      const v = body.bookingYoutubeUrls;
      if (Array.isArray(v)) {
        patch.bookingYoutubeUrls = v.map((s) => String(s ?? "").trim()).filter(Boolean);
      } else if (typeof v === "string") {
        patch.bookingYoutubeUrls = v
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    const next = patch;
    await put(KEY, JSON.stringify(next, null, 2), { access: "public", addRandomSuffix: false });
    return NextResponse.json({ ok: true, config: next });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Failed to update" }, { status: 500 });
  }
}


