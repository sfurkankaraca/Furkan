/** Google Form “Noqt - Özel Etkinlik Formu” ile hizalı seçenekler ve metinler */

export const REFERRAL_OPTIONS = ["Instagram", "web sitesi", "referans", "Google", "diğer"] as const;

export const EVENT_TYPE_OPTIONS = [
  "Kulüp",
  "Bar",
  "Açılış",
  "Düğün",
  "Nişan",
  "Bride",
  "Kına",
  "Mezuniyet",
  "Doğum günü",
  "Kurumsal etkinlik",
  "Kokteyl",
  "Özel parti",
  "Diğer",
] as const;

export const ENERGY_OPTIONS = ["Sakin & şık", "Romantik", "Eğlenceli", "Yoğun dans", "Karışık akış"] as const;

export const MUSIC_GENRE_OPTIONS = [
  "Global Pop",
  "Türkçe pop",
  "House",
  "Tech House",
  "Afro house",
  "Techno",
  "Hard Techno",
  "Disco",
  "90'lar",
  "2000'ler",
  "R&B",
  "Hip hop",
  "Slow",
  "Latin",
  "Arabesk",
  "Oyun havaları",
  "Karışık",
] as const;

export const DJ_ANNOUNCE_OPTIONS = ["Evet", "Hayır"] as const;

export const SOUND_SYSTEM_OPTIONS = ["Evet", "Hayır", "Noqt Sağlasın"] as const;

export const EXTRA_TECH_OPTIONS = [
  "Ses sistemi (2 PA Hoparlör)",
  "Sub bass",
  "Mikrofon",
  "Işık",
  "DJ setup",
] as const;

export const POWER_OK_OPTIONS = ["Evet", "Hayır", "Kontrol etmemiz gerek"] as const;

export const PACKAGE_OPTIONS = [
  "Sadece Dj (2 saat)",
  "Dj + Setup (2saat)",
  "Dj + Setup + Ses Sistemi  (2saat, 2 PA hoparlör)",
  "Dj + Setup + Ses Sistemi + Sub bass (2saat, 2 PA hoparlör)",
] as const;

export const EXTRAS_OPTIONS = ["1 saat ek süre", "Video Prodüksiyon, İçerik üretimi"] as const;

export const PAYMENT_OPTIONS = ["Havale/EFT", "Kart", "Elden", "Fark etmez"] as const;

export const KVKK_CHECKBOX_LABELS = [
  "KVKK Aydınlatma Metni’ni okudum ve kişisel verilerimin talebimin değerlendirilmesi, teklif hazırlanması ve benimle iletişime geçilmesi amacıyla işlenmesini kabul ediyorum.",
  "Tarafıma kampanya, etkinlik ve hizmet bilgilendirmesi yapılmasına izin veriyorum.",
  "Verdiğim bilgilerin doğru olduğunu onaylıyorum.",
] as const;

export const KAPORA_INFO =
  "Kapora: KDV dahil nihai tutarın en az %25’i, etkinlik tarihinden en geç 30 gün önce tahsil edilir. (30 gün içinde gerçekleşecek etkinliklerde KDV dahil nihai tutarın en az %50’si, etkinlik tarihinden en geç 7 gün önce tahsil edilir.)\nKalan tutar: KDV dahil toplam üzerinden, etkinlik tarihinden itibaren en geç 7 gün içinde ödenir.";

/** Booking kartı `sec` → form “Etkinlik türü” ön seçimi */
export function eventTypeFromBookingSec(sec: string | null): string {
  if (!sec) return "";
  const m: Record<string, string> = {
    dugun: "Düğün",
    kurumsal: "Kurumsal etkinlik",
    acilis: "Açılış",
    venue: "Bar",
    sahne: "Özel parti",
    genel: "",
  };
  return m[sec] ?? "";
}

export type OzelEtkinlikPayload = {
  kaynak: "booking" | "b2b";
  fullName: string;
  phone: string;
  email: string;
  brandName: string;
  referralSource: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  city: string;
  venueName: string;
  addressLink: string;
  indoorOutdoor: string;
  guestCount: string;
  concept: string;
  importantMoments: string;
  importantMomentsDetail: string;
  energy: string;
  guestProfile: string;
  musicGenres: string[];
  djAnnounce: string;
  playlistLink: string;
  hasSoundSystem: string;
  soundSystemNotes: string;
  extraTech: string[];
  powerOk: string;
  packageChoice: string;
  extras: string[];
  invoiceName: string;
  paymentPref: string;
  kvkkProcess: boolean;
  kvkkMarketing: boolean;
  kvkkAccurate: boolean;
  extraNotes: string;
};

