import type { Metadata } from "next";
import Link from "next/link";
import { ClubRadioShell } from "@/components/club-radio/ClubRadioShell";
import { BrandProposalForm } from "@/components/club-radio/BrandProposalForm";
import { Photo } from "@/components/club-radio/Photo";
import { getDict } from "@/lib/club-radio/i18n/server";
import { AUDIENCE_STATS, CONTACT_EMAIL, KNOWN_SET_VIDEOS, MEDIA_KIT_URL, youtubeWatchUrl } from "@/lib/club-radio/content";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDict();
  return {
    title: t.meta.collabsTitle,
    description: t.meta.collabsDescription,
    alternates: { canonical: "/isbirlikleri" },
    openGraph: {
      title: t.meta.collabsOgTitle,
      description: t.meta.collabsOgDescription,
      type: "website",
      locale: t.meta.ogLocale,
      images: [{ url: "/club-radio/gece-kalabalik.jpg", width: 1800, height: 1013, alt: t.meta.collabsOgAlt }],
    },
  };
}

const SECTION = "mx-auto max-w-[1360px] px-6";
const H2 = "cr-display cr-sec-title m-0 mb-8";

const ICON = {
  className: "flex-none",
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#DDF76A",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

const FORMAT_ICONS: React.ReactNode[] = [
  <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  <><rect x="2" y="5" width="15" height="14" rx="2" /><path d="M17 10l5-3v10l-5-3" /></>,
  <><path d="M20 12v9H4v-9" /><path d="M2 7h20v5H2z" /><path d="M12 21V7" /><path d="M12 7c-2-4-6-4-6-1s4 1 6 1c2 0 6 2 6-1s-4-3-6 1z" /></>,
  <><path d="M3 21h18" /><path d="M5 21V8l7-5 7 5v13" /><path d="M10 21v-6h4v6" /></>,
  <><rect x="3" y="6" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 6l2-3h4l2 3" /></>,
  <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v3" /></>,
];

export default async function IsbirlikleriPage() {
  const { t } = await getDict();
  const c = t.collabs;
  const halloween = KNOWN_SET_VIDEOS.P4bYVZOm22w;
  return (
    <ClubRadioShell>
      <main>
        <section id="ust" className="border-b border-[#1F1F1F]">
          <div className="mx-auto max-w-[1360px] px-6 pb-20 pt-10">
            <p className="cr-mono m-0 mb-2 text-[14px] uppercase tracking-[1.5px] text-[#DDF76A]">{c.eyebrow}</p>
            <h1 className="cr-display cr-wm cr-wm-brand m-0">
              {c.h1A}
              <br />
              {c.h1B}
            </h1>
            <div className="mt-12 flex flex-wrap items-end gap-x-12 gap-y-8">
              <div className="flex flex-[1_1_420px] flex-col gap-6">
                <p className="cr-display m-0 max-w-[580px] text-[24px] min-[560px]:text-[30px]" style={{ fontWeight: 800, fontStretch: "100%", lineHeight: 1.15 }}>
                  {c.lead}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="#teklif" className="cr-pill cr-pill-lime px-[26px]">{c.ctaPropose}</Link>
                  {MEDIA_KIT_URL ? (
                    <a href={MEDIA_KIT_URL} target="_blank" rel="noopener noreferrer" className="cr-pill cr-pill-line-light px-[26px]">
                      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 4v11" />
                        <path d="M7 10l5 5 5-5" />
                        <path d="M5 20h14" />
                      </svg>
                      {c.mediaKit}
                    </a>
                  ) : null}
                </div>
              </div>
              <figure className="m-0 flex min-w-0 flex-[1_1_520px] flex-col gap-2">
                <Photo src="/club-radio/gece-kalabalik.jpg" alt={c.figAlt} sizes="(max-width: 900px) 100vw, 50vw" position="55% 40%" priority className="aspect-[16/10]" />
                <figcaption className="cr-mono text-[12px] uppercase tracking-[1px]">{c.figCaption}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {AUDIENCE_STATS.length > 0 ? (
          <section aria-labelledby="kitle" className={`${SECTION} pt-[104px]`}>
            <h2 id="kitle" className="cr-display cr-sec-title m-0 mb-8">{c.audience}</h2>
            <dl className="m-0 grid border-t border-[#2A2A2A] [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
              {AUDIENCE_STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-1.5 border-b border-[#2A2A2A] py-7 pr-6">
                  <dd className="cr-display cr-stat m-0 text-[#DDF76A]">{s.value}</dd>
                  <dt className="text-[#C9CBC3]">{s.label}</dt>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section aria-labelledby="formatlar" className={`${SECTION} pt-28`}>
          <h2 id="formatlar" className={H2}>{c.formatsTitle}</h2>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
            {c.formats.map((f, fi) => (
              <div key={f.title} className="flex flex-col gap-3 rounded-[14px] border border-[#2A2A2A] bg-[#161616] p-[26px]">
                <svg {...ICON}>{FORMAT_ICONS[fi]}</svg>
                <h3 className="cr-display m-0 text-[24px]" style={{ fontStretch: "112%", lineHeight: 1.05 }}>{f.title}</h3>
                <p className="m-0 text-[#C9CBC3]">
                  {fi === c.formats.length - 1 ? (
                    <>
                      {c.launchPre}{" "}
                      <a href="https://noqt.events" target="_blank" rel="noopener noreferrer" className="cr-ul">noqt.events</a>
                      {c.launchPost ? ` ${c.launchPost}` : ""}
                    </>
                  ) : (
                    f.text
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="isler" className={`${SECTION} pt-28`}>
          <h2 id="isler" className={H2}>{c.doneTitle}</h2>
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            <a href={youtubeWatchUrl(halloween.id)} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-3 no-underline">
              <Photo src={halloween.image} alt={c.doneAlt} bw={false} sizes="(max-width: 900px) 100vw, 50vw" radius="rounded-xl" className="aspect-[4/3]" />
              <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#DDF76A]">{c.doneKind}</span>
              <span className="text-[21px] font-bold">{c.doneName}</span>
              <span className="text-[15px] text-[#A6A9A0]">{c.doneText}</span>
            </a>
            <Link href="#teklif" className="flex min-h-[260px] flex-col items-start justify-center gap-3 rounded-xl border-2 border-dashed border-[#DDF76A] p-8 no-underline">
              <span className="cr-mono text-[12px] uppercase tracking-[1px] text-[#DDF76A]">{c.nextLabel}</span>
              <span className="cr-display text-[34px] leading-none">{c.nextTitle}</span>
              <span className="text-[15px] text-[#C9CBC3]">{c.nextText}</span>
              <span className="text-[14px] font-bold uppercase tracking-[0.5px] text-[#DDF76A]">{c.nextCta}</span>
            </Link>
          </div>
        </section>

        <section aria-labelledby="surec" className={`${SECTION} pt-28`}>
          <h2 id="surec" className={H2}>{c.processTitle}</h2>
          <ol className="m-0 grid list-none gap-7 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
            {c.steps.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2.5 border-t-2 border-[#DDF76A] pt-5">
                <span aria-hidden="true" className="cr-display text-[48px] text-[#DDF76A] min-[901px]:text-[64px]" style={{ fontStretch: "125%", lineHeight: 0.9 }}>{i + 1}</span>
                <h3 className="m-0 text-[23px] font-semibold">{s.title}</h3>
                <p className="m-0 text-[#C9CBC3]">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="teklif" aria-labelledby="teklif-baslik" className={`${SECTION} scroll-mt-4 pt-28`}>
          <div className="flex flex-wrap gap-x-14 gap-y-10">
            <div className="flex flex-[1_1_340px] flex-col gap-[18px]">
              <h2 id="teklif-baslik" className="cr-display cr-sec-title m-0">{c.proposalTitle}</h2>
              <p className="m-0 max-w-[420px] text-[17px] text-[#C9CBC3]">
                {c.proposalText} <a href={`mailto:${CONTACT_EMAIL}`} className="cr-ul">{CONTACT_EMAIL}</a>
              </p>
            </div>
            <BrandProposalForm />
          </div>
        </section>
      </main>
      <div className="h-12" aria-hidden="true" />
    </ClubRadioShell>
  );
}
