"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SITE_IMAGE_SLOTS } from "@/lib/site-images/registry";
import { validateImageUrlForSave } from "@/lib/site-images/resolver";
import { readSiteImageOverrides, writeSiteImageOverrides } from "@/lib/site-images/store";

async function gate() {
  const jar = await cookies();
  if (jar.get("admin")?.value !== "1") redirect("/admin/login");
}

export async function saveSiteImageSlot(formData: FormData) {
  await gate();
  const id = String(formData.get("slotId") || "").trim();
  const urlRaw = String(formData.get("url") || "").trim();
  const validIds = new Set(SITE_IMAGE_SLOTS.map((s) => s.id));
  if (!validIds.has(id)) redirect("/admin/site-images?err=invalid");

  const all = await readSiteImageOverrides();
  const next = { ...all };
  if (!urlRaw) {
    delete next[id];
  } else {
    const v = validateImageUrlForSave(urlRaw);
    if (!v) redirect(`/admin/site-images?err=url&slot=${encodeURIComponent(id)}`);
    next[id] = v;
  }
  await writeSiteImageOverrides(next);
  const paths = [
    "/",
    "/booking",
    "/b2b",
    "/academy",
    "/events",
    "/radio",
    "/collective",
    "/noqta-club",
    "/join",
    "/furkan-karaca",
    "/biz-kimiz",
    "/contact",
    "/admin/site-images",
    "/api/site",
    "/api/site-image",
  ] as const;
  for (const p of paths) revalidatePath(p);
}
