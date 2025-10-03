export const metadata = { title: "Workshops | noqta" };

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

export default function WorkshopsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 grid gap-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Workshops</h1>
      <ul className="text-white/70 max-w-prose list-disc ml-5 space-y-1">
        <li>8-10 kişilik gruplar</li>
        <li>Tek seanslık, deneyim ve uygulama odaklı oturumlar.</li>
      </ul>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NeonCard title="DJ Workshop (3 saat)">
          <p>
            Temel ekipman bilgisi, kavramlar ve kısa bir girişin ardından 2,5 saatlik B2B session.
          </p>
          <p>
            Herkes sırayla geçiş yapmayı dener, kulaklıkla tempo yakalar, sahne heyecanını deneyimler.
          </p>
          <div className="pt-2">
            <a href="/academy/workshops/dj/apply" className="inline-block rounded-xl bg-white text-black px-3 py-1.5 text-sm font-medium">Başvur</a>
          </div>
        </NeonCard>

        <NeonCard title="Müzik Prodüksiyon Workshop (3 saat)" gradient="from-emerald-400 via-lime-400 to-teal-300">
          <p>
            Prodüktör ile sıfırdan parça yapımı. Katılımcılar süreci canlı izler; isteyen kendi bilgisayarıyla dahil olur.
          </p>
          <p>
            Melodi, ritim, aranje ve mini mix deneyimi. Bilgisayar zorunlu değil.
          </p>
          <div className="pt-2">
            <a href="/academy/workshops/production/apply" className="inline-block rounded-xl bg-white text-black px-3 py-1.5 text-sm font-medium">Başvur</a>
          </div>
        </NeonCard>
      </div>
    </div>
  );
}
