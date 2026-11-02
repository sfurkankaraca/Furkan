import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import { CLUB_LEGAL_UPDATED_AT, SELLER } from "@/lib/content/seller";

export const metadata = {
  title: "Teslimat ve İade Şartları | noqt",
  description:
    "noqt.club kulüp üyeliği, etkinlik biletleri ve DJ hizmetleri için teslimat, iptal ve iade koşulları.",
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
            description={`Kulüp üyeliği, etkinlik biletleri ve DJ hizmetlerinde iptal ve iade. Son güncelleme: ${CLUB_LEGAL_UPDATED_AT}.`}
          />
          <ContentCard className="grid gap-6 p-6 text-sm leading-relaxed text-white/75 md:p-8">
            <section className="grid gap-2">
              <p>
                Bu koşullar noqt.club üzerinden yapılan satışlar içindir. NOQT Academy eğitimlerinin iptal ve iade koşulları{" "}
                <a href="https://academy.noqt.club/iptal-ve-iade" className="underline underline-offset-4">
                  academy.noqt.club
                </a>
                &apos;da, noqt social uygulamasınınkiler uygulamanın kendi sayfasındadır.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Kulüp üyeliği</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Satın aldığın günden itibaren 14 gün içinde ve üyelik ayrıcalıklarını (üyelere özel etkinlik, indirim
                  vb.) kullanmadan iptal edersen bedelin tamamı iade edilir.
                </li>
                <li>
                  Üyelik otomatik yenilenmez; süre bitince kendiliğinden sona erer. Başlamış bir üyelik döneminin kalan
                  süresi için iade yapılmaz.
                </li>
              </ul>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Etkinlik biletleri</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Belirli bir tarihte yapılan eğlence ve boş zaman etkinliklerinde cayma hakkı yoktur. Etkinlik iptal
                  edilmedikçe bilet iadesi ya da değişimi yapılmaz.
                </li>
                <li>Etkinlik iptal edilirse bilet bedelinin tamamı iade edilir.</li>
                <li>
                  Etkinlik ertelenirse biletin yeni tarihte geçerlidir. Yeni tarihe katılamayacaksan iade talep
                  edebilirsin.
                </li>
              </ul>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">DJ hizmetleri</h2>
              <p>Presskit, video ve audio set kaydı, stüdyo fotoğraf çekimi ve müzik dağıtımı için:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>İşe başlanmadan önce iptal edersen ödediğin bedelin tamamı iade edilir.</li>
                <li>
                  Planlanmış çekim ya da kayıt gününü en az 48 saat önce haber vererek ücretsiz değiştirebilirsin. Daha
                  geç iptal edilen ya da gelinmeyen çekim veya kayıt yapılmış sayılır.
                </li>
                <li>
                  İşe başlandıktan sonra vazgeçersen, teklifte yazan aşamalardan tamamlanmış olanların bedeli düşülür ve
                  kalan tutar iade edilir.
                </li>
                <li>Müzik dağıtımında parça dijital platformlara gönderildikten sonra dağıtım bedeli iade edilmez.</li>
                <li>
                  Teslim edilen işte hata ya da eksik görürsen teslimden itibaren 14 gün içinde bildir; teklifte yazan
                  düzeltme hakları kapsamında ücretsiz düzeltilir.
                </li>
              </ul>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">Teslimat</h2>
              <p>
                noqt.club üzerinden fiziksel ürün satılmaz. Biletler ve hazırlanan işler dijital olarak iletilir; kargo
                ücreti alınmaz.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">İade nasıl yapılır</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  İptal ya da iade talebini {SELLER.email} adresine e-postayla ya da {SELLER.phone} numarasına WhatsApp
                  mesajıyla ilet.
                </li>
                <li>
                  İade, ödemeyi yaptığın yönteme göre yapılır: kartla ödemelerde karta, havale ile ödemelerde senin adına
                  kayıtlı bir IBAN&apos;a. İade, talebinin bize ulaştığı günden itibaren en geç 14 gün içinde yapılır.
                </li>
              </ul>
            </section>
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
