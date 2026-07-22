import { readMembers, setMemberBanned, type Member } from "@/lib/admin/store";
import { sendContactMail } from "@/lib/mail/send";
import { ContentCard } from "@/components/layout/PageShell";
import { getPrisma } from "@/lib/prisma";

export const metadata = { title: "Admin — Üyeler | noqta" };

export default async function AdminMembersPage() {
  const members = await readMembers();
  const prisma = getPrisma();
  const subscriptionUsers = prisma
    ? await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
        select: {
          id: true,
          email: true,
          name: true,
          clubSubscription: { select: { periodEnd: true } },
        },
      })
    : [];

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

  async function membershipAction(formData: FormData) {
    "use server";
    const prisma = getPrisma();
    if (!prisma) return;
    const userId = String(formData.get("userId") || "");
    const action = String(formData.get("action") || "");
    if (!userId || !action) return;

    if (action === "deactivate") {
      await prisma.clubSubscription.upsert({
        where: { userId },
        create: { userId, periodEnd: new Date(0) },
        update: { periodEnd: new Date(0) },
      });
      return;
    }

    if (action === "extend30") {
      const current = await prisma.clubSubscription.findUnique({ where: { userId } });
      const now = new Date();
      const base = current?.periodEnd && current.periodEnd > now ? current.periodEnd : now;
      const next = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);
      await prisma.clubSubscription.upsert({
        where: { userId },
        create: { userId, periodEnd: next },
        update: { periodEnd: next },
      });
      return;
    }

    if (action === "setDate") {
      const raw = String(formData.get("periodEnd") || "");
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return;
      await prisma.clubSubscription.upsert({
        where: { userId },
        create: { userId, periodEnd: d },
        update: { periodEnd: d },
      });
    }
  }

  return (
    <ContentCard className="p-6 md:p-8">
      <div className="grid gap-8">
        <h2 className="text-xl font-semibold text-foreground">Üyeler</h2>

        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-secondary/40">
              <tr className="text-left text-muted-foreground">
                <th className="px-3 py-2.5 font-medium">Ad</th>
                <th className="px-3 py-2.5 font-medium">Email</th>
                <th className="px-3 py-2.5 font-medium">Şehir</th>
                <th className="px-3 py-2.5 font-medium">İnstagram</th>
                <th className="px-3 py-2.5 font-medium">Durum</th>
                <th className="px-3 py-2.5 font-medium">İşlem</th>
                <th className="px-3 py-2.5 font-medium">Mesaj</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m: Member) => (
                <tr key={m.id} className="border-t border-border align-top hover:bg-muted/20">
                  <td className="px-3 py-2.5 text-foreground">{m.name}</td>
                  <td className="px-3 py-2.5 text-foreground">{m.email}</td>
                  <td className="px-3 py-2.5 text-foreground">{m.city || "—"}</td>
                  <td className="px-3 py-2.5 text-foreground">{m.instagram || "—"}</td>
                  <td className="px-3 py-2.5">
                    {m.banned
                      ? <span className="text-red-600 font-medium">Banlı</span>
                      : <span className="text-emerald-600 font-medium">Aktif</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    <form action={banAction} className="inline">
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="banned" value={String(m.banned)} />
                      <button className="rounded-lg bg-foreground text-background px-2.5 py-1 text-xs font-medium hover:opacity-80 transition">
                        {m.banned ? "Banı Kaldır" : "Banla"}
                      </button>
                    </form>
                  </td>
                  <td className="px-3 py-2.5">
                    <form action={messageAction} className="grid gap-1.5">
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="email" value={m.email} />
                      <input type="hidden" name="name" value={m.name} />
                      <input
                        name="subject"
                        placeholder="Konu"
                        className="rounded-lg border border-border bg-background px-2 py-1 text-foreground text-xs placeholder:text-muted-foreground"
                      />
                      <textarea
                        name="message"
                        rows={2}
                        placeholder="Mesaj"
                        className="rounded-lg border border-border bg-background px-2 py-1 text-foreground text-xs placeholder:text-muted-foreground"
                      />
                      <button className="rounded-lg bg-foreground text-background px-2 py-1 text-xs font-medium hover:opacity-80 transition">
                        Gönder
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold text-foreground">Üyelik yönetimi</h2>
          {!prisma ? (
            <p className="text-sm text-amber-700 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              Veritabanı bağlantısı yok. Üyelik kontrolleri devre dışı.
            </p>
          ) : (
            <div className="rounded-xl border border-border overflow-x-auto">
              <table className="w-full text-sm min-w-[760px]">
                <thead className="bg-secondary/40">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2.5 font-medium">Kullanıcı</th>
                    <th className="px-3 py-2.5 font-medium">Email</th>
                    <th className="px-3 py-2.5 font-medium">Durum</th>
                    <th className="px-3 py-2.5 font-medium">Bitiş</th>
                    <th className="px-3 py-2.5 font-medium">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptionUsers.map((u) => {
                    const periodEnd = u.clubSubscription?.periodEnd ?? null;
                    const active = !!periodEnd && new Date(periodEnd).getTime() > Date.now();
                    const dtLocal = periodEnd
                      ? new Date(periodEnd.getTime() - periodEnd.getTimezoneOffset() * 60000)
                          .toISOString()
                          .slice(0, 16)
                      : "";
                    return (
                      <tr key={u.id} className="border-t border-border align-top hover:bg-muted/20">
                        <td className="px-3 py-2.5 text-foreground">{u.name || "—"}</td>
                        <td className="px-3 py-2.5 text-foreground">{u.email}</td>
                        <td className="px-3 py-2.5">
                          {active
                            ? <span className="text-emerald-600 font-medium">Aktif</span>
                            : <span className="text-muted-foreground">Pasif</span>}
                        </td>
                        <td className="px-3 py-2.5 text-foreground">
                          {periodEnd ? new Date(periodEnd).toLocaleString("tr-TR") : "—"}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-wrap gap-1.5">
                            <form action={membershipAction} className="inline">
                              <input type="hidden" name="userId" value={u.id} />
                              <input type="hidden" name="action" value="extend30" />
                              <button className="rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 text-xs font-medium border border-emerald-200 hover:bg-emerald-100 transition">
                                +30 gün
                              </button>
                            </form>
                            <form action={membershipAction} className="inline">
                              <input type="hidden" name="userId" value={u.id} />
                              <input type="hidden" name="action" value="deactivate" />
                              <button className="rounded-lg bg-red-50 text-red-600 px-2.5 py-1 text-xs font-medium border border-red-200 hover:bg-red-100 transition">
                                Pasife al
                              </button>
                            </form>
                          </div>
                          <form action={membershipAction} className="mt-2 flex items-center gap-2">
                            <input type="hidden" name="userId" value={u.id} />
                            <input type="hidden" name="action" value="setDate" />
                            <input
                              type="datetime-local"
                              name="periodEnd"
                              defaultValue={dtLocal}
                              className="rounded-lg border border-border bg-background px-2 py-1 text-foreground text-xs"
                            />
                            <button className="rounded-lg bg-foreground text-background px-2.5 py-1 text-xs font-medium hover:opacity-80 transition">
                              Tarih ayarla
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ContentCard>
  );
}
