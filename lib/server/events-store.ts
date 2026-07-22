import { list, put } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";
import type { PublicEvent } from "@/lib/event-types";

const BLOB_KEY = "noqta-events.json";
const blobToken =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VERCEL_BLOB_RW_TOKEN ||
  process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
const dataDir = path.join(process.cwd(), "data");
const localFile = path.join(dataDir, "events.json");
const tmpLocalFile = "/tmp/events.json";

const defaultEvents: PublicEvent[] = [
  {
    id: "noqta-b2b-dj-workshop-2025-10-02",
    title: "noqta B2B DJ Workshop",
    date: "2025-10-02T18:00:00+03:00",
    city: "İstanbul",
    venue: "noqta studyo",
    ctaUrl: "/academy/workshops/dj/apply",
    image: "/pexels-a-e-g-s-728750948-20557241.jpg",
  },
  {
    id: "dj-101-registrations-open",
    title: "DJ 101",
    date: "",
    city: "İstanbul",
    venue: "",
    ctaUrl: "/academy/labs/dj101/apply",
  },
];

async function readLocalEvents(): Promise<PublicEvent[]> {
  try {
    const text = await fs
      .readFile(process.env.VERCEL ? tmpLocalFile : localFile, "utf8")
      .catch(async () => fs.readFile(localFile, "utf8"));
    const arr = JSON.parse(text);
    return Array.isArray(arr) ? (arr as PublicEvent[]) : [];
  } catch {
    return [];
  }
}

export async function readEventsJson(): Promise<PublicEvent[]> {
  const local = await readLocalEvents();
  try {
    if (!blobToken) return local.length ? local : defaultEvents;
    const { blobs } = await list({ prefix: BLOB_KEY, token: blobToken });
    if (blobs.length === 0) return local.length ? local : defaultEvents;
    const exact = (blobs as { pathname?: string; url: string }[]).find((b) => b.pathname === BLOB_KEY) || blobs[blobs.length - 1];
    const response = await fetch(exact.url, { cache: "no-store" });
    if (!response.ok) return local.length ? local : defaultEvents;
    const data = await response.json();
    if (!Array.isArray(data)) return local.length ? local : defaultEvents;
    // Blob varsa tek doğruluk kaynağı blob’dur; yerel / repodaki eski JSON silinenleri geri eklemez
    const fromBlob = data as PublicEvent[];
    return fromBlob.length ? fromBlob : defaultEvents;
  } catch {
    return local.length ? local : defaultEvents;
  }
}

export async function writeEventsJson(events: PublicEvent[]): Promise<{ url: string }> {
  const text = JSON.stringify(events, null, 2);
  await fs.mkdir(dataDir, { recursive: true }).catch(() => {});
  await fs.writeFile(process.env.VERCEL ? tmpLocalFile : localFile, text + "\n", "utf8").catch(() => {});
  if (process.env.VERCEL && !blobToken) {
    throw new Error("BLOB_READ_WRITE_TOKEN eksik: etkinlikler kalıcı kaydedilemiyor.");
  }
  if (!blobToken) {
    return { url: "local://events.json" };
  }
  const mainBlob = await put(BLOB_KEY, text, { access: "public", addRandomSuffix: false, token: blobToken });
  return { url: mainBlob.url };
}

export async function getEventById(id: string): Promise<PublicEvent | undefined> {
  const events = await readEventsJson();
  const decoded = (() => {
    try {
      return decodeURIComponent(id);
    } catch {
      return id;
    }
  })();
  return events.find((e) => e.id === id || e.id === decoded);
}
