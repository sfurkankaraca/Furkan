import { readEvents } from "@/lib/events";

export const metadata = { title: "Admin — Etkinlikler | noqta" };

export default async function AdminEventsList() {
  const events = await readEvents();
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Etkinlikler</h2>
        <a href="/admin/events/new" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">Yeni</a>
      </div>
      <div className="rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/60">
              <th className="px-3 py-2">Başlık</th>
              <th className="px-3 py-2">Tarih</th>
              <th className="px-3 py-2">Şehir</th>
              <th className="px-3 py-2">CTA</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-t border-white/10">
                <td className="px-3 py-2">{e.title}</td>
                <td className="px-3 py-2">{new Date(e.date).toLocaleString()}</td>
                <td className="px-3 py-2">{e.city}</td>
                <td className="px-3 py-2">
                  {e.ctaUrl ? <a className="underline" href={e.ctaUrl} target="_blank">link</a> : <span className="text-white/40">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
