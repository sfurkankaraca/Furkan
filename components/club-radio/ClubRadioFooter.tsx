import Link from "next/link";
import { INSTAGRAM_URL, SOUNDCLOUD_URL, WHATSAPP_CHANNEL_URL, YOUTUBE_CHANNEL_URL, CONTACT_EMAIL } from "@/lib/club-radio/content";
import { NOQTA_SPOTIFY_PROFILE_URL } from "@/lib/noqta-spotify-curated";

type FooterLink = { label: string; href: string; external?: boolean };

const LINKS: (FooterLink | null)[] = [
  SOUNDCLOUD_URL ? { label: "SoundCloud", href: SOUNDCLOUD_URL, external: true } : null,
  { label: "Instagram", href: INSTAGRAM_URL, external: true },
  { label: "YouTube", href: YOUTUBE_CHANNEL_URL, external: true },
  { label: "Spotify", href: NOQTA_SPOTIFY_PROFILE_URL, external: true },
  { label: "Etkinlikler", href: "/#etkinlikler" },
  { label: "DJ'ler için", href: "/djler-icin" },
  { label: "İşbirlikleri", href: "/isbirlikleri" },
  { label: "noqt social", href: "/#social" },
  { label: "Hakkında", href: "/hakkimizda" },
  { label: "NOQT Academy", href: "https://academy.noqt.club", external: true },
  { label: "noqt.events", href: "https://noqt.events", external: true },
  { label: "Mesafeli satış", href: "/mesafeli-satis-sozlesmesi" },
  { label: "İptal ve iade", href: "/teslimat-ve-iade-sartlari" },
  { label: "Gizlilik", href: "/gizlilik-politikasi" },
  { label: "KVKK aydınlatma", href: "/kvkk-aydinlatma" },
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, external: true },
];

export function ClubRadioFooter() {
  return (
    <footer className="mx-auto max-w-[1360px] px-6 pb-12 pt-[72px]">
      <div className="flex flex-wrap justify-between gap-10">
        <div className="flex flex-[1_1_320px] flex-col gap-3.5">
          <span lang="en" className="cr-display text-[30px] leading-[0.95]">
            noqt club
            <br />
            radio
          </span>
          {WHATSAPP_CHANNEL_URL ? (
            <>
              <span className="text-[15px] text-[#A6A9A0]">Geceleri ilk duyan sen ol: WhatsApp kanalımıza katıl.</span>
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center self-start rounded-full border border-[#F4F4EE] px-5 py-3 text-[14px] font-bold uppercase tracking-[0.5px] no-underline"
              >
                WhatsApp kanalı
              </a>
            </>
          ) : (
            <span className="text-[15px] text-[#A6A9A0]">DJ setleri, playlistler ve noqt geceleri.</span>
          )}
        </div>
        <nav aria-label="Alt menü" className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-2.5 text-[15px]">
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
      <p className="cr-mono mt-10 border-t border-[#262626] pt-6 text-[12px] text-[#A6A9A0]">noqt stüdyo · Kayseri</p>
    </footer>
  );
}
