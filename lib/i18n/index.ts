import { en } from "./en";
import { tr } from "./tr";

export const dictionaries = {
  en,
  tr,
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = (typeof dictionaries)[Locale];
