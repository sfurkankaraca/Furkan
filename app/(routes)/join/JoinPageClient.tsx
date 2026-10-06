"use client";

import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { useEffect, useRef, useState } from "react";
import { submitJoin } from "./actions";

type ClubPackage = {
  id: string;
  name: string;
  priceTry: number;
  periodLabel: string;
  description: string;
  features: string[];
  mappedRole: "participant" | "student" | "dj";
  coverUrl?: string;
};

export function JoinPageClient({
  tierImageUrls,
  packages,
}: {
  tierImageUrls: (string | null)[];
  packages: ClubPackage[];
}) {
  const [role, setRole] = useState<"dj" | "participant" | "student" | "">("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  const tiers = packages.map((p) => ({
    id: p.id,
    title: p.name,
    price: `${p.priceTry.toFixed(0)} ₺`,
    period: p.periodLabel || "/ ay",
    features: p.features || [],
    mappedRole: p.mappedRole,
    coverUrl: p.coverUrl,
  }));

  function handleApply(mappedRole: "dj" | "participant" | "student") {
    setRole(mappedRole);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function action(formData: FormData) {
    setBusy(true);
    try {
      await submitJoin(formData);
      setDone(true);
    } catch {
      alert("Gönderim başarısız");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    if (roleParam === "dj" || roleParam === "participant" || roleParam === "student") {
      setRole(roleParam as "dj" | "participant" | "student");
    }
  }, []);

  return (
    <PageShell>
      <div className="grid gap-8 md:gap-10">
        <PageHeader
          title="Topluluğa katıl"
          description={
            <>
              <p>
                noqta; müzik üretenlerle dinleyicileri aynı masada toplayan yaratıcı bir etkinlik topluluğu. Burada birbirimize
                kulak veririz, deneyim paylaşır, beraber üretir ve birlikte sunarız — gizli parti kulübü değil, ortak frekansta
                büyüyen bir sahne.
              </p>
              <p className="mt-3 text-white/80">
                Aşağıda sana uygun paketi seç, rolünü işaretle ve formu doldur. En geç bir hafta içinde e-postayla döneriz.
              </p>
            </>
          }
        />
        <ContentCard className="p-6 md:p-8">
          <div className="grid gap-8 max-w-4xl mx-auto">
            <div className="grid gap-4">
              <div className="text-center">
                <div className="text-xl font-medium text-white">Sana uygun katılım</div>
                <p className="text-sm text-white/55 mt-1">
                  Hepsi aynı topluluğun farklı derinlikleri — hangisi sana uyuyorsa oradan başla.
                </p>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-4 snap-x snap-mandatory px-1">
                  {tiers.map((t, idx) => {
                    const primarySrc = t.coverUrl || tierImageUrls[idx] || `/${idx + 1}.JPG`;
                    const isLocalNumeric = /^\/\d+(\.[a-zA-Z]+)?$/.test(primarySrc.split("?")[0] ?? "");
                    return (
                      <div
                        key={t.id}
                        className="snap-start min-w-[280px] w-[85%] sm:w-[320px] max-w-[360px] rounded-2xl p-[2px] bg-gradient-to-r from-noqt-lime/50 via-noqt-lime/40 to-noqt-sky/50"
                      >
                        <div className="rounded-[14px] h-full bg-black/80 p-4 flex flex-col">
                          <div className="rounded-xl overflow-hidden mb-3 aspect-[16/10] bg-white/5">
                            <img
                              src={primarySrc}
                              data-ext-index="0"
                              alt={t.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                              draggable={false}
                              onError={(e) => {
                                if (!isLocalNumeric) return;
                                const exts = [".JPG", ".jpg", ".jpeg", ".JPEG", ".png", ".webp"];
                                const target = e.currentTarget as HTMLImageElement;
                                const base = `/${idx + 1}`;
                                const current = Number(target.getAttribute("data-ext-index") || "0");
                                const next = current + 1;
                                if (next < exts.length) {
                                  target.setAttribute("data-ext-index", String(next));
                                  target.src = `${base}${exts[next]}`;
                                }
                              }}
                            />
                          </div>
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="text-lg font-medium text-white">{t.title}</div>
                            <div className="text-white">
                              <span className="text-2xl font-semibold">{t.price}</span>
                              <span className="text-white/60 text-sm ml-1">{t.period}</span>
                            </div>
                          </div>
                          <ul className="mt-3 grid gap-2 text-white/80 text-sm">
                            {t.features.map((f) => (
                              <li key={f} className="inline-flex items-start gap-2">
                                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => handleApply(t.mappedRole)}
                              className="w-full rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90"
                            >
                              Başvur
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div ref={formRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3 place-items-center">
              {[
                { id: "dj", label: "DJ", desc: "Set, tarz, ekipman" },
                { id: "participant", label: "Katılımcı", desc: "Dinlediğin tarzlar" },
                { id: "student", label: "DJ Eğitimi Adayı", desc: "Seviye, amaç, uygunluk" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as "dj" | "participant" | "student")}
                  className={`w-full inline-flex rounded-2xl p-[2px] ${
                    role === r.id
                      ? "bg-gradient-to-r from-noqt-lime via-noqt-lime to-noqt-sky"
                      : "bg-gradient-to-r from-white/20 via-white/10 to-white/20"
                  }`}
                >
                  <span
                    className={`rounded-[14px] w-full bg-black/80 p-4 text-left ${
                      role === r.id ? "text-white" : "text-white/80"
                    }`}
                  >
                    <div className="text-lg font-medium">{r.label}</div>
                    <div className="text-white/60 text-sm mt-1">{r.desc}</div>
                  </span>
                </button>
              ))}
            </div>

            {role === "" ? (
              <div className="text-white/70 text-sm text-center">Önce rolünü seç; formu ona göre doldururuz.</div>
            ) : done ? (
              <div className="rounded-xl border border-white/10 p-4 bg-white/5 text-center">
                Teşekkürler! Başvurun bize ulaştı. En geç bir hafta içinde e-postayla döneriz. Gelen kutunu ve gerekiyorsa spam
                klasörünü kontrol etmeyi unutma.
              </div>
            ) : (
              <form action={action} className="grid gap-4">
                <input type="hidden" name="role" value={role} />

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2" htmlFor="name">
                    <span className="text-sm text-white/80">Ad Soyad</span>
                    <input
                      id="name"
                      name="name"
                      required
                      className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="Ad Soyad"
                    />
                  </label>
                  <label className="grid gap-2" htmlFor="email">
                    <span className="text-sm text-white/80">Email</span>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="you@mail.com"
                    />
                  </label>
                  <label className="grid gap-2" htmlFor="city">
                    <span className="text-sm text-white/80">Şehir</span>
                    <input
                      id="city"
                      name="city"
                      className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </label>
                  <label className="grid gap-2" htmlFor="phone">
                    <span className="text-sm text-white/80">Telefon</span>
                    <input
                      id="phone"
                      name="phone"
                      className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="+90 ..."
                    />
                  </label>
                  <label className="grid gap-2" htmlFor="instagram">
                    <span className="text-sm text-white/80">Instagram</span>
                    <input
                      id="instagram"
                      name="instagram"
                      className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                      placeholder="@handle"
                    />
                  </label>
                </div>

                {role === "dj" && (
                  <div className="grid gap-3 rounded-xl border border-white/10 p-3">
                    <div className="text-sm text-white/80">DJ Bilgileri</div>
                    <input name="genres" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Tarz(lar)" />
                    <input name="experienceYears" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Deneyim (yıl)" />
                    <input name="equipment" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Ekipman" />
                    <input name="mixes" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Mix/Set linkleri" />
                    <input name="availability" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Uygunluk (gün/saat)" />
                  </div>
                )}

                {role === "participant" && (
                  <div className="grid gap-3 rounded-xl border border-white/10 p-3">
                    <div className="text-sm text-white/80">Katılımcı Bilgileri</div>
                    <input name="tastes" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Neler dinlersin?" />
                    <input name="age" type="number" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Yaş" />
                    <select name="hasCar" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white">
                      <option value="no">Arabam yok</option>
                      <option value="yes">Arabam var</option>
                    </select>
                  </div>
                )}

                {role === "student" && (
                  <div className="grid gap-3 rounded-xl border border-white/10 p-3">
                    <div className="text-sm text-white/80 font-medium">DJ Eğitimi Aday Formu</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <input name="age" type="number" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Yaş" />
                      <input name="q_socials" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Sosyal hesap(lar) (@, link)" />
                    </div>

                    <div className="grid gap-2">
                      <span className="text-sm text-white/80">DJ&apos;likle alakan ne düzeyde?</span>
                      <div className="grid gap-2 text-sm text-white/80">
                        {[
                          "Hiç denemedim ama ilgim çok yüksek",
                          "Takip ediyorum ama başlamadım",
                          "Biraz denedim / öğreniyorum",
                          "Evde pratik yapıyorum",
                          "Sahne aldım / alıyorum",
                        ].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-2">
                            <input type="radio" name="q_level" value={opt} required />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-sm text-white/80">En çok hangi müzik türleri ilgini çekiyor?</span>
                      <input name="q_genres" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Örn: Techno, House, Afro..." />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm text-white/80">Neden DJ eğitimi almak istiyorsun?</span>
                      <textarea name="q_reason" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-24" />
                    </label>

                    <div className="grid gap-2">
                      <span className="text-sm text-white/80">Hedefin nedir?</span>
                      <div className="grid gap-2 text-sm text-white/80">
                        {["Hobi", "Arkadaş ortamında çalmak", "Bar/etkinlik/festival hedefi"].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-2">
                            <input type="radio" name="q_goal" value={opt} required />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <span className="text-sm text-white/80">Uygunluk (birden fazla seçebilirsin)</span>
                      <div className="grid gap-2 text-sm text-white/80">
                        {["Hafta içi akşam", "Hafta sonu gündüz", "Hafta sonu akşam", "Fark etmez"].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-2">
                            <input type="checkbox" name="q_availability" value={opt} />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <span className="text-sm text-white/80">Bilgisayar ve kulaklık var mı?</span>
                      <div className="grid gap-2 text-sm text-white/80">
                        {["Evet", "Hayır"].map((opt) => (
                          <label key={opt} className="inline-flex items-center gap-2">
                            <input type="radio" name="q_has_gear" value={opt} required />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <label className="grid gap-2" htmlFor="note">
                  <span className="text-sm text-white/80">Ek Not (opsiyonel)</span>
                  <textarea
                    id="note"
                    name="note"
                    rows={4}
                    className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
                  />
                </label>

                <div className="flex justify-center">
                  <button type="submit" disabled={busy} className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-60">
                    Kaydol
                  </button>
                </div>
              </form>
            )}
          </div>
        </ContentCard>
      </div>
    </PageShell>
  );
}
