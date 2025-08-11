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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { locale, toggle } = useI18n();

  const links = [
    { href: "/events", label: "Events" },
    { href: "/collective", label: "Collective" },
    { href: "/academy", label: "Academy" },
    { href: "/b2b", label: "B2B" },
    { href: "/contact", label: "Contact" },
  ];

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
                    <NavigationMenuLink className="px-3 py-2 rounded-xl text-sm text-white/90 hover:text-white transition">
                      {l.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button asChild size="sm" className="ml-2 rounded-xl">
            <Link href="/contact">Bize yaz</Link>
          </Button>
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
                    className="px-2 py-2 rounded-xl text-base text-white/90 hover:text-white transition"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <Button asChild className="rounded-xl">
                    <Link href="/contact" onClick={() => setOpen(false)}>
                      Bize yaz
                    </Link>
                  </Button>
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
