"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";

async function assertAdmin() {
  const jar = await cookies();
  if (jar.get("admin")?.value !== "1") {
    throw new Error("Yetkisiz");
  }
}

export async function updateCustomerAdminNotes(formData: FormData) {
  await assertAdmin();
  const userId = String(formData.get("userId") || "");
  const adminNotes = String(formData.get("adminNotes") || "");
  if (!userId) return { ok: false as const, error: "userId" };

  const prisma = getPrisma();
  if (!prisma) return { ok: false as const, error: "db" };

  await prisma.userProfile.upsert({
    where: { userId },
    create: { userId, adminNotes: adminNotes || null },
    update: { adminNotes: adminNotes || null },
  });

  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath("/admin/customers");
  return { ok: true as const };
}
