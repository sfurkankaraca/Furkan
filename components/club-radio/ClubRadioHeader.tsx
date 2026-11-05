"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SOUNDCLOUD_URL } from "@/lib/club-radio/content";

export type ClubRadioPage = "home" | "djler" | "isbirlikleri";

const NAV: { href: string; label: string; page?: ClubRadioPage }[] = [
  { href: "/#setler", label: "Setler" },
  { href: "/#playlistler", label: "Playlistler" },
  { href: "/#etkinlikler", label: "Etkinlikler" },
  { href: "/djler-icin", label: "DJ'ler için", page: "djler" },
  { href: "/isbirlikleri", label: "İşbirlikleri", page: "isbirlikleri" },
];

const CTA: Record<ClubRadioPage, { href: string; label: string }> = {
  home: { href: "/#etkinlikler", label: "Bilet al" },
  djler: { href: "#basvuru", label: "Set gönder" },
  isbirlikleri: { href: "#teklif", label: "Teklif gönder" },
};

export function ClubRadioHeader({ current }: { current: ClubRadioPage }) {
  const [open, setOpen] = useState(false);
  const cta = CTA[current];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (page?: ClubRadioPage) =>
    `cr-keep no-underline text-[#0A0A0A] ${
      page && page === current ? "underline decoration-2 underline-offset-[6px]" : ""
    }`;

  return (
    <header className="cr-on-lime bg-[#DDF76A] text-[#0A0A0A]">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-6 py-5">
        <Link
          lang="en"
          href="/"
          className="cr-display cr-keep flex-none whitespace-nowrap text-[18px] min-[420px]:text-[20px] leading-none tracking-[-0.2px] text-[#0A0A0A] no-underline"
          style={{ fontStretch: "112%" }}
        >
          noqt club
          <br />
          radio
        </Link>

        <nav
          aria-label="Ana menü"
          className="hidden items-center gap-7 text-[15px] font-semibold uppercase tracking-[0.5px] min-[901px]:flex"
        >
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={n.page && n.page === current ? "page" : undefined} className={linkClass(n.page)}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {current === "home" && SOUNDCLOUD_URL ? (
            <a
              href={SOUNDCLOUD_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SoundCloud"
              className="cr-keep hidden size-11 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] text-[#0A0A0A] min-[420px]:flex"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 14v3" />
                <path d="M6 11v6" />
                <path d="M9 9v8" />
                <path d="M12 7v10h6a3 3 0 0 0 0-6 5 5 0 0 0-6-4z" />
              </svg>
            </a>
          ) : null}
          <Link
            href={cta.href}
            className="cr-keep inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-[#0A0A0A] px-3.5 py-3 text-[13px] min-[420px]:px-4 min-[420px]:text-[14px] font-bold uppercase tracking-[0.5px] !text-[#DDF76A] no-underline min-[901px]:px-5 min-[901px]:text-[15px]"
          >
            {cta.label}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="cr-mobil-menu"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-full border-[1.5px] border-[#0A0A0A] bg-transparent text-[#0A0A0A] min-[901px]:hidden"
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="cr-mobil-menu" aria-label="Mobil menü" className="border-t border-[#0A0A0A]/20 min-[901px]:hidden">
          <ul className="mx-auto flex max-w-[1360px] list-none flex-col px-6 pb-4 pt-2">
            {NAV.map((n) => (
              <li key={n.href} className="border-b border-[#0A0A0A]/15 last:border-b-0">
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={n.page && n.page === current ? "page" : undefined}
                  className={`${linkClass(n.page)} block py-3.5 text-[17px] font-semibold uppercase tracking-[0.5px]`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
