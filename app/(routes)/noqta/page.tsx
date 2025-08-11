import Section from "@/components/Section";
import DotRing from "@/components/DotRing";

export const metadata = { title: "noqta? | noqta" };

export default function NoqtaAboutPage() {
  return (
    <Section title="noqta?" description="We are noqta / A sound collective for people who feel in loops.">
      <div className="grid place-items-center gap-6 py-6">
        <DotRing size={220} />
        <p className="text-center text-white/80 max-w-2xl">
          Döngülerde hissedenler için ses, ritim ve paylaşıma alan açıyoruz. Sessizlik ile gürültü arasında
          nefes alan minimal deneyimler tasarlıyoruz.
        </p>
      </div>
    </Section>
  );
} 