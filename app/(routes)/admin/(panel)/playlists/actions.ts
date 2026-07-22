"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getPrisma } from "@/lib/prisma";

export async function createPlaylist(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) redirect("/admin/playlists/new?e=nodb");

  const title = String(formData.get("title") || "").trim();
  const spotifyUrl = String(formData.get("spotifyUrl") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const featured = formData.get("featured") === "on";
  const sortOrderRaw = String(formData.get("sortOrder") || "0").trim();
  const sortOrder = Number(sortOrderRaw);
  const sort = Number.isFinite(sortOrder) ? sortOrder : 0;

  if (!title || !spotifyUrl || !coverImage || !category) {
    redirect("/admin/playlists/new?e=missing");
  }

  await prisma.playlist.create({
    data: { title, spotifyUrl, coverImage, category, featured, sortOrder: sort },
  });
  revalidatePath("/radio");
  revalidatePath("/api/playlists");
  redirect("/admin/playlists");
}

export async function updatePlaylist(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) redirect("/admin/playlists?e=nodb");

  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const spotifyUrl = String(formData.get("spotifyUrl") || "").trim();
  const coverImage = String(formData.get("coverImage") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const featured = formData.get("featured") === "on";
  const sortOrderRaw = String(formData.get("sortOrder") || "0").trim();
  const sortOrder = Number(sortOrderRaw);
  const sort = Number.isFinite(sortOrder) ? sortOrder : 0;

  if (!id || !title || !spotifyUrl || !coverImage || !category) {
    redirect(`/admin/playlists/${id}/edit?e=missing`);
  }

  await prisma.playlist.update({
    where: { id },
    data: { title, spotifyUrl, coverImage, category, featured, sortOrder: sort },
  });
  revalidatePath("/radio");
  revalidatePath("/api/playlists");
  redirect("/admin/playlists");
}

export async function deletePlaylist(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  if (!prisma) redirect("/admin/playlists?e=nodb");

  const id = String(formData.get("id") || "").trim();
  if (!id) redirect("/admin/playlists");

  await prisma.playlist.delete({ where: { id } });
  revalidatePath("/radio");
  revalidatePath("/api/playlists");
  redirect("/admin/playlists");
}
