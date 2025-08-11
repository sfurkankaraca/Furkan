import { sendContactMail } from "@/lib/mail/send";
import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "İletişim | noqta" };

export default function ContactPage() {
  async function action(_prev: any, formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");
    try {
      const result = await sendContactMail({ name, email, subject, message });
      if (!result.ok) return { ok: false, error: "E‑posta gönderilemedi" } as const;
      return { ok: true } as const;
    } catch (e: any) {
      return { ok: false, error: "Sunucu hatası" } as const;
    }
  }

  return (
    <Section title="İletişim" description="Bize mesaj bırakın.">
      <ContactForm action={action} />
    </Section>
  );
}
