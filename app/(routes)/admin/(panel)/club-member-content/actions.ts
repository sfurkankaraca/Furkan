"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  readClubMemberPosts,
  writeClubMemberPosts,
  type ClubMemberPost,
} from "@/lib/server/club-posts-store";

async function gate() {
  const jar = await cookies();
  if (jar.get("admin")?.value !== "1") redirect("/admin/login");
}

export async function createClubMemberPost(formData: FormData) {
  await gate();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title) redirect("/admin/club-member-content/new");

  const posts = await readClubMemberPosts();
  const id = `club-post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const sortOrder = Number(String(formData.get("sortOrder") || "0")) || 0;
  const image = String(formData.get("image") || "").trim();
  const linkUrl = String(formData.get("linkUrl") || "").trim();
  const linkLabel = String(formData.get("linkLabel") || "").trim();

  const row: ClubMemberPost = {
    id,
    title,
    body,
    createdAt: now,
    updatedAt: now,
    sortOrder,
    ...(image ? { image } : {}),
    ...(linkUrl ? { linkUrl } : {}),
    ...(linkLabel ? { linkLabel } : {}),
  };
  posts.unshift(row);
  await writeClubMemberPosts(posts);
  redirect("/admin/club-member-content");
}

export async function updateClubMemberPost(formData: FormData) {
  await gate();
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/admin/club-member-content");

  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!title) redirect(`/admin/club-member-content/${id}/edit?error=title`);

  const sortOrder = Number(String(formData.get("sortOrder") || "0")) || 0;
  const image = String(formData.get("image") || "").trim();
  const linkUrl = String(formData.get("linkUrl") || "").trim();
  const linkLabel = String(formData.get("linkLabel") || "").trim();
  const now = new Date().toISOString();

  const posts = await readClubMemberPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) redirect("/admin/club-member-content");

  const prev = posts[idx];
  const next: ClubMemberPost = {
    id: prev.id,
    title,
    body,
    createdAt: prev.createdAt,
    updatedAt: now,
    sortOrder,
  };
  if (image) next.image = image;
  if (linkUrl) next.linkUrl = linkUrl;
  if (linkLabel) next.linkLabel = linkLabel;

  posts[idx] = next;
  await writeClubMemberPosts(posts);
  redirect("/admin/club-member-content");
}

export async function deleteClubMemberPost(formData: FormData) {
  await gate();
  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/admin/club-member-content");
  const posts = (await readClubMemberPosts()).filter((p) => p.id !== id);
  await writeClubMemberPosts(posts);
  redirect("/admin/club-member-content");
}
