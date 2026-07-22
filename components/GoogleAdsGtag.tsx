import Script from "next/script";

const DEFAULT_ID = "AW-18042412380";

function resolveGoogleAdsId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
  if (raw === "0" || raw === "false") return null;
  if (raw && /^AW-\d+$/.test(raw)) return raw;
  if (raw) return null;
  return process.env.NODE_ENV === "production" ? DEFAULT_ID : null;
}

/** Google Ads dönüşüm etiketi (gtag.js) — yalnızca script; sayfa içeriğinde görünmez. */
export function GoogleAdsGtag() {
  const id = resolveGoogleAdsId();
  if (!id) return null;

  const inline = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)});
`.trim();

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`} strategy="afterInteractive" />
      <Script id="google-ads-gtag-init" strategy="afterInteractive">
        {inline}
      </Script>
    </>
  );
}
