import { CLUB_SUBSCRIPTION_EXTEND_DAYS } from "@/lib/club-subscription/constants";

type Tx = {
  clubSubscription: {
    upsert: (args: {
      where: { userId: string };
      create: { userId: string; periodEnd: Date };
      update: { periodEnd: Date };
    }) => Promise<unknown>;
    findUnique: (args: { where: { userId: string } }) => Promise<{ periodEnd: Date } | null>;
  };
};

/** Mevcut dönem bitmeden yenilersen süre üst üste eklenir. */
export async function extendClubSubscriptionPeriod(tx: Tx, userId: string): Promise<void> {
  const now = new Date();
  const existing = await tx.clubSubscription.findUnique({ where: { userId } });
  const base =
    existing && existing.periodEnd.getTime() > now.getTime() ? existing.periodEnd : now;
  const periodEnd = new Date(base);
  periodEnd.setDate(periodEnd.getDate() + CLUB_SUBSCRIPTION_EXTEND_DAYS);

  await tx.clubSubscription.upsert({
    where: { userId },
    create: { userId, periodEnd },
    update: { periodEnd },
  });
}
