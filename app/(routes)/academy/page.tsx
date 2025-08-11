import Section from "@/components/Section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Eğitimler | noqta" };

export default function AcademyPage() {
  const whatsappHref = `https://wa.me/00000000000?text=${encodeURIComponent("Merhaba, eğitimler hakkında bilgi almak istiyorum.")}`;
  return (
    <Section title="Eğitimler" description="DJ & prodüksiyon eğitimleri özet ve müfredat.">
      <ul className="grid gap-2 list-disc pl-5 text-white/85">
        <li>Beatmatching ve miksaj temelleri</li>
        <li>Set yapısı, geçişler ve dinamizm</li>
        <li>Prodüksiyon için temel ses tasarımı</li>
        <li>Workflow ve kaynaklar</li>
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="rounded-xl">
          <Link href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="mailto:hi@noqta.ai">E‑posta</Link>
        </Button>
      </div>
    </Section>
  );
}
