import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { ContentCard } from "@/components/layout/PageShell";
import { AdminPrismaErrorCard } from "@/lib/admin/admin-prisma-fallback";

export const metadata = { title: "Müşteriler | Admin" };

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim().toLowerCase();
  const prisma = getPrisma();

  if (!prisma) {
    return (
      <ContentCard className="bg-white p-6 md:p-8">
        <p className="text-sm text-amber-700 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <code className="text-amber-800">DATABASE_URL</code> tanımlı değil.
        </p>
      </ContentCard>
    );
  }

  let users: Awaited<ReturnType<typeof prisma.user.findMany>> = [];
  try {
    users = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { email: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { profile: { phone: { contains: q, mode: "insensitive" } } },
              { profile: { firstName: { contains: q, mode: "insensitive" } } },
              { profile: { lastName: { contains: q, mode: "insensitive" } } },
            ],
          }
        : undefined,
      include: {
        profile: true,
        _count: { select: { orders: true, tickets: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 150,
    });
  } catch (e) {
    console.error("[admin/customers] prisma", e);
    return <AdminPrismaErrorCard title="Müşteriler" subtitle="Kayıtlı hesaplar, profil ve bilet verileri." />;
  }

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Müşteriler</h1>
          <p className="text-sm text-muted-foreground mt-1">Kayıtlı hesaplar, profil ve bilet verileri.</p>
        </div>
        <form className="flex gap-2 max-w-md w-full" action="/admin/customers" method="get">
          <input
            name="q"
            defaultValue={sp.q || ""}
            placeholder="E-posta, ad, telefon ara…"
            className="flex-1 rounded-xl bg-secondary/40 border border-border px-3 py-2 text-sm text-white placeholder:text-muted-foreground"
          />
          <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium">
            Ara
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-medium">E-posta</th>
                <th className="px-4 py-3 font-medium">Ad</th>
                <th className="px-4 py-3 font-medium">Telefon</th>
                <th className="px-4 py-3 font-medium">Profil</th>
                <th className="px-4 py-3 font-medium">Sipariş</th>
                <th className="px-4 py-3 font-medium">Bilet</th>
                <th className="px-4 py-3 font-medium">Kayıt</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Kayıt yok.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-t border-border hover:bg-secondary/20">
                    <td className="px-4 py-2.5 text-foreground/80">{u.email}</td>
                    <td className="px-4 py-2.5 text-foreground/70">{u.name || "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{u.profile?.phone || "—"}</td>
                    <td className="px-4 py-2.5">
                      {u.profileCompletedAt ? (
                        <span className="text-emerald-600/90">Tamam</span>
                      ) : (
                        <span className="text-amber-700">Eksik</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{u._count.orders}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{u._count.tickets}</td>
                    <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-4 py-2.5">
                      <Link href={`/admin/customers/${u.id}`} className="text-fuchsia-600 hover:underline">
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </ContentCard>
  );
}
