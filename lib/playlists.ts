import { getPrisma } from "@/lib/prisma";

export type PlaylistRow = {
  id: string;
  title: string;
  spotifyUrl: string;
  coverImage: string;
  category: string;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function listPlaylistsForPublic(): Promise<PlaylistRow[]> {
  const prisma = getPrisma();
  if (!prisma) return [];
  return prisma.playlist.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
  });
}

export async function listPlaylistsForAdmin(): Promise<PlaylistRow[]> {
  const prisma = getPrisma();
  if (!prisma) return [];
  return prisma.playlist.findMany({
    orderBy: [{ sortOrder: "asc" }, { category: "asc" }, { title: "asc" }],
  });
}

export async function getPlaylistById(id: string): Promise<PlaylistRow | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.playlist.findUnique({ where: { id } });
}
