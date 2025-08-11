import Link from "next/link";
import { Button } from "@/components/ui/button";
import DotRing from "@/components/DotRing";

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">biz noqta’yız.</h1>
            <p className="mt-4 text-lg text-white/70 max-w-prose">döngülerde kaybolanlar için ses kolektifi.</p>
            <div className="mt-8 flex gap-3">
              <Button asChild className="rounded-xl">
                <Link href="/events">Etkinlikler</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/join">Kaybol</Link>
              </Button>
            </div>
          </div>
          <div className="grid place-items-center">
            <DotRing size={260} />
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto max-w-7xl px-4">
          <p className="text-white/70">loop’larda dolananlara alan açıyoruz. sessizlik ile ritim arasında nefes alan minimal deneyimler kuruyoruz.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { href: "/events", title: "Events", desc: "Yaklaşan etkinlikler" },
              { href: "/collective", title: "Collective", desc: "Manifesto ve yaklaşım" },
              { href: "/labs", title: "Labs", desc: "Deneyler & atölyeler" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition block"
              >
                <div className="text-xl font-medium">{c.title}</div>
                <div className="text-white/60 mt-1">{c.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
