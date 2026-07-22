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

import { ArticleKraftwerkElektronikMuziginMimarlari } from "@/components/blog/articles/kraftwerk-elektronik-muzigin-mimarlari";
import { ArticleFrankieKnucklesHouseMuziginBabasi } from "@/components/blog/articles/frankie-knuckles-house-muzigin-babasi";
import { ArticleDetroitBellevilleThreeTechnoDogusu } from "@/components/blog/articles/detroit-belleville-three-techno-dogusu";
import { ArticleJeffMillsTheWizardTechnoUstasi } from "@/components/blog/articles/jeff-mills-the-wizard-techno-ustasi";
import { ArticleDaftPunkElektronikMuzigiPopYapanIkili } from "@/components/blog/articles/daft-punk-elektronik-muzigi-pop-yapan-ikili";
import { ArticleCarlCoxSahneninYasayanEfsanesi } from "@/components/blog/articles/carl-cox-sahnenin-yasayan-efsanesi";

import { ArticleElektronikMuzikHaberleriTemmuz2026 } from "@/components/blog/articles/elektronik-muzik-haberleri-temmuz-2026";

import { ArticleEnergyFlashJoeyBeltramParcaninHikayesi } from "@/components/blog/articles/energy-flash-joey-beltram-parcanin-hikayesi";
import { ArticleSahneHaritasiBerlin } from "@/components/blog/articles/sahne-haritasi-berlin";

import { ArticleLarryLevanParadiseGarageEfsanesi } from "@/components/blog/articles/larry-levan-paradise-garage-efsanesi";
import { ArticleStringsOfLifeDerrickMayParcaninHikayesi } from "@/components/blog/articles/strings-of-life-derrick-may-parcanin-hikayesi";

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
  "kraftwerk-elektronik-muzigin-mimarlari": ArticleKraftwerkElektronikMuziginMimarlari,
  "frankie-knuckles-house-muzigin-babasi": ArticleFrankieKnucklesHouseMuziginBabasi,
  "detroit-belleville-three-techno-dogusu": ArticleDetroitBellevilleThreeTechnoDogusu,
  "jeff-mills-the-wizard-techno-ustasi": ArticleJeffMillsTheWizardTechnoUstasi,
  "daft-punk-elektronik-muzigi-pop-yapan-ikili": ArticleDaftPunkElektronikMuzigiPopYapanIkili,
  "carl-cox-sahnenin-yasayan-efsanesi": ArticleCarlCoxSahneninYasayanEfsanesi,
  "elektronik-muzik-haberleri-temmuz-2026": ArticleElektronikMuzikHaberleriTemmuz2026,
  "energy-flash-joey-beltram-parcanin-hikayesi": ArticleEnergyFlashJoeyBeltramParcaninHikayesi,
  "sahne-haritasi-berlin": ArticleSahneHaritasiBerlin,
  "larry-levan-paradise-garage-efsanesi": ArticleLarryLevanParadiseGarageEfsanesi,
  "strings-of-life-derrick-may-parcanin-hikayesi": ArticleStringsOfLifeDerrickMayParcaninHikayesi,
};
