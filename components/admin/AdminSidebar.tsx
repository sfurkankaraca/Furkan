"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const nav = [
  { href: "/admin", label: "Özet", icon: "▦" },
  { href: "/admin/customers", label: "Müşteriler", icon: "👤" },
  { href: "/admin/orders", label: "Siparişler", icon: "🧾" },
  { href: "/admin/events", label: "Etkinlikler", icon: "🎉" },
  { href: "/admin/events/new", label: "Yeni etkinlik", icon: "＋" },
  { href: "/admin/playlists", label: "Playlistler", icon: "♪" },
  { href: "/admin/radio-live", label: "Canlı radyo", icon: "📻" },
  { href: "/admin/members", label: "Kulüp üyeleri", icon: "⭐" },
  { href: "/admin/forms", label: "Başvurular", icon: "📋" },
  { href: "/admin/club-applications", label: "Club başvuruları", icon: "🏷" },
  { href: "/admin/club-member-content", label: "Club içerikleri", icon: "📁" },
  { href: "/admin/club-packages", label: "Club paketleri", icon: "📦" },
  { href: "/admin/workshops", label: "Workshop", icon: "🎛" },
  { href: "/admin/gorseller", label: "Görseller", icon: "🖼" },
  { href: "/admin/site-images", label: "Site görselleri", icon: "🗂" },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-white/15 text-white font-medium"
                : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="text-base leading-none w-5 text-center shrink-0">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
      <div className="my-2 border-t border-white/10" />
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
      >
        <span className="text-base leading-none w-5 text-center shrink-0">←</span>
        Siteye dön
      </Link>
      <Link
        href="/admin/logout"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"
      >
        <span className="text-base leading-none w-5 text-center shrink-0">↪</span>
        Çıkış
      </Link>
    </nav>
  );
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-foreground text-background min-h-screen">
        <div className="px-5 py-5 border-b border-white/10">
          <Logo size={28} invert />
        </div>
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          <NavLinks />
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between border-b border-white/10 bg-foreground px-4 py-3 sticky top-0 z-30">
        <Logo size={24} invert />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Menü" className="text-white hover:bg-white/10">
              <HamburgerMenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-foreground border-white/10 text-white w-64 p-0">
            <div className="px-5 py-5 border-b border-white/10">
              <SheetTitle className="sr-only">NOQT Admin</SheetTitle>
              <Logo size={26} invert />
            </div>
            <div className="px-3 py-4">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
