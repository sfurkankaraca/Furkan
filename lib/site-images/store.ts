import fs from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

const dataDir = path.join(process.cwd(), "data");
const localFile = path.join(dataDir, "site-images-overrides.json");
const blobPathname = "site-images-overrides.json";

function blobRwToken(): string | undefined {
  return blobToken;
}

async function ensureDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    /* ignore */
  }
}

async function readFromBlob(): Promise<Record<string, string> | null> {
  const token = blobRwToken();
  if (!token) return null;
  try {
    const { blobs } = await list({ prefix: "site-images-overrides", token });
    const exact = blobs.find((b) => b.pathname === blobPathname);
    const pick =
      exact?.url ??
      blobs
        .filter((b) => typeof b.pathname === "string" && b.pathname.startsWith("site-images-overrides"))
        .sort(
          (a, b) =>
            new Date((b as { uploadedAt?: Date }).uploadedAt ?? 0).getTime() -
            new Date((a as { uploadedAt?: Date }).uploadedAt ?? 0).getTime(),
        )[0]?.url;
    if (!pick) return null;
    const res = await fetch(pick, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = await res.json().catch(() => null);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    return raw as Record<string, string>;
  } catch (e) {
    console.error("[site-images] blob read", e);
    return null;
  }
}

async function writeToBlob(data: Record<string, string>): Promise<boolean> {
  const token = blobRwToken();
  if (!token) return false;
  try {
    const body = JSON.stringify(data, null, 2) + "\n";
    await put(blobPathname, body, {
      access: "public",
      addRandomSuffix: false,
      token,
      contentType: "application/json",
    });
    return true;
  } catch (e) {
    console.error("[site-images] blob write", e);
    return false;
  }
}

async function readFromDisk(): Promise<Record<string, string>> {
  try {
    const text = await fs.readFile(localFile, "utf8");
    const raw = JSON.parse(text);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    return raw as Record<string, string>;
  } catch {
    return {};
  }
}

async function writeToDisk(data: Record<string, string>) {
  await ensureDir();
  await fs.writeFile(localFile, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/** Admin + public sayfalar: slot id → görsel URL */
export async function readSiteImageOverrides(): Promise<Record<string, string>> {
  const fromBlob = await readFromBlob();
  if (fromBlob !== null) return fromBlob;
  return readFromDisk();
}

export async function writeSiteImageOverrides(data: Record<string, string>): Promise<void> {
  const ok = await writeToBlob(data);
  if (!ok) {
    await writeToDisk(data);
  } else {
    try {
      await writeToDisk(data);
    } catch {
      /* blob yeterli */
    }
  }
}
