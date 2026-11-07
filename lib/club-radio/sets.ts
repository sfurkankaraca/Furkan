import { unstable_cache } from "next/cache";
import { readSiteConfigBlob, resolveEventsYoutubeUrls } from "@/lib/site-config-read";
import { parseYoutubeUrl } from "@/lib/youtube/embed";
import { DEFAULT_SET_IDS, KNOWN_SET_VIDEOS, type SetVideo } from "@/lib/club-radio/content";

const FEATURED_ID = DEFAULT_SET_IDS[0];

const getCachedUrls = unstable_cache(
  async () => resolveEventsYoutubeUrls(await readSiteConfigBlob()),
  ["club-radio-set-urls"],
  { revalidate: 300 },
);

async function fetchTitle(id: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return "noqt set";
    const json = (await res.json()) as { title?: unknown };
    return typeof json.title === "string" && json.title.trim() ? json.title.trim() : "noqt set";
  } catch {
    return "noqt set";
  }
}

async function toVideo(id: string): Promise<SetVideo> {
  const known = KNOWN_SET_VIDEOS[id];
  if (known) return known;
  return {
    id,
    kind: "noqt set",
    artists: "",
    title: await fetchTitle(id),
    image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

/** Site yapılandırmasındaki (admin düzenlenebilir) YouTube listesi; Meeting 4.0 her zaman ilk. */
export async function getSetVideos(): Promise<SetVideo[]> {
  let urls: string[] = [];
  try {
    urls = await getCachedUrls();
  } catch (e) {
    console.error("[club-radio] set listesi okunamadı", e);
  }
  const ids: string[] = [];
  for (const u of urls) {
    const ref = parseYoutubeUrl(u);
    if (ref?.kind === "video" && !ids.includes(ref.id)) ids.push(ref.id);
  }
  if (ids.length === 0) ids.push(...DEFAULT_SET_IDS);
  if (ids.includes(FEATURED_ID)) {
    ids.splice(ids.indexOf(FEATURED_ID), 1);
    ids.unshift(FEATURED_ID);
  }
  return Promise.all(ids.map(toVideo));
}
