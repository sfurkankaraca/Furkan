import { readEvents } from "@/lib/events";
import { readApplicationsByEvent } from "@/lib/admin/store";
import CSVDownloadButton from "@/components/CSVDownloadButton";

export const metadata = { title: "Admin — Formlar | noqta" };

export default async function AdminFormsPage({ searchParams }: { searchParams: { eventId?: string } }) {
  const events = await readEvents();
  const eventId = searchParams?.eventId || events[0]?.id || "";
  const applications = eventId ? await readApplicationsByEvent(eventId) : [];

  function toCSV() {
    const header = [
      "createdAt","name","email","phone","birthDate","city","mainReason","musicGenres","djExcitement","hasCar","instagram","consentLocation","consentInstructions","referrer"
    ];
    const rows = applications.map(a => [
      a.createdAt,a.name,a.email,a.phone,a.birthDate,a.city,a.mainReason,(a.musicGenres||[]).join(";"),a.djExcitement,a.hasCar ? "yes" : "no",a.instagram,a.consentLocation?"yes":"no",a.consentInstructions?"yes":"no",a.referrer||""
    ]);
    return [header, ...rows].map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-medium">Formlar</h2>
      <form className="flex items-center gap-2">
        <label className="text-sm text-white/80">Etkinlik:</label>
        <select name="eventId" defaultValue={eventId} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white">
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
        <button className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">Göster</button>
        <CSVDownloadButton csv={toCSV()} filename={`applications-${eventId}.csv`} />
      </form>

      <div className="rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[1000px]">
          <thead>
            <tr className="text-left text-white/60">
              <th className="px-3 py-2">Tarih</th>
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Telefon</th>
              <th className="px-3 py-2">Şehir</th>
              <th className="px-3 py-2">IG</th>
              <th className="px-3 py-2">Neden</th>
              <th className="px-3 py-2">Müzik</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="px-3 py-2">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2">{a.name}</td>
                <td className="px-3 py-2">{a.email}</td>
                <td className="px-3 py-2">{a.phone}</td>
                <td className="px-3 py-2">{a.city}</td>
                <td className="px-3 py-2">{a.instagram}</td>
                <td className="px-3 py-2">{a.mainReason}</td>
                <td className="px-3 py-2">{(a.musicGenres||[]).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
