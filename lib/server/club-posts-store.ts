import { list, put } from "@vercel/blob";

const BLOB_KEY = "noqta-club-member-posts.json";

export type ClubMemberPost = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  image?: string;
  linkUrl?: string;
  linkLabel?: string;
  sortOrder: number;
};

const defaultPosts: ClubMemberPost[] = [];

export async function readClubMemberPosts(): Promise<ClubMemberPost[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return defaultPosts;
    const exact =
      (blobs as { pathname?: string; url: string }[]).find((b) => b.pathname === BLOB_KEY) ||
      blobs[blobs.length - 1];
    const response = await fetch(exact.url, { cache: "no-store" });
    if (!response.ok) return defaultPosts;
    const data = await response.json();
    return Array.isArray(data) ? data : defaultPosts;
  } catch {
    return defaultPosts;
  }
}

export async function writeClubMemberPosts(posts: ClubMemberPost[]): Promise<{ url: string }> {
  const text = JSON.stringify(posts, null, 2);
  const mainBlob = await put(BLOB_KEY, text, { access: "public", addRandomSuffix: false });
  return { url: mainBlob.url };
}

export async function getClubMemberPostById(id: string): Promise<ClubMemberPost | undefined> {
  const posts = await readClubMemberPosts();
  return posts.find((p) => p.id === id);
}

export function sortClubMemberPosts(posts: ClubMemberPost[]): ClubMemberPost[] {
  return [...posts].sort((a, b) => {
    const o = a.sortOrder - b.sortOrder;
    if (o !== 0) return o;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
