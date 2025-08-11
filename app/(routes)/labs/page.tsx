import Section from "@/components/Section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Labs | noqta" };

export default function LabsPage() {
  const whatsappHref = `https://wa.me/00000000000?text=${encodeURIComponent("Merhaba, Labs / atölyeler hakkında bilgi almak istiyorum.")}`;
  return (
    <Section title="Labs" description="Deneyler, mikro atölyeler ve paylaşım seansları.">
      <ul className="grid gap-2 list-disc pl-5 text-white/85">
        <li>Loop odaklı ses deneyleri</li>
        <li>DJ workflow paylaşımları</li>
        <li>Mikro üretim alıştırmaları</li>
        <li>Açık oturum ve dinleme</li>
      </ul>
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