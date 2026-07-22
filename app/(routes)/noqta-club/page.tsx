import Link from "next/link";
import { Disc3, Lock, Radio as RadioIcon, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCard, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolvePageHeroSources } from "@/lib/page-hero-videos";
import { getSession } from "@/lib/auth/session";
import { getNoqtaClubStatusForEmail } from "@/lib/noqta-club/membership";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";

export const metadata = {
  title: "Noqta Club — Müzik ve Topluluk Üyeliği | noqta",
  description:
    "Noqta Club: üretmek ve paylaşmak isteyenler için seçici üyelik, içerik ve buluşmalar. Türkiye merkezli elektronik müzik topluluğu; başvuru ve manifesto.",
  alternates: { canonical: "/noqta-club" },
};

const manifestoText = `Her noqta’nın hikayesi, enerjisi, üretimi değişir ama döngü değişmez.

Döngü: buluşmak, üretmek, paylaşmak, buluşmak, üretmek, paylaşmak, buluşm…

Döngü bi noqtada buluşarak başlar.

Noqta bir konum, bir fikir ya da ortak bir problem olabilir.

Üretim bazen yeni bir set, bazen bir çözüm , bazense yeni bir bakış açısıdır.

Paylaşmak döngünün zirve noqtası, kırılma noqtası, G noqtasıdır.

Her döngü bir sonraki döngüyü hazırlar, her yeni döngü yeni bir enerji ister, değişim yoksa döngü bir hapise dönüşür.

Değişim özgürlüğün anahtarı, döngünün hayatta kalma biçimidir.

Yükselişler, düşüşler, bazen yumuşak bazen sert geçişler.

Döngüyü kırma cesareti gösteren her ritim, her melodi bir şarkıya; şarkılar sete, setler yeni bi deneyime dönüşür.

Döngüye katıl, deneyime ortak ol.`;

const menuItems = [
  {
    href: "/noqta-club/basvuru",
    title: "Kulübe Katıl",
    description: "Kısa form — aynı frekansta insanlarla buluşmak için.",
    icon: Sparkles,
    tone: "accent",
  },
  {
    href: "/noqta-club/only-members",
    title: "Üyelere özel alan",
    description: "Birlikte üretilen içerik ve etkinliklerden ilk sen haberdar ol.",
    icon: Lock,
    tone: "dark",
  },
  {
    href: "/noqta-club#club-manifesto",
    title: "Manifesto",
    description: "Ritme, birbirimize ve ana alan açıyoruz.",
    icon: Disc3,
    tone: "dark",
  },
  {
    href: "/radio",
    title: "Koleksiyonlar",
    description: "Üyeler için zamanla özel kürasyonlar.",
    icon: RadioIcon,
    tone: "dark",
  },
  {
    href: "/collective",
    title: "Topluluk & network",
    description: "Müzik kültürünü birlikte büyütürüz.",
    icon: Users,
    tone: "dark",
  },
  {
    href: "/contact",
    title: "İletişim",
    description: "Soru / geri bildirim için mesaj gönder.",
    icon: Sparkles,
    tone: "dark",
  },
];

