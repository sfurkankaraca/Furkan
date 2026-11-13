/**
 * TİCARİ ELEKTRONİK İLETİ ONAYI (6563 sayılı Kanun) — noqt.club tarafı.
 *
 * Onay KVKK aydınlatmasından AYRIDIR, varsayılanı kapalıdır. Kayıtta onay
 * zamanı ve metin sürümü saklanır (bülten: subscribers.json, kulüp başvurusu:
 * noqta-club-applications.json) ve noqt social'ın Firestore'una eşitlenir
 * (`marketingContactSync`, eventmatch/functions/src/marketing.ts). Etkinlik
 * e-postaları oradan, onaylı ortak listeye ve tek tık çıkış bağlantısıyla gider.
 *
 * Sürüm ve metin eventmatch `MARKETING_CONSENT_VERSION` / `MARKETING_CONSENT_TEXT`
 * ile AYNI tutulmalı.
 */
export const MARKETING_CONSENT_VERSION = "2026-11-13";

export const MARKETING_CONSENT_TEXT_TR =
  "noqt social ve noqt club etkinlik duyuruları ile tanıtım e-postaları almak istiyorum " +
  "(6563 sayılı Kanun kapsamında ticari elektronik ileti onayı). Her e-postadaki bağlantıdan " +
  "istediğim zaman vazgeçebilirim.";

export const MARKETING_CONSENT_TEXT_EN =
  "I want to receive noqt social and noqt club event announcements and promotional emails " +
  "(consent to commercial electronic messages under Turkish Law No. 6563). I can withdraw " +
  "at any time from the link in every email.";

export type MarketingConsentSource = "noqt.club/newsletter" | "noqt.club/club-application";

const DEFAULT_SYNC_URL =
  "https://europe-west1-eventmatch-bd8ad.cloudfunctions.net/marketingContactSync";

/**
 * Onayı noqt social'a eşitler. Gizli anahtar yoksa ya da istek düşerse
 * SESSİZCE geçer (kayıt yerelde zaten saklandı; kurucu sonradan
 * admin panelindeki listeyle tamamlayabilir) — formu asla bozmaz.
 */
export async function syncMarketingConsent(input: {
  email: string;
  consent: boolean;
  consentAt: string;
  source: MarketingConsentSource;
}): Promise<boolean> {
  const secret = process.env.MARKETING_SYNC_SECRET;
  if (!secret) return false;
  try {
    const res = await fetch(process.env.MARKETING_SYNC_URL || DEFAULT_SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-noqt-sync-secret": secret },
      body: JSON.stringify({
        email: input.email,
        consent: input.consent,
        consentAt: input.consentAt,
        version: MARKETING_CONSENT_VERSION,
        source: input.source,
      }),
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
