import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi | noqta",
  description:
    "noqta üzerinden yapılan bilet ve merch satışlarına ilişkin mesafeli satış sözleşmesi.",
  alternates: { canonical: "/mesafeli-satis-sozlesmesi" },
};

export default function DistanceSalesPage() {
  return (
    <main>
      <PageHeroVideo
        sources={resolveRandomHeroSources("/mesafeli-satis-sozlesmesi")}
        posterAlt="Mesafeli satış sözleşmesi arka plan görseli"
      >
        <PageShell withGlow={false}>
          <PageHeader
            title="Mesafeli Satış Sözleşmesi"
            description="ALICI ile SATICI arasındaki bilet ve fiziksel ürün satışına ilişkin temel hükümler."
          />
          <ContentCard className="grid gap-6 p-6 text-sm leading-relaxed text-white/75 md:p-8">
            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Madde 1 - Konu</h2>
              <p>
                İşbu sözleşme, ALICI&apos;nın noqta platformu üzerinden satın aldığı hizmet (etkinlik bileti) veya mal
                (merch/fiziksel ürün) ile ilgili tarafların hak ve yükümlülüklerini düzenler.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Madde 2 - Ürün ve Hizmet Teslimatı</h2>
              <p>
                Hizmet niteliğindeki biletler dijital ortamda anında teslim edilir. Mal niteliğindeki fiziksel ürünler,
                ALICI&apos;nın formda belirttiği adrese kargo yoluyla teslim edilir.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Madde 3 - Cayma Hakkı İstisnaları</h2>
              <p>
                ALICI, Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca aşağıdaki durumlarda cayma hakkını
                kullanamayacağını kabul eder:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Belirli bir tarihte veya dönemde yapılması gereken eğlence veya dinlenme amacıyla yapılan boş zamanın
                  değerlendirilmesine ilişkin sözleşmeler (biletler).
                </li>
                <li>ALICI&apos;nın isteğiyle kişiye özel hazırlanan ürünler (isme özel merch vb.).</li>
              </ul>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Madde 4 - Genel Hükümler</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>Etkinliğin iptali durumunda sorumluluk organizatöre aittir; noqta iade sürecini yönetir.</li>
                <li>Fiziksel ürünlerde ayıplı mal bildirimleri teslimat anında veya en geç 2 gün içinde yapılmalıdır.</li>
              </ul>
              <p>
                Sorular için <strong>destek@noqta.com</strong> adresinden bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}

