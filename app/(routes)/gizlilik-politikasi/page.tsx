import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";

export const metadata = {
  title: "Gizlilik Sözleşmesi | noqta",
  description: "noqta biletleme ve e-ticaret süreçlerinde kişisel verilerin işlenmesi ve korunmasına ilişkin esaslar.",
  alternates: { canonical: "/gizlilik-politikasi" },
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <PageHeroVideo
        sources={resolveRandomHeroSources("/gizlilik-politikasi")}
        posterAlt="Gizlilik sözleşmesi arka plan görseli"
      >
        <PageShell withGlow={false}>
          <PageHeader
            title="Gizlilik Sözleşmesi"
            description="Kişisel verilerinizin hangi amaçla işlendiği, nasıl korunduğu ve hangi kapsamda paylaşıldığı."
          />
          <ContentCard className="grid gap-4 p-6 text-sm leading-relaxed text-white/75 md:p-8">
            <p>
              <strong>İşlenen Veriler:</strong> İsim, iletişim bilgileri, bilet gönderimi için e-posta ve merch teslimatı
              için açık adres bilgileri güvenli şekilde saklanır.
            </p>
            <p>
              <strong>Ödeme Güvenliği:</strong> Kart bilgileriniz noqta sunucularında tutulmaz. Tüm işlemler iyzico
              altyapısı üzerinden 256-bit SSL ile şifrelenmiş şekilde gerçekleştirilir.
            </p>
            <p>
              <strong>Kullanım Amacı:</strong> Veriler; bilet teslimi, ürün kargolama ve faturalandırma süreçleri için
              kullanılır. Bu kapsam dışında üçüncü taraflarla paylaşılmaz.
            </p>
            <p>
              <strong>Pazarlama İzni:</strong> Pazarlama iletişimleri yalnızca açık rızanız varsa gönderilir; dilediğiniz
              zaman izni geri çekebilirsiniz.
            </p>
            <p>
              Destek talepleri ve veri başvuruları için <strong>destek@noqta.com</strong> adresi üzerinden iletişime
              geçebilirsiniz.
            </p>
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
