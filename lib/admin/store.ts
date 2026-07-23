import fs from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";

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

export type WorkshopApplication = {
  id: string;
  kind: "dj" | "production" | string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  instagram?: string;
  answers: Record<string, string | number | boolean>;
  createdAt: string;
};

export type ContactInquiryType = "booking" | "b2b" | "collective" | "general";

export type ContactInquiry = {
  id: string;
  type: ContactInquiryType;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  details?: Record<string, string>;
  createdAt: string;
};

export type NoqtaClubStatus = "pending" | "approved" | "rejected";

export type NoqtaClubApplication = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city: string;
  /** YYYY-MM-DD */
  birthDate?: string;
  /** Eski başvurular (yaş alanı) */
  age?: number;
  instagram: string;
  /** Seni öneren kişi / referans (serbest metin) */
  referrer?: string;
  /** Nasıl duydun / kanal (çoktan seçmeli) */
  referralSource?: string;
  mainReason: string;
  musicInterest: string;
  consentKvkk: boolean;
  consentMarketing?: boolean;
  status: NoqtaClubStatus;
  tier?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionNote?: string;
  createdAt: string;
  updatedAt?: string;
};

const dataDir = path.join(process.cwd(), "data");
const membersFile = path.join(dataDir, "members.json");
const applicationsFile = path.join(dataDir, "applications.json");
const workshopApplicationsFile = path.join(dataDir, "workshop-applications.json");
const contactInquiriesFile = path.join(dataDir, "contact-inquiries.json");
const tmpMembersFile = "/tmp/members.json";
const tmpApplicationsFile = "/tmp/applications.json";
const tmpWorkshopApplicationsFile = "/tmp/workshop-applications.json";
const tmpContactInquiriesFile = "/tmp/contact-inquiries.json";
const clubApplicationsFile = path.join(dataDir, "noqta-club-applications.json");
const tmpClubApplicationsFile = "/tmp/noqta-club-applications.json";
const subscribersFile = path.join(dataDir, "subscribers.json");
const tmpSubscribersFile = "/tmp/subscribers.json";
/** Vercel Blob — tek dosya; sunucusuz ortamda /tmp yerine kalıcı saklama */
const clubApplicationsBlobPath = "noqta-club-applications.json";

function blobRwToken(): string | undefined {
  return blobToken;
}

async function readNoqtaClubApplicationsFromBlob(): Promise<NoqtaClubApplication[] | null> {
  const token = blobRwToken();
  if (!token) return null;
  try {
    const { blobs } = await list({ prefix: "noqta-club-applications", token });
    const exact = blobs.find((b) => b.pathname === clubApplicationsBlobPath);
    const pick = exact?.url
      ? exact
      : blobs
          .filter((b) => typeof b.pathname === "string" && b.pathname.startsWith("noqta-club-applications"))
          .sort(
            (a, b) =>
              new Date((b as { uploadedAt?: string }).uploadedAt || 0).getTime() -
              new Date((a as { uploadedAt?: string }).uploadedAt || 0).getTime(),
          )[0];
    if (!pick?.url) return [];
    const res = await fetch(pick.url, { cache: "no-store" });
    if (!res.ok) return [];
    const arr = await res.json().catch(() => []);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("[admin/store] noqta-club blob read", e);
    return [];
  }
}

async function writeNoqtaClubApplicationsToBlob(rows: NoqtaClubApplication[]): Promise<boolean> {
  const token = blobRwToken();
  if (!token) return false;
  try {
    const body = JSON.stringify(rows, null, 2) + "\n";
    await put(clubApplicationsBlobPath, body, {
      access: "public",
      addRandomSuffix: false,
      token,
      contentType: "application/json",
    });
    return true;
  } catch (e) {
    console.error("[admin/store] noqta-club blob write", e);
    return false;
  }
}

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

export type Subscriber = {
  id: string;
  email: string;
  /** Nereden abone oldu: journal, footer, vb. */
  source?: string;
  createdAt: string;
};

export async function readSubscribers(): Promise<Subscriber[]> {
  return readJson<Subscriber>(subscribersFile, "subscribers.json", tmpSubscribersFile);
}

