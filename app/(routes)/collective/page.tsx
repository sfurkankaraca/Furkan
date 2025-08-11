import DotRing from "@/components/DotRing";
import Section from "@/components/Section";

export const metadata = { title: "Collective | noqta" };

export default function CollectivePage() {
  return (
    <Section title="Collective" description="a small circle for people who feel in loops.">
      <div className="relative grid place-items-center py-10 gap-4">
        <DotRing size={220} />
        <blockquote className="text-center text-white/70">label, community, and a quiet place to get lost together.</blockquote>
        <p className="max-w-2xl text-center text-white/80">
          minimal and unhurried. we listen first, then we move. we gather to share, to try, to make. if you’re
          around the same loop, you’re home.
        </p>
      </div>
    </Section>
  );
}
