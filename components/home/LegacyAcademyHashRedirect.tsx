"use client";

import { useEffect } from "react";

// Eski reklam bağlantıları (noqt.club/#fiyatlar vb.) akademi vitrinine yönlenir.
const ACADEMY_HASHES = new Set(["#fiyatlar", "#programs", "#labs", "#taksit"]);

export function LegacyAcademyHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash.toLowerCase();
    if (ACADEMY_HASHES.has(hash)) {
      window.location.replace("https://academy.noqt.club/" + hash);
    }
  }, []);
  return null;
}
