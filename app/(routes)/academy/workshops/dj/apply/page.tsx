"use client";

import { useState } from "react";
import Section from "@/components/Section";

export default function ApplyDjWorkshopPage() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const kind = "dj" as const;

  function formDataToObject(fd: FormData) {
    const obj: Record<string, any> = {};
    fd.forEach((value, key) => {
      if (obj[key] === undefined) obj[key] = value;
      else if (Array.isArray(obj[key])) (obj[key] as any[]).push(value);
      else obj[key] = [obj[key], value];
    });
    return obj;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = formDataToObject(new FormData(form));
    setBusy(true);
    try {
      const res = await fetch("/api/workshops/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          instagram: data.instagram,
          answers: Object.fromEntries(Object.entries(data).filter(([k]) => k.startsWith("q_"))) as any,
        }),
      });
      const json = await res.json();
      if (json?.ok) setDone(true);
      else alert(json?.error || "Gönderim başarısız");
    } catch {
      alert("Gönderim başarısız");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section title="DJ Workshop Başvuru" description="Kısa formu doldur, seni arayalım.">
      <form onSubmit={submit} className="grid gap-4 max-w-2xl mx-auto">
        <input type="hidden" name="kind" value={kind} />

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-white/80">Ad Soyad</span>
            <input name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">E‑posta</span>
            <input type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">Telefon</span>
            <input name="phone" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">Şehir / İlçe</span>
            <input name="city" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">Yaş</span>
            <input name="q_age" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm text-white/80">Instagram</span>
            <input name="instagram" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="@handle" />
          </label>
        </div>

        <div className="grid gap-3 rounded-xl border border-white/10 p-3">
          <div className="text-sm text-white/80 font-medium">DJ'liğe Ne Kadar Meraklısın?</div>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">DJ'likle alakan ne düzeyde?</span>
            <div className="grid gap-2 text-sm text-white/80">
              {[
                "Hiç denemedim ama deli gibi ilgim var",
                "Uzun süredir takip ediyorum ama başlamadım",
                "Ufak tefek denedim, hâlâ öğrenme aşamasındayım",
                "Evde kendi kendime takılıyorum",
                "Aktif olarak sahne alıyorum",
              ].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input type="radio" name="q_level" value={opt} required />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </label>

          <div className="grid gap-2">
            <span className="text-sm text-white/80">En çok hangi müzik türleri ilgini çekiyor?</span>
            <div className="grid gap-2 text-sm text-white/80">
              {["Elektronik (Techno, House, Melodic vs.)","Afro / Baile Funk / Latin vibe'lar","Hip-Hop / Trap","Türkçe Pop / 90'lar","R&B / Soul","Diğer"].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input type="checkbox" name="q_genres" value={opt} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm text-white/80">Bu atölyeye neden katılmak istiyorsun?</span>
            <textarea name="q_reason" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-28" />
          </label>
        </div>

        <div className="grid gap-3 rounded-xl border border-white/10 p-3">
          <div className="text-sm text-white/80 font-medium">Zamanlama & Ekipman Durumu</div>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">Daha önce herhangi bir müzik eğitimi ya da DJ'lik deneyimin oldu mu? (Varsa kısaca nedir?)</span>
            <textarea name="q_prev_training" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-24" />
          </label>

          <div className="grid gap-2">
            <span className="text-sm text-white/80">Bu işi nasıl düşünüyorsun?</span>
            <div className="grid gap-2 text-sm text-white/80">
              {["Sadece hobi","Arkadaş ortamında çalmak istiyorum","Bar / etkinlik / festival gibi sahneler hedefim"].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input type="radio" name="q_goal" value={opt} required />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm text-white/80">Atölye ne zaman olsa sana uyar?</span>
            <div className="grid gap-2 text-sm text-white/80">
              {["Hafta içi akşam","Hafta sonu gündüz","Hafta sonu akşam","Fark etmez, yeter ki DJ olayım"].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input type="checkbox" name="q_availability" value={opt} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm text-white/80">Bilgisayarın ve kulaklığın var mı?</span>
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

        <div className="grid gap-3 rounded-xl border border-white/10 p-3">
          <div className="text-sm text-white/80 font-medium">Biraz da Ruhunu Görelim</div>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">İlk sahnene çıksaydın, hangi parçayla başlardın ve neden?</span>
            <textarea name="q_first_track" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-24" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">DJ'lik senin için ne ifade ediyor?</span>
            <textarea name="q_meaning" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-24" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-white/80">Seni bulabileceğimiz sosyal medya hesapların (Instagram, SoundCloud vs.)</span>
            <input name="q_socials" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          </label>
        </div>

        <div className="flex justify-center">
          <button type="submit" disabled={busy || done} className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium disabled:opacity-60">
            {done ? "Gönderildi" : busy ? "Gönderiliyor..." : "Başvur"}
          </button>
        </div>
      </form>
    </Section>
  );
}


