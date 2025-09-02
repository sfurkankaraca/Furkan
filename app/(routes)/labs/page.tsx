import Section from "@/components/Section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Labs | noqta" };

function NeonCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="inline-flex rounded-2xl p-[2px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400">
      <div className="rounded-[14px] bg-white/5 hover:bg-white/10 transition p-4 w-full">
        <div className="text-white text-lg font-medium">{title}</div>
        <p className="text-white/75 mt-1 text-sm">{desc}</p>
      </div>
    </div>
  );
}

export default function LabsPage() {
  const whatsappHref = `https://wa.me/905417997973?text=${encodeURIComponent("Hi, I’d like to learn more about Labs / workshops.")}`;
  return (
    <Section title="Labs" description="tiny experiments, micro workshops, shared practice.">
      <div className="grid gap-4">
        <NeonCard title="mixlab — djing live" desc="beatmatching, phrasing, transitions, small stage setup." />
        <NeonCard title="production lab — electronic music" desc="workflow, arrangement, minimal sound palette, finishing." />
        <NeonCard title="sound design lab — synth & mixing basics" desc="subtractive/oscillators, filters/envelopes, gain staging, EQ." />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="rounded-xl">
          <Link href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/join">Kaybol</Link>
        </Button>
      </div>
    </Section>
  );
} 