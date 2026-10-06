import Link from "next/link";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell, PageHeader } from "@/components/layout/PageShell";
import { contactHref } from "@/lib/contact-href";

export const metadata = { title: "Sanatçı Yönetimi | noqta" };

export default function ManagementPage() {
  return (
    <PageShell>
      <div className="grid max-w-3xl gap-8">
        <PageHeader
          eyebrow={
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
              <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
              Management
            </p>
          }
          title={
            <>
              <span className="bg-gradient-to-r from-noqt-lime via-noqt-lime to-noqt-sky bg-clip-text text-transparent">
                Kariyer
              </span>{" "}
              ve yayın stratejisi
            </>
          }
          description="Strateji, dağıtım, PR, turne planlama ve kariyer yönetimi üzerine birlikte çalışıyoruz. Hedeflerinizi ve
            mevcut çıktılarınızı paylaştığınızda size özel bir yol haritası öneriyoruz."
          actions={
            <Button
              asChild
              size="lg"
              className="rounded-xl border-0 bg-gradient-to-r from-noqt-lime to-noqt-lime text-black shadow-lg shadow-noqt-lime/20 hover:from-noqt-lime hover:to-noqt-lime"
            >
              <Link
                href={contactHref(
                  "Management — Görüşme talebi",
                  "Merhaba,\n\nSanatçı / proje adı:\nLinkler (Spotify, IG, vs.):\nKısa hedef (ör. yayın, tur, PR):\n\nNot:\n",
                )}
              >
                <Users className="size-4" aria-hidden />
                Ön görüşme talep et
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          }
        />
      </div>
    </PageShell>
  );
}
