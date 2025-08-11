import DotRing from "@/components/DotRing";
import Section from "@/components/Section";

export const metadata = { title: "Collective | noqta" };

export default function CollectivePage() {
  return (
    <Section title="We are noqta" description="A sound collective for people who feel in loops.">
      <div className="relative grid place-items-center py-10">
        <DotRing size={220} />
        <p className="mt-6 max-w-2xl text-center text-white/80">
          We are noqta / A sound collective for people who feel in loops.
        </p>
      </div>
    </Section>
  );
}
