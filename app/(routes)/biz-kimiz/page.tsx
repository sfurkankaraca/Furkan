import type { Metadata } from "next";
import Link from "next/link";
import { Music, Sparkles, Users, GraduationCap, Video, Workflow, Globe2 } from "lucide-react";
import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { FurkanBioCard } from "@/components/people/FurkanBioCard";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";

export const metadata: Metadata = {
  title: "Biz Kimiz? Noqta — Elektronik Müzik ve Kolektif",
  description:
    "Noqta; elektronik müzik ve etkinlikler etrafında toplanan bir ekip. Etkinlikler, Academy, Radio, Club ve iş birlikleriyle DJ’ler, prodüktörler ve dinleyicileri bir araya getirir.",
  alternates: { canonical: "/hakkimizda" },
  openGraph: {
    title: "Biz kimiz? | Noqta",
    description: "Noqta kimdir? Etkinlik, Academy, Radio ve topluluk — kısa ve net özet.",
    url: "/hakkimizda",
  },
};

const whyNoqta = [
  {
    icon: Music,
    title: "Müzik kültürü",
    text: "Elektronik müziği etkinlikler, eğitimler ve dinleme alanlarıyla birlikte düşünür; sahne ile dinleyiciyi yan yana getiririz.",
  },
  {
    icon: Workflow,
    title: "Net süreç",
    text: "Brif, teklif ve gün organizasyonunda sözü dağıtmadan ilerleriz; kimin ne zaman ne yapacağı bellidir.",
  },
  {
    icon: Video,
    title: "İçerik üretimi",
    text: "Set çekimi, görsel işler ve dijital kanallarla sanatçıların görünür olmasına yardımcı oluruz.",
  },
  {
    icon: Users,
    title: "Topluluk",
    text: "Noqta yalnızca gece değil; üretmek ve paylaşmak isteyen insanların bir araya geldiği bir topluluk.",
  },
  {
    icon: Globe2,
    title: "Türkiye geneli",
    text: "Kayseri’den başlayıp Türkiye genelinde projeler yürütüyoruz; şehir ve tarih projenin ihtiyacına göre şekillenir.",
  },
];

