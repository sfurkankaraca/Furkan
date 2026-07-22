import { readEvents } from "@/lib/events";
import { readApplicationsByEvent, readContactInquiries } from "@/lib/admin/store";
import CSVDownloadButton from "@/components/CSVDownloadButton";

export const metadata = { title: "Admin — Formlar | noqta" };

export default async function AdminFormsPage({ searchParams }: { searchParams: { eventId?: string } }) {
  const events = await readEvents();
  const eventId = searchParams?.eventId || events[0]?.id || "";
  const applications = eventId ? await readApplicationsByEvent(eventId) : [];
  const contactInquiries = await readContactInquiries();

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Başvurular</h1>
        <p className="text-sm text-muted-foreground mt-1">Etkinlik başvuruları ve iletişim formları.</p>
      </div>

      {/* Etkinlik seçici */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <form className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-foreground">Etkinlik:</label>
          <select
            name="eventId"
            defaultValue={eventId}
            className="rounded-xl bg-background border border-border px-3 py-2 text-sm text-foreground"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
          <button className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition">
            Göster
          </button>
          <CSVDownloadButton csv={toCSV()} filename={`applications-${eventId}.csv`} />
        </form>
      </div>

      {/* Etkinlik başvuruları */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-foreground font-medium">Bu etkinliğe başvuru yok</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Etkinlik başvuruları</h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{applications.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">TARİH</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">AD</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">EMAIL</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">TELEFON</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">ŞEHİR</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">IG</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">NEDEN</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">MÜZİK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{new Date(a.createdAt).toLocaleString("tr-TR")}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{a.name}</td>
                    <td className="px-4 py-3 text-foreground/80">{a.email}</td>
                    <td className="px-4 py-3 text-foreground/80">{a.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.city}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.instagram}</td>
                    <td className="px-4 py-3 text-foreground/70 max-w-[160px] truncate">{a.mainReason}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{(a.musicGenres||[]).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* İletişim formları */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">İletişim formları</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{contactInquiries.length}</span>
        </div>
        {contactInquiries.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Henüz form yok</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">TARİH</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">TİP</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">AD</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">EMAIL</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">TELEFON</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">KONU</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">MESAJ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contactInquiries.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/20 transition-colors align-top">
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{new Date(c.createdAt).toLocaleString("tr-TR")}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary border border-border text-foreground uppercase">
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="px-4 py-3 text-foreground/80">{c.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-foreground/70">{c.subject}</td>
                    <td className="px-4 py-3 text-foreground/70 whitespace-pre-wrap max-w-[240px]">{c.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
