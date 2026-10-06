"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import type { PublicEvent } from "@/lib/event-types";
import { ContentCard, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import PaymentComplianceNote from "@/components/payments/PaymentComplianceNote";
import { cn } from "@/lib/utils";

function formatEventWhen(ev: PublicEvent): string {
  try {
    const start = new Date(ev.date);
    const fmt: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    if (ev.endDate) {
      const end = new Date(ev.endDate);
      return `${start.toLocaleDateString("tr-TR", fmt)} – ${end.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
    }
    const withTime =
      start.getHours() !== 0 || start.getMinutes() !== 0 || start.getSeconds() !== 0;
    if (withTime) {
      return start.toLocaleString("tr-TR", {
        ...fmt,
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return start.toLocaleDateString("tr-TR", fmt);
  } catch {
    return ev.date;
  }
}

function TicketShell({ children }: { children: React.ReactNode }) {
  return (
    <PageHeroVideo
      sources={resolveRandomHeroSources("/events/bilet")}
      posterAlt="Noqta bilet ve ödeme arka plan görseli"
    >
      <PageShell withGlow={false}>
        <ContentCard className="mx-auto max-w-4xl overflow-hidden p-0 md:p-0">{children}</ContentCard>
      </PageShell>
    </PageHeroVideo>
  );
}

export default function EventTicketPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "");
  const { isLoggedIn, needsOnboarding, loading: authLoading, club } = useAuth();
  const [event, setEvent] = useState<PublicEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [acceptedDistanceContract, setAcceptedDistanceContract] = useState(false);
  const [iyzicoLogo, setIyzicoLogo] = useState<string | null>(null);
  const [cardLogo, setCardLogo] = useState<string | null>(null);
  const [payPanelOpen, setPayPanelOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/events/${encodeURIComponent(id)}`, {
          cache: "no-store",
          credentials: "include",
        });
        if (res.ok) {
          const ev: PublicEvent = await res.json();
          setEvent(ev);
        } else {
          setEvent(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
    if (!authLoading && isLoggedIn && needsOnboarding) {
      router.replace("/onboarding");
    }
  }, [authLoading, isLoggedIn, needsOnboarding, router]);

  if (loading || authLoading) {
    return (
      <TicketShell>
        <div className="flex min-h-[12rem] items-center justify-center p-8 text-sm text-white/60">
          Yükleniyor…
        </div>
      </TicketShell>
    );
  }

  if (!event) {
    return (
      <TicketShell>
        <div className="grid gap-4 p-6 md:p-8">
          <p className="text-white/80">Etkinlik bulunamadı.</p>
          <Button asChild variant="outline" className="w-fit rounded-xl border-white/25">
            <Link href="/events">Etkinliklere dön</Link>
          </Button>
        </div>
      </TicketShell>
    );
  }

  const t = event.ticketing;
  const past = event.date && new Date(event.date).getTime() < Date.now();

  if (!t?.enabled || past) {
    return (
      <TicketShell>
        <div className="grid gap-4 p-6 md:p-8">
          <p className="text-white/75">
            Bu etkinlik için çevrimiçi bilet satışı yok veya etkinlik sona erdi.
          </p>
          <Button asChild variant="outline" className="w-fit rounded-xl border-white/25">
            <Link href={`/events/${id}`}>Etkinlik sayfası</Link>
          </Button>
        </div>
      </TicketShell>
    );
  }

  if (needsOnboarding) {
    return (
      <TicketShell>
        <div className="p-8 text-sm text-white/60">Yönlendiriliyor…</div>
      </TicketShell>
    );
  }

  if (!isLoggedIn) {
    return (
      <TicketShell>
        <div className="grid gap-5 p-6 md:p-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-noqt-lime/90">
              Bilet
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{event.title}</h1>
            <p className="mt-2 text-sm text-white/65">Ödeme için önce giriş yapmalısınız.</p>
            {event.membersOnly ? (
              <p className="mt-2 text-sm text-amber-200/90">
                Bu etkinlik kulüp üyelerine özeldir; girişten sonra onaylı başvuru ve aktif Noqta Club aboneliği gerekir.
              </p>
            ) : null}
          </div>
          <Button asChild className="w-full rounded-xl sm:w-fit">
            <Link href={`/login?next=/events/${id}/bilet`}>Giriş yap</Link>
          </Button>
        </div>
      </TicketShell>
    );
  }

  if (event.membersOnly && !club?.fullMember) {
    return (
      <TicketShell>
        <div className="grid gap-5 p-6 md:p-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-amber-300/90">Kulüp etkinliği</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">{event.title}</h1>
            <p className="mt-2 text-sm text-white/70">
              Bu etkinlik için bilet almak üzere onaylı Noqta Club başvurunuz ve aktif aylık aboneliğiniz olmalıdır.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-xl bg-white text-black hover:bg-white/90">
              <Link href="/account/club">Noqta Club</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/25">
              <Link href={`/events/${id}`}>Etkinlik sayfası</Link>
            </Button>
          </div>
        </div>
      </TicketShell>
    );
  }

  const maxPer = t.maxPerOrder ?? 8;
  const unit = t.priceTry ?? 0;
  const subtotal = unit > 0 ? unit * qty : 0;
  const whenLabel = formatEventWhen(event);
  const placeLine = [event.venue, event.city].filter(Boolean).join(" · ") || event.city;

  function bump(delta: number) {
    setQty((q) => Math.min(maxPer, Math.max(1, q + delta)));
  }

  async function pay() {
    setBusy(true);
    setError("");
    try {
      if (!(unit > 0)) {
        setError("Birim fiyat tanımlanmadı. Lütfen yönetimden fiyatın güncellenmesini isteyin.");
        setBusy(false);
        return;
      }
      if (!acceptedDistanceContract) {
        setError("Devam etmek için mesafeli satış sözleşmesini onaylamanız gerekir.");
        setBusy(false);
        return;
      }
      const res = await fetch("/api/pay/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId: id, quantity: qty }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Ödeme başlatılamadı");
        setBusy(false);
        return;
      }
      if (data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
        return;
      }
      if (data.checkoutFormContent) {
        const wrap = document.getElementById("iyzi-root");
        if (wrap) {
          wrap.innerHTML = data.checkoutFormContent;
          const scripts = wrap.getElementsByTagName("script");
          for (let i = 0; i < scripts.length; i++) {
            const s = document.createElement("script");
            s.textContent = scripts[i].textContent;
            document.body.appendChild(s);
          }
        }
        setBusy(false);
        return;
      }
      setError("Ödeme formu alınamadı");
    } catch {
      setError("Bağlantı hatası");
    }
    setBusy(false);
  }

  const payDisabled = busy || !acceptedDistanceContract || !(unit > 0);

  return (
    <TicketShell>
      <div className="relative">
        {/* Sol: etkinlik özeti */}
        <div className="p-6 md:p-8">
          <Link
            href={`/events/${id}`}
            className="inline-flex items-center gap-1 text-xs text-white/50 transition hover:text-white/80"
          >
            <span aria-hidden>←</span> Etkinlik detayı
          </Link>

          <div className="mt-5 grid gap-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-noqt-lime/90">
                Sipariş özeti
              </p>
              <h1 className="mt-1 text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                {event.title}
              </h1>
              {event.subtitle ? (
                <p className="mt-2 text-sm text-white/60">{event.subtitle}</p>
              ) : null}
            </div>

            {event.image ? (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            ) : null}

            <dl className="grid gap-3 text-sm">
              <div className="flex gap-3 justify-between border-t border-white/10 pt-3">
                <dt className="text-white/50">Tarih</dt>
                <dd className="text-right text-white/90">{whenLabel}</dd>
              </div>
              <div className="flex gap-3 justify-between border-t border-white/10 pt-3">
                <dt className="text-white/50">Yer</dt>
                <dd className="text-right text-white/90">{placeLine}</dd>
              </div>
              {t.note ? (
                <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-white/60">
                  {t.note}
                </div>
              ) : null}
            </dl>
          </div>

          <div className="mt-6">
            <Button className="h-11 rounded-xl px-5" onClick={() => setPayPanelOpen(true)}>
              Bilet al
            </Button>
          </div>
        </div>
      </div>

      {payPanelOpen ? (
        <button
          type="button"
          aria-label="Ödeme panelini kapat"
          onClick={() => setPayPanelOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px]"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-white/10 bg-zinc-950 p-6 shadow-2xl transition-transform duration-300 md:p-8",
          payPanelOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Ödeme paneli"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Ödeme</h2>
          <button
            type="button"
            onClick={() => setPayPanelOpen(false)}
            className="rounded-lg border border-white/15 px-2 py-1 text-sm text-white/75 transition hover:text-white"
          >
            Kapat
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="mt-1 text-xs text-white/50">Bilet adedi ve toplam tutar</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-white/80">Adet</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-lg border-white/20"
                  onClick={() => bump(-1)}
                  disabled={qty <= 1 || busy}
                  aria-label="Adedi azalt"
                >
                  −
                </Button>
                <span className="min-w-[2.5rem] text-center text-sm font-medium tabular-nums">
                  {qty}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-lg border-white/20"
                  onClick={() => bump(1)}
                  disabled={qty >= maxPer || busy}
                  aria-label="Adedi artır"
                >
                  +
                </Button>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-white/45">En fazla {maxPer} bilet / sipariş</p>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between gap-4 text-white/70">
                <span>
                  Bilet × {qty}
                  <span className="text-white/45">
                    {" "}
                    ({unit > 0 ? `${unit.toFixed(2)} ₺` : "—"} / adet)
                  </span>
                </span>
                <span className="tabular-nums text-white/90">
                  {unit > 0 ? `${(unit * qty).toFixed(2)} ₺` : "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-base font-semibold text-white">
                <span>Toplam</span>
                <span className="tabular-nums">{unit > 0 ? `${subtotal.toFixed(2)} ₺` : "—"}</span>
              </div>
            </div>
          </div>

          <PaymentComplianceNote iyzicoLogo={iyzicoLogo} cardLogo={cardLogo} showHeading />

          <label
            className={cn(
              "flex cursor-pointer gap-3 rounded-xl border p-3 text-left transition",
              acceptedDistanceContract
                ? "border-noqt-lime/35 bg-noqt-lime/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/15",
            )}
          >
            <input
              type="checkbox"
              checked={acceptedDistanceContract}
              onChange={(e) => setAcceptedDistanceContract(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-black accent-noqt-lime"
            />
            <span className="text-xs leading-relaxed text-white/70">
              <Link
                href="/mesafeli-satis-sozlesmesi"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-noqt-lime/95 underline-offset-2 hover:underline"
              >
                Mesafeli Satış Sözleşmesi
              </Link>
              &apos;ni,{" "}
              <Link
                href="/teslimat-ve-iade-sartlari"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-noqt-lime/95 underline-offset-2 hover:underline"
              >
                teslimat ve iade şartlarını
              </Link>{" "}
              okudum ve onaylıyorum.
            </span>
          </label>

          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-auto grid gap-3">
            <Button
              className="h-12 w-full rounded-xl text-base font-medium"
              disabled={payDisabled}
              onClick={() => void pay()}
            >
              {busy ? "Yönlendiriliyor…" : "Güvenli ödemeye geç"}
            </Button>
            <p className="text-center text-[11px] text-white/40">
              Devam ettiğinizde iyzico ödeme sayfasına yönlendirilirsiniz.
            </p>
          </div>

          <div id="iyzi-root" className="min-h-[1px]" />
        </div>
      </aside>
    </TicketShell>
  );
}
