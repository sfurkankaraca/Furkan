import { readMembers } from "@/lib/members";

export const metadata = { title: "Admin — Üyeler | noqta" };

export default async function AdminMembersList() {
  const members = await readMembers();
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Üyeler</h2>
        <div className="text-sm text-white/60">Toplam {members.length}</div>
      </div>
      <div className="rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-white/60">
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">E‑posta</th>
              <th className="px-3 py-2">Şehir</th>
              <th className="px-3 py-2">Instagram</th>
              <th className="px-3 py-2">Araba</th>
              <th className="px-3 py-2">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-white/10">
                <td className="px-3 py-2">{m.name}</td>
                <td className="px-3 py-2">{m.email}</td>
                <td className="px-3 py-2">{m.city || <span className="text-white/40">—</span>}</td>
                <td className="px-3 py-2">{m.instagram || <span className="text-white/40">—</span>}</td>
                <td className="px-3 py-2">{m.hasCar === "yes" ? "Evet" : "Hayır"}</td>
                <td className="px-3 py-2">{new Date(m.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


