import { ArrowRight, Clock, CreditCard, GraduationCap, Headphones, Instagram, MessageCircle, Phone, Trophy, Users } from "lucide-react";
import {
  ACADEMY_CONTACT,
  INSTALLMENT_CARDS,
  INSTALLMENT_RATES,
  LABS_REGISTER_URL,
  PRIVATE_DJ_PACKAGES,
  SUNDAY_WORKSHOP,
  academyWhatsappHref,
  formatTry,
  studentPrice,
} from "@/lib/academy-pricing";

export function AcademyPricing() {
  return (
    <section id="fiyatlar" className="scroll-mt-24" aria-labelledby="pricing-heading">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Fiyatlar</p>
        <h2 id="pricing-heading" className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Eğitim ve workshop ücretleri
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-noqt-sky px-3 py-1 text-sm font-semibold text-black">
            <GraduationCap className="size-4" aria-hidden />
            Üniversite öğrencilerine tüm programlarda %50 indirim
          </p>
          <a
            href="#taksit"
            className="inline-flex items-center gap-2 rounded-full bg-noqt-lime px-3 py-1 text-sm font-semibold text-black"
          >
            <CreditCard className="size-4" aria-hidden />
            Kredi kartına 12 aya varan taksit
          </a>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Tüm fiyatlara KDV dahil değildir.</p>
      </div>

      {/* 1'e 1 DJ Eğitimi */}
      <div className="rounded-3xl border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-noqt-lime text-black">
            <Headphones className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">1&apos;e 1 DJ Eğitimi</h3>
            <p className="text-sm text-muted-foreground">Birebir ders + ekipman başında etüt saati</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PRIVATE_DJ_PACKAGES.map((pkg) => {
            const highlight = "highlight" in pkg && pkg.highlight;
            return (
              <div
                key={pkg.lessonHours}
                className={`relative flex flex-col rounded-2xl border p-5 ${
                  highlight ? "border-2 border-black/80 bg-background shadow-[6px_6px_0_0_var(--color-noqt-lime)]" : "border-border bg-background"
                }`}
              >
                {highlight ? (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-noqt-lime px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black ring-1 ring-black/80">
                    Önerilen
                  </span>
                ) : null}
                <p className="text-sm font-medium text-foreground">
                  {pkg.lessonHours} saat ders + {pkg.studyHours} saat etüt
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                  {formatTry(pkg.price)} <span className="text-base font-semibold text-muted-foreground">+ KDV</span>
                </p>
                <p className="text-xs text-muted-foreground">Peşin fiyat</p>
                <p className="mt-3 text-sm text-emerald-700">
                  Üniversite öğrencisine <span className="font-semibold">{formatTry(studentPrice(pkg.price))} + KDV</span>
                </p>
                <a
                  href={`${LABS_REGISTER_URL}?program=dj_private&paket=${pkg.lessonHours}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 ${
                    highlight ? "bg-foreground text-background" : "border border-border bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  Ön kayıt ol
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pazar DJ Workshop */}
      <div className="mt-5 rounded-3xl border border-border bg-card p-5 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-noqt-sky text-black">
              <Trophy className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">DJ Workshop</h3>
              <p className="text-sm text-muted-foreground">{SUNDAY_WORKSHOP.tagline}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground">
              <Clock className="size-4" aria-hidden />
              {SUNDAY_WORKSHOP.schedule}
            </p>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground">
              <Users className="size-4" aria-hidden />
              {SUNDAY_WORKSHOP.format}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SUNDAY_WORKSHOP.options.map((opt) => (
            <div key={opt.label} className="flex items-end justify-between gap-4 rounded-2xl border border-border bg-background p-5">
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                  {formatTry(opt.price)} <span className="text-base font-semibold text-muted-foreground">+ KDV</span>
                </p>
              </div>
              <p className="text-right text-sm text-emerald-700">
                Üniversite öğrencisine
                <br />
                <span className="font-semibold">{formatTry(studentPrice(opt.price))} + KDV</span>
              </p>
            </div>
          ))}
        </div>
        <a
          href={`${LABS_REGISTER_URL}?program=workshop`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition hover:opacity-90"
        >
          Workshop&apos;a kayıt ol
          <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>

      {/* Ödeme ve taksit */}
      <div id="taksit" className="mt-5 scroll-mt-24 rounded-3xl border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-noqt-lime text-black">
            <CreditCard className="size-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Kredi kartına 12 aya varan taksit</h3>
            <p className="text-sm text-muted-foreground">Fiyatlar peşin ödeme içindir; taksitte aşağıdaki komisyon eklenir.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Taksit yapılan kartlar</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {INSTALLMENT_CARDS.map((card) => (
                <li key={card} className="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
                  {card}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Komisyon oranları · düz kartlarda geçerli
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-3">
              {INSTALLMENT_RATES.map(({ months, rate }) => (
                <div key={months} className="rounded-xl border border-border bg-background px-3 py-2 text-center">
                  <p className="text-sm font-semibold text-foreground">{months} taksit</p>
                  <p className="text-xs text-muted-foreground">%{rate.toLocaleString("tr-TR")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AcademyContactStrip className="mt-5" />
    </section>
  );
}

export function AcademyContactStrip({ className = "" }: { className?: string }) {
  const items = [
    { icon: Phone, label: "Telefon", value: ACADEMY_CONTACT.phoneDisplay, href: ACADEMY_CONTACT.phoneHref, external: false },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: ACADEMY_CONTACT.whatsappDisplay,
      href: academyWhatsappHref("Merhaba, NOQT Academy eğitim ve workshop ücretleri hakkında bilgi almak istiyorum."),
      external: true,
    },
    {
      icon: Instagram,
      label: "Instagram DM",
      value: `@${ACADEMY_CONTACT.instagramHandle}`,
      href: ACADEMY_CONTACT.instagramHref,
      external: true,
    },
  ];
  return (
    <div className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      {items.map(({ icon: Icon, label, value, href, external }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-foreground/20 hover:shadow-sm"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-noqt-lime text-black"><Icon className="size-4" aria-hidden /></span>
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="block text-sm font-medium text-foreground">{value}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
