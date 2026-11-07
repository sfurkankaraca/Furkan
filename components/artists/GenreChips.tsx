/** Sanatçının ana türleri için küçük etiketler (en fazla 3). Boşsa hiçbir şey çizmez. */
export function GenreChips({
  genres,
  label,
  className = "",
  chipClassName = "border-[#3A3A3A] text-[#D9DBD3]",
}: {
  genres: readonly string[];
  /** Görünmez/okunur grup etiketi, örn. "Ana türler". */
  label?: string;
  className?: string;
  chipClassName?: string;
}) {
  const list = genres.slice(0, 3);
  if (list.length === 0) return null;
  return (
    <ul aria-label={label} className={`m-0 flex list-none flex-wrap gap-1.5 p-0 ${className}`}>
      {list.map((g) => (
        <li key={g} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-snug ${chipClassName}`}>
          {g}
        </li>
      ))}
    </ul>
  );
}
