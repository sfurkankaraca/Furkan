"use client";

import { useEffect, useMemo, useState } from "react";
import { dictionaries, Dictionary, Locale } from ".";

export function useI18n() {
  const [locale, setLocale] = useState<Locale>("tr");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("locale") : null;
    if (stored === "en" || stored === "tr") setLocale(stored);
  }, []);

  const dict: Dictionary = useMemo(() => dictionaries[locale], [locale]);

  const toggle = () => {
    const next = locale === "tr" ? "en" : "tr";
    setLocale(next);
    if (typeof window !== "undefined") localStorage.setItem("locale", next);
  };

  return { locale, dict, setLocale, toggle };
}
