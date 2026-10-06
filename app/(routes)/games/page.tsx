import type { Metadata } from "next";
import { Gauge } from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Games | NOQT DJ Academy",
  description: "Müzikle oynanan deneyimler; genre quiz, BPM guess ve mini oyunlar. NOQT DJ Academy Games.",
};

export default function GamesPage() {
  return (
    <PageShell>
      <div className="grid gap-10">
        <PageHeader
          eyebrow={
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Games
            </p>
          }
          title="Oyunla keşfet"
          description="Müzikle oynanan deneyimler; genre quiz, BPM guess ve ileride eklenecek mini oyunlar burada toplanır."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://quiz.noqt.club"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-emerald-200 hover:shadow-sm"
          >
            <div className="inline-flex rounded-xl bg-emerald-50 border border-emerald-100 p-2.5 mb-4">
              <svg className="size-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div className="text-lg font-semibold text-foreground">Genre Quiz</div>
            <div className="mt-2 text-sm text-muted-foreground">Müziğin türünü tahmin et.</div>
            <span className="mt-4 block text-sm text-emerald-600 group-hover:text-emerald-700 transition">quiz.noqt.club →</span>
          </a>

          <a
            href="https://bpmguess.noqt.club"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-border bg-card p-6 transition hover:border-noqt-lime/60 hover:shadow-sm"
          >
            <div className="inline-flex rounded-xl bg-noqt-lime/15 border border-noqt-lime/60 p-2.5 mb-4">
              <Gauge className="size-6 text-noqt-lime-ink" aria-hidden />
            </div>
            <div className="text-lg font-semibold text-foreground">BPM Guess</div>
            <div className="mt-2 text-sm text-muted-foreground">Tempoyu kulakla yakalayıp BPM tahmin et.</div>
            <span className="mt-4 block text-sm text-noqt-lime-ink group-hover:text-noqt-lime-ink transition">bpmguess.noqt.club →</span>
          </a>
        </div>
      </div>
    </PageShell>
  );
}
