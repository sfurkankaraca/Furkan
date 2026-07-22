import type { BlogPostMeta } from "@/lib/blog/registry";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";

/** Blog liste sayfası: sırayla admin’de tanımlı posterlerden ilki. */
const BLOG_INDEX_POSTER_SLOTS = [
  "events_hero_poster",
  "booking_hero_poster",
  "academy_hero_poster",
  "b2b_hero_poster",
  "collective_hero_poster",
  "radio_hero_poster",
  "home_hero_poster",
  "biz_kimiz_hero_poster",
  "contact_hero_poster",
] as const;

const CATEGORY_POSTER_SLOTS: Record<BlogPostMeta["category"], readonly string[]> = {
  booking: ["events_hero_poster", "booking_hero_poster", "contact_hero_poster", "home_hero_poster"],
  egitim: ["academy_hero_poster", "collective_hero_poster", "radio_hero_poster"],
  dj: ["radio_hero_poster", "collective_hero_poster", "events_hero_poster", "club_hero_poster"],
  b2b: ["b2b_hero_poster", "collective_hero_poster", "booking_hero_poster"],
  produksiyon: ["academy_hero_poster", "radio_hero_poster", "collective_hero_poster"],
  sahne: ["club_hero_poster", "events_hero_poster", "radio_hero_poster", "collective_hero_poster"],
};

function firstPoster(overrides: Record<string, string>, slotIds: readonly string[]): string {
  for (const id of slotIds) {
    const u = resolveSiteImageUrl(id, overrides);
    if (u) return u;
  }
  return "/og.png";
}

export function resolveBlogIndexPoster(overrides: Record<string, string>): string {
  return firstPoster(overrides, BLOG_INDEX_POSTER_SLOTS);
}

export function resolveBlogArticlePoster(post: BlogPostMeta, overrides: Record<string, string>): string {
  return firstPoster(overrides, CATEGORY_POSTER_SLOTS[post.category]);
}
