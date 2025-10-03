import { readWorkshopApplicationsByKind } from "@/lib/admin/store";

export const metadata = { title: "Admin — Workshop Başvuruları | noqta" };

export default async function AdminWorkshopsPage({ searchParams }: { searchParams?: { kind?: string } }) {
  const kind = searchParams?.kind || "dj";
  const rows = await readWorkshopApplicationsByKind(kind);
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-medium">Workshop Başvuruları</h2>
      <form className="flex items-center gap-2">
        <label className="text-sm text-white/80">Workshop:</label>
        <select name="kind" defaultValue={kind} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white">
          <option value="dj">DJ Workshop</option>
          <option value="production">Müzik Prodüksiyon Workshop</option>
        </select>
        <button className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">Göster</button>
      </form>

      <div className="rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-left text-white/60">
              <th className="px-3 py-2">Tarih</th>
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">E‑posta</th>
              <th className="px-3 py-2">Telefon</th>
              <th className="px-3 py-2">Şehir</th>
              <th className="px-3 py-2">Instagram</th>
              <th className="px-3 py-2">Cevaplar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="px-3 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{r.phone || "-"}</td>
                <td className="px-3 py-2">{r.city || "-"}</td>
                <td className="px-3 py-2">{r.instagram || "-"}</td>
                <td className="px-3 py-2">
                  <div className="text-white/80 max-w-[480px] truncate">
                    {Object.entries(r.answers || {}).map(([k, v]) => `${k}: ${v}`).join(" | ")}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


