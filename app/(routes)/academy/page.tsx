export const metadata = { title: "Akademi | noqta" };

export default function AcademyPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Akademi</h1>
      <p className="text-white/70 max-w-prose">
        DJ’lik ve elektronik müzik alanında pratik odaklı programlar. Uzun soluklu Labs müfredatları ve tek seanslık Workshops ile öğren, uygula, paylaş.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/academy/labs" className="inline-flex rounded-2xl p-[2px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400">
          <div className="rounded-[14px] bg-white/5 hover:bg-white/10 transition p-6 w-full">
            <div className="text-xl font-medium">Labs</div>
            <div className="text-white/70 mt-1">Haftalık ilerleyen müfredatlar, mentör eşliğinde derin pratik.</div>
          </div>
        </a>
        <a href="/academy/workshops" className="inline-flex rounded-2xl p-[2px] bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-300">
          <div className="rounded-[14px] bg-white/5 hover:bg-white/10 transition p-6 w-full">
            <div className="text-xl font-medium">Workshops</div>
            <div className="text-white/70 mt-1">Tek seanslık yoğun oturumlar; konu odaklı, uygulamalı.</div>
          </div>
        </a>
      </div>
    </div>
  );
}
