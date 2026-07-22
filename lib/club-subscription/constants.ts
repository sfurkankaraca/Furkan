/** Sipariş kaydında kulüp aboneliği ödemesini ayırt etmek için sabit eventId */
export const CLUB_SUBSCRIPTION_EVENT_ID = "noqta-club-monthly-sub";

export const CLUB_SUBSCRIPTION_EXTEND_DAYS = 30;

export function getClubSubscriptionPriceTry(): number {
  const n = Number(process.env.CLUB_SUBSCRIPTION_PRICE_TRY ?? "0");
  return Number.isFinite(n) && n > 0 ? n : 0;
}
