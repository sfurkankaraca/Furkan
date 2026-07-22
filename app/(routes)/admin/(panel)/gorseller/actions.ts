"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";

export async function saveAssetRecord({
  category,
  label,
  url,
}: {
  category: string;
  label: string;
  url: string;
}) {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Veritabanı bağlantısı yok");
  await prisma.siteAsset.create({ data: { category, label, url } });
  revalidatePath("/admin/gorseller");
}

export async function deleteAsset(id: string, url: string) {
  const prisma = getPrisma();
  if (!prisma) throw new Error("Veritabanı bağlantısı yok");
  try {
    await del(url);
  } catch {
    // Blob silme başarısız olsa bile kaydı sil
  }
  await prisma.siteAsset.delete({ where: { id } });
  revalidatePath("/admin/gorseller");
}
