// Academy fiyatları — tek kaynak. Instagram reklamları noqt.club/academy#fiyatlar'a yönlenir.
// Üniversite öğrencisi indirimi tüm kalemlerde %50.

export const STUDENT_DISCOUNT = 0.5;

export const PRIVATE_DJ_PACKAGES = [
  { lessonHours: 4, studyHours: 4, price: 12000 },
  { lessonHours: 8, studyHours: 8, price: 20000, highlight: true },
  { lessonHours: 12, studyHours: 12, price: 28000 },
] as const;

export const SUNDAY_WORKSHOP = {
  schedule: "Her Pazar 14.00 – 16.00",
  format: "Gruplar halinde · 60 dakika",
  tagline: "Her hafta yeni bir mix challenge",
  options: [
    { label: "Tek seferlik katılım", price: 1000 },
    { label: "Aylık katılım", price: 3000 },
  ],
} as const;

// Kredi kartına taksit — komisyon oranları kart sahibine yansır (%).
export const INSTALLMENT_CARDS = [
  "Halkbank Paraf",
  "Akbank Axess",
  "Anadolubank",
  "Yapı Kredi World",
  "Garanti BBVA Bonus",
  "DenizBank Bonus",
] as const;

export const INSTALLMENT_RATES = [
  { months: 2, rate: 7.49 },
  { months: 3, rate: 9.29 },
  { months: 4, rate: 11.29 },
  { months: 6, rate: 14.99 },
  { months: 9, rate: 20.49 },
  { months: 12, rate: 25.99 },
] as const;

export const ACADEMY_CONTACT = {
  phoneDisplay: "0541 733 55 14",
  phoneHref: "tel:+905417335514",
  whatsappDisplay: "0541 799 79 73",
  whatsappNumber: "905417997973",
  instagramHandle: "noqtacademy",
  instagramHref: "https://ig.me/m/noqtacademy",
} as const;

export const LABS_REGISTER_URL = "https://labs.noqt.club/register";

export function formatTry(amount: number) {
  return `${amount.toLocaleString("tr-TR")}₺`;
}

export function studentPrice(amount: number) {
  return Math.round(amount * (1 - STUDENT_DISCOUNT));
}

export function academyWhatsappHref(message: string) {
  return `https://wa.me/${ACADEMY_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
