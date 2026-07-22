"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ContentCard, PageShell } from "@/components/layout/PageShell";
import UploadWidget from "@/components/UploadWidget";

const GENRE_OPTIONS = [
  "Techno",
  "House",
  "Disco",
  "Funk",
  "Hip-hop",
  "R&B",
  "Pop",
  "Rock",
  "Indie",
  "Jazz",
  "Klasik",
  "Drum & bass",
  "UK garage",
  "Afro",
  "Latin",
  "Diğer",
] as const;

const steps = [
  { n: 1, title: "Müzik profilin", desc: "Hangi türlerde dans ediyorsun? Favori sanatçıların?" },
  { n: 2, title: "Kişisel bilgiler", desc: "Bilet ve iletişim için gerekli." },
  { n: 3, title: "Adres", desc: "Fatura ve yasal süreçlerde kullanılabilir." },
  { n: 4, title: "Kurumsal fatura (isteğe bağlı)", desc: "Şirket adına fatura için." },
  { n: 5, title: "Onay", desc: "Kullanım şartları ve ileti tercihleri." },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [s1, setS1] = useState({
    genres: new Set<string>(),
    favoriteArtists: "",
    musicNotes: "",
    image: "",
  });
  const [s2, setS2] = useState({ firstName: "", lastName: "", phone: "", birthDate: "" });
  const [s3, setS3] = useState({ city: "", district: "", addressLine: "", postalCode: "", country: "TR" });
  const [s4, setS4] = useState({ companyName: "", taxNumber: "", taxOffice: "", invoiceEmail: "" });
  const [s5, setS5] = useState({ termsAccepted: false, marketingEmailConsent: false });

  function toggleGenre(g: string) {
    setS1((prev) => {
      const next = new Set(prev.genres);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return { ...prev, genres: next };
    });
  }

  async function submitStep(current: number) {
    setBusy(true);
    setErr("");
    let data: Record<string, unknown> = {};
    if (current === 1) {
      data = {
        musicGenres: [...s1.genres],
        favoriteArtists: s1.favoriteArtists,
        musicNotes: s1.musicNotes,
        image: s1.image,
      };
    } else if (current === 2) data = { ...s2 };
    else if (current === 3) data = { ...s3 };
    else if (current === 4) data = { ...s4 };
    else if (current === 5) data = { ...s5 };

    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ step: current, data }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j?.error || "Kaydedilemedi");
        setBusy(false);
        return;
      }
      await refresh();
      if (current === 5) {
        router.push("/events");
        return;
      }
      setStep(current + 1);
    } catch {
      setErr("Bağlantı hatası");
    }
    setBusy(false);
  }

  const meta = steps.find((x) => x.n === step)!;

  return (
    <PageShell withGlow={false}>
      <ContentCard className="max-w-lg mx-auto p-6 md:p-8">
        <div className="mb-8">
          <div className="text-xs text-white/50 mb-2">
            Adım {step} / 5
          </div>
          <h1 className="text-2xl font-semibold">{meta.title}</h1>
          <p className="text-white/60 text-sm mt-1">{meta.desc}</p>
          <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= step ? "bg-fuchsia-500" : "bg-white/10"}`}
              />
            ))}
          </div>
        </div>

        {err ? <div className="mb-4 text-sm text-red-400">{err}</div> : null}

        {step === 1 ? (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <span className="text-sm text-white/70">En az bir tür seç *</span>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                      s1.genres.has(g)
                        ? "bg-fuchsia-600 border-fuchsia-400 text-white"
                        : "border-white/20 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Favori sanatçılar veya plak şirketleri</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                placeholder="Örn. The Weeknd, Peggy Gou..."
                value={s1.favoriteArtists}
                onChange={(e) => setS1({ ...s1, favoriteArtists: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Kısa not (isteğe bağlı)</span>
              <textarea
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-[72px]"
                placeholder="Gece hayatında ne arıyorsun?"
                value={s1.musicNotes}
                onChange={(e) => setS1({ ...s1, musicNotes: e.target.value })}
              />
            </label>
            <div className="grid gap-2 rounded-xl border border-white/10 bg-black/15 p-3">
              <span className="text-sm text-white/70">Profil fotoğrafı (isteğe bağlı)</span>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/5">
                  {s1.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={s1.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-white/35">—</div>
                  )}
                </div>
                <div className="grid gap-1 min-w-0">
                  <UploadWidget
                    uploadApiPath="/api/me/upload-avatar"
                    withCredentials
                    buttonLabel="Fotoğraf yükle"
                    onUploadComplete={(url) => setS1({ ...s1, image: url })}
                  />
                  <p className="text-[11px] text-white/40">En fazla 5 MB</p>
                </div>
              </div>
              {s1.image ? (
                <button
                  type="button"
                  className="text-left text-xs text-red-400/90 hover:text-red-300 w-fit"
                  onClick={() => setS1({ ...s1, image: "" })}
                >
                  Kaldır
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Ad</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s2.firstName}
                onChange={(e) => setS2({ ...s2, firstName: e.target.value })}
                required
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Soyad</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s2.lastName}
                onChange={(e) => setS2({ ...s2, lastName: e.target.value })}
                required
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Cep telefonu</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                placeholder="+90 5xx xxx xx xx"
                value={s2.phone}
                onChange={(e) => setS2({ ...s2, phone: e.target.value })}
                required
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Doğum tarihi (isteğe bağlı)</span>
              <input
                type="date"
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s2.birthDate}
                onChange={(e) => setS2({ ...s2, birthDate: e.target.value })}
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4">
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Şehir *</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s3.city}
                onChange={(e) => setS3({ ...s3, city: e.target.value })}
                required
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">İlçe</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s3.district}
                onChange={(e) => setS3({ ...s3, district: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Adres satırı</span>
              <textarea
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-[88px]"
                value={s3.addressLine}
                onChange={(e) => setS3({ ...s3, addressLine: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Posta kodu</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s3.postalCode}
                onChange={(e) => setS3({ ...s3, postalCode: e.target.value })}
              />
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="grid gap-4">
            <p className="text-sm text-white/50">Bu adımı boş bırakıp atlayabilirsiniz.</p>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Şirket ünvanı</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s4.companyName}
                onChange={(e) => setS4({ ...s4, companyName: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Vergi numarası</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s4.taxNumber}
                onChange={(e) => setS4({ ...s4, taxNumber: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Vergi dairesi</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s4.taxOffice}
                onChange={(e) => setS4({ ...s4, taxOffice: e.target.value })}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Fatura e-postası</span>
              <input
                type="email"
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={s4.invoiceEmail}
                onChange={(e) => setS4({ ...s4, invoiceEmail: e.target.value })}
              />
            </label>
          </div>
        ) : null}

        {step === 5 ? (
          <div className="grid gap-4">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={s5.termsAccepted}
                onChange={(e) => setS5({ ...s5, termsAccepted: e.target.checked })}
                className="mt-1 rounded border-white/30"
              />
              <span className="text-white/80">
                Kişisel verilerimin etkinlik ve bilet hizmetleri kapsamında işlenmesini ve{" "}
                <a href="/contact" className="text-fuchsia-300 underline">
                  iletişim
                </a>{" "}
                kanallarından bilgilendirilmemi kabul ediyorum.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={s5.marketingEmailConsent}
                onChange={(e) => setS5({ ...s5, marketingEmailConsent: e.target.checked })}
                className="mt-1 rounded border-white/30"
              />
              <span className="text-white/80">E-posta ile kampanya ve etkinlik duyuruları almak istiyorum (isteğe bağlı).</span>
            </label>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          {step > 1 ? (
            <Button type="button" variant="outline" className="rounded-xl border-white/25" disabled={busy} onClick={() => setStep(step - 1)}>
              Geri
            </Button>
          ) : null}
          <Button className="rounded-xl" disabled={busy} onClick={() => void submitStep(step)}>
            {busy ? "Kaydediliyor..." : step === 5 ? "Tamamla" : "Devam"}
          </Button>
        </div>
      </ContentCard>
    </PageShell>
  );
}
