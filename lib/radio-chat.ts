import { getPrisma } from "@/lib/prisma";

const MAX_BODY = 400;
const LIST_LIMIT = 120;

export type RadioChatMessagePublic = {
  id: string;
  body: string;
  createdAt: string;
  authorLabel: string;
};

function displayAuthor(name: string | null | undefined, email: string): string {
  const n = name?.trim();
  if (n) return n;
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

export async function listRadioChatMessages(): Promise<RadioChatMessagePublic[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const rows = await prisma.radioChatMessage.findMany({
    take: LIST_LIMIT,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return rows
    .map((r) => ({
      id: r.id,
      body: r.body,
      createdAt: r.createdAt.toISOString(),
      authorLabel: displayAuthor(r.user.name, r.user.email),
    }))
    .reverse();
}

export function sanitizeRadioChatBody(raw: string): string {
  let s = raw.replace(/\r\n/g, "\n").trim();
  if (!s) return "";
  s = s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "");
  s = s.slice(0, MAX_BODY);
  const lines = s.split("\n").slice(0, 6);
  return lines.join("\n").trim();
}

export async function createRadioChatMessage(userId: string, body: string): Promise<RadioChatMessagePublic | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const clean = sanitizeRadioChatBody(body);
  if (!clean) return null;

  const row = await prisma.radioChatMessage.create({
    data: { userId, body: clean },
    include: { user: { select: { name: true, email: true } } },
  });

  return {
    id: row.id,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    authorLabel: displayAuthor(row.user.name, row.user.email),
  };
}
