import type { ReactNode } from "react";

/** noqt club radio ana sayfalarının sarmalayıcısı (koyu tema). Yazı tipi değişkenleri <body> üzerinden gelir. */
export function ClubRadioShell({ children }: { children: ReactNode }) {
  return <div className="cr-root">{children}</div>;
}