/** Bültene ekler. Zaten kayıtlıysa "already" döner, yeni ise "added". */
export async function addSubscriber(email: string, source?: string): Promise<"added" | "already"> {
  const clean = email.trim().toLowerCase();
  const rows = await readSubscribers();
  if (rows.some((s) => s.email === clean)) return "already";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  rows.unshift({ id, email: clean, source, createdAt: new Date().toISOString() });
  await writeJson(subscribersFile, rows, "subscribers.json", tmpSubscribersFile);
  return "added";
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

export async function readWorkshopApplications(): Promise<WorkshopApplication[]> {
  return readJson<WorkshopApplication>(workshopApplicationsFile, "workshop-applications.json", tmpWorkshopApplicationsFile);
}

export async function addWorkshopApplication(row: Omit<WorkshopApplication, "id" | "createdAt">) {
  const rows = await readWorkshopApplications();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  rows.unshift({ id, createdAt, ...row });
  await writeJson(workshopApplicationsFile, rows, "workshop-applications.json", tmpWorkshopApplicationsFile);
}

export async function readWorkshopApplicationsByKind(kind: string) {
  const rows = await readWorkshopApplications();
  return rows.filter((a) => a.kind === kind);
}

export async function readContactInquiries(): Promise<ContactInquiry[]> {
  return readJson<ContactInquiry>(contactInquiriesFile, "contact-inquiries.json", tmpContactInquiriesFile);
}

export async function addContactInquiry(row: Omit<ContactInquiry, "id" | "createdAt">) {
  const rows = await readContactInquiries();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  rows.unshift({ id, createdAt, ...row });
  await writeJson(contactInquiriesFile, rows, "contact-inquiries.json", tmpContactInquiriesFile);
}

// -----------------------
// Noqta Club Store
// -----------------------

export async function readNoqtaClubApplications(): Promise<NoqtaClubApplication[]> {
  const fromBlob = await readNoqtaClubApplicationsFromBlob();
  if (fromBlob !== null) return fromBlob;
  return readJson<NoqtaClubApplication>(clubApplicationsFile, undefined, tmpClubApplicationsFile);
}

export async function getNoqtaClubApplicationByEmail(email: string): Promise<NoqtaClubApplication | null> {
  const e = email.toLowerCase().trim();
  const rows = await readNoqtaClubApplications();
  return rows.find((r) => r.email.toLowerCase().trim() === e) || null;
}

export async function getNoqtaClubApplicationById(id: string): Promise<NoqtaClubApplication | null> {
  const rows = await readNoqtaClubApplications();
  return rows.find((r) => r.id === id) || null;
}

export async function upsertNoqtaClubApplication(
  row: Omit<NoqtaClubApplication, "id" | "createdAt" | "updatedAt" | "reviewedAt" | "reviewedBy" | "rejectionNote" | "status"> & {
    status?: NoqtaClubStatus;
  }
): Promise<NoqtaClubApplication> {
  const rows = await readNoqtaClubApplications();
  const email = row.email.toLowerCase().trim();
  const now = new Date().toISOString();

  const existingIdx = rows.findIndex((r) => r.email.toLowerCase().trim() === email);
  if (existingIdx >= 0) {
    const prev = rows[existingIdx];
    rows[existingIdx] = {
      ...prev,
      ...row,
      email,
      status: "pending",
      reviewedAt: undefined,
      reviewedBy: undefined,
      rejectionNote: undefined,
      tier: row.tier || prev.tier || "standard",
      updatedAt: now,
    };
    const ok = await writeNoqtaClubApplicationsToBlob(rows);
    if (!ok) {
      await writeJson(clubApplicationsFile, rows, undefined, tmpClubApplicationsFile);
    }
    return rows[existingIdx];
  }

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = now;
  const newRow: NoqtaClubApplication = {
    id,
    createdAt,
    updatedAt: now,
    tier: row.tier || "standard",
    reviewedAt: undefined,
    reviewedBy: undefined,
    rejectionNote: undefined,
    status: "pending",
    ...row,
    email,
  };
  rows.unshift(newRow);
  const ok = await writeNoqtaClubApplicationsToBlob(rows);
  if (!ok) {
    await writeJson(clubApplicationsFile, rows, undefined, tmpClubApplicationsFile);
  }
  return newRow;
}

export async function setNoqtaClubStatus(args: {
  id: string;
  status: NoqtaClubStatus;
  adminEmail?: string;
  rejectionNote?: string;
}) {
  const rows = await readNoqtaClubApplications();
  const idx = rows.findIndex((r) => r.id === args.id);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  const prev = rows[idx];
  rows[idx] = {
    ...prev,
    status: args.status,
    reviewedAt: now,
    reviewedBy: args.adminEmail,
    rejectionNote: args.status === "rejected" ? args.rejectionNote || undefined : undefined,
    updatedAt: now,
  };
  const ok = await writeNoqtaClubApplicationsToBlob(rows);
  if (!ok) {
    await writeJson(clubApplicationsFile, rows, undefined, tmpClubApplicationsFile);
  }
  return rows[idx];
}
