import Image from "next/image";
import Link from "next/link";
import type { CityDjContent } from "@/lib/city-dj-pages/types";
import { ContentCard, PageBlockTitle } from "@/components/layout/PageShell";
import { cn } from "@/lib/utils";

function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28", className)}>
      {children}
    </section>
  );
}

export function CityDjPageSections({ content }: { content: CityDjContent }) {
  const p = content.sectionPrefix;
  const guideIntroId = `${p}-guide-intro`;
  const guideSectionId = `${p}-dj-hizmeti`;

  return (
    <div className="mx-auto max-w-5xl space-y-14 md:space-y-20 pb-4">
      <Section id="hizmet-alanlari">
        <PageBlockTitle
          title={content.services.title}
          description={content.services.description}
          sectionId={`${p}-services-h`}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {content.services.items.map((s) => (
            <ContentCard
              key={s.title}
              className="p-4 md:p-5 transition duration-300 hover:border-white/16 hover:-translate-y-0.5"
            >
              <h3 className="text-base font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
            </ContentCard>
          ))}
        </div>
      </Section>

      <Section id="neden-noqta">
        <PageBlockTitle title={content.why.title} description={content.why.description} sectionId={`${p}-why-h`} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.why.items.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition duration-300 hover:border-noqt-lime/20 hover:bg-white/[0.05] md:p-5"
            >
              <h3 className="text-sm font-semibold text-white md:text-base">{w.title}</h3>
              <p className="mt-2 text-sm text-white/55 leading-relaxed">{w.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id={guideSectionId} aria-labelledby={guideIntroId}>
        <ContentCard className="border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h2 id={guideIntroId} className="text-xl font-semibold tracking-tight text-white md:text-2xl">
            {content.seoBody.title}
          </h2>
          <div className="mt-5 grid gap-4 text-sm leading-relaxed text-white/65 md:text-[15px]">
            {content.seoBody.paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </ContentCard>

        <div className="mt-6 grid gap-6">
          {content.chapters.map((ch) => (
            <article
              key={ch.id}
              id={ch.id}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-8 transition duration-300 hover:border-white/14"
            >
              <h2 className="text-lg font-semibold tracking-tight text-white md:text-xl">{ch.title}</h2>
              <div className="mt-4 grid gap-3.5 text-sm leading-relaxed text-white/62 md:gap-4 md:text-[15px]">
                {ch.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="medya">
        <PageBlockTitle title={content.media.title} description={content.media.description} sectionId={`${p}-media-h`} />
        <Link
          href={content.media.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Instagram — @noqtaverse
        </Link>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {content.media.placeholders.map((ph) =>
            ph.image ? (
              <figure
                key={ph.label}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <Image
                  src={ph.image.src}
                  alt={ph.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-3 pt-8">
                  <span className="text-xs font-medium text-white/90">{ph.label}</span>
                  <span className="mt-0.5 block text-[11px] text-white/55">{ph.hint}</span>
                </figcaption>
              </figure>
            ) : (
              <div
                key={ph.label}
                role="img"
                aria-label={`${ph.label}. ${ph.hint}`}
                className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center transition hover:border-white/25"
              >
                <span className="text-sm font-medium text-white/80">{ph.label}</span>
                <span className="mt-2 text-xs text-white/40">{ph.hint}</span>
              </div>
            ),
          )}
        </div>
      </Section>

      <Section id="surec">
        <PageBlockTitle title={content.process.title} sectionId={`${p}-process-h`} />
        <ol className="grid gap-0">
          {content.process.steps.map((step, i) => (
            <li key={step.title} className="relative border-l border-white/10 pb-8 pl-6 last:pb-0 md:pl-8">
              <span
                className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-noqt-lime to-noqt-sky ring-4 ring-black"
                aria-hidden
              />
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">Adım {i + 1}</span>
              <h3 className="mt-1 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id={`${p}-site-ici`}>
        <PageBlockTitle
          title="Site içinde devam"
          description={content.internalLinksIntro}
          sectionId={`${p}-hub-h`}
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          <li>
            <Link
              href="/booking"
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm transition hover:border-white/18 hover:bg-white/[0.05]"
            >
              <span className="font-medium text-white">Booking ve teklif formu</span>
              <span className="mt-1 block text-xs leading-relaxed text-white/50">
                Genel DJ booking akışı; şehir dışı ve yakın şehir projeleri dahil teklif talebi.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/events"
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm transition hover:border-white/18 hover:bg-white/[0.05]"
            >
              <span className="font-medium text-white">Etkinlikler</span>
              <span className="mt-1 block text-xs leading-relaxed text-white/50">
                Yaklaşan buluşmalar ve arşiv; etkinlik takvimiyle hizmet bağlamını tamamlayın.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/b2b"
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm transition hover:border-white/18 hover:bg-white/[0.05]"
            >
              <span className="font-medium text-white">B2B ve marka iş birlikleri</span>
              <span className="mt-1 block text-xs leading-relaxed text-white/50">
                Kurumsal etkinlik, lansman ve marka deneyimi projeleri için iş birliği kapısı.
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm transition hover:border-white/18 hover:bg-white/[0.05]"
            >
              <span className="font-medium text-white">Noqta ana sayfa</span>
              <span className="mt-1 block text-xs leading-relaxed text-white/50">
                Kolektif, Academy, Radio ve diğer giriş noktaları.
              </span>
            </Link>
          </li>
        </ul>
      </Section>

      <Section id="sss">
        <PageBlockTitle title={content.faq.title} sectionId={`${p}-faq-h`} />
        <div className="grid max-w-3xl gap-2">
          {content.faq.items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition open:border-white/[0.16] hover:border-white/14"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-white/35 transition group-open:rotate-180" aria-hidden>
                    ▼
                  </span>
                </span>
              </summary>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/65">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </div>
  );
}
