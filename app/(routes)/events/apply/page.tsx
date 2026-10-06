import EventApplicationForm from "@/components/EventApplicationForm";
import { sendEventApplicationMail } from "@/lib/mail/send";
import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "Etkinlik Başvurusu | noqta" };

export default function EventApplyPage() {
  async function action(_prev: unknown, formData: FormData) {
    "use server";
    try {
      const eventId = String(formData.get("eventId") || "");
      const eventTitle = String(formData.get("eventTitle") || "");
      const name = String(formData.get("name") || "");
      const email = String(formData.get("email") || "");
      const phone = String(formData.get("phone") || "");
      const birthDate = String(formData.get("birthDate") || "");
      const city = String(formData.get("city") || "");
      const mainReason = String(formData.get("mainReason") || "");
      const musicGenres = (formData.getAll("musicGenres") || []).map(String);
      const djExcitement = String(formData.get("djExcitement") || "");
      const hasCar = String(formData.get("hasCar") || "no") === "yes";
      const instagram = String(formData.get("instagram") || "");
      const consentLocation = formData.get("consentLocation") === "on";
      const consentInstructions = formData.get("consentInstructions") === "on";
      const referrer = String(formData.get("referrer") || "");

      if (!eventId || !name || !email || !phone || !birthDate || !city || !mainReason || !djExcitement || !instagram || !consentLocation || !consentInstructions) {
        return { ok: false, error: "Lütfen zorunlu alanları doldurun" } as const;
      }

      const res = await sendEventApplicationMail({
        eventId,
        eventTitle: eventTitle || undefined,
        name,
        email,
        phone,
        birthDate,
        city,
        mainReason: mainReason as any,
        musicGenres,
        djExcitement: djExcitement as any,
        hasCar,
        instagram,
        consentLocation,
        consentInstructions,
        referrer: referrer || undefined,
      });
      if (!res.ok) return { ok: false, error: "E‑posta gönderilemedi" } as const;
      return { ok: true } as const;
    } catch (e) {
      console.error("[apply] action error", e);
      return { ok: false, error: "Sunucu hatası" } as const;
    }
  }

  const description = (
    <>
      <p>12 Ağustos Salı gecesi, Felahiye yakınlarında gerçekleştireceğimiz özel etkinlik için başvurunu bu form üzerinden yapabilirsin.</p>
      <p>Etkinlik ücretsiz olup. Katılım kontenjanla sınırlı, seni çağıramazsak üzülme, kaybol ve sıradaki etkinlik için sana mail atmamızı bekle.</p>
      <p>Konum bilgisi yalnızca başvurusu onaylanan kişilere iletilecektir.</p>
      <p>Başvurunun geçerli olması için @noqtclub ve @voilatoncafe resmi Instagram hesaplarını takip ettiğinden ve 18yaşından büyük olduğundan emin ol.</p>
    </>
  );

  return (
    <div>
      <PageShell>
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-12">
          <PageHeader
            eyebrow={
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70">
                Başvuru
              </p>
            }
            title="Perseid Meteor Party — Başvuru"
            description={description}
          />
          <ContentCard className="p-6 md:p-8">
            <EventApplicationForm
              action={action}
              defaultEventId="private-meteor-party-2025-08-12"
              defaultEventTitle="Private Meteor Party"
            />
          </ContentCard>
        </div>
      </PageShell>
    </div>
  );
} 