const bizFaq = [
  {
    q: "Hangi şehirlerde hizmet veriyorsunuz?",
    a: "Türkiye genelinde etkinlik, booking ve içerik projeleri yürütüyoruz. Operasyonel merkezimiz Kayseri olsa da sahne ve prodüksiyon lokasyonu projeye göre şekillenir.",
  },
  {
    q: "Noqta yalnızca DJ kolektifi mi?",
    a: "DJ performansı ve müzik kürasyonu çekirdektir; Academy, Radio, Club ve B2B hatlarıyla eğitim, dinleme ve marka iş birliklerini aynı çatıda topluyoruz.",
  },
  {
    q: "Nasıl iş birliği başlarım?",
    a: "Collective veya Club başvuruları formlar üzerinden; etkinlik ve booking için /booking veya iletişim kanallarından ulaşman yeterli.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: bizFaq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default async function BizKimizPage() {
  const overrides = await readSiteImageOverrides();
  const poster = resolveSiteImageUrl("biz_kimiz_hero_poster", overrides) ?? "/og.png";

  return (
    <main>
      <PageHeroVideo
        sources={resolveRandomHeroSources("/hakkimizda")}
        poster={poster}
        posterAlt="Noqta — biz kimiz arka plan görseli"
      >
        <PageShell withGlow={false}>
      <div className="grid gap-14 md:gap-20">
        <section id="biz-kimiz-intro">
          <PageHeader
            eyebrow={
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
                <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
                Biz kimiz
              </p>
            }
            title={
              <>
                Biz kimiz? <span className="text-white/70">Noqta.</span>
              </>
            }
            description={
              <>
                Elektronik müzik ve etkinlikler etrafında çalışan bir ekipiz. Gece düzenler,{" "}
                <Link href="/academy" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
                  Academy
                </Link>{" "}
                ile eğitim verir,{" "}
                <Link href="/radio" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
                  Radio
                </Link>{" "}
                ile dinleme paylaşır;{" "}
                <Link href="/collective" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
                  Collective
                </Link>{" "}
                ve kulüp üyeliğiyle de üretmek isteyenleri bir araya getiririz. Amacımız soyut sloganlar değil, net iş
                yapan, güvenilir bir adres olmak.
              </>
            }
          />
        </section>

        <section aria-labelledby="biz-kimiz-founder" className="max-w-3xl mx-auto w-full">
          <h2 id="biz-kimiz-founder" className="sr-only">
            Kurucu
          </h2>
          <FurkanBioCard variant="about" />
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <ContentCard className="bg-white/[0.03] p-6 md:p-7 border-white/10">
            <h2 className="text-xl md:text-2xl font-semibold text-white">Ne yapıyoruz?</h2>
            <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
              DJ’ler, prodüktörler ve dinleyiciler için iş birliği, görünürlük ve öğrenim alanları açıyoruz.{" "}
              <Link href="/collective" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
                Collective
              </Link>{" "}
              ile iş birliği ve kariyer desteği;{" "}
              <Link href="/noqta-club" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
                Club
              </Link>{" "}
              ile topluluk içi erişim ve etkinlikler — hepsi aynı çatı altında, birbirinden ayrı sayfalarda.
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-white/75">
              <li className="flex gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-noqt-lime to-noqt-lime" aria-hidden />
                Sahne ve etkinlik kürasyonu
              </li>
              <li className="flex gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" aria-hidden />
                İçerik üretimi ve dijital varlık
              </li>
              <li className="flex gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-gradient-to-r from-sky-400 to-noqt-sky" aria-hidden />
                Topluluk ve DJ ağı
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/events"
                className="rounded-xl bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition"
              >
                Etkinlikleri keşfet
              </Link>
              <Link
                href="/booking"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 transition"
              >
                DJ booking
              </Link>
              <Link
                href="/noqta-club/basvuru"
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 transition"
              >
                Noqta Club’a başvur
              </Link>
            </div>
          </ContentCard>

          <ContentCard className="bg-white/[0.03] p-6 md:p-7 border-white/10">
            <h2 className="text-xl md:text-2xl font-semibold text-white">Alanlarımız</h2>
            <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
              Etkinlik, eğitim, radyo ve iş birliği hatları aynı ekibin kalite ve iletişim standardıyla yürür.
            </p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/16 hover:bg-black/30">
                <div className="flex items-center gap-3">
                  <GraduationCap className="size-5 text-noqt-lime" aria-hidden />
                  <h3 className="font-medium text-white">Academy</h3>
                </div>
                <p className="mt-2 text-sm text-white/70">
                  DJ ve prodüksiyon eğitimleri; pratik odaklı Labs ve Games ile pekiştirme.
                </p>
                <Link href="/academy" className="mt-2 inline-block text-xs text-cyan-300/90 hover:text-cyan-200">
                  Academy’ye git →
                </Link>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/16 hover:bg-black/30">
                <div className="flex items-center gap-3">
                  <Users className="size-5 text-cyan-300" aria-hidden />
                  <h3 className="font-medium text-white">Collective</h3>
                </div>
                <p className="mt-2 text-sm text-white/70">İş birliği, içerik üretimi ve kariyer desteği.</p>
                <Link href="/collective" className="mt-2 inline-block text-xs text-cyan-300/90 hover:text-cyan-200">
                  Collective’e göz at →
                </Link>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-white/16 hover:bg-black/30">
                <div className="flex items-center gap-3">
                  <Sparkles className="size-5 text-amber-300" aria-hidden />
                  <h3 className="font-medium text-white">Club</h3>
                </div>
                <p className="mt-2 text-sm text-white/70">Topluluk üyeliği; etkinlik ve içeriklere başvuru ile katılım.</p>
                <Link href="/noqta-club" className="mt-2 inline-block text-xs text-cyan-300/90 hover:text-cyan-200">
                  Club sayfası →
                </Link>
              </div>
            </div>
          </ContentCard>
        </section>

        <section aria-labelledby="neden-noqta-heading" className="grid gap-6">
          <h2 id="neden-noqta-heading" className="text-xl md:text-2xl font-semibold text-white">
            Neden Noqta?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyNoqta.map((h) => (
              <ContentCard
                key={h.title}
                className="bg-white/[0.03] p-5 border-white/10 transition duration-300 hover:border-white/16 hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <h.icon className="size-5 text-white/80 transition duration-300 group-hover:translate-y-[-1px]" aria-hidden />
                  <h3 className="font-medium text-white">{h.title}</h3>
                </div>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{h.text}</p>
              </ContentCard>
            ))}
          </div>
        </section>

        <section aria-labelledby="prensip-heading" className="grid gap-6">
          <h2 id="prensip-heading" className="text-xl md:text-2xl font-semibold text-white">
            Nasıl çalışıyoruz?
          </h2>
          <ul className="grid gap-3 max-w-2xl text-sm text-white/75">
            <li className="flex gap-3 items-start">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-noqt-lime" aria-hidden />
              <span>
                Net iletişim: gereksiz jargon yok; kutlama, kurumsal gece veya marka işi fark etmeksizin beklentiyi baştan
                yazıyoruz.
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" aria-hidden />
              <span>
                Etkinlik,{" "}
                <Link href="/radio" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-2 hover:underline">
                  Radio
                </Link>{" "}
                ve içerikleri aynı markanın dilinde tutmaya çalışırız; dağınık mesaj vermeyiz.
              </span>
            </li>
            <li className="flex gap-3 items-start">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-noqt-lime" aria-hidden />
              <span>Tek gecelik işler de yapıyoruz ama kalıcı ilişkiyi ve tekrarlayan güveni önemsiyoruz.</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="biz-sss" className="grid gap-4">
          <h2 id="biz-sss" className="text-xl font-semibold text-white">
            Sık sorulanlar
          </h2>
          <div className="grid gap-2 max-w-3xl">
            {bizFaq.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition open:border-white/[0.16] hover:border-white/14"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-white/35 transition group-open:rotate-180">▼</span>
                  </span>
                </summary>
                <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/65">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-white/[0.05] px-6 py-8 text-center mb-4">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">DJ Hizmeti</p>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Düğün veya etkinlik için profesyonel DJ arıyorsanız
          </h2>
          <p className="mt-3 text-sm text-white/60 max-w-md mx-auto">
            noqt.events; düğün, kurumsal etkinlik ve özel parti için DJ booking ve deneyim planlama platformumuz.
          </p>
          <a
            href="https://www.noqt.events"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            noqt.events'i ziyaret et ↗
          </a>
        </div>
      </div>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
