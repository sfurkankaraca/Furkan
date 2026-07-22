import type { PrismaClient } from "@/lib/generated/prisma/client";
import { isNoqtaClubApproved } from "@/lib/noqta-club/membership";

export type ClubAccessState = {
  applicationApproved: boolean;
  subscriptionActive: boolean;
  /** Başvuru onaylı ve abonelik süresi dolmamış */
  fullMember: boolean;
  periodEnd: string | null;
};

export async function getClubAccessForUser(
  prisma: PrismaClient | null,
  userId: string,
  email: string
): Promise<ClubAccessState> {
  const applicationApproved = await isNoqtaClubApproved(email);
  if (!prisma) {
    return {
      applicationApproved,
      subscriptionActive: false,
      fullMember: false,
      periodEnd: null,
    };
  }
  const sub = await prisma.clubSubscription.findUnique({ where: { userId } });
  const now = Date.now();
  const subscriptionActive = Boolean(sub && sub.periodEnd.getTime() > now);
  return {
    applicationApproved,
    subscriptionActive,
    fullMember: applicationApproved && subscriptionActive,
    periodEnd: sub ? sub.periodEnd.toISOString() : null,
  };
}
