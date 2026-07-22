import { SITE_IMAGE_SLOTS } from "@/lib/site-images/registry";

function isAllowedImageUrl(u: string): boolean {
  const t = u.trim();
  if (!t) return false;
  if (t.startsWith("/")) return true;
  try {
    const x = new URL(t);
    return x.protocol === "https:" || x.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Override veya kayıtlı varsayılan; ikisi de yoksa null.
 */
export function resolveSiteImageUrl(
  slotId: string,
  overrides: Record<string, string>,
): string | null {
  const o = overrides[slotId]?.trim();
  if (o && isAllowedImageUrl(o)) return o.trim();
  const slot = SITE_IMAGE_SLOTS.find((s) => s.id === slotId);
  const d = slot?.defaultUrl?.trim();
  if (d && isAllowedImageUrl(d)) return d;
  return null;
}

export function validateImageUrlForSave(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  return isAllowedImageUrl(t) ? t : null;
}
