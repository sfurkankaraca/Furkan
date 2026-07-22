import { list } from "@vercel/blob";

const KEY = "site-config.json";

/**
 * Vercel Blob'tan `site-config.json` okur.
 * - Dönen config eksikse `{}' ile dönülür.
 * - Yerelde ve/veya Blob erişimi yoksa da hata fırlatmaz.
 */
export async function readSiteConfig(): Promise<Record<string, unknown>> {
  try {
    const { blobs } = await list({ prefix: KEY });
    const exact = blobs.find((b) => b.pathname === KEY) || blobs.at(-1);
    if (!exact) return {};

    const res = await fetch(exact.url, { cache: "no-store" });
    if (!res.ok) return {};

    const json = await res.json().catch(() => ({}));
    return typeof json === "object" && json ? json : {};
  } catch {
    return {};
  }
}

