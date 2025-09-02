"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/lib/i18n/useI18n";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, dict, toggle } = useI18n();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  const links = [
    { href: "/events", label: dict.nav.events },
    { href: "/collective", label: dict.nav.collective },
    { href: "/labs", label: "Labs", highlight: false },
    { href: "/games", label: "Games", highlight: true },
    { href: "/contact", label: dict.nav.contact },
  ] as const;

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const GamesLinkInner = (label: string) => (
    <span className="inline-flex rounded-full p-[2px] bg-gradient-to-r from-fuchsia-500 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.6)] hover:shadow-[0_0_18px_rgba(168,85,247,0.9)] transition-shadow">
      <span className="px-3 py-1 rounded-full bg-black/80 text-white text-sm tracking-wide">
        {label}
      </span>
    </span>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/40">
      <div className="container mx-auto max-w-7xl flex items-center justify-between py-3 px-4">
        <Link href="/" aria-label="Go to home" className="flex items-center gap-3">
          <Logo size={28} />
          <span className="sr-only">noqta</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map((l) => (
                <NavigationMenuItem key={l.href}>
                  <Link href={l.href} legacyBehavior passHref>
                    <NavigationMenuLink className="px-0 py-0 rounded-xl text-sm text-white/90 hover:text-white transition">
                      {l.highlight ? GamesLinkInner(l.label) : <span className="px-3 py-2 inline-block">{l.label}</span>}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Button asChild size="sm" className="ml-2 rounded-xl">
                  <Link href="/admin/events">Admin</Link>
                </Button>
              )}
              <span className="text-sm text-white/60 ml-2">
                {user?.username}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 rounded-xl text-white/70 hover:text-white" 
                onClick={handleLogout}
              >
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="sm" className="ml-2 rounded-xl">
                <Link href="/login">Giriş</Link>
              </Button>
              <Button asChild size="sm" className="ml-2 rounded-xl">
                <Link href="/join">Kaybol</Link>
              </Button>
            </>
          )}
          
          <Button variant="ghost" size="sm" className="ml-1 rounded-xl text-white/70 hover:text-white" aria-label="Switch language" onClick={toggle}>
            {locale.toUpperCase()}
          </Button>
        </nav>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <HamburgerMenuIcon className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black text-white border-white/10">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <Logo size={24} />
                  <span>noqta</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 grid gap-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="px-0 py-0 rounded-xl text-base text-white/90 hover:text-white transition"
                  >
                    {l.highlight ? GamesLinkInner(l.label) : <span className="px-3 py-2 inline-block">{l.label}</span>}
                  </Link>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  {isLoggedIn ? (
                    <>
                      {isAdmin && (
                        <Button asChild className="rounded-xl">
                          <Link href="/admin/events" onClick={() => setOpen(false)}>
                            Admin
                          </Link>
                        </Button>
                      )}
                      <span className="text-sm text-white/60">
                        {user?.username}
                      </span>
                      <Button 
                        variant="ghost" 
                        className="rounded-xl text-white/70 hover:text-white" 
                        onClick={handleLogout}
                      >
                        Çıkış
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="rounded-xl">
                        <Link href="/login" onClick={() => setOpen(false)}>
                          Giriş
                        </Link>
                      </Button>
                      <Button asChild className="rounded-xl">
                        <Link href="/join" onClick={() => setOpen(false)}>
                          Kaybol
                        </Link>
                      </Button>
                    </>
                  )}
                  
                  <Button variant="ghost" size="sm" className="rounded-xl text-white/70 hover:text-white" onClick={() => { toggle(); setOpen(false); }}>
                    {locale.toUpperCase()}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
