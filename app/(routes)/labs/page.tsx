import Section from "@/components/Section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Labs | noqta" };

export default function LabsPage() {
  const whatsappHref = `https://wa.me/905417997973?text=${encodeURIComponent("Hi, I’d like to learn more about Labs / workshops.")}`;
  return (
    <Section title="Labs" description="tiny experiments, micro workshops, shared practice.">
      <div className="grid gap-6">
        <div>
          <h3 className="text-white text-lg font-medium">mixlab — djing live</h3>
          <p className="text-white/75 mt-1">beatmatching, phrasing, transitions, small stage setup.</p>
        </div>
        <div>
          <h3 className="text-white text-lg font-medium">production lab — electronic music</h3>
          <p className="text-white/75 mt-1">workflow, arrangement, minimal sound palette, finishing.</p>
        </div>
        <div>
          <h3 className="text-white text-lg font-medium">sound design lab — synth & mixing basics</h3>
          <p className="text-white/75 mt-1">subtractive/oscillators, filters/envelopes, gain staging, EQ.</p>
        </div>
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