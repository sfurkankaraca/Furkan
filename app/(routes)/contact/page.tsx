import { sendContactMail } from "@/lib/mail/send";
import Section from "@/components/Section";

export const metadata = { title: "İletişim | noqta" };

export default function ContactPage() {
  async function action(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");
    await sendContactMail({ name, email, subject, message });
  }

  return (
    <Section title="İletişim" description="Bize mesaj bırakın.">
      <form action={action} className="grid gap-4">
        <label className="grid gap-2" htmlFor="name">
          <span className="text-sm text-white/80">Ad</span>
          <input id="name" name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Adınız" />
        </label>
        <label className="grid gap-2" htmlFor="email">
          <span className="text-sm text-white/80">E‑posta</span>
          <input id="email" type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="ornek@posta.com" />
        </label>
        <label className="grid gap-2" htmlFor="subject">
          <span className="text-sm text-white/80">Konu</span>
          <input id="subject" name="subject" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Kısa konu" />
        </label>
        <label className="grid gap-2" htmlFor="message">
          <span className="text-sm text-white/80">Mesaj</span>
          <textarea id="message" name="message" rows={6} required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Mesajınız" />
        </label>
        <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Gönder</button>
      </form>
    </Section>
  );
}
