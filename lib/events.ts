import fs from "node:fs/promises";
import path from "node:path";

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
const blobApi = "https://api.vercel.com/v2/blob";

export type PhotoItem = {
  url: string;
  title?: string;
  description?: string;
};

export type PlaylistItem = {
  djName: string;
  description?: string;
  avatarUrl?: string;
  spotifyEmbedUrl: string; // iframe src ya da playlist URL
};

export type AdminEvent = {
  id: string;
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
  photos?: PhotoItem[]; // organizasyonun eklediği fotoğraflar
  memberPhotos?: PhotoItem[]; // üyelerin eklediği fotoğraflar
  playlists?: PlaylistItem[]; // DJ playlistleri
};

const eventsFile = path.join(process.cwd(), "data", "events.json");
const tmpEventsFile = "/tmp/events.json";

async function blobListLatest(prefix: string): Promise<string | undefined> {
  if (!blobToken) return undefined;
  try {
    const res = await fetch(`${blobApi}?prefix=${encodeURIComponent(prefix)}`, {
      headers: { Authorization: `Bearer ${blobToken}` },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({} as any));
    const blobs: any[] = Array.isArray(json?.blobs) ? json.blobs : [];
    const sorted = blobs.sort((a, b) => new Date(b?.uploadedAt || 0).getTime() - new Date(a?.uploadedAt || 0).getTime());
    return sorted[0]?.url as string | undefined;
  } catch {
    return undefined;
  }
}

export async function readEvents(): Promise<AdminEvent[]> {
  // Prefer Blob if available
  if (blobToken) {
    try {
      const latestUrl = await blobListLatest("events.json");
      if (latestUrl) {
        const res = await fetch(latestUrl, { cache: "no-store" });
        if (res.ok) {
          const arr = await res.json();
          return Array.isArray(arr) ? arr : [];
        }
      }
    } catch {}
  }
  // fallback to local file
  try {
    // Try tmp first (Vercel writeable path)
    const json = await fs
      .readFile(process.env.VERCEL ? tmpEventsFile : eventsFile, "utf8")
      .catch(async () => fs.readFile(eventsFile, "utf8"));
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

export async function writeEvents(events: AdminEvent[]) {
  const text = JSON.stringify(events, null, 2) + "\n";
  if (blobToken) {
    try {
      const gen = await fetch(`${blobApi}/generate-upload-url`, {
        method: "POST",
        headers: { Authorization: `Bearer ${blobToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ access: "public", filename: `events.json-${Date.now()}.json`, contentType: "application/json" }),
      });
      const { url, ok } = await gen.json();
      if (gen.ok && ok && url) {
        const up = await fetch(url, { method: "POST", body: text });
        if (up.ok) return;
      }
    } catch {}
  }
  // Fallback: on Vercel, write to /tmp; locally, write to repo data
  if (process.env.VERCEL) {
    await fs.writeFile(tmpEventsFile, text, "utf8");
    return;
  }
  await fs.writeFile(eventsFile, text, "utf8");
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
