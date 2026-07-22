import type { CityDjContent, CityDjRouteSlug } from "./types";
import { CITY_DJ_ROUTE_SLUGS } from "./types";
import { kayseriCityDj } from "./content/kayseri";
import { nevsehirCityDj } from "./content/nevsehir";
import { ankaraCityDj } from "./content/ankara";

export const CITY_DJ_REGISTRY: Record<CityDjRouteSlug, CityDjContent> = {
  "kayseri-dj": kayseriCityDj,
  "nevsehir-dj": nevsehirCityDj,
  "ankara-dj": ankaraCityDj,
};

export function getCityDjContent(slug: CityDjRouteSlug): CityDjContent {
  return CITY_DJ_REGISTRY[slug];
}

/** Yeni şehir: `types.ts` içindeki `CITY_DJ_ROUTE_SLUGS` + bu registry’ye içerik ekleyin */
export const CITY_DJ_ROUTE_SLUGS_LIST: CityDjRouteSlug[] = [...CITY_DJ_ROUTE_SLUGS];
