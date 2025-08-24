import { readEvents, writeEvents, slugify } from "@/lib/events";
import { sendAdminEventMail } from "@/lib/mail/send";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Yeni Etkinlik | noqta" };

export default function AdminNewEventPage() {
  async function action(_prev: unknown, formData: FormData) {
    "use server";
    const title = String(formData.get("title") || "");
    const date = String(formData.get("date") || "");
    const city = String(formData.get("city") || "");
    const venue = String(formData.get("venue") || "");
    const ctaUrlRaw = String(formData.get("ctaUrl") || "");
    const image = String(formData.get("image") || "");

    if (!title || !date || !city) {
      return { ok: false, error: "Zorunlu alanları doldurun" } as const;
    }

    const ctaUrl = ctaUrlRaw || "/events/apply";

    const id = `${slugify(title)}-${date.slice(0, 10)}`;
    const next = await readEvents();
    next.unshift({ id, title, date: new Date(date).toISOString(), city, venue: venue || undefined, ctaUrl, image: image || undefined });
    await writeEvents(next);

    await sendAdminEventMail({ title, date, city, venue: venue || undefined, ctaUrl, image: image || undefined, note: "Yeni etkinlik eklendi" });

    redirect("/admin/events");
  }

  return (
    <form action={action} className="grid gap-4 max-w-xl">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm text-white/80">Başlık *</label>
        <input id="title" name="title" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Etkinlik adı" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="date" className="text-sm text-white/80">Tarih *</label>
        <input id="date" name="date" type="datetime-local" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="city" className="text-sm text-white/80">Şehir *</label>
        <input id="city" name="city" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" placeholder="Şehir" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="venue" className="text-sm text-white/80">Mekan</label>
        <input id="venue" name="venue" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" placeholder="Mekan" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="ctaUrl" className="text-sm text-white/80">CTA URL</label>
        <input id="ctaUrl" name="ctaUrl" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" placeholder="https://... (boş bırakılırsa /events/apply)" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="image" className="text-sm text-white/80">Görsel URL</label>
        <input id="image" name="image" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30" placeholder="/events/....webp" />
      </div>

      <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Kaydet</button>
    </form>
  );
}
