"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ContentCard, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import type { PublicEvent } from "@/lib/event-types";
import type { ClubMemberPost } from "@/lib/server/club-posts-store";
import PaymentComplianceNote from "@/components/payments/PaymentComplianceNote";

type Dash = {
  events: PublicEvent[];
  posts: ClubMemberPost[];
  access: { periodEnd: string | null };
};

type ClubPackage = {
  id: string;
  name: string;
  priceTry: number;
  periodLabel?: string;
  description?: string;
};

function ClubShell({ children }: { children: React.ReactNode }) {
  return (
    <PageHeroVideo
      sources={resolveRandomHeroSources("/account/club")}
      posterAlt="Noqta Club üyelik ve ödeme arka plan görseli"
    >
      {children}
    </PageHeroVideo>
  );
}

function AccountClubPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const payOk = searchParams.get("pay") === "ok";
  const { isLoggedIn, loading: authLoading, club, refresh } = useAuth();
  const [priceTry, setPriceTry] = useState<number | null>(null);
  const [priceOk, setPriceOk] = useState(false);
  const [packages, setPackages] = useState<ClubPackage[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [dash, setDash] = useState<Dash | null>(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [payBusy, setPayBusy] = useState(false);
  const [err, setErr] = useState("");
  const [iyzicoLogo, setIyzicoLogo] = useState<string | null>(null);
  const [cardLogo, setCardLogo] = useState<string | null>(null);

  const loadPrice = useCallback(async () => {
    try {
      const r = await fetch("/api/club/price");
      const j = await r.json().catch(() => ({}));
      const unitPrice = j?.priceTry != null ? Number(j.priceTry) : null;
      if (unitPrice != null) setPriceTry(unitPrice);
      setPriceOk(!!j?.configured);

      const fromApi = Array.isArray(j?.packages)
        ? (j.packages as Array<Record<string, unknown>>)
            .map((p) => ({
              id: String(p.id ?? ""),
              name: String(p.name ?? ""),
              priceTry: Number(p.priceTry ?? NaN),
              periodLabel: typeof p.periodLabel === "string" ? p.periodLabel : "/ ay",
              description: typeof p.description === "string" ? p.description : "",
            }))
            .filter((p) => p.id && p.name && Number.isFinite(p.priceTry) && p.priceTry > 0)
        : [];

      if (fromApi.length > 0) {
        setPackages(fromApi);
        setSelectedPackageId((prev) => prev || fromApi[0].id);
        return;
      }

      // Fallback: tek fiyat konfigürasyonundan paket seçenekleri üret.
      if (unitPrice && Number.isFinite(unitPrice) && unitPrice > 0) {
        const fallback: ClubPackage[] = [
          { id: "baslangic", name: "Başlangıç Noqtası", priceTry: unitPrice, periodLabel: "/ ay", description: "Topluluk ve temel avantajlar." },
          { id: "dongu", name: "Döngü Noqtası", priceTry: unitPrice * 2, periodLabel: "/ ay", description: "Daha fazla içerik ve avantaj." },
          { id: "groove", name: "Groove Noqtası", priceTry: unitPrice * 3, periodLabel: "/ ay", description: "Topluluk + eğitim tarafında genişletilmiş erişim." },
          { id: "dj-adaylari", name: "DJ Adayları", priceTry: unitPrice * 4, periodLabel: "/ ay", description: "DJ gelişim odaklı üyelik." },
          { id: "dj-plus", name: "DJ Plus", priceTry: unitPrice * 5, periodLabel: "/ ay", description: "En kapsamlı üyelik paketi." },
        ];
        setPackages(fallback);
        setSelectedPackageId((prev) => prev || fallback[0].id);
      } else {
        setPackages([]);
      }
    } catch {
      setPriceOk(false);
      setPackages([]);
    }
  }, []);

  const loadDash = useCallback(async () => {
    setDashLoading(true);
    setErr("");
    try {
      const r = await fetch("/api/club/member-dashboard", { credentials: "include", cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (r.status === 403 || r.status === 401) {
        setDash(null);
        setDashLoading(false);
        return;
      }
      if (!r.ok) {
        setErr(j?.error || "Yüklenemedi");
        setDash(null);
        setDashLoading(false);
        return;
      }
      setDash({ events: j.events || [], posts: j.posts || [], access: j.access || { periodEnd: null } });
    } catch {
      setErr("Bağlantı hatası");
      setDash(null);
    }
    setDashLoading(false);
  }, []);

  useEffect(() => {
    void loadPrice();
  }, [loadPrice]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace("/login?next=/account/club");
      return;
    }
    void refresh();
  }, [authLoading, isLoggedIn, refresh, router]);

  useEffect(() => {
    if (authLoading || !isLoggedIn || !club?.fullMember) return;
    void loadDash();
  }, [authLoading, isLoggedIn, club?.fullMember, loadDash]);

  useEffect(() => {
    (async () => {
      try {
        const [a, b] = await Promise.all([
          fetch("/api/site-image?slot=payment_iyzico_logo", { cache: "no-store" }),
          fetch("/api/site-image?slot=payment_card_logo", { cache: "no-store" }),
        ]);
        const aj = await a.json().catch(() => ({}));
        const bj = await b.json().catch(() => ({}));
        if (typeof aj?.url === "string" && aj.url) setIyzicoLogo(aj.url);
        if (typeof bj?.url === "string" && bj.url) setCardLogo(bj.url);
      } catch {
        // noop
      }
    })();
  }, []);

  useEffect(() => {
    if (payOk) void refresh();
  }, [payOk, refresh]);

  async function startPay() {
    setPayBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/pay/club-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packageId: selectedPackageId || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.error || "Ödeme başlatılamadı");
        setPayBusy(false);
        return;
      }
      if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
        return;
      }
      if (data.checkoutFormContent) {
        const wrap = document.getElementById("iyzi-club-root");
        if (wrap) {
          wrap.innerHTML = data.checkoutFormContent;
          const scripts = wrap.getElementsByTagName("script");
          for (let i = 0; i < scripts.length; i++) {
            const s = document.createElement("script");
            s.textContent = scripts[i].textContent;
            document.body.appendChild(s);
          }
        }
        setPayBusy(false);
        return;
      }
      setErr("Ödeme formu alınamadı");
    } catch {
      setErr("Bağlantı hatası");
    }
    setPayBusy(false);
  }

  if (authLoading || !isLoggedIn) {
    return (
      <ClubShell>
        <PageShell>
          <div className="container max-w-3xl mx-auto px-4 py-16 text-white/60">Yükleniyor…</div>
        </PageShell>
      </ClubShell>
    );
  }

  const approved = club?.applicationApproved === true;
  const subscribed = club?.subscriptionActive === true;
  const full = club?.fullMember === true;
  const selectedPkg = packages.find((p) => p.id === selectedPackageId) ?? null;

  return (
    <ClubShell>
      <PageShell withGlow={false}>
        <div className="max-w-3xl mx-auto px-4 py-8 grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Noqta Club</h1>
          <p className="text-sm text-white/55 mt-1">Üyelik paneli — özel içerik ve etkinlikler</p>
        </div>

        {payOk ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            Ödemen alındı. Aboneliğin birkaç saniye içinde güncellenir; gerekirse sayfayı yenile.
          </div>
        ) : null}

        {!approved ? (
          <ContentCard className="p-6 md:p-8 bg-zinc-950/30">
            <p className="text-white/70 text-sm mb-4">
              Bu alan onaylı kulüp başvurusu olan ve abonelik ödeyen üyeler içindir. Önce başvurunu tamamla.
            </p>
            <Button asChild className="rounded-xl">
              <Link href="/noqta-club/basvuru">Kulübe başvur</Link>
            </Button>
          </ContentCard>
        ) : null}

        {approved && !subscribed ? (
          <ContentCard className="p-6 md:p-8 bg-zinc-950/30">
            <h2 className="text-lg font-medium text-white mb-2">Abonelik paketleri</h2>
            <p className="text-sm text-white/65 mb-4">
              Başvurun onaylandı. Aşağıdan paket seçip üyeliğini başlatabilirsin.
            </p>
            {!priceOk ? (
              <p className="text-sm text-amber-400">Abonelik fiyatı sunucuda ayarlanmadı (CLUB_SUBSCRIPTION_PRICE_TRY).</p>
            ) : (
              <div className="mb-4 grid gap-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {packages.map((pkg) => {
                    const active = selectedPackageId === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`rounded-xl border p-3 text-left transition ${
                          active ? "border-noqt-lime/55 bg-noqt-lime/10" : "border-white/15 bg-white/[0.03] hover:border-white/25"
                        }`}
                      >
                        <div className="text-sm font-medium text-white">{pkg.name}</div>
                        <div className="text-sm text-white/70 mt-1">
                          <span className="font-semibold text-white">{pkg.priceTry.toFixed(2)} TRY</span> {pkg.periodLabel || "/ ay"}
                        </div>
                        {pkg.description ? <p className="mt-1 text-xs text-white/55">{pkg.description}</p> : null}
                      </button>
                    );
                  })}
                </div>
                {selectedPkg ? (
                  <p className="text-sm text-white/80">
                    Seçilen paket: <span className="font-semibold text-white">{selectedPkg.name}</span> —{" "}
                    <span className="font-semibold text-white">{selectedPkg.priceTry.toFixed(2)} TRY</span> {selectedPkg.periodLabel || "/ ay"}
                  </p>
                ) : (
                  <p className="text-sm text-white/80 mb-1">
                    Güncel paket: <span className="font-semibold text-white">{priceTry?.toFixed(2)} TRY</span> / ay
                  </p>
                )}
              </div>
            )}
            {err ? <p className="text-sm text-red-400 mb-3">{err}</p> : null}
            <Button className="rounded-xl" disabled={payBusy || !priceOk || packages.length === 0} onClick={() => void startPay()}>
              {payBusy ? "Yönlendiriliyor…" : "İyzico ile abone ol"}
            </Button>
            <div className="mt-3">
              <PaymentComplianceNote iyzicoLogo={iyzicoLogo} cardLogo={cardLogo} />
            </div>
            <div id="iyzi-club-root" className="min-h-[80px] mt-4" />
          </ContentCard>
        ) : null}

        {full ? (
          <>
            <ContentCard className="p-6 md:p-8 bg-zinc-950/30">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-lg font-medium text-white">Hoş geldin</span>
                <span className="rounded-full bg-noqt-lime/20 text-noqt-lime text-xs font-medium px-2.5 py-0.5 border border-noqt-lime/35">
                  Aktif üye
                </span>
              </div>
              {club?.periodEnd ? (
                <p className="text-sm text-white/55">
                  Abonelik bitişi:{" "}
                  <span className="text-white/80">
                    {new Date(club.periodEnd).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </p>
              ) : null}
            </ContentCard>

            {dashLoading ? (
              <div className="text-white/50 text-sm">Panel yükleniyor…</div>
            ) : err && !dash ? (
              <div className="text-red-400 text-sm">{err}</div>
            ) : null}

            {dash ? (
              <>
                <ContentCard className="p-6 md:p-8 bg-zinc-950/30">
                  <h2 className="text-lg font-medium text-white mb-4">Özel içerikler</h2>
                  {dash.posts.length === 0 ? (
                    <p className="text-sm text-white/50">Henüz paylaşım yok.</p>
                  ) : (
                    <ul className="grid gap-6">
                      {dash.posts.map((p) => (
                        <li key={p.id} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                          <h3 className="font-medium text-white">{p.title}</h3>
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.image}
                              alt=""
                              className="mt-3 max-w-full max-h-72 rounded-xl border border-white/10 object-cover"
                            />
                          ) : null}
                          {p.body ? (
                            <p className="text-sm text-white/70 whitespace-pre-wrap mt-3">{p.body}</p>
                          ) : null}
                          {p.linkUrl ? (
                            <Link
                              href={p.linkUrl}
                              className="inline-block mt-3 text-sm text-noqt-lime underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {p.linkLabel || "Bağlantı"}
                            </Link>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </ContentCard>

                <ContentCard className="p-6 md:p-8 bg-zinc-950/30">
                  <h2 className="text-lg font-medium text-white mb-4">Kulüp etkinlikleri</h2>
                  {dash.events.length === 0 ? (
                    <p className="text-sm text-white/50">İşaretli kulüp etkinliği yok. Admin panelinden etkinliğe “Kulüp” seçebilirsin.</p>
                  ) : (
                    <ul className="grid gap-3">
                      {dash.events.map((e) => (
                        <li key={e.id}>
                          <Link href={`/events/${e.id}`} className="text-noqt-lime hover:underline text-sm font-medium">
                            {e.title}
                          </Link>
                          <span className="text-white/45 text-sm ml-2">
                            {e.city}
                            {e.date ? ` · ${new Date(e.date).toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </ContentCard>
              </>
            ) : null}
          </>
        ) : null}
        </div>
      </PageShell>
    </ClubShell>
  );
}

export default function AccountClubPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <div className="container max-w-3xl mx-auto px-4 py-16 text-white/60">Yükleniyor…</div>
        </PageShell>
      }
    >
      <AccountClubPageInner />
    </Suspense>
  );
}
