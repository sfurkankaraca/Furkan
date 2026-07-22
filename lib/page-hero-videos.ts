/**
 * `public/` altındaki sayfa videoları.
 * Vercel (Linux) büyük/küçük harfe duyarlı: `.MP4` ile kayıtlıysa aday listesinde ikisini de verin.
 */
export type PageHeroKey =
  | "home"
  | "events"
  | "radio"
  | "club"
  | "academy"
  | "collective"
  | "b2b"
  | "booking";

/** Repo içinde doğrulanmış mp4 dosyaları — rastgele arka plan ve güvenli fallback için. */
export const PUBLIC_HERO_VIDEO_POOL: readonly string[] = [
  "/events-hero.mp4",
  "/b2b-hero.mp4",
  "/club-hero.mp4",
  "/collective-hero.mp4",
  "/academy-hero.mp4",
  "/radio-hero.mp4",
] as const;

const HERO_FALLBACK = PUBLIC_HERO_VIDEO_POOL[0]!;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Sayfa yolu veya benzersiz anahtar ile havuzdan deterministik seçim (aynı sayfa = aynı video). */
export function resolveRandomHeroSources(seed: string): readonly string[] {
  if (PUBLIC_HERO_VIDEO_POOL.length === 0) return [HERO_FALLBACK];
  const idx = hashSeed(seed) % PUBLIC_HERO_VIDEO_POOL.length;
  return [PUBLIC_HERO_VIDEO_POOL[idx]!];
}

const PAGE_HERO_CANDIDATES: Record<PageHeroKey, readonly string[]> = {
  home: ["/b2b-hero.mp4", "/collective-hero.mp4", HERO_FALLBACK],
  events: ["/events-hero.mp4", HERO_FALLBACK],
  radio: ["/radio-hero.mp4", "/radio-hero.MP4", HERO_FALLBACK],
  club: ["/club-hero.mp4", "/club-hero.MP4", HERO_FALLBACK],
  academy: ["/academy-hero.mp4", HERO_FALLBACK],
  collective: ["/collective-hero.mp4", HERO_FALLBACK],
  b2b: ["/b2b-hero.mp4", HERO_FALLBACK],
  booking: ["/collective-hero.mp4", "/events-hero.mp4", HERO_FALLBACK],
};

/** Önce tam URL (env / Blob), yoksa sayfa dosya adayları (sonunda havuz fallback). */
export function resolvePageHeroSources(
  key: PageHeroKey,
  options?: { envUrl?: string | null },
): readonly string[] {
  const u = options?.envUrl?.trim();
  if (u) return [u];
  return PAGE_HERO_CANDIDATES[key];
}
