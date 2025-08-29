import fs from "node:fs/promises";
import path from "node:path";

export type AdminEvent = {
  id: string;
  title: string;
  date: string;
  city: string;
  venue?: string;
  ctaUrl?: string;
  image?: string;
  description?: string;
};

const eventsFile = path.join(process.cwd(), "data", "events.json");

export async function readEvents(): Promise<AdminEvent[]> {
  try {
    const json = await fs.readFile(eventsFile, "utf8");
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

export async function writeEvents(events: AdminEvent[]) {
  const text = JSON.stringify(events, null, 2) + "\n";
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
