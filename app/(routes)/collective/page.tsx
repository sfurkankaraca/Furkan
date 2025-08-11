import DotRing from "@/components/DotRing";
import Section from "@/components/Section";

export const metadata = { title: "Collective | noqta" };

export default function CollectivePage() {
  return (
    <Section title="Collective" description="döngülerde kaybolanlar için ses, ritim ve paylaşım alanı.">
      <div className="relative grid place-items-center py-10 gap-4">
        <DotRing size={220} />
        <p className="max-w-2xl text-center text-white/80">
          noqta; minimal ve çok sakin. hızlı değil, yüksek değil. birlikte dinlemeyi, denemeyi ve üretmeyi
          seviyoruz. sahnede de stüdyoda da tek bir amacımız var: aynı loop’ta buluşmak.
        </p>
      </div>
    </Section>
  );
}