export type WizardStep =
  | { kind: "text"; field: keyof OzelEtkinlikPayload; label: string; required?: boolean; placeholder?: string; multiline?: boolean }
  | { kind: "date"; field: "eventDate"; label: string; optional?: boolean }
  | { kind: "radio"; field: keyof OzelEtkinlikPayload; label: string; options: readonly string[]; required?: boolean }
  | { kind: "multi"; field: "musicGenres" | "extraTech" | "extras"; label: string; options: readonly string[]; required?: boolean }
  | { kind: "group"; label: string; subtitle?: string; fields: readonly { field: keyof OzelEtkinlikPayload; label: string; required?: boolean; multiline?: boolean; placeholder?: string }[] }
  | { kind: "static"; label: string; body: string }
  | { kind: "kvkk" };

/** Tek ekranda bir soru / küçük grup — Google Form sırasına yakın */
export const TEKLIF_WIZARD_STEPS: readonly WizardStep[] = [
  { kind: "text", field: "fullName", label: "Ad Soyad", required: true, placeholder: "Adınız ve soyadınız" },
  { kind: "text", field: "phone", label: "Telefon numarası", required: true, placeholder: "+90 …" },
  { kind: "text", field: "email", label: "E-posta adresi", required: true, placeholder: "ornek@posta.com" },
  {
    kind: "text",
    field: "brandName",
    label: "Sizi hangi marka / işletme / kişi adına kaydedelim? (isteğe bağlı)",
    placeholder: "Marka, şirket veya adınız",
  },
  { kind: "radio", field: "referralSource", label: "Bize nasıl ulaştınız?", options: REFERRAL_OPTIONS, required: true },
  { kind: "radio", field: "eventType", label: "Etkinlik türü nedir?", options: EVENT_TYPE_OPTIONS, required: true },
  { kind: "date", field: "eventDate", label: "Etkinlik tarihi", optional: true },
  {
    kind: "group",
    label: "Başlangıç ve bitiş saati",
    fields: [
      { field: "startTime", label: "Başlangıç saati", required: true, placeholder: "örn. 20:00" },
      { field: "endTime", label: "Bitiş saati", required: true, placeholder: "örn. 02:00" },
    ],
  },
  { kind: "text", field: "city", label: "Etkinlik hangi şehirde?", required: true, placeholder: "Şehir" },
  { kind: "text", field: "venueName", label: "Mekân adı", required: true, placeholder: "Mekân adı" },
  {
    kind: "text",
    field: "addressLink",
    label: "Açık adres / konum linki (isteğe bağlı)",
    multiline: true,
    placeholder: "Adres veya Google Maps linki",
  },
  { kind: "text", field: "indoorOutdoor", label: "Etkinlik açık alan mı kapalı alan mı?", required: true, placeholder: "Açık / kapalı / karma" },
  { kind: "text", field: "guestCount", label: "Tahmini davetli sayısı", required: true, placeholder: "örn. 120" },
  {
    kind: "text",
    field: "concept",
    label: "Etkinliğin genel konsepti nasıl? (isteğe bağlı)",
    multiline: true,
    placeholder: "Kısaca konsept, tema veya beklenti…",
  },
  {
    kind: "text",
    field: "importantMoments",
    label: "Etkinlikte özellikle önemli anlar var mı? (isteğe bağlı)",
    multiline: true,
    placeholder: "Örn. ilk dans, konuşma, kesit töreni…",
  },
  {
    kind: "text",
    field: "importantMomentsDetail",
    label: "Varsa önemli anların detayını yazın (isteğe bağlı)",
    multiline: true,
    placeholder: "Saat, süre, özel istekler…",
  },
  { kind: "radio", field: "energy", label: "Etkinliğin enerjisini nasıl tarif edersiniz?", options: ENERGY_OPTIONS, required: true },
  {
    kind: "text",
    field: "guestProfile",
    label: "Misafir profili nasıl? (isteğe bağlı)",
    multiline: true,
    placeholder: "Yaş aralığı, beklenti, dil tercihi…",
  },
  {
    kind: "multi",
    field: "musicGenres",
    label: "Öncelikli müzik tarzları (isteğe bağlı, birden fazla seçebilirsiniz)",
    options: MUSIC_GENRE_OPTIONS,
  },
  { kind: "radio", field: "djAnnounce", label: "DJ’den anons / yönlendirme beklentiniz var mı?", options: DJ_ANNOUNCE_OPTIONS, required: true },
  {
    kind: "text",
    field: "playlistLink",
    label: "Müzik akışı için örnek playlist linki (isteğe bağlı)",
    placeholder: "Spotify / YouTube linki",
  },
  { kind: "radio", field: "hasSoundSystem", label: "Mekânda hazır ses sistemi var mı?", options: SOUND_SYSTEM_OPTIONS, required: true },
  {
    kind: "text",
    field: "soundSystemNotes",
    label: "Varsa mevcut sistem hakkında bildikleriniz (isteğe bağlı)",
    multiline: true,
    placeholder: "Marka, güç, kablosuz mikrofon vb.",
  },
  {
    kind: "multi",
    field: "extraTech",
    label: "Ek olarak kurulum istiyor musunuz? (isteğe bağlı)",
    options: EXTRA_TECH_OPTIONS,
  },
  { kind: "radio", field: "powerOk", label: "Mekânda elektrik, masa ve kurulum alanı uygun mu?", options: POWER_OK_OPTIONS, required: true },
  { kind: "static", label: "Kapora ve ödeme", body: KAPORA_INFO },
  { kind: "radio", field: "packageChoice", label: "Paket fiyatları", options: PACKAGE_OPTIONS, required: true },
  { kind: "multi", field: "extras", label: "Ekstralar (isteğe bağlı)", options: EXTRAS_OPTIONS },
  {
    kind: "text",
    field: "invoiceName",
    label: "Teklif hangi isim / firma adına hazırlanmalı?",
    required: true,
    placeholder: "Firma veya kişi adı",
  },
  { kind: "radio", field: "paymentPref", label: "Ödeme yöntemi tercihiniz", options: PAYMENT_OPTIONS, required: true },
  { kind: "kvkk" },
  {
    kind: "text",
    field: "extraNotes",
    label: "Eklemek istediğiniz bir şey (isteğe bağlı)",
    multiline: true,
    placeholder: "Ek notlarınız…",
  },
] as const;

