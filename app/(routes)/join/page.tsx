"use client";

import Section from "@/components/Section";
import { useEffect, useState } from "react";
import { submitJoin } from "./actions";

export default function JoinPage() {
  const [role, setRole] = useState<'dj' | 'participant' | 'student' | ''>('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function action(formData: FormData) {
    setBusy(true);
    try {
      await submitJoin(formData);
      setDone(true);
    } catch (e) {
      alert('Gönderim başarısız');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'dj' || roleParam === 'participant' || roleParam === 'student') {
      setRole(roleParam as 'dj' | 'participant' | 'student');
    }
  }, []);

  return (
    <Section title="Kaybol" description="Rollünü seç ve aramıza katıl.">
      <div className="grid gap-6 max-w-3xl mx-auto">
        {/* Role selector as neon cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 place-items-center">
          {[{id:'dj',label:'DJ',desc:'Set, tarz, ekipman'},{id:'participant',label:'Katılımcı',desc:'Dinlediğin tarzlar'},{id:'student',label:'DJ Eğitimi Adayı',desc:'Seviye, amaç, uygunluk'}].map((r:any)=> (
            <button key={r.id} onClick={() => setRole(r.id)} className={`w-full inline-flex rounded-2xl p-[2px] ${role===r.id? 'bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400':'bg-gradient-to-r from-white/20 via-white/10 to-white/20'}`}>
              <span className={`rounded-[14px] w-full bg-black/80 p-4 text-left ${role===r.id? 'text-white':'text-white/80'}`}>
                <div className="text-lg font-medium">{r.label}</div>
                <div className="text-white/60 text-sm mt-1">{r.desc}</div>
              </span>
            </button>
          ))}
        </div>

        {role === '' ? (
          <div className="text-white/70 text-sm text-center">Kaydolmak istediğin rolü seç.</div>
        ) : done ? (
          <div className="rounded-xl border border-white/10 p-4 bg-white/5 text-center">Teşekkürler! Başvurun alındı.</div>
        ) : (
          <form action={action} className="grid gap-4">
            <input type="hidden" name="role" value={role} />

            {/* Common fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2" htmlFor="name">
                <span className="text-sm text-white/80">Ad Soyad</span>
                <input id="name" name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Ad Soyad" />
              </label>
              <label className="grid gap-2" htmlFor="email">
                <span className="text-sm text-white/80">Email</span>
                <input id="email" type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="you@mail.com" />
              </label>
              <label className="grid gap-2" htmlFor="city">
                <span className="text-sm text-white/80">Şehir</span>
                <input id="city" name="city" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" />
              </label>
              <label className="grid gap-2" htmlFor="phone">
                <span className="text-sm text-white/80">Telefon</span>
                <input id="phone" name="phone" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="+90 ..." />
              </label>
              <label className="grid gap-2" htmlFor="instagram">
                <span className="text-sm text-white/80">Instagram</span>
                <input id="instagram" name="instagram" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="@handle" />
              </label>
            </div>

            {/* Role specific */}
            {role === 'dj' && (
              <div className="grid gap-3 rounded-xl border border-white/10 p-3">
                <div className="text-sm text-white/80">DJ Bilgileri</div>
                <input name="genres" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Tarz(lar)" />
                <input name="experienceYears" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Deneyim (yıl)" />
                <input name="equipment" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Ekipman" />
                <input name="mixes" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Mix/Set linkleri" />
                <input name="availability" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Uygunluk (gün/saat)" />
              </div>
            )}

            {role === 'participant' && (
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

            {role === 'student' && (
              <div className="grid gap-3 rounded-xl border border-white/10 p-3">
                <div className="text-sm text-white/80 font-medium">DJ Eğitimi Aday Formu</div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input name="age" type="number" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Yaş" />
                  <input name="q_socials" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Sosyal hesap(lar) (@, link)" />
                </div>

                <div className="grid gap-2">
                  <span className="text-sm text-white/80">DJ'likle alakan ne düzeyde?</span>
                  <div className="grid gap-2 text-sm text-white/80">
                    {["Hiç denemedim ama ilgim çok yüksek","Takip ediyorum ama başlamadım","Biraz denedim / öğreniyorum","Evde pratik yapıyorum","Sahne aldım / alıyorum"].map((opt) => (
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
                    {["Hobi","Arkadaş ortamında çalmak","Bar/etkinlik/festival hedefi"].map((opt) => (
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
                    {["Hafta içi akşam","Hafta sonu gündüz","Hafta sonu akşam","Fark etmez"].map((opt) => (
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
                    {["Evet","Hayır"].map((opt) => (
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
              <textarea id="note" name="note" rows={4} className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" />
            </label>

            <div className="flex justify-center"><button type="submit" disabled={busy} className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-60">Kaydol</button></div>
          </form>
        )}
      </div>
    </Section>
  );
} 