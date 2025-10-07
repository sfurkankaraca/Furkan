import DotRing from "@/components/DotRing";
import Section from "@/components/Section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Collective | noqta" };

export default function CollectivePage() {
  return (
    <Section title="Collective" description="a small circle for people who feel in loops.">
      <div className="relative grid place-items-center py-10 gap-4 overflow-hidden">
        {/* Background image with reduced brightness */}
        <div className="absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/DSC04369-1.jpg" alt="collective background" className="w-full h-full object-cover scale-105 brightness-[0.35]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        <DotRing size={220} />
        <blockquote className="text-center text-white/70">label, community, and a quiet place to get lost together.</blockquote>
        <p className="max-w-2xl text-center text-white/80">
          minimal and unhurried. we listen first, then we move. we gather to share, to try, to make. if you’re
          around the same loop, you’re home.
        </p>
        <div className="mt-4">
          <Button asChild className="rounded-xl">
            <Link href="/join">Klube Katıl</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-center text-2xl md:text-3xl font-semibold tracking-wide">MANIFESTO</h2>
        <p className="text-center text-white/60 mt-2">ritme, birbirimize ve ana alan açıyoruz</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { t: "MÜZİK.", d: "Her şey onunla başlar, onunla biter.", g: "from-fuchsia-500 via-purple-500 to-cyan-400" },
            { t: "KEŞİF.", d: "Bildiğini bırak, bilmediğine açıl.", g: "from-emerald-400 via-lime-400 to-teal-300" },
            { t: "SAYGI.", d: "Alanını koru, enerjini paylaş.", g: "from-sky-400 via-blue-500 to-indigo-400" },
            { t: "YÜZLEŞ.", d: "Kalabalığa dön, birlikte titre.", g: "from-rose-400 via-pink-500 to-fuchsia-400" },
            { t: "ÖZGÜRLÜK.", d: "Telefon yok, maskeler yok, an var.", g: "from-amber-400 via-orange-500 to-yellow-300" },
            { t: "İFADE.", d: "Kıyafetin, bedenin, hareketin → senin imzan.", g: "from-teal-300 via-cyan-400 to-sky-400" },
            { t: "DANS.", d: "Kendini bırak, ritim seni alsın.", g: "from-purple-400 via-violet-500 to-fuchsia-400" },
            { t: "KABİLE.", d: "Noqta’da yalnız değilsin, biz bir topluluğuz.", g: "from-green-400 via-emerald-500 to-teal-400" },
          ].map((it, i) => (
            <div key={i} className={`rounded-2xl p-[2px] bg-gradient-to-r ${it.g}`}>
              <div className="rounded-[14px] bg-black p-5 h-full">
                <div className="text-white font-semibold">{it.t}</div>
                <div className="text-white/70 text-sm mt-1">{it.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
