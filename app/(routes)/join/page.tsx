import { sendContactMail } from "@/lib/mail/send";
import { readMembers, writeMembers, memberIdFromEmail } from "@/lib/members";
import Section from "@/components/Section";

export const metadata = { title: "Kaybol | noqta" };

export default function JoinPage() {
  async function action(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const note = String(formData.get("note") || "");
    const gender = String(formData.get("gender") || "");
    const age = String(formData.get("age") || "");
    const city = String(formData.get("city") || "");
    const phone = String(formData.get("phone") || "");
    const instagram = String(formData.get("instagram") || "");
    const hasCar = String(formData.get("hasCar") || "no");
    const tastes = String(formData.get("tastes") || "");

    const message = `Gender: ${gender}\nAge: ${age}\nCity: ${city}\nPhone: ${phone}\nInstagram: ${instagram}\nHasCar: ${hasCar}\nTastes: ${tastes}\n\n${note}`;
    await sendContactMail({ name, email, subject: "Membership", message });

    // Diske kaydet
    if (name && email) {
      const list = await readMembers();
      const id = memberIdFromEmail(email);
      const createdAt = new Date().toISOString();
      const next = list.filter((m) => m.id !== id);
      next.unshift({
        id,
        name,
        email,
        gender: gender || undefined,
        age: age ? Number(age) : undefined,
        city: city || undefined,
        phone: phone || undefined,
        instagram: instagram || undefined,
        hasCar: hasCar === "yes" ? "yes" : "no",
        tastes: tastes || undefined,
        note: note || undefined,
        createdAt,
      });
      await writeMembers(next);
    }

    // Otomatik yeniden yayın (Deploy Hook varsa)
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      try { await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, { method: "POST" }); } catch {}
    }
  }

  return (
    <Section title="Kaybol" description="Join the circle. leave a few details.">
      <form action={action} className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2" htmlFor="name">
            <span className="text-sm text-white/80">Name</span>
            <input id="name" name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Your name" />
          </label>
          <label className="grid gap-2" htmlFor="email">
            <span className="text-sm text-white/80">Email</span>
            <input id="email" type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="you@mail.com" />
          </label>
          <label className="grid gap-2" htmlFor="gender">
            <span className="text-sm text-white/80">Gender</span>
            <select id="gender" name="gender" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30">
              <option value="">Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="nonbinary">Nonbinary</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="grid gap-2" htmlFor="age">
            <span className="text-sm text-white/80">Age</span>
            <input id="age" name="age" type="number" min="16" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="" />
          </label>
          <label className="grid gap-2" htmlFor="city">
            <span className="text-sm text-white/80">City</span>
            <input id="city" name="city" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="" />
          </label>
          <label className="grid gap-2" htmlFor="phone">
            <span className="text-sm text-white/80">Phone</span>
            <input id="phone" name="phone" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="+90 ..." />
          </label>
          <label className="grid gap-2" htmlFor="instagram">
            <span className="text-sm text-white/80">Instagram</span>
            <input id="instagram" name="instagram" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="@handle" />
          </label>
          <label className="grid gap-2" htmlFor="hasCar">
            <span className="text-sm text-white/80">Car available?</span>
            <select id="hasCar" name="hasCar" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2" htmlFor="tastes">
          <span className="text-sm text-white/80">What do you listen to?</span>
          <input id="tastes" name="tastes" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="ambient, dub techno, minimal, ..." />
        </label>
        <label className="grid gap-2" htmlFor="note">
          <span className="text-sm text-white/80">Note (optional)</span>
          <textarea id="note" name="note" rows={6} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Tell us a bit about yourself" />
        </label>
        <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Kaybol</button>
      </form>
    </Section>
  );
} 