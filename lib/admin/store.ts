import fs from "node:fs/promises";
import path from "node:path";

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

async function ensureDir() {
  try { await fs.mkdir(dataDir, { recursive: true }); } catch {}
}

async function readJson<T>(file: string): Promise<T[]> {
  try {
    const json = await fs.readFile(file, "utf8");
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function writeJson<T>(file: string, rows: T[]) {
  await ensureDir();
  const text = JSON.stringify(rows, null, 2) + "\n";
  await fs.writeFile(file, text, "utf8");
}

export async function readMembers(): Promise<Member[]> {
  return readJson<Member>(membersFile);
}

export async function addMember(row: Omit<Member, "id" | "createdAt">) {
  const rows = await readMembers();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  rows.unshift({ id, createdAt, banned: false, ...row });
  await writeJson(membersFile, rows);
}

export async function setMemberBanned(memberId: string, banned: boolean) {
  const rows = await readMembers();
  const next = rows.map((m) => (m.id === memberId ? { ...m, banned } : m));
  await writeJson(membersFile, next);
}

export async function readApplications(): Promise<Application[]> {
  return readJson<Application>(applicationsFile);
}

export async function addApplication(row: Omit<Application, "id" | "createdAt">) {
  const rows = await readApplications();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  rows.unshift({ id, createdAt, ...row });
  await writeJson(applicationsFile, rows);
}

export async function readApplicationsByEvent(eventId: string) {
  const rows = await readApplications();
  return rows.filter((a) => a.eventId === eventId);
}
