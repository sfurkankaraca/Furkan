import { ArrowRight, CalendarCheck, CheckCircle2, Gamepad2, Presentation, Sparkles } from "lucide-react";

// İçerik labs.noqt.club'daki gerçek müfredattan (dj101/public/sunum/*.default.json) alındı.
// Modül eklenince sayılar burada da güncellenmeli.
const COURSES = [
  {
    name: "DJ 101",
    status: "Aktif",
    modules: 19,
    desc: "Ritim, geçişler, Rekordbox ve beatmatching — teoriden pratiğe.",
    topics: [
      "BPM, beat, bar ve phrase",
      "Rekordbox: import, analiz, cue noktaları",
      "Kulakla beatmatching",
      "Camelot Wheel ve harmonic mixing",
      "Set planlama ve performans",
    ],
    live: true,
  },
  {
    name: "Production 101",
    status: "Aktif",
    modules: 16,
    desc: "Fikirden export'a: DAW, ses tasarımı, aranjman ve mix.",
    topics: [
      "DAW arayüzü, MIDI ve audio",
      "Drum programming ve groove",
      "Synthesizer, filtre ve ADSR",
      "Aranjman ve mixing temelleri",
      "Export ve mastering temelleri",
    ],
    live: true,
  },
];

const FEATURES = [
  { icon: Presentation, title: "İnteraktif dersler", desc: "Her modül görsel ve örnekli sunumlarla, kendi hızında." },
  { icon: CheckCircle2, title: "Quiz ve pratik ödev", desc: "Öğrendiğini quizle pekiştir, pratik ödevle uygula." },
  { icon: Gamepad2, title: "Kulak oyunları", desc: "BPM tahmini ve tür quiz'iyle kulağını eğlenerek geliştir." },
  { icon: CalendarCheck, title: "Ders rezervasyonu", desc: "Online ders veya yüz yüze mentorluk için yerini ayırt." },
];

export function LabsShowcase() {
  return (
    <section id="labs" className="scroll-mt-16 bg-foreground py-20 text-background md:py-28">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-background/60">
            <Sparkles className="size-3.5 text-noqt-lime" aria-hidden />
            noqt labs
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Dersten sonra da çalışmaya devam et</h2>
          <p className="mt-3 text-base leading-relaxed text-background/70">
            labs.noqt.club, NOQT Academy&apos;nin online ders platformu. Modül modül ilerleyen kurslar, quizler, pratik
            ödevler ve kulak oyunları tek yerde.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {COURSES.map((c) => (
            <div key={c.name} className="flex flex-col rounded-2xl border border-background/15 bg-background/5 p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold">{c.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    c.live ? "bg-noqt-lime text-black" : "bg-background/10 text-background/60"
                  }`}
                >
                  {c.status} · {c.modules} modül
                </span>
              </div>
              <p className="mt-2 text-sm text-background/70">{c.desc}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {c.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-background/85">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-noqt-lime" />
                    {t}
                  </li>
                ))}
                <li className="pl-3.5 text-xs text-background/50">+ {c.modules - c.topics.length} modül daha</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-background/10 p-5">
              <Icon className="size-5 text-noqt-sky" aria-hidden />
              <p className="mt-3 text-sm font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-background/60">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://labs.noqt.club/register"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-noqt-lime px-6 py-2.5 text-sm font-semibold text-black transition hover:brightness-95"
          >
            Labs&apos;a kayıt ol
            <ArrowRight className="size-4" aria-hidden />
          </a>
          <a
            href="https://labs.noqt.club"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-background/25 px-6 py-2.5 text-sm font-medium transition hover:bg-background/10"
          >
            labs.noqt.club&apos;u keşfet ↗
          </a>
        </div>
      </div>
    </section>
  );
}
