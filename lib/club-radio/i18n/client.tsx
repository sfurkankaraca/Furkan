"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { dictFor, type Dict } from "./dict";
import type { Lang } from "./lang";

type Ctx = { lang: Lang; t: Dict };
const LangContext = createContext<Ctx>({ lang: "tr", t: dictFor("tr") });

/** Kök düzende sunucudaki dil değeriyle beslenir; istemci bileşenleri `useT()` / `useLang()` kullanır. */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo(() => ({ lang, t: dictFor(lang) }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  return useContext(LangContext);
}

export function useT(): Dict {
  return useContext(LangContext).t;
}