export default async function NoqtaClubLandingPage() {
  const session = await getSession();
  let clubStatus: Awaited<ReturnType<typeof getNoqtaClubStatusForEmail>> = null;
  if (session?.email) {
    try {
      clubStatus = await getNoqtaClubStatusForEmail(session.email);
    } catch (e) {
      console.error("[noqta-club] membership lookup", e);
    }
  }

  const heroSources = resolvePageHeroSources("club", {
    envUrl: process.env.NEXT_PUBLIC_HERO_VIDEO_URL,
  });
  const imgOverrides = await readSiteImageOverrides();
  const clubPoster = resolveSiteImageUrl("club_hero_poster", imgOverrides) ?? "/og.png";

  return (
    <main>
      <PageHeroVideo
        sources={heroSources}
        poster={clubPoster}
        posterAlt="Noqta Club — topluluk ve üyelik deneyimi arka plan görseli"
      >
        <div className="container mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="grid place-items-center text-center gap-6 md:gap-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
              <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
              Noqta Club
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-satoshi text-white">
              Noqta Club — müziği birlikte yaşatan topluluk
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Noqta Club; üretmek, paylaşmak ve sahneye çıkmak isteyen insanların aynı masada oturduğu yer. Burada birbirimize destek olur, imkanları paylaşır, beraber üretir ve sunarız. Başvurunu inceliyoruz; onay e-postayla gelir.
              <span className="block mt-2 text-white/65 text-base">
                Not: Kulüp üyeliği etkinlik bileti satın almaktan ayrı bir süreçtir.
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-xl border-0 bg-white text-black hover:bg-white/90">
                <Link href="/noqta-club/basvuru">Kulübe Katıl</Link>
              </Button>
              <Link
                href="/noqta-club#club-manifesto"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 transition"
              >
                Manifestoya git
              </Link>
            </div>

            {clubStatus ? (
              <div
                className={`rounded-xl border px-4 py-2 text-sm ${
                  clubStatus === "approved"
                    ? "border-white/15 bg-white/5 text-white/80"
                    : clubStatus === "rejected"
                      ? "border-white/15 bg-white/5 text-white/70"
                      : "border-white/15 bg-white/5 text-white/70"
                }`}
              >
                Üyelik durumu: <span className="font-medium">{clubStatus}</span>
              </div>
            ) : null}
          </div>
        </div>
        <PageShell withGlow={false}>
        <div className="grid gap-14 md:gap-16">
          {/* Büyük menü */}
          <section aria-labelledby="club-menu">
            <h2 id="club-menu" className="sr-only">
              Noqta Club menüsü
            </h2>

            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-2xl md:text-3xl font-semibold">Noqta Club</h3>
              <span className="text-sm text-white/50">Tanı • üret • paylaş</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {menuItems.map((it) => {
                const Icon = it.icon;
                const isAccent = it.tone === "accent";
                return (
                  <Link
                    key={it.href + it.title}
                    href={it.href}
                    className={`group rounded-2xl border p-5 transition ${
                      isAccent
                        ? "border-white/20 bg-white/[0.06] hover:bg-white/[0.10]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15"
                    }`}
                  >
                    <div className={`h-[2px] w-10 rounded-full ${isAccent ? "bg-white/80" : "bg-white/25"}`} />
                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-black/40">
                          <Icon className={`size-5 ${isAccent ? "text-white" : "text-white/80"}`} aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white text-sm">{it.title}</div>
                          <div className="mt-1 text-sm text-white/60 leading-relaxed line-clamp-2">{it.description}</div>
                        </div>
                      </div>
                      <span className="text-white/30 group-hover:text-white/60 transition" aria-hidden>
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Kısa açıklama */}
          <section className="grid gap-6 lg:grid-cols-2">
            <ContentCard className="bg-white/[0.03] p-6 md:p-7 border-white/10">
              <div className="grid gap-4">
                <h3 className="text-xl md:text-2xl font-semibold text-white">Noqta Club nedir?</h3>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  Yaratıcı bir müzik ve etkinlik topluluğuyuz: DJ, prodüktör, dinleyici — fark etmez; ortak noktamız üretmek ve bir araya gelmek. Üyeler birbirini geliştirir, deneyim paylaşır, projelerde yan yana durur.
                  Başvurunu okuyup sana en uygun şekilde dönüş yapıyoruz.
                </p>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-white/65">
                  Kulüp üyeliği ile etkinlik bileti almak farklı akışlardır; ikisi birbirinin yerine geçmez.
                </div>
              </div>
            </ContentCard>

            <ContentCard className="bg-white/[0.03] p-6 md:p-7 border-white/10">
              <div className="grid gap-4">
                <h3 className="text-xl md:text-2xl font-semibold text-white">Neler yaparız?</h3>
                <ul className="grid gap-3 text-sm text-white/75">
                  <li className="flex gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500" aria-hidden />
                    Buluşmalar, jam’ler ve paylaşılan sahneler
                  </li>
                  <li className="flex gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" aria-hidden />
                    Üyelere yönelik içerik ve davetler (zamanla büyüyen alan)
                  </li>
                  <li className="flex gap-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" aria-hidden />
                    Farklı katılım seviyeleri — kendine uygun olanı seç
                  </li>
                </ul>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link href="/noqta-club/basvuru" className="rounded-xl bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition w-fit">
                    Kulübe Katıl
                  </Link>
                  <Link href="/kvkk/noqta-club" className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 transition w-fit">
                    KVKK metni
                  </Link>
                </div>
              </div>
            </ContentCard>
          </section>

          {/* Manifesto (collective’den taşınan bölüm) */}
          <section id="club-manifesto" aria-labelledby="club-manifesto">
            <h2 id="club-manifesto" className="text-center text-xl font-semibold tracking-wide md:text-2xl text-white">
              Manifesto
            </h2>
            <p className="mt-2 text-center text-sm text-white/55 md:text-base">
              Ritme, birbirimize ve ana alan açıyoruz.
            </p>

            <ContentCard className="mt-8 bg-white/[0.03] p-6 md:p-8 border-white/10">
              <div className="text-sm md:text-base text-white/75 leading-relaxed whitespace-pre-wrap">
                {manifestoText}
              </div>
            </ContentCard>
          </section>
        </div>
      </PageShell>
      </PageHeroVideo>
    </main>
  );
}

