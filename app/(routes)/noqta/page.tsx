import Section from "@/components/Section";
import DotRing from "@/components/DotRing";

export const metadata = { title: "noqta? | noqta" };

export default function NoqtaAboutPage() {
  return (
    <Section title="noqta?" description="kimiz, ne yaparız, neden buradayız">
      <div className="grid place-items-center gap-6 py-6">
        <DotRing size={220} />
        <div className="text-white/80 max-w-3xl space-y-4 text-center">
          <p>
            noqta; döngülerde kaybolanlar için bir ses kolektifi. elektronik müzik, ambient ve deneysel
            aralığında; etkinlikler, küçük atölyeler ve kayıt seansları organize eder.
          </p>
          <p>
            Minimal estetik, an’a odak ve paylaşım bizim için temel. Gürültüyü azaltıp ritme alan açar; dinleme,
            deneme ve üretme süreçlerini herkes için ulaşılabilir kılmaya çalışırız.
          </p>
          <p>
            Eğer aynı loop’ta buluşuyorsak, hoş geldin. Yan yana sessiz kalmayı da birlikte yükselmeyi de
            deneriz.
          </p>
        </div>
      </div>
    </Section>
  );
} 