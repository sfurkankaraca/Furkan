export const metadata = { title: "Games | noqta" };

export default function GamesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="https://quiz.noqta.club"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-2xl p-[2px] bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-300 shadow-[0_0_12px_rgba(52,211,153,0.5)] hover:shadow-[0_0_18px_rgba(52,211,153,0.8)] transition-shadow"
        >
          <div className="rounded-[14px] bg-white/5 hover:bg-white/10 transition p-6 w-full">
            <div className="text-xl font-medium">Genre Quiz</div>
            <div className="text-white/60 mt-1">Müziğin türünü tahmin et.</div>
          </div>
        </a>
      </div>
    </div>
  );
}
