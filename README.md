# noqta web

Minimalist, modern ve responsive web sitesi. Next.js 14+ (App Router), TypeScript, Tailwind CSS v4, shadcn/ui ve Framer Motion.

## Kurulum

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm i
pnpm dev
```

## Komutlar

- `pnpm dev`: Geliştirme sunucusu
- `pnpm build`: Production build
- `pnpm start`: Production server

## Çevre Değişkenleri

- `RESEND_API_KEY`: İletişim formu için e‑posta gönderimi (opsiyonel; yoksa console.log yapılır)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Plausible domain (opsiyonel)

## Yapı

- `app/`: App Router sayfaları
- `components/`: UI bileşenleri
- `data/events.json`: Etkinlik verisi
- `lib/i18n`: Basit sözlük ve `useI18n` hook
- `lib/mail/send.ts`: E‑posta gönderim fonksiyonu (Resend)

## Notlar

- Tema dark-first (#000 arka plan, #fff foreground)
- Köşeler `rounded-2xl`, grid tabanlı yerleşim
- Görseller `next/image` ile optimize edilir
- JSON‑LD: Organization (global) ve Event listesi (events sayfası)