/** Bu adımda doldurulan alanlar (Atla ile sıfırlanır) */
export function wizardStepFields(step: WizardStep): (keyof OzelEtkinlikPayload)[] {
  if (step.kind === "text" || step.kind === "date" || step.kind === "radio") return [step.field];
  if (step.kind === "multi") return [step.field];
  if (step.kind === "group") return step.fields.map((f) => f.field);
  return [];
}

export function wizardStepIsSkippable(step: WizardStep): boolean {
  if (step.kind === "static" || step.kind === "kvkk") return false;
  if (step.kind === "text") return !step.required;
  if (step.kind === "date") return Boolean(step.optional);
  if (step.kind === "radio") return !step.required;
  if (step.kind === "multi") return !step.required;
  if (step.kind === "group") return step.fields.every((f) => !f.required);
  return false;
}

export const EMPTY_PAYLOAD: OzelEtkinlikPayload = {
  kaynak: "booking",
  fullName: "",
  phone: "",
  email: "",
  brandName: "",
  referralSource: "",
  eventType: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  city: "",
  venueName: "",
  addressLink: "",
  indoorOutdoor: "",
  guestCount: "",
  concept: "",
  importantMoments: "",
  importantMomentsDetail: "",
  energy: "",
  guestProfile: "",
  musicGenres: [],
  djAnnounce: "",
  playlistLink: "",
  hasSoundSystem: "",
  soundSystemNotes: "",
  extraTech: [],
  powerOk: "",
  packageChoice: "",
  extras: [],
  invoiceName: "",
  paymentPref: "",
  kvkkProcess: false,
  kvkkMarketing: false,
  kvkkAccurate: false,
  extraNotes: "",
};
