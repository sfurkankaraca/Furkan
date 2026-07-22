export type BookingOfferOption = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  detail: string;
  subject: string;
  message: string;
};

/** Hizmet alanları — booking sayfası kartları ve teklif akışı ile paylaşılır */
export const BOOKING_OFFER_OPTIONS: readonly BookingOfferOption[] = [
  {
    id: "dugun",
    title: "Düğün & özel kutlama",
    subtitle: "Düğün, nişan, kına, doğum günü…",
    summary: "Davet profiline uygun tempo ve seçkiler; gece boyunca doğal enerji akışı.",
    detail:
      "Kutlama ritmini birlikte çizeriz: ilk karşılamadan gece sonuna kadar net bir müzik hikâyesi. İster klasik ister modern çizgi — konuştuğumuz konsepte sadık kalırız.",
    subject: "Booking — Düğün & özel kutlama",
    message:
      "Selam noqta ekibi,\n\nÖzel bir kutlama için DJ booking düşünüyorum.\n\nEtkinlik türü: \nŞehir: \nTarih / saat aralığı: \nMekân (varsa): \nKabaca davetli: \nMüzik beklentisi (varsa): \n\nTeşekkürler,\n",
  },
  {
    id: "kurumsal",
    title: "Kurumsal & marka",
    subtitle: "Şirket geceleri, ödül töreni, müşteri buluşması",
    summary: "Markanın tonuna uygun seleksiyon; profesyonel sahne dili.",
    detail:
      "Kurumsal tempo genelde kontrollü başlar, doğru anda açılır. İstenilen imaj ve mesajla çelişmeyen, akılda kalan ama abartısız bir kurgu hedefleriz.",
    subject: "Booking — Kurumsal etkinlik",
    message:
      "Selam,\n\nKurumsal / marka etkinliği için yazıyorum.\n\nMarka veya şirket: \nEtkinlik tipi: \nŞehir: \nTarih veya dönem: \nKabaca katılım: \nReferans ton veya link (varsa): \n\nTeşekkürler,\n",
  },
  {
    id: "acilis",
    title: "Açılış, lansman & kokteyl",
    subtitle: "Yeni mekân, ürün tanıtımı, VIP akşamlar",
    summary: "İlk izlenim güçlü; arka planda doğru dinamik — konuşmayı boğmaz.",
    detail:
      "Açılış ve lansmanlarda müzik, akışı destekler: karşılama, konuşma, networking ve sonrasında yükselen enerji. Zaman çizgisine göre esneriz.",
    subject: "Booking — Açılış / lansman / kokteyl",
    message:
      "Selam,\n\nAçılış / lansman / kokteyl etkinliği planlıyorum.\n\nEtkinlik başlığı: \nŞehir: \nTarih: \nProgram özeti (varsa): \nBeklenen katılım: \n\nTeşekkürler,\n",
  },
  {
    id: "venue",
    title: "Venue, lounge, restoran & otel",
    subtitle: "Düzenli gece veya özel sezon programı",
    summary: "Mekân karakterine uygun sound identity; tekrarlanabilir kalite.",
    detail:
      "Sabit veya dönemsel çalışmalarda mekânın ruhunu anlarız: oturma yoğunluğu, servis ritmi ve hedef kitleye göre günlük / haftalık akış kurgularız.",
    subject: "Booking — Venue / lounge / restoran / otel",
    message:
      "Selam,\n\nMekânımız için DJ / müzik programı hakkında görüşmek istiyorum.\n\nMekân tipi: \nŞehir: \nBekleyen günler veya özel tarih: \nKısa not: \n\nTeşekkürler,\n",
  },
  {
    id: "sahne",
    title: "Gösteri, sahne & özel konsept",
    subtitle: "Defile, performans eşlikleri, özel prodüksiyon",
    summary: "Sahne ve prova disiplini; zaman koduna duyarlı çalışma.",
    detail:
      "Gösteri akışında müzik ve geçişler keskin olmalı. Prova ve teknik uyumu önden planlar, sürtünmeyi azaltırız.",
    subject: "Booking — Gösteri / sahne / konsept",
    message:
      "Selam,\n\nSahne / gösteri tarafında destek arıyorum.\n\nProje tipi: \nŞehir: \nTarih: \nMekân veya kapasite: \nTeknik not (varsa): \n\nTeşekkürler,\n",
  },
  {
    id: "genel",
    title: "Henüz net değil",
    subtitle: "Fikri yaz; birlikte şekillendirelim",
    summary: "Takvim veya format oturmamış olabilir; iki cümle bile yeter.",
    detail:
      "Erken aşamada danışmak sorun değil. Aklındakileri paylaş; sana uygun yolu ve sonraki adımı birlikte netleştiririz.",
    subject: "Booking — Genel teklif talebi",
    message:
      "Selam,\n\nEtkinlik fikrim henüz tam net değil; danışmak istiyorum.\n\nNotlar: \nŞehir: \nAy veya dönem: \n\nTeşekkürler,\n",
  },
] as const;
