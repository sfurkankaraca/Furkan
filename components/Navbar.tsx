"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-xl px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground";

const dropdownPanelClass =
  "absolute right-0 top-full z-50 mt-1 min-w-[240px] rounded-xl border border-border bg-background/95 p-2 shadow-xl backdrop-blur-md";

function useClickOutside(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onCloseRef.current();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open, ref]);
}

function ExploreDropdown({
  dict,
  academySub,
  flatNav,
}: {
  dict: { nav: { academy: string } };
  academySub: readonly { href: string; label: string }[];
  flatNav: readonly { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, open, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(navLinkClass, "inline-flex items-center gap-1")}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Keşfet
        <ChevronDownIcon className={cn("h-3.5 w-3.5 opacity-70 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className={dropdownPanelClass} role="menu">
          <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{dict.nav.academy}</div>
          {academySub.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="my-2 border-t border-border" />
          {flatNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileAccountLinks({ onNavigate }: { onNavigate: () => void }) {
  const { user, needsOnboarding, isAdminNav, logout, club } = useAuth();

  const linkClass = "rounded-xl px-3 py-2.5 text-sm text-foreground/85 hover:bg-foreground/5 block";

  return (
    <div className="grid gap-1">
      {user?.email ? <p className="px-3 py-1 text-xs text-muted-foreground truncate">{user.email}</p> : null}
      {club?.subscriptionActive ? (
        <p className="px-3 pb-1 text-[11px] font-medium text-fuchsia-600">Kulüp üyeliği aktif</p>
      ) : null}

      {needsOnboarding ? (
        <Link href="/onboarding" onClick={onNavigate} className={cn(linkClass, "bg-amber-500/15 text-amber-100 font-medium")}>
          Profili tamamla
        </Link>
      ) : (
        <>
          <Link href="/account/profil" onClick={onNavigate} className={cn(linkClass, "flex items-center justify-between gap-2")}>
            <span>Profil</span>
            {club?.subscriptionActive ? (
              <span className="rounded-full bg-fuchsia-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-fuchsia-200 shrink-0">üye</span>
            ) : null}
          </Link>
          <Link href="/account/biletlerim" onClick={onNavigate} className={linkClass}>
            Biletlerim
          </Link>
        </>
      )}

      {club?.applicationApproved ? (
        <Link href="/account/club" onClick={onNavigate} className={cn(linkClass, "text-fuchsia-100")}>
          Noqta Club{club.subscriptionActive ? " +" : ""}
        </Link>
      ) : null}

      {isAdminNav ? (
        <Link href="/admin/events" onClick={onNavigate} className={linkClass}>
          Yönetim paneli
        </Link>
      ) : null}

      <button
        type="button"
        onClick={() => {
          onNavigate();
          void logout();
        }}
        className="rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 w-full"
      >
        Çıkış yap
      </button>
    </div>
  );
}

function UserAccountDropdown({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { user, needsOnboarding, isAdminNav, logout, club } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, open, () => setOpen(false));

  const initial = (user?.name?.trim()?.[0] || user?.email?.[0] || "?").toUpperCase();
  const shortName = user?.name?.trim()?.split(/\s+/)[0] || user?.email?.split("@")[0] || "Hesap";

  const handleLogout = async () => {
    setOpen(false);
    onNavigate?.();
    await logout();
  };

  const itemClass = "flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-foreground/85 hover:bg-foreground/5";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          navLinkClass,
          "inline-flex items-center gap-2 pr-2",
          club?.subscriptionActive && "ring-1 ring-fuchsia-500/35",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
          {initial}
        </span>
        <span className="max-w-[100px] truncate hidden sm:inline">{shortName}</span>
        <ChevronDownIcon className={cn("h-3.5 w-3.5 opacity-70 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className={cn(dropdownPanelClass, "min-w-[260px]")} role="menu">
          <div className="border-b border-border px-3 py-2 mb-1">
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            {club?.subscriptionActive ? (
              <div className="mt-1 text-[11px] font-medium text-fuchsia-600">Kulüp üyeliği aktif</div>
            ) : null}
          </div>

          {needsOnboarding ? (
            <Link
              href="/onboarding"
              className={cn(itemClass, "mb-1 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25")}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              Profili tamamla
            </Link>
          ) : (
            <>
              <Link
                href="/account/profil"
                className={itemClass}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                <span>Profil</span>
                {club?.subscriptionActive ? (
                  <span className="ml-auto rounded-full bg-fuchsia-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-fuchsia-200">
                    üye
                  </span>
                ) : null}
              </Link>
              <Link
                href="/account/biletlerim"
                className={itemClass}
                onClick={() => {
                  setOpen(false);
                  onNavigate?.();
                }}
              >
                Biletlerim
              </Link>
            </>
          )}

          {club?.applicationApproved ? (
            <Link
              href="/account/club"
              className={cn(itemClass, "text-fuchsia-100/95")}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              Noqta Club
              {club.subscriptionActive ? <span className="ml-auto text-xs text-fuchsia-300/80">+</span> : null}
            </Link>
          ) : null}

          {isAdminNav ? (
            <Link
              href="/admin/events"
              className={itemClass}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              Yönetim paneli
            </Link>
          ) : null}

          <div className="my-2 border-t border-border" />
          <button type="button" className={cn(itemClass, "text-red-600 hover:bg-red-50")} onClick={() => void handleLogout()}>
            Çıkış yap
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, dict, toggle } = useI18n();
  const { isLoggedIn } = useAuth();

  const mainNav = [
    { href: "/academy", label: dict.nav.academy },
    { href: "/academy/games", label: "Games" },
    { href: "/events", label: dict.nav.events },
    { href: "/sanatcilar", label: "Sanatçılar" },
    { href: "/blog", label: "Journal" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto max-w-7xl flex items-center justify-between py-3 px-4">
        <Link href="/" aria-label="Go to home" className="flex items-center gap-2">
          <Logo size={36} />
          <span className="sr-only">noqta</span>
        </Link>

        {/* Masaüstü nav */}
        <nav className="hidden md:flex items-center gap-1 flex-wrap justify-end">
          {mainNav.map((l) => (
            <Link key={l.href} href={l.href} className={navLinkClass}>
              {l.label}
            </Link>
          ))}
          <a
            href="https://labs.noqta.club"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-foreground/30 hover:text-foreground transition ml-1"
          >
            <span className="opacity-70">⚗️</span> Labs
          </a>

          {isLoggedIn ? (
            <>
              <UserAccountDropdown />
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 rounded-xl text-muted-foreground hover:text-foreground"
                aria-label="Switch language"
                onClick={toggle}
              >
                {locale.toUpperCase()}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="ml-2 rounded-xl text-foreground/85">
                <Link href="/login">Giriş</Link>
              </Button>
              <Button asChild size="sm" className="ml-1 rounded-xl">
                <Link href="/register">Kayıt</Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 rounded-xl text-muted-foreground hover:text-foreground"
                aria-label="Switch language"
                onClick={toggle}
              >
                {locale.toUpperCase()}
              </Button>
            </>
          )}
        </nav>

        {/* Mobil */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menüyü aç">
                <HamburgerMenuIcon className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background text-foreground border-border p-4 overflow-y-auto w-[min(100vw-2rem,320px)]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-left">
                  <Logo size={32} />
                  <span className="sr-only">noqta</span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 grid gap-6">
                <div className="grid gap-1">
                  {mainNav.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-foreground/5"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <a
                    href="https://labs.noqta.club"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-foreground/5 inline-flex items-center gap-2"
                  >
                    <span>⚗️</span> Labs
                  </a>
                </div>

                {isLoggedIn ? (
                  <div className="rounded-xl border border-border bg-muted/50 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 pt-2 pb-1">Hesabım</p>
                    <MobileAccountLinks onNavigate={() => setOpen(false)} />
                  </div>
                ) : (
                  <div className="grid gap-2 pt-2 border-t border-border">
                    <Button asChild variant="outline" className="rounded-xl border-border w-full">
                      <Link href="/login" onClick={() => setOpen(false)}>Giriş</Link>
                    </Button>
                    <Button asChild className="rounded-xl w-full">
                      <Link href="/register" onClick={() => setOpen(false)}>Kayıt</Link>
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-muted-foreground hover:text-foreground justify-start"
                  onClick={() => {
                    toggle();
                    setOpen(false);
                  }}
                >
                  Dil: {locale.toUpperCase()}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
