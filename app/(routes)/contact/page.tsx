import { Sparkles } from "lucide-react";
import { sendContactMail } from "@/lib/mail/send";
import { addContactInquiry, type ContactInquiryType } from "@/lib/admin/store";
import ContactForm from "@/components/ContactForm";
import { ContentCard, PageShell, PageHeader } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import { resolveSiteImageUrl } from "@/lib/site-images/resolver";
import { readSiteImageOverrides } from "@/lib/site-images/store";

export const metadata = {
  title: "İletişim — Booking ve İş Birliği | noqta",
  description:
    "Noqta ile iletişim: DJ booking, collective, Academy ve marka iş birlikleri için mesaj bırakın. Türkiye genelinde projeler.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; message?: string }>;
}) {
  const { subject, message } = await searchParams;
  const overrides = await readSiteImageOverrides();
  const contactPoster = resolveSiteImageUrl("contact_hero_poster", overrides) ?? "/og.png";

  async function action(_prev: unknown, formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");
    const formTypeRaw = String(formData.get("formType") || "general");
    const formType: ContactInquiryType =
      formTypeRaw === "booking" || formTypeRaw === "b2b" || formTypeRaw === "collective"
        ? formTypeRaw
        : "general";
    const details: Record<string, string> = {};
    for (const key of [
      "eventDate",
      "eventCity",
      "guestCount",
      "budget",
      "brandName",
      "timeline",
      "campaignType",
      "stageName",
      "city",
      "genres",
      "links",
    ]) {
      const v = String(formData.get(key) || "").trim();
      if (v) details[key] = v;
    }
    try {
      await addContactInquiry({ type: formType, name, email, phone, subject, message, details });
      const result = await sendContactMail({ name, email, phone, subject, message, formType, details });
      if (!result.ok) return { ok: false, error: "E‑posta gönderilemedi" } as const;
      return { ok: true } as const;
    } catch (error: unknown) {
      console.error("[contact] send error", error);
      return { ok: false, error: "Sunucu hatası" } as const;
    }
  }

  return (
    <main className="dark bg-background text-foreground">
      <PageHeroVideo
        sources={resolveRandomHeroSources("/contact")}
        poster={contactPoster}
        posterAlt="Noqta iletişim — arka plan görseli"
      >
        <PageShell withGlow={false}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-12">
        <PageHeader
          eyebrow={
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
              <Sparkles className="size-3.5 text-cyan-300" aria-hidden />
              İletişim
            </p>
          }
          title={<>İletişim — Noqta ekibine ulaşın</>}
          description="Booking, collective, akademi veya iş birliği — mesajın doğrudan ekibe gider. Konu ve linkleri net paylaşırsan dönüş daha hızlı olur."
        />
        <ContentCard className="p-6 md:p-8">
          <ContactForm action={action} defaultSubject={subject} defaultMessage={message} />
        </ContentCard>
      </div>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
