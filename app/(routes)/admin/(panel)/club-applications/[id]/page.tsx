import Link from "next/link";
import { redirect } from "next/navigation";
import { getNoqtaClubApplicationById } from "@/lib/admin/store";
import { formatBirthDateTr } from "@/lib/noqta-club/birth-date";
import { ContentCard } from "@/components/layout/PageShell";
import { approveNoqtaClubApplication, rejectNoqtaClubApplication } from "../actions";

export const metadata = { title: "Admin — Noqta Club Başvurusu | noqta" };

export default async function ClubApplicationDetailPage({ params }: { params: { id: string } }) {
  const app = await getNoqtaClubApplicationById(params.id);
  if (!app) redirect("/admin/club-applications");

  const statusColor =
    app.status === "approved"
      ? "text-emerald-600"
      : app.status === "rejected"
        ? "text-red-400"
        : "text-amber-600";

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium">Başvuru Detayı</h2>
            <p className="text-sm text-muted-foreground mt-1">
              <span className={statusColor}>{app.status}</span> · {new Date(app.createdAt).toLocaleString("tr-TR")}
            </p>
          </div>
          <Link href="/admin/club-applications" className="text-fuchsia-600 hover:underline text-sm">
            ← Listeye dön
          </Link>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-background/20">
          <div className="grid gap-5 p-5 md:p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Ad Soyad</div>
                <div className="text-white font-medium">{app.name}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">E-posta</div>
                <div className="text-white/90">{app.email}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Şehir</div>
                <div className="text-white/90">{app.city}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Doğum tarihi</div>
                <div className="text-white/90">
                  {app.birthDate
                    ? formatBirthDateTr(app.birthDate)
                    : app.age != null
                      ? `Eski kayıt — yaş: ${app.age}`
                      : "—"}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Telefon</div>
                <div className="text-white/90">{app.phone || "—"}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Instagram</div>
                <div className="text-white/90">{app.instagram}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Referans</div>
                <div className="text-foreground/80 text-sm whitespace-pre-wrap">{app.referrer || "—"}</div>
              </div>
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Nasıl ulaştın</div>
                <div className="text-foreground/80 text-sm">{app.referralSource || "—"}</div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">KVKK onayı</div>
              <div className="text-white/90">{app.consentKvkk ? "Evet" : "Hayır"}</div>
            </div>
            <div className="grid gap-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">E-posta/SMS bilgilendirme</div>
              <div className="text-white/90">{app.consentMarketing ? "Evet" : "Hayır"}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Katılım amacı</div>
              <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed text-sm">{app.mainReason}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Müzik ilgisi</div>
              <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed text-sm">{app.musicInterest}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center pt-2">
          <form
            action={approveNoqtaClubApplication}
            className="inline"
          >
            <input type="hidden" name="id" value={app.id} />
            <button
              type="submit"
              disabled={app.status !== "pending"}
              className="rounded-xl bg-emerald-400/90 text-black px-4 py-2 text-sm font-medium hover:bg-emerald-400 disabled:opacity-50"
            >
              Approve
            </button>
          </form>

          <form action={rejectNoqtaClubApplication} className="inline grid gap-2">
            <input type="hidden" name="id" value={app.id} />
            <input
              name="rejectionNote"
              defaultValue=""
              placeholder="(Opsiyonel) Not"
              className="rounded-xl bg-background border border-border px-3 py-2 text-white text-sm w-[260px]"
            />
            <button
              type="submit"
              disabled={app.status !== "pending"}
              className="rounded-xl bg-red-500/90 text-white px-4 py-2 text-sm font-medium hover:bg-red-500 disabled:opacity-50"
            >
              Reject
            </button>
          </form>
        </div>
      </div>
    </ContentCard>
  );
}

