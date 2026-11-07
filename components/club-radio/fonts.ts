import { Archivo, Geist, Geist_Mono } from "next/font/google";

const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-cr-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-cr-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-cr-mono", display: "swap" });

/** noqt club radio yazı tipi değişkenleri: <body> üzerinde uygulanır, böylece global üst/alt bilgi ve yeniden tasarlanan sayfalar kullanabilir. */
export const CR_FONT_VARS = `${archivo.variable} ${geist.variable} ${geistMono.variable}`;
