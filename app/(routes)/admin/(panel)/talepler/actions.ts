"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getPrisma } from "@/lib/prisma";
import { CLUB_REQUEST_STATUSES, type ClubRequestStatusValue } from "@/lib/club-requests";

export async function updateClubRequest(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as ClubRequestStatusValue;
  const adminNote = String(formData.get("adminNote") || "").trim().slice(0, 2000);
  if (!id || !CLUB_REQUEST_STATUSES.some((s) => s.value === status)) return;

  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.clubRequest.update({
    where: { id },
    data: { status, adminNote: adminNote || null },
  });
  revalidatePath("/admin/talepler");
}
