import fs from "node:fs/promises";
import path from "node:path";

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
const blobApi = "https://api.vercel.com/v2/blob";

export type Member = {
  id: string;
  name: string;
  email: string;
  city?: string;
  phone?: string;
  instagram?: string;
  gender?: string;
  age?: number;
  hasCar?: boolean;
  tastes?: string;
  note?: string;
  createdAt: string;
  banned?: boolean;
};

export type Application = {
  id: string;
  eventId: string;
  eventTitle?: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  city: string;
  mainReason: string;
  musicGenres: string[];
  djExcitement: string;
  hasCar: boolean;
  instagram: string;
  consentLocation: boolean;
  consentInstructions: boolean;
  referrer?: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const membersFile = path.join(dataDir, "members.json");
const applicationsFile = path.join(dataDir, "applications.json");
const tmpMembersFile = "/tmp/members.json";
const tmpApplicationsFile = "/tmp/applications.json";

async function ensureDir() {
  try { await fs.mkdir(dataDir, { recursive: true }); } catch {}
}

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

async function readJson<T>(file: string, blobPrefix?: string, tmpFile?: string): Promise<T[]> {
  if (blobToken && blobPrefix) {
    try {
      const latestUrl = await blobListLatest(blobPrefix);
      if (latestUrl) {
        const res = await fetch(latestUrl, { cache: "no-store" });
        if (res.ok) {
          const arr = await res.json();
          return Array.isArray(arr) ? arr : [];
        }
      }
    } catch {}
  }
  try {
    const json = await fs
      .readFile(process.env.VERCEL && tmpFile ? tmpFile : file, "utf8")
      .catch(async () => fs.readFile(file, "utf8"));
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, rows: T[], blobPrefix?: string, tmpFile?: string) {
  const text = JSON.stringify(rows, null, 2) + "\n";
  if (blobToken && blobPrefix) {
    try {
      const gen = await fetch(`${blobApi}/generate-upload-url`, {
        method: "POST",
        headers: { Authorization: `Bearer ${blobToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ access: "public", filename: `${blobPrefix}-${Date.now()}.json`, contentType: "application/json" }),
      });
      const { url, ok } = await gen.json();
      if (gen.ok && ok && url) {
        const up = await fetch(url, { method: "POST", body: text });
        if (up.ok) return;
      }
    } catch {}
  }
  if (process.env.VERCEL && tmpFile) {
    await fs.writeFile(tmpFile, text, "utf8");
    return;
  }
  await ensureDir();
  await fs.writeFile(file, text, "utf8");
}

export async function readMembers(): Promise<Member[]> {
  return readJson<Member>(membersFile, "members.json", tmpMembersFile);
}

export async function addMember(row: Omit<Member, "id" | "createdAt">) {
  const rows = await readMembers();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  rows.unshift({ id, createdAt, banned: false, ...row });
  await writeJson(membersFile, rows, "members.json", tmpMembersFile);
}

export async function setMemberBanned(memberId: string, banned: boolean) {
  const rows = await readMembers();
  const next = rows.map((m) => (m.id === memberId ? { ...m, banned } : m));
  await writeJson(membersFile, next, "members.json", tmpMembersFile);
}

export async function readApplications(): Promise<Application[]> {
  return readJson<Application>(applicationsFile, "applications.json", tmpApplicationsFile);
}

export async function addApplication(row: Omit<Application, "id" | "createdAt">) {
  const rows = await readApplications();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  rows.unshift({ id, createdAt, ...row });
  await writeJson(applicationsFile, rows, "applications.json", tmpApplicationsFile);
}

export async function readApplicationsByEvent(eventId: string) {
  const rows = await readApplications();
  return rows.filter((a) => a.eventId === eventId);
}
