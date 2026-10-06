import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { getNoqtaClubStatusForEmail } from "@/lib/noqta-club/membership";
import { getClubAccessForUser } from "@/lib/club-subscription/access";
import { ContentCard, PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "Noqta Club — Üyeler | noqta" };

export default async function OnlyMembersPage() {
  const session = await getSession();
  const email = session?.email;
  let status: Awaited<ReturnType<typeof getNoqtaClubStatusForEmail>> = null;
  let clubAccess: Awaited<ReturnType<typeof getClubAccessForUser>> | null = null;
  if (email && session?.sub) {
    try {
      status = await getNoqtaClubStatusForEmail(email);
      const prisma = getPrisma();
      clubAccess = await getClubAccessForUser(prisma, session.sub, email);
    } catch (e) {
      console.error("[noqta-club/only-members] membership lookup", e);
    }
  }

  const header =
    status === "approved"
      ? "Hoş geldin"
      : status === "pending"
        ? "Başvurun elinde"
        : status === "rejected"
          ? "Bu sefer olmadı"
          : "Önce kulübe katıl";

  const body =
    status === "approved" ? (
      <div className="grid gap-4">
        {!session ? (
          <>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Başvurun onaylandı. Abonelik ve üye paneli için hesabınla giriş yap.
            </p>
            <Link
              href="/login?next=/account/club"
              className="w-fit rounded-xl bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90"
            >
              Giriş yap — Club paneli
            </Link>
          </>
        ) : !clubAccess?.subscriptionActive ? (
          <>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Onayın tamam. Üyelere özel içerik ve etkinlikler için aylık aboneliğini başlatman gerekiyor.
            </p>
            <Link
              href="/account/club"
              className="w-fit rounded-xl bg-noqt-lime text-black px-4 py-2.5 text-sm font-medium hover:bg-noqt-lime"
            >
              Abonelik ve üye paneli
            </Link>
          </>
        ) : (
          <>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Aboneliğin aktif. Özel içerik ve kulüp etkinlikleri panelinde.
            </p>
            <Link
              href="/account/club"
              className="w-fit rounded-xl bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90"
            >
              Club paneline git
            </Link>
            <Link href="/events" className="w-fit text-sm text-noqt-lime underline">
              Tüm etkinlikler
            </Link>
          </>
        )}
      </div>
    ) : status === "pending" ? (
      <div className="grid gap-3">
        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          Formunu aldık, teşekkürler. Sana uygun olup olmadığımızı düşünüp e-posta ile haber vereceğiz — biraz sabır, söz veriyoruz dönüş yapacağız.
        </p>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-white/65">
          Çok yoğun dönemlerde cevap birkaç gün sürebilir; merak ettiğin bir şey olursa iletişimden de yazabilirsin.
        </div>
        <Link href="/noqta-club/basvuru" className="w-fit rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10">
          Başvuruyu gözden geçir
        </Link>
      </div>
    ) : status === "rejected" ? (
      <div className="grid gap-3">
        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          Bu turda aramıza katılmak için uygun zaman / uyum göremedik — bu senin değerinin eksik olduğu anlamına gelmez.
        </p>
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-white/65">
          İstersen bir süre sonra yeniden başvurabilir veya collective / etkinlikler üzerinden yine yanımızda olabilirsin.
        </div>
        <Link href="/noqta-club/basvuru" className="w-fit rounded-xl bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90">
          Yeniden başvur
        </Link>
      </div>
    ) : (
      <div className="grid gap-3">
        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          Bu sayfa kulüp üyeleri için. Katılmak istersen kısa başvurudan geçmen yeterli; sonra mail ile haberleşiriz.
        </p>
        <Link href="/noqta-club/basvuru" className="w-fit rounded-xl bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90">
          Kulübe Katıl
        </Link>
      </div>
    );

  return (
    <PageShell withGlow={false}>
      <div className="grid gap-6 md:gap-8">
        <ContentCard className="bg-zinc-950/20 p-6 md:p-8">
          <div className="grid gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">{header}</h1>
            {body}
          </div>
        </ContentCard>
      </div>
    </PageShell>
  );
}

