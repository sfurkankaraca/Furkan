export const metadata = { title: "DJ Rezervasyon | noqta" };

export default function BookingPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">DJ Rezervasyon</h1>
      <p className="text-white/70 max-w-prose">
        Mekanlar, markalar ve özel etkinlikler için DJ ayarlıyoruz. Kısa bir brif ver; konseptine ve bütçene en uygun isimlerle geri dönelim.
      </p>
      <div className="mt-6 grid gap-4">
        <div className="inline-flex rounded-2xl p-[2px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400">
          <div className="rounded-[14px] bg-white/5 p-4">
            <div className="font-medium">Kullanım Alanları</div>
            <ul className="text-white/70 text-sm list-disc ml-5 mt-2">
              <li>Mekan geceleri</li>
              <li>Marka/aktivasyon etkinlikleri</li>
              <li>Özel etkinlikler</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
