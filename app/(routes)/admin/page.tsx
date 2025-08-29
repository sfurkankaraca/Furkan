import { readMembers, readApplications } from "@/lib/admin/store";
import { readEvents } from "@/lib/events";

export const metadata = { title: "Admin | noqta" };

export default async function AdminHome() {
  async function deployAction() {
    "use server";
    const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!hookUrl) return { ok: false, error: "VERCEL_DEPLOY_HOOK_URL tanımlı değil" } as const;
    try {
      const res = await fetch(hookUrl, { method: "POST" });
      if (!res.ok) return { ok: false, error: `Hook hata: ${res.status}` } as const;
      return { ok: true } as const;
    } catch (e) {
      return { ok: false, error: "İstek atanamadı" } as const;
    }
  }

  const [members, applications, events] = await Promise.all([
    readMembers(),
    readApplications(),
    readEvents(),
  ]);
  const now = Date.now();
  const aWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const members7 = members.filter((m) => new Date(m.createdAt).getTime() >= aWeekAgo).length;
  const apps7 = applications.filter((a) => new Date(a.createdAt).getTime() >= aWeekAgo).length;

  const latestMembers = members.slice(0, 5);
  const latestApps = applications.slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <StatCard label="Toplam Üye" value={members.length} />
        <StatCard label="Son 7 Gün Üye" value={members7} />
        <StatCard label="Toplam Başvuru" value={applications.length} />
        <StatCard label="Son 7 Gün Başvuru" value={apps7} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-white font-medium mb-3">Son Üyeler</h3>
          <ul className="text-sm text-white/90 grid gap-2">
            {latestMembers.length === 0 ? <li className="text-white/60">Kayıt yok</li> : latestMembers.map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <span>{m.name}</span>
                <span className="text-white/50">{new Date(m.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-white font-medium mb-3">Son Başvurular</h3>
          <ul className="text-sm text-white/90 grid gap-2">
            {latestApps.length === 0 ? <li className="text-white/60">Kayıt yok</li> : latestApps.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <span>{a.name}</span>
                <span className="text-white/50">{new Date(a.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 grid gap-3">
        <h3 className="text-white font-medium">Hızlı Eylemler</h3>
        <div className="flex flex-wrap gap-2">
          <a href="/admin/events/new" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">Yeni Etkinlik</a>
          <a href="/admin/forms" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">Başvuruları Gör</a>
          <a href="/admin/members" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">Üyeleri Gör</a>
          <form action={deployAction} className="inline">
            <button type="submit" className="rounded-xl bg-white text-black px-3 py-1.5 text-sm">Deploy</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-white/60 text-sm">{label}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
    </div>
  );
}
