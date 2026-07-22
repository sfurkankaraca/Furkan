declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Teklif formu gönderimi — “Fiyat teklifi isteyin” dönüşümü (Event snippet).
 * Sayfa yükünde değil, form başarıyla gönderildiğinde tetiklenir (doğru ölçüm).
 * İsterseniz `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO` ile başka bir send_to kullanın; `0` ile kapatın.
 */

const DEFAULT_SEND_TO = "AW-18042412380/gwHrCLKV76McENy6pZtD";

const DEDUPE_MS = 8000;
let lastFiredAt = 0;

function getConversionSendTo(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_SEND_TO?.trim();
  if (raw === "0" || raw === "false") return null;
  if (raw && /^AW-\d+\/.+/.test(raw)) return raw;
  if (raw) return null;
  return DEFAULT_SEND_TO;
}

export function fireTeklifFormGoogleAdsConversion(): void {
  if (typeof window === "undefined") return;
  const sendTo = getConversionSendTo();
  if (!sendTo) return;

  const now = Date.now();
  if (now - lastFiredAt < DEDUPE_MS) return;

  const gtag = window.gtag;
  if (typeof gtag !== "function") {
    if (process.env.NODE_ENV === "development") {
      console.warn("[google-ads] gtag yok; etiket yüklenene kadar bekleyin veya NEXT_PUBLIC_GOOGLE_ADS_ID ile base tag’i açın.");
    }
    return;
  }

  lastFiredAt = now;
  gtag("event", "conversion", {
    send_to: sendTo,
  });
}
