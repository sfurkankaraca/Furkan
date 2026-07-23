import { readSubscribers } from "@/lib/admin/store";
import { ContentCard } from "@/components/layout/PageShell";

export const metadata = { title: "Admin — Bülten aboneleri | noqta" };

export const dynamic = "force-dynamic";

function toCsv(rows: { email: string; source?: string; createdAt: string }[]): string {
  const head = "email,source,createdAt";
  const body = rows
    .map((r) => [r.email, r.source ?? "", r.createdAt].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  return `${head}\n${body}`;
}

export default async function AdminSubscribersPage() {
  const subscribers = await readSubscribers();
  const csv = toCsv(subscribers);
  const csvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;

  const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const last7 = subscribers.filter((s) => new Date(s.createdAt).getTime() >= aWeekAgo).length;

  return (
    <ContentCard className="p-6 md:p-8">
      <div className="grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-foreground">Bülten aboneleri</h2>
          <a
            href={csvHref}
            download="noqta-subscribers.csv"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-foreground/5"
          >
            CSV indir
          </a>
        </div>

        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>
            Toplam: <b className="text-foreground">{subscribers.length}</b>
          </span>
          <span>
            Son 7 gün: <b className="text-foreground">{last7}</b>
          </span>
        </div>

        {subscribers.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz abone yok.</p>
        ) : (
          <div className="rounded-xl border border-border overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">E-posta</th>
                  <th className="px-4 py-3 font-medium">Kaynak</th>
                  <th className="px-4 py-3 font-medium">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-border/60">
                    <td className="px-4 py-3">{s.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.source ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ContentCard>
  );
}
