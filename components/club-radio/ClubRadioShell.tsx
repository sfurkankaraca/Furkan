import type { ReactNode } from "react";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./club-radio.css";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-cr-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-cr-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-cr-mono", display: "swap" });

/** noqt club radio sayfalarının ortak sarmalayıcısı: yalnızca burada yeni yazı tipleri ve koyu tema geçerli. */
export function ClubRadioShell({ children }: { children: ReactNode }) {
  return <div className={`cr-root ${archivo.variable} ${geist.variable} ${geistMono.variable}`}>{children}</div>;
}
