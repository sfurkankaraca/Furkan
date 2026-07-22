import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { ContentCard, PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "Biletlerim" };

export default async function BiletlerimPage({
  searchParams,
}: {
  searchParams: Promise<{ pay?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/account/biletlerim");
  }

  const prisma = getPrisma();
  const sp = await searchParams;
  const pay = sp?.pay;

  let tickets: Awaited<ReturnType<NonNullable<typeof prisma>["ticket"]["findMany"]>> = [];
  let orders: Awaited<ReturnType<NonNullable<typeof prisma>["order"]["findMany"]>> = [];
  if (prisma) {
    try {
      tickets = await prisma.ticket.findMany({
        where: { userId: session.sub },
        orderBy: { createdAt: "desc" },
      });
      orders = await prisma.order.findMany({
        where: { userId: session.sub },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    } catch (e) {
      console.error("[account/biletlerim] prisma", e);
    }
  }

  return (
    <PageShell>
      <ContentCard className="max-w-3xl mx-auto p-6 md:p-8">
        <div>
          <h1 className="text-2xl font-semibold">Biletlerim</h1>
          <p className="text-white/60 text-sm mt-1">Satın aldığınız ve geçmiş biletleriniz.</p>
        </div>

      {pay === "ok" ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Ödeme tamamlandı. Biletleriniz aşağıda listelenir.
        </div>
      ) : null}
      {pay === "fail" ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Ödeme tamamlanamadı veya iptal edildi. Sorun devam ederse destek ile iletişime geçin.
        </div>
      ) : null}

      {!prisma ? (
        <p className="text-white/70 text-sm">
          Bilet listesi için sunucuda <code className="text-white/90">DATABASE_URL</code> tanımlanmalıdır.
        </p>
      ) : null}

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Aktif biletler</h2>
        {tickets.length === 0 ? (
          <p className="text-white/50 text-sm">Henüz bilet yok. Etkinliklere göz atın.</p>
        ) : (
          <ul className="grid gap-2">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <div className="font-medium">{t.eventTitle || t.eventId}</div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {new Date(t.createdAt).toLocaleString("tr-TR")} · Kod:{" "}
                    <span className="text-white/80 font-mono">{t.code}</span>
                  </div>
                </div>
                <Link href={`/events/${t.eventId}`} className="text-sm text-fuchsia-300 hover:underline shrink-0">
                  Etkinlik
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3">
        <h2 className="text-lg font-medium">Son siparişler</h2>
        {orders.length === 0 ? (
          <p className="text-white/50 text-sm">Sipariş geçmişi boş.</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {orders.map((o) => (
              <li key={o.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 flex justify-between gap-2">
                <span className="text-white/80 truncate">{o.eventTitle || o.eventId}</span>
                <span className="text-white/50 shrink-0">
                  {(o.amountKurus / 100).toFixed(2)} TRY · {o.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      </ContentCard>
    </PageShell>
  );
}
