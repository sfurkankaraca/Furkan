import Link from "next/link";
import { readMembers, readApplications } from "@/lib/admin/store";
import { readEvents } from "@/lib/events";
import { getPrisma } from "@/lib/prisma";
import { ContentCard } from "@/components/layout/PageShell";
import { triggerDeployAction } from "./deploy-action";

export const metadata = { title: "Özet | Admin" };

export default async function AdminDashboardPage() {
  let members: Awaited<ReturnType<typeof readMembers>> = [];
  let applications: Awaited<ReturnType<typeof readApplications>> = [];
  let events: Awaited<ReturnType<typeof readEvents>> = [];
  try {
    [members, applications, events] = await Promise.all([
      readMembers(),
      readApplications(),
      readEvents(),
    ]);
  } catch (e) {
    console.error("[admin/dashboard] store/events read", e);
  }

  const prisma = getPrisma();
  let dbStats = {
    customers: 0,
    profilesComplete: 0,
    ordersPaid: 0,
    ordersPending: 0,
    tickets: 0,
    revenueKurus: 0,
  };
  let dbError: string | null = null;
  if (prisma) {
    try {
      const [customers, profilesComplete, ordersPaid, ordersPending, tickets, agg] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { profileCompletedAt: { not: null } } }),
        prisma.order.count({ where: { status: "paid" } }),
        prisma.order.count({ where: { status: "pending" } }),
        prisma.ticket.count(),
        prisma.order.aggregate({
          where: { status: "paid" },
          _sum: { amountKurus: true },
        }),
      ]);
      dbStats = {
        customers,
        profilesComplete,
        ordersPaid,
        ordersPending,
        tickets,
        revenueKurus: agg._sum.amountKurus || 0,
      };
    } catch (e) {
      console.error("[admin/dashboard] prisma", e);
      dbError = "Veritabanı sorgusu başarısız — DATABASE_URL veya bağlantıyı kontrol edin.";
    }
  }

  const now = Date.now();
  const aWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const members7 = members.filter((m) => new Date(m.createdAt).getTime() >= aWeekAgo).length;
  const apps7 = applications.filter((a) => new Date(a.createdAt).getTime() >= aWeekAgo).length;

  const latestMembers = members.slice(0, 5);
  const latestApps = applications.slice(0, 5);

  return (
    <ContentCard className="p-6 md:p-8">
      <div className="grid gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Özet</h1>
          <p className="text-sm text-muted-foreground mt-1">Bilet, müşteri ve kulüp metrikleri.</p>
        </div>

        {dbError ? (
          <p className="text-sm text-amber-700 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            {dbError}
          </p>
        ) : null}

        {prisma && !dbError ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Kayıtlı müşteri" value={dbStats.customers} href="/admin/customers" />
            <StatCard label="Tam profil" value={dbStats.profilesComplete} href="/admin/customers" />
            <StatCard label="Ödenen sipariş" value={dbStats.ordersPaid} href="/admin/orders?status=paid" />
            <StatCard
              label="Ciro (ödenen)"
              value={`${(dbStats.revenueKurus / 100).toFixed(0)} ₺`}
              href="/admin/orders?status=paid"
              isText
            />
            <StatCard label="Bekleyen ödeme" value={dbStats.ordersPending} href="/admin/orders?status=pending" />
            <StatCard label="Bilet kaydı" value={dbStats.tickets} href="/admin/orders" />
          </div>
        ) : null}

        {!prisma ? (
          <p className="text-sm text-amber-700 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            Veritabanı bağlı değil — müşteri ve sipariş kartları için{" "}
            <code className="text-amber-800">DATABASE_URL</code> ekleyin.
          </p>
        ) : null}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Kulüp üyesi" value={members.length} href="/admin/members" />
          <StatCard label="Son 7 gün üye" value={members7} />
          <StatCard label="Toplam başvuru" value={applications.length} href="/admin/forms" />
          <StatCard label="Son 7 gün başvuru" value={apps7} />
          <StatCard label="Etkinlik kaydı" value={events.length} href="/admin/events" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <section className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-foreground font-medium mb-3">Son kulüp üyeleri</h3>
            <ul className="text-sm text-foreground/70 grid gap-2">
              {latestMembers.length === 0 ? (
                <li className="text-muted-foreground">Kayıt yok</li>
              ) : (
                latestMembers.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-2">
                    <span>{m.name}</span>
                    <span className="text-muted-foreground text-xs">{new Date(m.createdAt).toLocaleString("tr-TR")}</span>
                  </li>
                ))
              )}
            </ul>
          </section>
          <section className="rounded-2xl border border-border bg-white p-4">
            <h3 className="text-foreground font-medium mb-3">Son başvurular</h3>
            <ul className="text-sm text-foreground/70 grid gap-2">
              {latestApps.length === 0 ? (
                <li className="text-muted-foreground">Kayıt yok</li>
              ) : (
                latestApps.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2">
                    <span>{a.name}</span>
                    <span className="text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleString("tr-TR")}</span>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-border bg-white p-4 grid gap-3">
          <h3 className="text-foreground font-medium">Hızlı işlemler</h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/events/new" className="rounded-xl bg-foreground text-background px-3 py-1.5 text-sm font-medium">
              Yeni etkinlik
            </Link>
            <Link href="/admin/playlists/new" className="rounded-xl bg-foreground text-background px-3 py-1.5 text-sm font-medium">
              Yeni playlist
            </Link>
            <Link href="/admin/customers" className="rounded-xl border border-border text-foreground px-3 py-1.5 text-sm hover:bg-foreground/5">
              Müşteriler
            </Link>
            <Link href="/admin/orders" className="rounded-xl border border-border text-foreground px-3 py-1.5 text-sm hover:bg-foreground/5">
              Siparişler
            </Link>
            <Link href="/admin/forms" className="rounded-xl border border-border text-foreground px-3 py-1.5 text-sm hover:bg-foreground/5">
              Başvurular
            </Link>
            <form action={triggerDeployAction} className="inline">
              <button type="submit" className="rounded-xl border border-border text-foreground px-3 py-1.5 text-sm hover:bg-foreground/5">
                Deploy tetikle
              </button>
            </form>
          </div>
        </section>
      </div>
    </ContentCard>
  );
}

function StatCard({
  label,
  value,
  href,
  isText,
}: {
  label: string;
  value: number | string;
  href?: string;
  isText?: boolean;
}) {
  const inner = (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-foreground/20 transition h-full">
      <div className="text-muted-foreground text-xs uppercase tracking-wide">{label}</div>
      <div className={`mt-2 font-semibold text-foreground ${isText ? "text-lg" : "text-2xl"}`}>{value}</div>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
