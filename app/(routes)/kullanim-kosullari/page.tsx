import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";

export const metadata = {
  title: "Kullanım Koşulları | noqta",
  description: "noqta platformunu kullanırken geçerli olan şartlar ve koşullar.",
  alternates: { canonical: "/kullanim-kosullari" },
};

export default function TermsPage() {
  return (
    <main>
      <PageHeroVideo
        sources={resolveRandomHeroSources("/kullanim-kosullari")}
        posterAlt="Kullanım koşulları arka plan görseli"
      >
        <PageShell withGlow={false}>
          <PageHeader
            title="Kullanım Koşulları"
            description="noqta platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız."
          />
          <ContentCard className="grid gap-4 p-6 text-sm leading-relaxed text-white/75 md:p-8">
            <p>
              <strong>Hizmet Kapsamı:</strong> noqta; etkinlik bileti satışı, DJ hizmet rezervasyonu ve müzik eğitimi
              hizmetleri sunan bir platformdur. Platform üzerinden gerçekleştirilen işlemler Türkiye Cumhuriyeti
              yasalarına tabidir.
            </p>
            <p>
              <strong>Bilet ve Rezervasyonlar:</strong> Satın alınan biletler kişiye özeldir, devredilemez. Etkinlik
              iptali veya ertelenmesi durumunda iade politikamız geçerlidir. İptal talepleri etkinlik tarihinden en az
              48 saat önce iletilmelidir.
            </p>
            <p>
              <strong>Kullanıcı Sorumlulukları:</strong> Platform üzerinde yanıltıcı bilgi paylaşmak, yetkisiz erişim
              girişiminde bulunmak veya platformu kötüye kullanmak yasaktır. Bu tür davranışlar tespit edildiğinde
              hesap askıya alınabilir.
            </p>
            <p>
              <strong>Fikri Mülkiyet:</strong> Platformdaki tüm içerikler (logo, tasarım, metin, ses ve görsel
              materyaller) noqta&apos;ya aittir. İzinsiz kopyalanması veya dağıtılması yasaktır.
            </p>
            <p>
              <strong>Sorumluluk Sınırı:</strong> noqta, üçüncü taraf hizmet sağlayıcılardan kaynaklanan kesintiler,
              ödeme gecikmeler veya teknik arızalardan sorumlu tutulamaz.
            </p>
            <p>
              <strong>Değişiklikler:</strong> Bu koşullar önceden bildirim yapılmaksızın güncellenebilir. Güncel versiyona
              bu sayfa üzerinden ulaşabilirsiniz.
            </p>
            <p>
              Sorularınız için <strong>destek@noqta.com</strong> adresinden iletişime geçebilirsiniz.
            </p>
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
