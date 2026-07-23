"use server";

import { addSubscriber } from "@/lib/admin/store";
import { sendNewsletterWelcomeMail } from "@/lib/mail/send";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeResult = { ok: boolean; message: string };

export async function subscribeNewsletter(_prev: SubscribeResult | null, formData: FormData): Promise<SubscribeResult> {
  const email = String(formData.get("email") || "").trim();
  const source = String(formData.get("source") || "journal");
  // Basit bot tuzağı: doldurulmuşsa sessizce başarı dön.
  const honeypot = String(formData.get("company") || "");
  if (honeypot) return { ok: true, message: "Teşekkürler!" };

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Geçerli bir e-posta adresi gir." };
  }

  try {
    const result = await addSubscriber(email, source);
    if (result === "already") {
      return { ok: true, message: "Zaten kayıtlısın — teşekkürler!" };
    }
    // Mail hatası aboneliği bozmasın.
    try {
      await sendNewsletterWelcomeMail({ email, source });
    } catch {
      /* yut */
    }
    return { ok: true, message: "Kaydolundu! Gelen kutunu kontrol et." };
  } catch {
    return { ok: false, message: "Bir şeyler ters gitti, tekrar dener misin?" };
  }
}
