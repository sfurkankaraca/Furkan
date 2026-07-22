import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";

export const metadata = {
  title: "Teslimat ve İade Şartları | noqta",
  description:
    "noqta bilet (dijital) ve merch (fiziksel) ürünleri için teslimat, iptal ve iade koşulları.",
  alternates: { canonical: "/teslimat-ve-iade-sartlari" },
};

export default function DeliveryReturnPage() {
  return (
    <main>
      <PageHeroVideo
        sources={resolveRandomHeroSources("/teslimat-ve-iade-sartlari")}
        posterAlt="Teslimat ve iade şartları arka plan görseli"
      >
        <PageShell withGlow={false}>
          <PageHeader
            title="Teslimat ve İade Şartları"
            description="Bilet ve merch siparişlerinde teslimat, iptal, iade ve etkinlik iptal prosedürleri."
          />
          <ContentCard className="grid gap-6 p-6 text-sm leading-relaxed text-white/75 md:p-8">
            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Teslimat Esasları</h2>
              <p>
                <strong>Dijital Ürünler (Bilet):</strong> Satın alınan etkinlik biletleri, ödeme onayı ardından ALICI
                tarafından belirtilen e-posta adresine veya telefon numarasına (SMS/QR Kod) anında iletilir. Fiziksel
                gönderim yapılmaz.
              </p>
              <p>
                <strong>Fiziksel Ürünler (Merch):</strong> Tekstil, aksesuar vb. fiziksel ürünler sipariş onayından
                itibaren 3-5 iş günü içinde kargoya verilir. Kargo takip numarası ALICI ile paylaşılır.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">İade ve İptal Şartları</h2>
              <p>
                <strong>Biletler:</strong> 6502 sayılı Kanun uyarınca, belirli bir tarihte yapılması gereken eğlence
                veya dinlenme amacıyla yapılan boş zamanın değerlendirilmesine ilişkin sözleşmelerde cayma hakkı
                kullanılamaz. Etkinlik iptal edilmediği sürece bilet iadesi veya değişimi yapılamaz.
              </p>
              <p>
                <strong>Fiziksel Ürünler (Merch):</strong> ALICI, ürünü teslim aldığı tarihten itibaren 14 gün içinde,
                ambalajı açılmamış, kullanılmamış ve yeniden satılabilirlik özelliğini yitirmemiş ürünleri iade
                edebilir.
              </p>
              <p>
                <strong>İade Süreci:</strong> Talepler <strong>destek@noqta.com</strong> adresine iletilmelidir.
                Fiziksel ürün iadelerinde kargo ücreti (ayıplı mal hariç) ALICI&apos;ya aittir.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Etkinlik İptali Durumu</h2>
              <p>
                Etkinliğin organizatör tarafından iptal edilmesi halinde bilet bedeli, ödeme yapılan karta en geç 7 iş
                günü içinde iade edilir. Erteleme durumunda etkinliğe katılamayan kullanıcılar iade talebini destek
                kanallarından iletebilir.
              </p>
            </section>
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}

