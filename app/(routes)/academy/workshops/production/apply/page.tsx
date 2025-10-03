"use client";

import { useState } from "react";
import Section from "@/components/Section";

export default function ApplyProductionWorkshopPage() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const kind = "production" as const;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
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
    <Section title="Müzik Prodüksiyon Workshop Başvuru" description="Kısa formu doldur, seni arayalım.">
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
            <span className="text-sm text-white/80">Şehir</span>
            <input name="city" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          </label>
          <label className="grid gap-2 md:col-span-2">
            <span className="text-sm text-white/80">Instagram</span>
            <input name="instagram" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="@handle" />
          </label>
        </div>

        <div className="grid gap-3 rounded-xl border border-white/10 p-3">
          <div className="text-sm text-white/80">Prodüksiyon Workshop Soruları</div>
          <input name="q_daw" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Kullandığın DAW (Ableton/Logic vb.)" />
          <input name="q_seviye" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Seviye (başlangıç/orta/ileri)" />
          <input name="q_bilgisayar" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" placeholder="Bilgisayar getirir misin?" />
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


