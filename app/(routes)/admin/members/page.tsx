import { readMembers, setMemberBanned, type Member } from "@/lib/admin/store";
import { sendContactMail } from "@/lib/mail/send";

export const metadata = { title: "Admin — Üyeler | noqta" };

export default async function AdminMembersPage() {
  const members = await readMembers();

  async function banAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const banned = String(formData.get("banned") || "false") === "true";
    await setMemberBanned(id, !banned);
  }

  async function messageAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const email = String(formData.get("email") || "");
    const name = String(formData.get("name") || "");
    const subject = String(formData.get("subject") || "noqta");
    const message = String(formData.get("message") || "");
    if (!email) return;
    await sendContactMail({ name, email, subject, message });
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-medium">Üyeler</h2>
      <div className="rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-white/60">
              <th className="px-3 py-2">Ad</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Şehir</th>
              <th className="px-3 py-2">İnstagram</th>
              <th className="px-3 py-2">Durum</th>
              <th className="px-3 py-2">İşlem</th>
              <th className="px-3 py-2">Mesaj</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m: Member) => (
              <tr key={m.id} className="border-t border-white/10 align-top">
                <td className="px-3 py-2">{m.name}</td>
                <td className="px-3 py-2">{m.email}</td>
                <td className="px-3 py-2">{m.city || "—"}</td>
                <td className="px-3 py-2">{m.instagram || "—"}</td>
                <td className="px-3 py-2">{m.banned ? <span className="text-red-400">Banlı</span> : <span className="text-green-400">Aktif</span>}</td>
                <td className="px-3 py-2">
                  <form action={banAction} className="inline">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="banned" value={String(m.banned)} />
                    <button className="rounded-xl bg-white text-black px-2 py-1 text-xs">{m.banned ? "Banı Kaldır" : "Banla"}</button>
                  </form>
                </td>
                <td className="px-3 py-2">
                  <form action={messageAction} className="grid gap-2">
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="email" value={m.email} />
                    <input type="hidden" name="name" value={m.name} />
                    <input name="subject" placeholder="Konu" className="rounded-xl bg-black border border-white/20 px-2 py-1 text-white" />
                    <textarea name="message" rows={2} placeholder="Mesaj" className="rounded-xl bg-black border border-white/20 px-2 py-1 text-white" />
                    <button className="rounded-xl bg-white text-black px-2 py-1 text-xs">Gönder</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
