import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_URL, SOUNDCLOUD_URL, WHATSAPP_CHANNEL_URL, YOUTUBE_CHANNEL_URL, CONTACT_EMAIL } from "@/lib/club-radio/content";
import { NOQTA_SPOTIFY_PROFILE_URL } from "@/lib/noqta-spotify-curated";
import { getDict } from "@/lib/club-radio/i18n/server";
import type { Dict } from "@/lib/club-radio/i18n/dict";

type FooterLink = { label: string; href: string; external?: boolean };

function linksFor(t: Dict): (FooterLink | null)[] {
  return [
  SOUNDCLOUD_URL ? { label: "SoundCloud", href: SOUNDCLOUD_URL, external: true } : null,
  { label: "Instagram", href: INSTAGRAM_URL, external: true },
  { label: "YouTube", href: YOUTUBE_CHANNEL_URL, external: true },
  { label: "Spotify", href: NOQTA_SPOTIFY_PROFILE_URL, external: true },
  { label: t.footer.events, href: "/events" },
  { label: t.footer.sets, href: "/#setler" },
  { label: t.footer.artists, href: "/sanatcilar" },
  { label: t.footer.journal, href: "/blog" },
  { label: t.footer.forDjs, href: "/djler-icin" },
  { label: t.footer.collabs, href: "/isbirlikleri" },
  { label: "noqt social", href: "/#social" },
  { label: t.footer.about, href: "/hakkimizda" },
  { label: "NOQT Academy", href: "https://academy.noqt.club", external: true },
  { label: "noqt.events", href: "https://noqt.events", external: true },
  { label: t.footer.distanceSales, href: "/mesafeli-satis-sozlesmesi" },
  { label: t.footer.refunds, href: "/teslimat-ve-iade-sartlari" },
  { label: t.footer.privacy, href: "/gizlilik-politikasi" },
  { label: t.footer.kvkk, href: "/kvkk-aydinlatma" },
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, external: true },
  ];
}

export async function ClubRadioFooter() {
  const { t } = await getDict();
  const LINKS = linksFor(t);
  return (
    <footer className="cr-chrome pt-[72px]">
      <div className="mx-auto max-w-[1360px] px-6 pb-12">
      <div className="flex flex-wrap justify-between gap-10">
        <div className="flex flex-[1_1_320px] flex-col gap-3.5">
          <Link href="/" className="flex items-center gap-3 self-start text-[#F4F4EE] no-underline">
            <Image src="/club-radio/noqt-logo-white.png" alt="noqt" width={1031} height={301} sizes="200px" className="h-9 w-auto" />
            <span lang="en" className="cr-display whitespace-nowrap text-[18px] leading-none tracking-[0.5px]" style={{ fontStretch: "125%" }}>
              club radio
            </span>
          </Link>
          {WHATSAPP_CHANNEL_URL ? (
            <>
              <span className="text-[15px] text-[#A6A9A0]">{t.footer.whatsappPitch}</span>
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center self-start rounded-full border border-[#F4F4EE] px-5 py-3 text-[14px] font-bold uppercase tracking-[0.5px] no-underline"
              >
                {t.footer.whatsappButton}
              </a>
            </>
          ) : (
            <span className="text-[15px] text-[#A6A9A0]">{t.footer.tagline}</span>
          )}
        </div>
        <nav aria-label={t.footer.nav} className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-2.5 text-[15px]">
          {LINKS.map((l) =>
            l ? (
              l.external ? (
                <a key={l.label} href={l.href} {...(l.href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="w-fit py-1 hover:underline">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} href={l.href} className="w-fit py-1 hover:underline">
                  {l.label}
                </Link>
              )
            ) : null,
          )}
        </nav>
      </div>
      <p className="cr-mono mt-10 border-t border-[#262626] pt-6 text-[12px] text-[#A6A9A0]">{t.footer.studio}</p>
      </div>
    </footer>
  );
}
