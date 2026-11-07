import { list, put } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";
import type { EventTicketing } from "@/lib/event-types";

/**
 * noqt social etkinlikleri için SİTEYE ÖZEL ayarlar (sitede göster, alt başlık,
 * bilet fiyatı/kontenjanı). Anahtar: noqt social etkinlik kimliği (`ns-` öneki YOK).
 * events-store.ts ile aynı desen: Vercel Blob JSON; yerel geliştirmede dosya.
 */

export type SocialEventSetting = {
  listed: boolean;
  ticketing?: EventTicketing;
  subtitle?: string;
  updatedAt: string;
};

export type SocialEventSettings = Record<string, SocialEventSetting>;

const BLOB_KEY = "noqta-social-event-settings.json";
const LOCAL_FILE = path.join(process.cwd(), ".data", "social-event-settings.json");

function blobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_RW_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
    undefined
  );
}

/** Token yok ya da "disabled-local-test" ve üretim değilse yerel dosya kullanılır. */
function shouldUseLocalFile(): boolean {
  const token = blobToken();
  return (!token || token === "disabled-local-test") && process.env.NODE_ENV !== "production";
}

function sanitize(raw: unknown): SocialEventSettings {
  const out: SocialEventSettings = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^[A-Za-z0-9_-]{1,128}$/.test(id) || !v || typeof v !== "object") continue;
    const s = v as Partial<SocialEventSetting>;
    out[id] = {
      listed: s.listed === true,
      ...(s.ticketing && typeof s.ticketing === "object" ? { ticketing: s.ticketing } : {}),
      ...(typeof s.subtitle === "string" && s.subtitle ? { subtitle: s.subtitle } : {}),
      updatedAt: typeof s.updatedAt === "string" ? s.updatedAt : new Date(0).toISOString(),
    };
  }
  return out;
}

export async function readSocialEventSettings(): Promise<SocialEventSettings> {
  try {
    if (shouldUseLocalFile()) {
      return sanitize(JSON.parse(await fs.readFile(LOCAL_FILE, "utf8")));
    }
    const token = blobToken();
    if (!token) return {};
    const { blobs } = await list({ prefix: BLOB_KEY, token });
    if (blobs.length === 0) return {};
    const exact = (blobs as { pathname?: string; url: string }[]).find((b) => b.pathname === BLOB_KEY) || blobs[blobs.length - 1];
    const response = await fetch(exact.url, { cache: "no-store" });
    if (!response.ok) return {};
    return sanitize(await response.json());
  } catch {
    return {};
  }
}

export async function writeSocialEventSettings(settings: SocialEventSettings): Promise<void> {
  const text = JSON.stringify(settings, null, 2) + "\n";
  if (shouldUseLocalFile()) {
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, text, "utf8");
    return;
  }
  const token = blobToken();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN eksik: ayarlar kalıcı kaydedilemiyor.");
  await put(BLOB_KEY, text, { access: "public", addRandomSuffix: false, token, contentType: "application/json" });
}

export async function setSocialEventSetting(id: string, setting: SocialEventSetting): Promise<void> {
  const all = await readSocialEventSettings();
  all[id] = setting;
  await writeSocialEventSettings(all);
}
