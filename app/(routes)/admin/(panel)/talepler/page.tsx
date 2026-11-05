import Link from "next/link";
import { ContentCard } from "@/components/layout/PageShell";
import { getPrisma } from "@/lib/prisma";
import {
  CLUB_REQUEST_STATUSES,
  describeClubPayload,
  type ClubRequestKindValue,
  type ClubRequestStatusValue,
} from "@/lib/club-requests";
import { updateClubRequest } from "./actions";

export const metadata = { title: "Admin — DJ başvuruları ve marka teklifleri | noqta" };

const KIND_TABS: { value: ClubRequestKindValue; label: string }[] = [
  { value: "dj", label: "DJ başvuruları" },
  { value: "brand", label: "Marka teklifleri" },
];

const STATUS_COLOR: Record<ClubRequestStatusValue, string> = {
  new: "text-amber-700 bg-amber-50 border-amber-200",
  contacted: "text-sky-700 bg-sky-50 border-sky-200",
  done: "text-emerald-700 bg-emerald-50 border-emerald-200",
  rejected: "text-red-700 bg-red-50 border-red-200",
};

/** Türkiye numarasını wa.me biçimine çevirir (905xxxxxxxxx). */
function whatsappHref(phone: string): string {
  let d = phone.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = "90" + d.slice(1);
  else if (d.length === 10 && d.startsWith("5")) d = "90" + d;
  return `https://wa.me/${d}`;
}

function formatDate(d: Date): string {
  return d.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short" });
}

function href(kind: ClubRequestKindValue, status: string) {
  const q = new URLSearchParams();
  if (kind !== "dj") q.set("kind", kind);
  if (status !== "all") q.set("status", status);
  const qs = q.toString();
  return `/admin/talepler${qs ? `?${qs}` : ""}`;
}

export default async function ClubRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const kind: ClubRequestKindValue = sp.kind === "brand" ? "brand" : "dj";
  const status = CLUB_REQUEST_STATUSES.some((s) => s.value === sp.status) ? (sp.status as ClubRequestStatusValue) : "all";

  const prisma = getPrisma();
  const rows = prisma
    ? await prisma.clubRequest.findMany({
        where: { kind, ...(status !== "all" ? { status } : {}) },
        orderBy: { createdAt: "desc" },
        take: 200,
      })
    : [];

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="grid gap-5">
        <div>
          <h2 className="text-xl font-medium">DJ başvuruları ve marka teklifleri</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {prisma ? <>Listelenen: {rows.length}</> : "Veritabanı bağlantısı yok."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border pb-4 text-sm">
          {KIND_TABS.map((t) => (
            <Link
              key={t.value}
              href={href(t.value, "all")}
              className={`rounded-full border px-4 py-1.5 ${
                kind === t.value ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:bg-foreground/5"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {[{ value: "all", label: "Tümü" }, ...CLUB_REQUEST_STATUSES].map((s) => (
            <Link
              key={s.value}
              href={href(kind, s.value)}
              className={`rounded-full border px-3 py-1 ${
                status === s.value ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-700" : "border-border text-muted-foreground hover:bg-foreground/5"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {rows.length === 0 ? (
          <p className="rounded-xl border border-border px-4 py-10 text-center text-sm text-muted-foreground">Kayıt yok.</p>
        ) : (
          <ul className="grid gap-4">
            {rows.map((r) => {
              const payloadRows = describeClubPayload(r.kind, r.payload);
              return (
                <li key={r.id} className="rounded-xl border border-border p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-foreground">{r.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[r.status]}`}>
                      {CLUB_REQUEST_STATUSES.find((s) => s.value === r.status)?.label}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    {r.phone ? (
                      <>
                        <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="text-foreground underline underline-offset-2">
                          {r.phone}
                        </a>
                        <a href={whatsappHref(r.phone)} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline underline-offset-2">
                          WhatsApp
                        </a>
                      </>
                    ) : null}
                    {r.email ? (
                      <a href={`mailto:${r.email}`} className="text-foreground underline underline-offset-2">
                        {r.email}
                      </a>
                    ) : null}
                  </div>

                  {payloadRows.length > 0 ? (
                    <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[140px_1fr]">
                      {payloadRows.map((p) => (
                        <div key={p.label} className="contents">
                          <dt className="text-muted-foreground">{p.label}</dt>
                          <dd className="min-w-0 whitespace-pre-wrap break-words text-foreground">
                            {p.href ? (
                              <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-sky-700 underline underline-offset-2">
                                {p.value}
                              </a>
                            ) : (
                              p.value
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  <form key={`${r.id}-${r.status}-${r.adminNote ?? ""}`} action={updateClubRequest} className="mt-5 grid gap-3 border-t border-border pt-4 sm:grid-cols-[180px_1fr_auto] sm:items-start">
                    <input type="hidden" name="id" value={r.id} />
                    <select
                      name="status"
                      defaultValue={r.status}
                      aria-label="Durum"
                      className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
                    >
                      {CLUB_REQUEST_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="adminNote"
                      defaultValue={r.adminNote ?? ""}
                      rows={2}
                      maxLength={2000}
                      placeholder="Yönetici notu"
                      aria-label="Yönetici notu"
                      className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
                    />
                    <button type="submit" className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                      Kaydet
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </ContentCard>
  );
}
