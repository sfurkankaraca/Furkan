// @noqtacademy'den sitede gösterilen gönderiler (en yeni önce).
// Güncellemek için: Instagram'da gönderiyi aç → linkteki kodu (/reel/<KOD>/ veya /p/<KOD>/) buraya ekle.
export const ACADEMY_INSTAGRAM_HANDLE = "noqtacademy";

export type InstagramPostRef = { type: "reel" | "p"; code: string };

export const ACADEMY_INSTAGRAM_POSTS: InstagramPostRef[] = [
  { type: "reel", code: "DeHsQIToOSN" },
  { type: "reel", code: "DeHgW09oxZp" },
  { type: "reel", code: "DeHLgh0IcDY" },
  { type: "reel", code: "DeB_lhTI43B" },
  { type: "reel", code: "Dd8_ssuo9Fm" },
  { type: "reel", code: "Dd8tAOUIQKK" },
];

export function isListedInstagramCode(code: string) {
  return ACADEMY_INSTAGRAM_POSTS.some((p) => p.code === code);
}

export function instagramPostUrl(post: InstagramPostRef) {
  return `https://www.instagram.com/${post.type}/${post.code}/`;
}

/**
 * Gönderi açıklamasını Instagram'ın herkese açık embed sayfasından okur (6 saat önbellek).
 * Hashtag'ler ve "View all comments" atılır; alınamazsa null döner, kart açıklamasız gösterilir.
 */
export async function fetchInstagramCaption(post: InstagramPostRef): Promise<string | null> {
  try {
    const res = await fetch(`https://www.instagram.com/${post.type}/${post.code}/embed/captioned`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 21600 },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/);
    if (!m) return null;
    const text = decodeEntities(m[1].replace(/<[^>]+>/g, " "))
      .replace(/View all (\d+ )?comments?/gi, "")
      .replace(/#[\p{L}\p{N}_]+/gu, "")
      .replace(/\s+/g, " ")
      .trim()
      .replace(new RegExp(`^${ACADEMY_INSTAGRAM_HANDLE}\\s*`), "")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

function decodeEntities(s: string) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
