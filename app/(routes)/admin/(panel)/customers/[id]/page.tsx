import Link from "next/link";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { updateCustomerAdminNotes } from "../actions";
import { ContentCard } from "@/components/layout/PageShell";
import { AdminPrismaErrorCard } from "@/lib/admin/admin-prisma-fallback";

export const metadata = { title: "Müşteri | Admin" };

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  let user: Awaited<ReturnType<typeof prisma.user.findUnique>> = null;
  try {
    user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        orders: { orderBy: { createdAt: "desc" }, take: 25 },
        tickets: { orderBy: { createdAt: "desc" }, take: 25 },
      },
    });
  } catch (e) {
    console.error("[admin/customers/id] prisma", e);
    return <AdminPrismaErrorCard title="Müşteri" />;
  }

  if (!user) notFound();

  const p = user.profile;

  return (
    <ContentCard className="bg-white p-6 md:p-8 max-w-4xl mx-auto">
      <div className="grid gap-8">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="text-sm text-muted-foreground hover:text-foreground/70">
          ← Müşteriler
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{user.name || user.email}</h1>
          <p className="text-muted-foreground text-sm mt-1">{user.email}</p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs">
            {user.googleSub ? (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-foreground/70">Google</span>
            ) : (
              <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-foreground/70">E-posta / şifre</span>
            )}
            {user.profileCompletedAt ? (
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5">Profil tamam</span>
            ) : (
              <span className="rounded-full bg-amber-500/20 text-amber-800 px-2 py-0.5">Profil eksik</span>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          Kayıt: {new Date(user.createdAt).toLocaleString("tr-TR")}
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-white p-5 grid gap-3">
        <h2 className="text-lg font-medium text-white">Müşteri dosyası</h2>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Ad / Soyad</dt>
            <dd className="text-foreground/80">
              {p?.firstName || p?.lastName ? `${p?.firstName || ""} ${p?.lastName || ""}`.trim() : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Telefon</dt>
            <dd className="text-foreground/80">{p?.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Doğum</dt>
            <dd className="text-foreground/80">{p?.birthDate ? new Date(p.birthDate).toLocaleDateString("tr-TR") : "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Şehir / İlçe</dt>
            <dd className="text-foreground/80">
              {[p?.city, p?.district].filter(Boolean).join(" · ") || "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Adres</dt>
            <dd className="text-foreground/80 whitespace-pre-wrap">{p?.addressLine || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Posta kodu / Ülke</dt>
            <dd className="text-foreground/80">
              {[p?.postalCode, p?.country].filter(Boolean).join(" · ") || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Şirket / VKN</dt>
            <dd className="text-foreground/80">{[p?.companyName, p?.taxNumber].filter(Boolean).join(" · ") || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Vergi dairesi</dt>
            <dd className="text-foreground/80">{p?.taxOffice || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Fatura e-postası</dt>
            <dd className="text-foreground/80">{p?.invoiceEmail || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pazarlama izni</dt>
            <dd className="text-foreground/80">{p?.marketingEmailConsent ? "Evet" : "Hayır"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Şartlar kabul</dt>
            <dd className="text-foreground/80">
              {p?.termsAcceptedAt ? new Date(p.termsAcceptedAt).toLocaleString("tr-TR") : "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 grid gap-3">
        <h2 className="text-lg font-medium text-white">Admin notu</h2>
        <p className="text-xs text-muted-foreground">Sadece panelde görünür; müşteriye gösterilmez.</p>
        <form action={updateCustomerAdminNotes} className="grid gap-2">
          <input type="hidden" name="userId" value={user.id} />
          <textarea
            name="adminNotes"
            rows={4}
            defaultValue={p?.adminNotes || ""}
            className="rounded-xl bg-background border border-border px-3 py-2 text-sm text-white"
            placeholder="İç notlar…"
          />
          <button type="submit" className="rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium w-fit">
            Notu kaydet
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5">
        <h2 className="text-lg font-medium text-white mb-3">Son siparişler</h2>
        <ul className="text-sm space-y-2">
          {user.orders.length === 0 ? (
            <li className="text-muted-foreground">Yok</li>
          ) : (
            user.orders.map((o) => (
              <li key={o.id} className="flex justify-between gap-2 border-b border-border pb-2">
                <span className="text-foreground/70 truncate">{o.eventTitle || o.eventId}</span>
                <span className="text-muted-foreground shrink-0">
                  {(o.amountKurus / 100).toFixed(2)} TRY · {o.status}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5">
        <h2 className="text-lg font-medium text-white mb-3">Biletler</h2>
        <ul className="text-sm space-y-2 font-mono">
          {user.tickets.length === 0 ? (
            <li className="text-muted-foreground">Yok</li>
          ) : (
            user.tickets.map((t) => (
              <li key={t.id} className="flex justify-between gap-2 text-foreground/70">
                <span>{t.code}</span>
                <span className="text-muted-foreground">{t.eventTitle || t.eventId}</span>
              </li>
            ))
          )}
        </ul>
      </section>
      </div>
    </ContentCard>
  );
}
