import { tr } from "./tr";
import { en } from "./en";
import type { Lang } from "./lang";

export type Dict = typeof tr;

export function dictFor(lang: Lang): Dict {
  return lang === "en" ? en : tr;
}
