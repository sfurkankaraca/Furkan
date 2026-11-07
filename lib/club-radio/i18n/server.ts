import { cookies } from "next/headers";
import { LANG_COOKIE, parseLang, type Lang } from "./lang";
import { dictFor, type Dict } from "./dict";

/** Sunucu bileşenlerinde dil: `noqt_lang` çerezi ("tr" varsayılan | "en"). */
export async function getLang(): Promise<Lang> {
  try {
    const jar = await cookies();
    return parseLang(jar.get(LANG_COOKIE)?.value);
  } catch {
    return "tr";
  }
}

export async function getDict(): Promise<{ lang: Lang; t: Dict }> {
  const lang = await getLang();
  return { lang, t: dictFor(lang) };
}
