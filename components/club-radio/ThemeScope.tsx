"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Yeniden tasarlanan sayfalar (etkinlikler, sanatçılar, Journal): kabuk renk değişkenleri koyu club radio paletine döner. */
const SCOPED_PREFIXES = ["/events", "/sanatcilar", "/blog"];

export function isScopedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return SCOPED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default function ThemeScope({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (!isScopedPath(pathname)) return <>{children}</>;
  return <div className="dark cr-theme">{children}</div>;
}
