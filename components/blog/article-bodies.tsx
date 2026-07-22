import type { ComponentType } from "react";
import { ArticleDugunVeKurumsalEtkinlikIcinDjSecimi } from "@/components/blog/articles/dugun-ve-kurumsal-etkinlik-icin-dj-secimi";
import { ArticleEtkinlikMuzigiBrifRehberi } from "@/components/blog/articles/etkinlik-muzigi-brif-rehberi";
import { ArticleDjOlarakSahneyeCikmakIlkAdimlar } from "@/components/blog/articles/dj-olarak-sahneye-cikmak-ilk-adimlar";
import { ArticleDjEgitimiPratikVeAkademi } from "@/components/blog/articles/dj-egitimi-pratik-ve-akademi";
import { ArticleMarkaEtkinligindeMuzikDeneyimTasarimi } from "@/components/blog/articles/marka-etkinliginde-muzik-deneyim-tasarimi";
import { ArticleTurkiyeGenelindeDjBookingSureci } from "@/components/blog/articles/turkiye-genelinde-dj-booking-sureci";

import { ArticleDjNasilOlunur2026Rehberi } from "@/components/blog/articles/dj-nasil-olunur-2026-rehberi";
import { ArticleBaslangicIcinDjControllerOnerileri } from "@/components/blog/articles/baslangic-icin-dj-controller-onerileri";
import { ArticleRekordboxSeratoTraktorKarsilastirmasi } from "@/components/blog/articles/rekordbox-serato-traktor-karsilastirmasi";
import { ArticleBeatmatchingNedirNasilOgrenilir } from "@/components/blog/articles/beatmatching-nedir-nasil-ogrenilir";
import { ArticleIlkDjSetiniHazirlamaRehberi } from "@/components/blog/articles/ilk-dj-setini-hazirlama-rehberi";
import { ArticleMuzikProduksiyonunaNeredenBaslanir } from "@/components/blog/articles/muzik-produksiyonuna-nereden-baslanir";
import { ArticleAbletonMuFlStudioMu } from "@/components/blog/articles/ableton-mu-fl-studio-mu";
import { ArticleHouseTechnoMelodicTechnoFarklari } from "@/components/blog/articles/house-techno-melodic-techno-farklari";
import { ArticleIstanbuldaElektronikMuzikMekanlari } from "@/components/blog/articles/istanbulda-elektronik-muzik-mekanlari";
import { ArticleTurkiyedeElektronikMuzikFestivalleri } from "@/components/blog/articles/turkiyede-elektronik-muzik-festivalleri";

export const BLOG_ARTICLE_BODIES: Record<string, ComponentType> = {
  "dugun-ve-kurumsal-etkinlik-icin-dj-secimi": ArticleDugunVeKurumsalEtkinlikIcinDjSecimi,
  "etkinlik-muzigi-brif-rehberi": ArticleEtkinlikMuzigiBrifRehberi,
  "dj-olarak-sahneye-cikmak-ilk-adimlar": ArticleDjOlarakSahneyeCikmakIlkAdimlar,
  "dj-egitimi-pratik-ve-akademi": ArticleDjEgitimiPratikVeAkademi,
  "marka-etkinliginde-muzik-deneyim-tasarimi": ArticleMarkaEtkinligindeMuzikDeneyimTasarimi,
  "turkiye-genelinde-dj-booking-sureci": ArticleTurkiyeGenelindeDjBookingSureci,
  "dj-nasil-olunur-2026-rehberi": ArticleDjNasilOlunur2026Rehberi,
  "baslangic-icin-dj-controller-onerileri": ArticleBaslangicIcinDjControllerOnerileri,
  "rekordbox-serato-traktor-karsilastirmasi": ArticleRekordboxSeratoTraktorKarsilastirmasi,
  "beatmatching-nedir-nasil-ogrenilir": ArticleBeatmatchingNedirNasilOgrenilir,
  "ilk-dj-setini-hazirlama-rehberi": ArticleIlkDjSetiniHazirlamaRehberi,
  "muzik-produksiyonuna-nereden-baslanir": ArticleMuzikProduksiyonunaNeredenBaslanir,
  "ableton-mu-fl-studio-mu": ArticleAbletonMuFlStudioMu,
  "house-techno-melodic-techno-farklari": ArticleHouseTechnoMelodicTechnoFarklari,
  "istanbulda-elektronik-muzik-mekanlari": ArticleIstanbuldaElektronikMuzikMekanlari,
  "turkiyede-elektronik-muzik-festivalleri": ArticleTurkiyedeElektronikMuzikFestivalleri,
};
