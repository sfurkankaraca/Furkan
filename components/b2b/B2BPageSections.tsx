import Link from "next/link";
import {
  B2B_FAQ,
  B2B_PARTNERSHIP,
  B2B_PROCESS,
  B2B_SCENARIOS,
  B2B_SECTORS,
  B2B_SERVICES,
  B2B_SOCIAL,
  B2B_VALUE,
} from "@/lib/b2b-content";
import { ContentCard, PageBlockTitle } from "@/components/layout/PageShell";
import { FurkanBioCard } from "@/components/people/FurkanBioCard";
import { cn } from "@/lib/utils";
import { PortfolioVideoCard } from "@/components/social/PortfolioVideoCard";

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

export function B2BPageSections({
  b2bPhotoUrls = [],
  b2bVideoUrls = [],
}: {
  b2bPhotoUrls?: string[];
  b2bVideoUrls?: string[];
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-16 md:space-y-24 pb-4">
      <Section id="kurucu">
        <PageBlockTitle
          title="Kurucu"
          description="Marka ve kurumsal iş birlikleri için müzik, sahne ve operasyon tarafında deneyim."
          sectionId="b2b-founder-h"
        />
        <FurkanBioCard variant="b2b" className="mt-6" />
      </Section>

      <Section id="kimlerle">
        <PageBlockTitle title={B2B_SECTORS.title} description={B2B_SECTORS.description} sectionId="b2b-sectors-h" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {B2B_SECTORS.items.map((label) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/85 transition duration-300 hover:border-white/20 hover:bg-white/[0.06] active:scale-[0.99]"
            >
              {label}
            </div>
          ))}
        </div>
      </Section>

      <Section id="hizmetler">
        <PageBlockTitle title={B2B_SERVICES.title} description={B2B_SERVICES.description} sectionId="b2b-services-h" />
        <div className="grid gap-4 md:gap-5">
          {B2B_SERVICES.items.map((s) => (
            <ContentCard
              key={s.title}
              className="p-5 md:p-6 transition duration-300 hover:border-white/15 hover:bg-white/[0.05]"
            >
              <h3 className="text-lg font-semibold tracking-tight text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-[15px]">{s.blurb}</p>
              <ul className="mt-4 grid gap-2 text-sm text-white/55">
                {s.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noqt-lime/80" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </ContentCard>
          ))}
        </div>
      </Section>

      {(b2bPhotoUrls.length > 0 || b2bVideoUrls.length > 0) && (
        <Section id="b2b-portfolio">
          <PageBlockTitle
            title="Portfolyo"
            description="Fotoğraf ve video içeriklerini yönetim panelindeki Site görselleri > B2B bölümünden güncelleyebilirsin."
            sectionId="b2b-portfolio-h"
          />
          {b2bPhotoUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {b2bPhotoUrls.map((src, i) => (
                <div key={`${src}-${i}`} className="overflow-hidden rounded-xl border border-white/12 bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="aspect-[4/3] w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          ) : null}
          {b2bVideoUrls.length > 0 ? (
            <div className={`grid gap-3 ${b2bPhotoUrls.length > 0 ? "mt-4" : ""} md:grid-cols-2`}>
              {b2bVideoUrls.map((src, i) => (
                <PortfolioVideoCard key={`${src}-${i}`} src={src} title={`B2B portfolyo video ${i + 1}`} />
              ))}
            </div>
          ) : null}
        </Section>
      )}

      <Section id="markaya-ne-saglar">
        <PageBlockTitle title={B2B_VALUE.title} description={B2B_VALUE.description} sectionId="b2b-value-h" />
        <div className="grid gap-3 sm:grid-cols-2">
          {B2B_VALUE.items.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5 transition duration-300 hover:border-noqt-lime/25 hover:from-white/[0.07]"
            >
              <h3 className="text-base font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="senaryolar">
        <PageBlockTitle title={B2B_SCENARIOS.title} description={B2B_SCENARIOS.description} sectionId="b2b-scenarios-h" />
        <div className="grid gap-3 sm:grid-cols-2">
          {B2B_SCENARIOS.items.map((x) => (
            <ContentCard
              key={x.title}
              className="p-4 md:p-5 transition duration-300 hover:border-white/16 hover:-translate-y-0.5"
            >
              <h3 className="text-sm font-semibold text-white md:text-base">{x.title}</h3>
              <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{x.text}</p>
            </ContentCard>
          ))}
        </div>
      </Section>

      <Section id="noqta-x-marka">
        <ContentCard className="border-noqt-lime/20 bg-gradient-to-br from-noqt-lime/10 via-transparent to-noqt-sky/10 p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">{B2B_PARTNERSHIP.title}</h2>
          <div className="mt-4 grid gap-4 text-sm leading-relaxed text-white/70 md:text-base">
            {B2B_PARTNERSHIP.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </ContentCard>
      </Section>

      <Section id="sosyal-kanit">
        <PageBlockTitle title={B2B_SOCIAL.title} description={B2B_SOCIAL.description} sectionId="b2b-social-h" />
        <div className="flex flex-wrap gap-3">
          <Link
            href={B2B_SOCIAL.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/10"
          >
            Instagram — @noqtclub
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {B2B_SOCIAL.placeholders.map((p) => (
            <div
              key={p.label}
              className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-center transition hover:border-white/25"
            >
              <span className="text-sm font-medium text-white/80">{p.label}</span>
              <span className="mt-2 text-xs text-white/40">{p.hint}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="surec">
        <PageBlockTitle title={B2B_PROCESS.title} description={B2B_PROCESS.description} sectionId="b2b-process-h" />
        <ol className="grid gap-0">
          {B2B_PROCESS.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative border-l border-white/10 pl-6 pb-8 last:pb-0 md:pl-8"
            >
              <span
                className="absolute -left-[5px] top-1.5 flex h-2.5 w-2.5 rounded-full bg-gradient-to-br from-noqt-lime to-noqt-sky ring-4 ring-black"
                aria-hidden
              />
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">Adım {i + 1}</span>
              <h3 className="mt-1 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="sss">
        <PageBlockTitle title={B2B_FAQ.title} sectionId="b2b-faq-h" />
        <div className="grid gap-2 max-w-3xl">
          {B2B_FAQ.items.map((item) => (
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
