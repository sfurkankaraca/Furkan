"use server";

import { addSubscriber } from "@/lib/admin/store";
import { sendNewsletterWelcomeMail } from "@/lib/mail/send";
import { MARKETING_CONSENT_VERSION, syncMarketingConsent } from "@/lib/marketing/consent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = { ok: boolean; message: string };

export async function subscribeNewsletter(_prev: SubscribeResult | null, formData: FormData): Promise<SubscribeResult> {
  const email = String(formData.get("email") || "").trim();
  const source = String(formData.get("source") || "journal");
  // Basit bot tuzağı: doldurulmuşsa sessizce başarı dön.
  const en = String(formData.get("lang") || "") === "en";
  const m = (tr: string, enText: string) => (en ? enText : tr);
  const honeypot = String(formData.get("company") || "");
  if (honeypot) return { ok: true, message: m("Teşekkürler!", "Thanks!") };

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: m("Geçerli bir e-posta adresi gir.", "Enter a valid email address.") };
  }

  // Bülten = duyuru/tanıtım e-postası → ticari ileti onayı ŞART (6563).
  // Kutu formda varsayılan boş; işaretlenmeden abonelik alınmaz.
  if (formData.get("marketingConsent") !== "on") {
    return {
      ok: false,
      message: m(
        "Bülten e-postaları için onay kutusunu işaretlemelisin.",
        "Please tick the consent box to receive newsletter emails."
      ),
    };
  }
  const consentAt = new Date().toISOString();

  try {
    const result = await addSubscriber(email, source, { at: consentAt, version: MARKETING_CONSENT_VERSION });
    await syncMarketingConsent({ email, consent: true, consentAt, source: "noqt.club/newsletter" });
    if (result === "already") {
      return { ok: true, message: m("Zaten kayıtlısın — teşekkürler!", "You're already subscribed — thanks!") };
    }
    // Mail hatası aboneliği bozmasın.
    try {
      await sendNewsletterWelcomeMail({ email, source });
    } catch {
      /* yut */
    }
    return { ok: true, message: m("Kaydolundu! Gelen kutunu kontrol et.", "You're in! Check your inbox.") };
  } catch {
    return { ok: false, message: m("Bir şeyler ters gitti, tekrar dener misin?", "Something went wrong, please try again.") };
  }
}
