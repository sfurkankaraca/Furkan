import Link from "next/link";
import { readNoqtaClubApplications, type NoqtaClubApplication, type NoqtaClubStatus } from "@/lib/admin/store";
import { formatBirthDateTr } from "@/lib/noqta-club/birth-date";
import { ContentCard } from "@/components/layout/PageShell";

export const metadata = { title: "Admin — Noqta Club Başvuruları | noqta" };

export default async function ClubApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: NoqtaClubStatus | "all" }>;
}) {
  const sp = await searchParams;
  const status = sp.status || "all";
  const applications = await readNoqtaClubApplications();

  const filtered =
    status === "all" ? applications : applications.filter((a) => a.status === status);

  const sorted = filtered.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="grid gap-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium">Noqta Club Başvuruları</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Toplam: <span className="text-white">{sorted.length}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            {(["all", "pending", "approved", "rejected"] as const).map((s) => (
              <Link
                key={s}
                href={s === "all" ? "/admin/club-applications" : `/admin/club-applications?status=${s}`}
                className={`rounded-full px-3 py-1 border ${
                  status === s
                    ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700"
                    : "border-border text-muted-foreground hover:bg-foreground/5"
                }`}
              >
                {s === "all" ? "Tümü" : s}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="px-3 py-3">Tarih</th>
                <th className="px-3 py-3">Ad</th>
                <th className="px-3 py-3">Email</th>
                <th className="px-3 py-3">Şehir</th>
                <th className="px-3 py-3">Doğum</th>
                <th className="px-3 py-3">Instagram</th>
                <th className="px-3 py-3">Ref.</th>
                <th className="px-3 py-3">Durum</th>
                <th className="px-3 py-3">Detay</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-muted-foreground">
                    Başvuru yok.
                  </td>
                </tr>
              ) : (
                sorted.map((a: NoqtaClubApplication) => (
                  <tr key={a.id} className="border-t border-border hover:bg-secondary/20">
                    <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="px-3 py-3 text-white/90">{a.name}</td>
                    <td className="px-3 py-3">
                      <span className="text-foreground/80">{a.email}</span>
                    </td>
                    <td className="px-3 py-3 text-foreground/80">{a.city}</td>
                    <td className="px-3 py-3 text-foreground/80">
                      {a.birthDate
                        ? formatBirthDateTr(a.birthDate)
                        : a.age != null
                          ? `${a.age} (eski)`
                          : "—"}
                    </td>
                    <td className="px-3 py-3 text-foreground/80">{a.instagram}</td>
                    <td className="px-3 py-3 text-foreground/70 max-w-[140px] truncate" title={a.referrer || ""}>
                      {a.referrer || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={
                          a.status === "approved"
                            ? "text-emerald-600"
                            : a.status === "rejected"
                              ? "text-red-400"
                              : "text-amber-600"
                        }
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/club-applications/${a.id}`} className="text-fuchsia-600 hover:underline">
                        Gör
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ContentCard>
  );
}

