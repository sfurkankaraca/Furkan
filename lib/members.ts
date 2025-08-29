import fs from "node:fs/promises";
import path from "node:path";

export type Member = {
  id: string;
  name: string;
  email: string;
  gender?: string;
  age?: number;
  city?: string;
  phone?: string;
  instagram?: string;
  hasCar?: "yes" | "no";
  tastes?: string;
  note?: string;
  createdAt: string; // ISO
};

const membersFile = path.join(process.cwd(), "data", "members.json");

export async function readMembers(): Promise<Member[]> {
  try {
    const json = await fs.readFile(membersFile, "utf8");
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

export async function writeMembers(members: Member[]) {
  const text = JSON.stringify(members, null, 2) + "\n";
  await fs.mkdir(path.dirname(membersFile), { recursive: true });
  await fs.writeFile(membersFile, text, "utf8");
}

export function memberIdFromEmail(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}


