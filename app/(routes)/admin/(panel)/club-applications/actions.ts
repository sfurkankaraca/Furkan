"use server";

import { redirect } from "next/navigation";
import {
  getNoqtaClubApplicationById,
  setNoqtaClubStatus,
} from "@/lib/admin/store";
import {
  sendNoqtaClubApprovedMail,
  sendNoqtaClubRejectedMail,
} from "@/lib/mail/send";

export async function approveNoqtaClubApplication(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) redirect("/admin/club-applications");

  const app = await getNoqtaClubApplicationById(id);
  if (!app) redirect("/admin/club-applications");
  if (app.status !== "pending") redirect("/admin/club-applications");

  await setNoqtaClubStatus({
    id,
    status: "approved",
  });

  await sendNoqtaClubApprovedMail({ name: app.name, email: app.email });
  redirect("/admin/club-applications");
}

export async function rejectNoqtaClubApplication(formData: FormData) {
  const id = String(formData.get("id") || "");
  const rejectionNote = String(formData.get("rejectionNote") || "").trim();
  if (!id) redirect("/admin/club-applications");

  const app = await getNoqtaClubApplicationById(id);
  if (!app) redirect("/admin/club-applications");
  if (app.status !== "pending") redirect("/admin/club-applications");

  await setNoqtaClubStatus({
    id,
    status: "rejected",
    rejectionNote,
  });

  // Opsiyonel e-posta: istersen bunu kaldırabiliriz.
  await sendNoqtaClubRejectedMail({ name: app.name, email: app.email });
  redirect("/admin/club-applications");
}

