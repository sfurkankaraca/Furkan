"use client";

import { NOQT_SOCIAL } from "@/lib/club-radio/content";
import { useT } from "@/lib/club-radio/i18n/client";
import { rich } from "@/lib/club-radio/i18n/rich";

/**
 * "noqt social'da da burada" bloğu: etkinlik/bilet ekranlarında uygulamaya yönlendirir.
 * Sabit koyu zemin: hem koyu hem açık temalı sayfalarda aynı görünür.
 */
export function NoqtSocialBlock({ socialUrl, className = "" }: { socialUrl?: string | null; className?: string }) {
  const t = useT();
  const href = socialUrl || NOQT_SOCIAL.site;
  return (
    <aside
      aria-labelledby="noqt-social-blok-baslik"
      className={`flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-2xl border border-[#2A2A2A] bg-[#161616] p-5 text-[#F4F4EE] min-[560px]:p-6 ${className}`}
    >
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5">
        <span className="text-[12px] font-bold uppercase tracking-[1px] text-[#DDF76A]">{t.social.eyebrow}</span>
        <h2 id="noqt-social-blok-baslik" className="m-0 text-[22px] font-semibold leading-tight text-[#F4F4EE]">
          {rich(t.social.title)}
        </h2>
        <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-[#C9CBC3]">{t.social.text}</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="inline-flex min-h-11 flex-none items-center justify-center whitespace-nowrap rounded-full bg-[#DDF76A] px-5 py-2.5 text-[14px] font-bold uppercase tracking-[0.5px] !text-[#0A0A0A] no-underline"
      >
        {rich(t.social.open)}
      </a>
    </aside>
  );
}
