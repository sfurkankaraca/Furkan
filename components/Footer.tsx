import Link from "next/link";
import { ACADEMY_CONTACT, academyWhatsappHref } from "@/lib/academy-pricing";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Academy",
    links: [
      { label: "Eğitimler", href: "/#programs" },
      { label: "Fiyatlar", href: "/#fiyatlar" },
      { label: "Pazar DJ Workshop", href: "/#fiyatlar" },
      { label: "labs.noqt.club", href: "https://labs.noqt.club", external: true },
    ],
  },
  {
    title: "Keşfet",
    links: [
      { label: "Etkinlikler", href: "/events" },
      { label: "Sanatçılar", href: "/sanatcilar" },
      { label: "Journal", href: "/blog" },
      { label: "Oyunlar (Labs)", href: "https://labs.noqt.club/#oyunlar", external: true },
    ],
  },
  {
    title: "Takip et",
    links: [
      { label: "Instagram · @noqtacademy", href: ACADEMY_CONTACT.instagramHref.replace("ig.me/m/", "www.instagram.com/"), external: true },
      { label: "Instagram · @noqtclub", href: "https://www.instagram.com/noqtclub", external: true },
      { label: "Spotify", href: "https://open.spotify.com/user/31jte7ldctopxvipofwgucvts5sm?si=bf4008478d634b86", external: true },
      { label: "YouTube", href: "https://youtube.com/@noqtarecords?si=FOd1tTTnyjG8l2NJ", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="container mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/noqt-logo-transparent.png" alt="noqt" className="h-14 w-auto invert" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Kayseri ve Nevşehir&apos;de DJ ve müzik prodüksiyonu eğitimi, etkinlikler ve sanatçı ağı.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={academyWhatsappHref("Merhaba, NOQT Academy hakkında bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-noqt-lime px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95"
              >
                WhatsApp · {ACADEMY_CONTACT.whatsappDisplay}
              </a>
              <a
                href={ACADEMY_CONTACT.phoneHref}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/50"
              >
                {ACADEMY_CONTACT.phoneDisplay}
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-noqt-lime">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-sm text-white/70 transition hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} noqta</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Yasal">
            <Link href="/gizlilik-politikasi" className="transition hover:text-white">Gizlilik Politikası</Link>
            <Link href="/kullanim-kosullari" className="transition hover:text-white">Kullanım Koşulları</Link>
            <a
              href="https://www.noqt.events"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-noqt-sky transition hover:text-white"
            >
              DJ Hizmeti → noqt.events
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
