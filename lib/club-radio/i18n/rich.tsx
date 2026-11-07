import { Fragment, type ReactNode } from "react";

/**
 * Sözlük metinlerinde marka/İngilizce sözcükleri [[...]] ile işaretle; <span lang="en"> olur
 * (Türkçe büyük harfe çevirmede "radio" → "RADİO" hatası olmasın diye).
 */
export function rich(s: string): ReactNode {
  const parts = s.split(/\[\[(.+?)\]\]/g);
  if (parts.length === 1) return s;
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <span key={i} lang="en">
        {p}
      </span>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    ),
  );
}

/** İşaretleri atar (aria-label, alt, title gibi düz metin yerleri için). */
export function plain(s: string): string {
  return s.replace(/\[\[(.+?)\]\]/g, "$1");
}
