import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { AdminPrismaErrorCard } from "@/lib/admin/admin-prisma-fallback";

export const metadata = { title: "Siparişler | Admin" };

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};
const STATUS_LABELS: Record<string, string> = {
  paid: "Ödendi", pending: "Bekliyor", failed: "Başarısız",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status || "";
  const q = (sp.q || "").trim();
  const prisma = getPrisma();

  if (!prisma) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Siparişler</h1>
          <p className="text-sm text-muted-foreground mt-1">Ödeme ve bilet kayıtları.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
          <code className="text-amber-800">DATABASE_URL</code> gerekli.
        </div>
      </div>
    );
  }

  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  try {
    orders = await prisma.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q
          ? {
              OR: [
                { eventId: { contains: q, mode: "insensitive" } },
                { eventTitle: { contains: q, mode: "insensitive" } },
                { user: { email: { contains: q, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
  } catch (e) {
    console.error("[admin/orders] prisma", e);
    return <AdminPrismaErrorCard title="Siparişler" subtitle="Ödeme ve bilet kayıtları." />;
  }

  const revenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amountKurus, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Siparişler</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ödenen ciro (bu sayfa):{" "}
            <span className="text-emerald-600 font-medium">{(revenue / 100).toFixed(2)} TRY</span>
          </p>
        </div>
        <form className="flex flex-wrap gap-2" action="/admin/orders" method="get">
          <input type="hidden" name="status" value={status} />
          <input
            name="q"
            defaultValue={q}
            placeholder="E-posta, etkinlik ara…"
            className="rounded-xl bg-white border border-border px-3 py-2 text-sm text-foreground min-w-[200px]"
          />
          <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition">
            Ara
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {["", "paid", "pending", "failed"].map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`rounded-full px-3 py-1.5 border text-xs font-medium transition ${
              (status || "") === s
                ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {s === "" ? "Tümü" : STATUS_LABELS[s] ?? s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-4xl mb-4">🧾</p>
          <p className="text-foreground font-medium">Sipariş yok</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/40">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">TARİH</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">MÜŞTERİ</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">ETKİNLİK</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">ADET</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">TUTAR</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground tracking-wide">DURUM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/customers/${o.userId}`} className="text-fuchsia-600 hover:underline text-sm font-medium">
                        {o.user.email}
                      </Link>
                      {o.user.name ? <div className="text-xs text-muted-foreground">{o.user.name}</div> : null}
                    </td>
                    <td className="px-4 py-3 text-foreground/70 max-w-[200px] truncate text-sm">
                      {o.eventTitle || o.eventId}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{o.quantity}</td>
                    <td className="px-4 py-3 text-foreground text-sm font-medium">
                      {(o.amountKurus / 100).toFixed(2)} ₺
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[o.status] ?? "bg-secondary text-foreground border-border"}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
