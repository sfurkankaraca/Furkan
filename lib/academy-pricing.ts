// Academy fiyatları — tek kaynak. Instagram reklamları noqt.club/academy#fiyatlar'a yönlenir.
// Öğrenci indirimi tüm kalemlerde %50.

export const STUDENT_DISCOUNT = 0.5;

export const PRIVATE_DJ_PACKAGES = [
  { lessonHours: 4, studyHours: 4, price: 12000 },
  { lessonHours: 8, studyHours: 8, price: 20000, highlight: true },
  { lessonHours: 12, studyHours: 12, price: 28000 },
] as const;

export const SUNDAY_WORKSHOP = {
  schedule: "Her Pazar 14.00 – 16.00",
  tagline: "Her hafta yeni bir mix challenge",
  options: [
    { label: "Tek seferlik katılım", price: 1000 },
    { label: "Aylık katılım", price: 3000 },
  ],
} as const;

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
