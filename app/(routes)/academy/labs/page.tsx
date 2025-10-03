export const metadata = { title: "Labs | noqta" };

function NeonCard({
  title,
  children,
  gradient = "from-fuchsia-500 via-purple-500 to-cyan-400",
}: {
  title: string;
  children: React.ReactNode;
  gradient?: string;
}) {
  return (
    <div className={`inline-flex rounded-2xl p-[2px] bg-gradient-to-r ${gradient}`}>
      <div className="rounded-[14px] bg-black hover:bg-black transition p-5 w-full">
        <div className="text-white font-medium text-lg">{title}</div>
        <div className="text-white/70 text-sm mt-2 space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="list-disc ml-5 space-y-1 text-white/80 text-sm">{items.map((it, i) => (<li key={i}>{it}</li>))}</ul>
  );
}

export default function LabsPage() {
  const weeks = [
    "1. Hafta: Başlangıç — DJ’lik nedir? Ekipman tanıtımı, temel kavramlar",
    "2. Hafta: Rekordbox — Kurulum, arayüz, ayarlar",
    "3. Hafta: Müzik Arşivi — Bulma, format, kategorizasyon, tagging",
    "4. Hafta: Set Hazırlama — Parça analizi, grid, phrasing, cue noktaları",
    "5. Hafta: Efektler — Kullanım senaryoları, geçiş tasarlama",
    "6. Hafta: Ritim Karıştırma (Beatmixing) — Tempo eşleştirme",
    "7. Hafta: Ritim Karıştırma 2 — Beatmatching, phrase matching",
    "8. Hafta: Türler ve Pratik 1 — House/EDM geçişleri",
    "9. Hafta: Türler ve Pratik 2 — Hip‑Hop/R&B geçişleri",
    "10. Hafta: Türler ve Pratik 3 — Pop/Rock geçişleri",
    "11. Hafta: Türler ve BPM’ler Arası — Farklı türler/bpm’ler, doğaçlama",
    "12. Hafta: Bitirme Performansı — Sahnede set, final değerlendirme",
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 grid gap-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Labs</h1>
      <ul className="text-white/70 max-w-prose list-disc ml-5 space-y-1">
        <li>4-5 kişilik gruplar</li>
        <li>12 Haftalık teknikten pratiğe, sıfırdan profesyonel seviyeye uzanan programlar.</li>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeonCard title="DJ 101 (12 hafta)">
          <Bullets items={["12 Hafta", "Haftada bir gün 1.5 saat"]} />
          <p>
            Bu program sonunda temel teknikleri bilmen, kendi müzik seçkini düzenleyebilmen ve sahnede performans sergileyebilmen amaçlanır.
          </p>
          <div className="mt-3">
            <div className="text-white text-sm font-medium">Haftalık Ders Takvimi</div>
            <ol className="mt-2 space-y-2 list-decimal ml-5 text-white/80 text-sm">
              {weeks.map((w, i) => (<li key={i}>{w}</li>))}
            </ol>
          </div>
          <div className="pt-2">
            <a href="/academy/labs/dj101/apply" className="inline-block rounded-xl bg-white text-black px-3 py-1.5 text-sm font-medium">Başvur</a>
          </div>
        </NeonCard>

        <NeonCard title="Music Production 101" gradient="from-emerald-400 via-lime-400 to-teal-300">
          <Bullets items={["Logic Pro ile müzik prodüksiyon", "Ableton ile müzik prodüksiyon"]} />
          <div className="pt-2">
            <a href="/academy/labs/prod101/apply" className="inline-block rounded-xl bg-white text-black px-3 py-1.5 text-sm font-medium">Başvur</a>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
