"use client";

import { useState } from "react";
import Link from "next/link";
import { ContentCard, PageShell } from "@/components/layout/PageShell";
import {
  NOQTA_CLUB_MAIN_REASON_OPTIONS,
  NOQTA_CLUB_MUSIC_INTEREST_OPTIONS,
  NOQTA_CLUB_REFERRAL_SOURCE_OPTIONS,
} from "@/lib/noqta-club/apply-options";
import {
  birthDateNotInFuture,
  isAtLeastAge,
  parseIsoBirthDate,
} from "@/lib/noqta-club/birth-date";

type ApplyResponse = { ok: true } | { ok: false; error: string };

export default function NoqtaClubApplyPage() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ApplyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    birthDate: "",
    instagram: "",
    referrer: "",
    referralSource: "",
    mainReason: "",
    mainReasonOther: "",
    musicInterest: "",
    musicInterestOther: "",
    consentKvkk: false,
    consentMarketing: false,
    website: "", // honeypot
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const birth = parseIsoBirthDate(form.birthDate);
    if (!birth) {
      setError("Geçerli bir doğum tarihi seçin.");
      return;
    }
    if (!birthDateNotInFuture(birth)) {
      setError("Doğum tarihi gelecekte olamaz.");
      return;
    }
    if (!isAtLeastAge(birth, 18)) {
      setError("18+ onayı gerekiyor.");
      return;
    }
    if (!form.consentKvkk) {
      setError("KVKK onayı zorunludur.");
      return;
    }
    if (!form.referrer.trim()) {
      setError("Referans alanı zorunludur.");
      return;
    }
    if (!form.referralSource) {
      setError("“Bize nasıl ulaştın?” seçimini yapın.");
      return;
    }
    if (!form.mainReason) {
      setError("Katılım amacını seçin.");
      return;
    }
    if (form.mainReason === "Diğer" && form.mainReasonOther.trim().length < 3) {
      setError("Katılım amacı “Diğer” ise kısa bir açıklama yazın.");
      return;
    }
    if (!form.musicInterest) {
      setError("Müzik ilgisini seçin.");
      return;
    }
    if (form.musicInterest === "Diğer" && form.musicInterestOther.trim().length < 3) {
      setError("Müzik ilgisi “Diğer” ise kısa bir açıklama yazın.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/noqta-club/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          city: form.city,
          birthDate: form.birthDate,
          instagram: form.instagram,
          referrer: form.referrer,
          referralSource: form.referralSource,
          mainReason: form.mainReason,
          mainReasonOther: form.mainReasonOther,
          musicInterest: form.musicInterest,
          musicInterestOther: form.musicInterestOther,
          consentKvkk: form.consentKvkk,
          consentMarketing: form.consentMarketing,
          website: form.website,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as any;
      if (!res.ok || !data?.ok) {
        setResult({ ok: false, error: data?.error || "Başvuru gönderilemedi" });
        setError(data?.error || "Başvuru gönderilemedi");
        return;
      }
      setResult({ ok: true });
    } catch (err: any) {
      setResult({ ok: false, error: err?.message || "Sunucu hatası" });
      setError(err?.message || "Sunucu hatası");
    } finally {
      setPending(false);
    }
  }

  if (result?.ok) {
    return (
      <PageShell withGlow={false}>
        <ContentCard className="bg-black/20 p-6 md:p-8">
          <div className="grid gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Harika, formun bize ulaştı</h1>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Mesajını okuyup sana en kısa sürede e-posta ile döneceğiz. Aramıza katılmak istediğin için teşekkürler — birlikte üretmek için sabırsızlanıyoruz.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/noqta-club"
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90"
              >
                Noqta Club sayfasına dön
              </Link>
            </div>
          </div>
        </ContentCard>
      </PageShell>
    );
  }

  return (
    <PageShell withGlow={true}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:items-start md:gap-12">
        <div className="grid gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
            Noqta Club
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">Kulübe katıl</h1>
          <p className="text-white/75 text-sm md:text-base leading-relaxed">
            Aynı frekansta insanlarla tanışmak, birbirinizi dinlemek ve birlikte şeyler üretmek istiyorsan doğru yerdesin. Formu doldur; kim olduğunu ve neye hevesli olduğunu duymak isteriz. Okuyup sana mail ile döneceğiz.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/65">
            Güvenlik için basit spam ve çift kayıt kontrolleri var; gecikme olursa bir süre sonra tekrar deneyebilirsin.
          </div>
        </div>

        <ContentCard className="bg-black/20 p-6 md:p-8">
          <form onSubmit={onSubmit} className="grid gap-4">
            <input type="text" name="website" className="hidden" value={form.website} onChange={(ev) => setForm((s) => ({ ...s, website: ev.target.value }))} />

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Ad Soyad *</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                value={form.name}
                onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                required
                placeholder="Ad Soyad"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">E-posta *</span>
              <input
                type="email"
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                value={form.email}
                onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                required
                placeholder="ornek@posta.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Telefon (opsiyonel)</span>
              <input
                type="tel"
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                placeholder="5xx xxx xx xx"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Şehir *</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                value={form.city}
                onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
                required
                placeholder="Şehir"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Doğum tarihi (18+ kontrolü) *</span>
              <input
                type="date"
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                value={form.birthDate}
                onChange={(e) => setForm((s) => ({ ...s, birthDate: e.target.value }))}
                required
                max={new Date().toISOString().slice(0, 10)}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Sosyal medya hesabı (Instagram) *</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                value={form.instagram}
                onChange={(e) => setForm((s) => ({ ...s, instagram: e.target.value }))}
                required
                placeholder="@kullanici"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Referans *</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                value={form.referrer}
                onChange={(e) => setForm((s) => ({ ...s, referrer: e.target.value }))}
                required
                placeholder="Seni öneren kişi @kullanıcı veya isim / mekan"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Bize nasıl ulaştın? *</span>
              <select
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
                value={form.referralSource}
                onChange={(e) => setForm((s) => ({ ...s, referralSource: e.target.value }))}
                required
              >
                <option value="">Seç…</option>
                {NOQTA_CLUB_REFERRAL_SOURCE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Noqta Club’a katılım amacın *</span>
              <select
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
                value={form.mainReason}
                onChange={(e) =>
                  setForm((s) => ({ ...s, mainReason: e.target.value, mainReasonOther: "" }))
                }
                required
              >
                <option value="">Seç…</option>
                {NOQTA_CLUB_MAIN_REASON_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            {form.mainReason === "Diğer" ? (
              <label className="grid gap-2">
                <span className="text-sm text-white/80">Kısa açıklama (Diğer) *</span>
                <textarea
                  rows={3}
                  className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                  value={form.mainReasonOther}
                  onChange={(e) => setForm((s) => ({ ...s, mainReasonOther: e.target.value }))}
                  required
                  placeholder="1–3 cümle"
                />
              </label>
            ) : null}

            <label className="grid gap-2">
              <span className="text-sm text-white/80">Müzik ilgin *</span>
              <select
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
                value={form.musicInterest}
                onChange={(e) =>
                  setForm((s) => ({ ...s, musicInterest: e.target.value, musicInterestOther: "" }))
                }
                required
              >
                <option value="">Seç…</option>
                {NOQTA_CLUB_MUSIC_INTEREST_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            {form.musicInterest === "Diğer" ? (
              <label className="grid gap-2">
                <span className="text-sm text-white/80">Kısa açıklama (Diğer) *</span>
                <textarea
                  rows={3}
                  className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                  value={form.musicInterestOther}
                  onChange={(e) => setForm((s) => ({ ...s, musicInterestOther: e.target.value }))}
                  required
                  placeholder="Örn. türler, dinleme üretim alışkanlığın"
                />
              </label>
            ) : null}

            <div className="grid gap-3 pt-2">
              <label className="flex items-start gap-3 text-white/85 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consentKvkk}
                  onChange={(e) => setForm((s) => ({ ...s, consentKvkk: e.target.checked }))}
                  required
                  className="mt-1 accent-black"
                />
                <span className="text-sm leading-relaxed">
                  Kişisel verilerimin işlenmesine izin veriyorum.{" "}
                  <Link href="/kvkk/noqta-club" className="text-fuchsia-300 underline">
                    KVKK aydınlatma metni
                  </Link>{" "}
                </span>
              </label>

              <label className="flex items-start gap-3 text-white/85 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consentMarketing}
                  onChange={(e) => setForm((s) => ({ ...s, consentMarketing: e.target.checked }))}
                  className="mt-1 accent-black"
                />
                <span className="text-sm leading-relaxed">
                  Tarafıma e-posta/SMS ile bilgilendirme yapılmasını kabul ediyorum. (opsiyonel)
                </span>
              </label>
            </div>

            {error ? <div className="text-sm text-red-400" aria-live="polite">{error}</div> : null}

            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-50"
            >
              {pending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
          </form>
        </ContentCard>
      </div>
    </PageShell>
  );
}

