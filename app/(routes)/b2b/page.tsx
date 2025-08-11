import Section from "@/components/Section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "B2B | noqta" };

export default function B2BPage() {
  return (
    <Section title="B2B Deneyimler" description="Mekanlara özel DJ deneyimi ve müzik kürasyonu.">
      <p className="text-white/70">
        Mekanınız için atmosfer kuran, marka kimliğinizi yansıtan müzik deneyimleri tasarlıyoruz.
      </p>
      <div className="mt-6">
        <Button asChild className="rounded-xl">
          <Link href="/contact">Teklif al</Link>
        </Button>
      </div>
    </Section>
  );
}
