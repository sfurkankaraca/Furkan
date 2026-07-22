import { PageShell, PageHeader, ContentCard } from "@/components/layout/PageShell";
import { RadioChatPageClient } from "@/components/radio/RadioChatPageClient";

export const metadata = {
  title: "Radyo sohbeti | Noqta Radio",
  description: "Canlı yayın sohbeti. Mesaj okumak herkese açık; yazmak için giriş gerekir.",
  alternates: { canonical: "/radio/chat" },
};

export const dynamic = "force-dynamic";

export default function RadioChatPage() {
  return (
    <PageShell>
      <div className="container mx-auto max-w-3xl px-4 py-10 md:py-14">
        <PageHeader title="Noqta Radio — sohbet" description="Yayın sırasında burada buluşun." />
        <ContentCard className="p-5 md:p-8 mt-6">
          <RadioChatPageClient />
        </ContentCard>
      </div>
    </PageShell>
  );
}
