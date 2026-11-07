"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/club-radio/i18n/client";
import { LANG_COOKIE, type Lang } from "@/lib/club-radio/i18n/lang";
import type { Dict } from "@/lib/club-radio/i18n/dict";

type NavItem = { href: string; label: string; prefixes?: string[]; en?: boolean };

function navFor(t: Dict): NavItem[] {
  return [
    { href: "/events", label: t.nav.events, prefixes: ["/events"] },
    { href: "/#setler", label: t.nav.sets },
    { href: "/sanatcilar", label: t.nav.artists, prefixes: ["/sanatcilar"] },
    { href: "/blog", label: t.nav.journal, prefixes: ["/blog"], en: true },
    { href: "/djler-icin", label: t.nav.forDjs, prefixes: ["/djler-icin"] },
    { href: "/isbirlikleri", label: t.nav.collabs, prefixes: ["/isbirlikleri"] },
  ];
}

function isCurrent(pathname: string | null, item: NavItem): boolean {
  if (!pathname || !item.prefixes) return false;
  return item.prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function ctaFor(pathname: string | null, t: Dict): { href: string; label: string } {
  if (pathname === "/djler-icin") return { href: "#basvuru", label: t.nav.ctaSendSet };
  if (pathname === "/isbirlikleri") return { href: "#teklif", label: t.nav.ctaSendProposal };
  return { href: "/events", label: t.nav.ctaTickets };
}

/** TR / EN düğmesi: çerezi yazar ve sunucu bileşenlerini yeniler. */
function LangToggle({ className = "" }: { className?: string }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const choose = (next: Lang) => {
    if (next === lang) return;
    try {
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      /* çerez yazılamazsa sessizce geç */
    }
    router.refresh();
  };
  const btn = (code: Lang, label: string, aria: string) => (
    <button
      type="button"
      lang={code}
      aria-pressed={lang === code}
      aria-label={aria}
      onClick={() => choose(code)}
      className={`flex min-h-11 min-w-11 cursor-pointer items-center justify-center border-0 bg-transparent px-2 text-[13px] font-bold tracking-[0.5px] ${
        lang === code ? "text-[#DDF76A]" : "text-[#A6A9A0] hover:text-[#F4F4EE]"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div role="group" aria-label={t.nav.langAria} className={`flex items-center ${className}`}>
      {btn("tr", "TR", t.nav.switchToTr)}
      <span aria-hidden="true" className="text-[#3A3A3A]">/</span>
      {btn("en", "EN", t.nav.switchToEn)}
    </div>
  );
}

/** Tüm herkese açık sayfalarda kullanılan global üst bilgi: noqt logosu + "club radio". */
export function ClubRadioHeader() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { t } = useLang();
  const NAV = navFor(t);
  const [open, setOpen] = useState(false);
  const cta = ctaFor(pathname, t);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = (item: NavItem) =>
    `no-underline text-[#F4F4EE] hover:text-[#DDF76A] ${
      isCurrent(pathname, item) ? "underline decoration-[#DDF76A] decoration-2 underline-offset-[8px]" : ""
    }`;

  return (
    <header className="cr-chrome border-b border-[#1F1F1F]">
      <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-2 px-4 py-4 min-[420px]:gap-3 min-[420px]:px-6">
        <Link href="/" className="flex min-w-0 flex-none items-center gap-2.5 text-[#F4F4EE] no-underline min-[420px]:gap-3">
          <Image src="/club-radio/noqt-logo-white.png" alt="noqt" width={1031} height={301} sizes="200px" priority className="h-5 w-auto min-[420px]:h-6" />
          <span lang="en" className="cr-display whitespace-nowrap text-[13px] leading-none tracking-[0.5px] min-[420px]:text-[15px]" style={{ fontStretch: "125%" }}>
            club radio
          </span>
        </Link>

        <nav aria-label={t.nav.mainNav} className="hidden items-center gap-6 text-[14px] font-semibold uppercase tracking-[0.5px] min-[1100px]:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isCurrent(pathname, n) ? "page" : undefined} className={linkClass(n)}>
              {n.en ? <span lang="en">{n.label}</span> : n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 min-[420px]:gap-2.5">
          <LangToggle className="hidden min-[1100px]:flex" />
          {isLoggedIn ? (
            <Link
              href="/account/profil"
              className="hidden min-h-11 items-center px-2 text-[13px] font-semibold uppercase tracking-[0.5px] text-[#C9CBC3] no-underline hover:text-[#DDF76A] min-[1100px]:inline-flex"
            >
              {t.nav.account}
            </Link>
          ) : null}
          <Link
            href={cta.href}
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-[#DDF76A] px-3.5 py-3 text-[13px] font-bold uppercase tracking-[0.5px] !text-[#0A0A0A] no-underline min-[420px]:text-[14px] min-[1100px]:px-5"
          >
            {cta.label}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="cr-mobil-menu"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-[#3A3A3A] bg-transparent text-[#F4F4EE] min-[1100px]:hidden"
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
        <nav id="cr-mobil-menu" aria-label={t.nav.mobileNav} className="border-t border-[#1F1F1F] min-[1100px]:hidden">
          <ul className="mx-auto m-0 flex max-w-[1360px] list-none flex-col px-6 pb-4 pt-2">
            {NAV.map((n) => (
              <li key={n.href} className="border-b border-[#1F1F1F]">
                <Link
                  href={n.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(pathname, n) ? "page" : undefined}
                  className={`${linkClass(n)} block py-3.5 text-[17px] font-semibold uppercase tracking-[0.5px]`}
                >
                  {n.en ? <span lang="en">{n.label}</span> : n.label}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li>
                <Link href="/account/profil" onClick={() => setOpen(false)} className="block py-3.5 text-[17px] font-semibold uppercase tracking-[0.5px] text-[#C9CBC3] no-underline">
                  {t.nav.account}
                </Link>
              </li>
            ) : null}
            <li className="pt-2">
              <LangToggle />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
