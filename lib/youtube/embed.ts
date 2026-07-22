export type YoutubeEmbedRef =
  | { kind: "video"; id: string }
  | { kind: "playlist"; id: string };

/**
 * youtube.com/watch, youtu.be, /embed/, /shorts/, playlist?list= desteklenir.
 */
export function parseYoutubeUrl(input: string): YoutubeEmbedRef | null {
  const s = input.trim();
  if (!s) return null;
  try {
    const u = s.startsWith("http") ? new URL(s) : new URL(`https://${s}`);
    let v = u.searchParams.get("v");
    if (!v && u.hostname.replace(/^www\./, "") === "youtu.be") {
      v = u.pathname.split("/").filter(Boolean)[0] ?? "";
    }
    if (!v && u.pathname.includes("/embed/")) {
      v = u.pathname.split("/embed/")[1]?.split("/")[0] ?? "";
    }
    if (!v) {
      const shorts = u.pathname.match(/\/shorts\/([\w-]{11})/);
      if (shorts?.[1]) v = shorts[1];
    }
    if (v && /^[\w-]{11}$/.test(v)) {
      return { kind: "video", id: v };
    }
    const list = u.searchParams.get("list");
    if (list && /^[\w-]+$/.test(list) && list.length >= 10) {
      return { kind: "playlist", id: list };
    }
  } catch {
    return null;
  }
  return null;
}

export function youtubeNocookieEmbedSrc(ref: YoutubeEmbedRef): string {
  if (ref.kind === "playlist") {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(ref.id)}&rel=0`;
  }
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(ref.id)}?rel=0`;
}

/** Tekil videolar için kapak; playlist’te null. */
export function youtubeThumbnailUrl(ref: YoutubeEmbedRef): string | null {
  if (ref.kind !== "video") return null;
  return `https://i.ytimg.com/vi/${ref.id}/hqdefault.jpg`;
}
