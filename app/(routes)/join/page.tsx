import { sendContactMail } from "@/lib/mail/send";
import Section from "@/components/Section";

export const metadata = { title: "Kaybol | noqta" };

export default function JoinPage() {
  async function action(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const note = String(formData.get("note") || "");
    await sendContactMail({ name, email, subject: "Membership", message: note });
  }

  return (
    <Section title="Kaybol" description="Kolektife katılmak için bilgilerini bırak.">
      <form action={action} className="grid gap-4">
        <label className="grid gap-2" htmlFor="name">
          <span className="text-sm text-white/80">Ad</span>
          <input id="name" name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Adınız" />
        </label>
        <label className="grid gap-2" htmlFor="email">
          <span className="text-sm text-white/80">E‑posta</span>
          <input id="email" type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="ornek@posta.com" />
        </label>
        <label className="grid gap-2" htmlFor="note">
          <span className="text-sm text-white/80">Not (isteğe bağlı)</span>
          <textarea id="note" name="note" rows={6} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Kısaca kendinden bahset" />
        </label>
        <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Kaybol</button>
      </form>
    </Section>
  );
} 