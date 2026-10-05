import { ArrowRight, Clock, GraduationCap, Headphones, Instagram, MessageCircle, Phone, Trophy } from "lucide-react";
import {
  ACADEMY_CONTACT,
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Fiyatlar</p>
        <h2 id="pricing-heading" className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Eğitim ve workshop ücretleri
        </h2>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          <GraduationCap className="size-4" aria-hidden />
          Öğrencilere tüm programlarda %50 indirim
        </p>
      </div>

      {/* 1'e 1 DJ Eğitimi */}
      <div className="rounded-3xl border border-border bg-card p-5 md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-fuchsia-50 text-fuchsia-600">
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
                  highlight ? "border-fuchsia-300 bg-gradient-to-br from-fuchsia-50 via-background to-violet-50 shadow-sm" : "border-border bg-background"
                }`}
              >
                {highlight ? (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-fuchsia-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Önerilen
                  </span>
                ) : null}
                <p className="text-sm font-medium text-foreground">
                  {pkg.lessonHours} saat ders + {pkg.studyHours} saat etüt
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{formatTry(pkg.price)}</p>
                <p className="text-xs text-muted-foreground">Peşin</p>
                <p className="mt-3 text-sm text-emerald-700">
                  Öğrenciye <span className="font-semibold">{formatTry(studentPrice(pkg.price))}</span>
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
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Trophy className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">DJ Workshop</h3>
              <p className="text-sm text-muted-foreground">{SUNDAY_WORKSHOP.tagline}</p>
            </div>
          </div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground">
            <Clock className="size-4 text-violet-600" aria-hidden />
            {SUNDAY_WORKSHOP.schedule}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SUNDAY_WORKSHOP.options.map((opt) => (
            <div key={opt.label} className="flex items-end justify-between gap-4 rounded-2xl border border-border bg-background p-5">
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{formatTry(opt.price)}</p>
              </div>
              <p className="text-right text-sm text-emerald-700">
                Öğrenciye
                <br />
                <span className="font-semibold">{formatTry(studentPrice(opt.price))}</span>
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
          <Icon className="size-5 shrink-0 text-fuchsia-600" aria-hidden />
          <span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
            <span className="block text-sm font-medium text-foreground">{value}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
