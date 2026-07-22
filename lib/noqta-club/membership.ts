import { getNoqtaClubApplicationByEmail, type NoqtaClubStatus } from "@/lib/admin/store";

export async function getNoqtaClubStatusForEmail(email: string): Promise<NoqtaClubStatus | null> {
  const app = await getNoqtaClubApplicationByEmail(email);
  return app?.status ?? null;
}

export async function isNoqtaClubApproved(email: string): Promise<boolean> {
  const status = await getNoqtaClubStatusForEmail(email);
  return status === "approved";
}

