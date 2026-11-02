import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import { CLUB_LEGAL_UPDATED_AT, SELLER } from "@/lib/content/seller";

export const metadata = {
  title: "Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme | noqt",
  description:
    "noqt.club üzerinden satın alınan kulüp üyeliği, etkinlik biletleri ve DJ hizmetleri için satıcı bilgileri ve satış koşulları.",
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
            title="Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme"
            description={`noqt.club üzerinden yapılan satışlar için satıcı bilgileri ve koşullar. Son güncelleme: ${CLUB_LEGAL_UPDATED_AT}.`}
          />
          <ContentCard className="grid gap-6 p-6 text-sm leading-relaxed text-white/75 md:p-8">
            <section className="grid gap-2">
              <p>
                Bu metin noqt.club üzerinden satın alınan <strong>Noqta Club üyeliği</strong>,{" "}
                <strong>noqt etkinlik biletleri</strong> ve <strong>DJ&apos;lere yönelik hizmetler</strong> (presskit,
                video ve audio set kaydı, stüdyo fotoğraf çekimi, müzik dağıtımı) için geçerlidir. NOQT Academy
                eğitimleri{" "}
                <a href="https://academy.noqt.club/mesafeli-satis-sozlesmesi" className="underline underline-offset-4">
                  academy.noqt.club
                </a>
                &apos;daki ayrı sözleşmeye, noqt social uygulamasında yapılan satışlar uygulamanın kendi sözleşmesine
                tabidir.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">1. Satıcı</h2>
              <ul className="space-y-1">
                <li>Ad soyad ({SELLER.kind}): {SELLER.name}</li>
                <li>Marka: noqt</li>
                <li>Adres: {SELLER.address}</li>
                <li>
                  Vergi dairesi / no: {SELLER.taxOffice} / {SELLER.taxId}
                </li>
                <li>Telefon: {SELLER.phone}</li>
                <li>E-posta: {SELLER.email}</li>
              </ul>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">2. Sözleşmenin konusu</h2>
              <p>
                Satın aldığın üyelik, bilet ya da hizmetin adı, kapsamı, teslim süresi ve vergiler dahil toplam bedeli
                ödeme adımında ya da sana gönderilen yazılı teklifte gösterilir. Bu bilgiler sözleşmenin parçasıdır.
                Fiyatlar Türk lirasıdır.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">3. Ödeme</h2>
              <p>
                Ödeme yöntemi ve tutar ödeme adımında gösterilir. Banka havalesi ile ödemede IBAN ve açıklamaya yazılacak
                kod sana iletilir; ödeme hesabımıza geçince siparişin onaylanır. Kart bilgilerin noqt tarafından
                saklanmaz.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">4. Teslim ve ifa</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>Kulüp üyeliği:</strong> Ödeme onaylanınca başlar ve ödeme adımında yazan süre boyunca geçerlidir.
                  Otomatik yenilenmez.
                </li>
                <li>
                  <strong>Etkinlik biletleri:</strong> Dijital olarak iletilir ve etkinlik günü girişte kullanılır.
                </li>
                <li>
                  <strong>DJ hizmetleri:</strong> Çekim ya da kayıt tarihi seninle birlikte planlanır. Hazırlanan işler
                  (dosya, video, fotoğraf, presskit) teklifte yazan süre içinde dijital olarak teslim edilir.
                </li>
                <li>Teslim edilecek fiziksel bir ürün yoktur, kargo ücreti alınmaz.</li>
              </ul>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">5. Cayma hakkı</h2>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Kulüp üyeliği ve DJ hizmetlerinde, satın aldığın günden itibaren 14 gün içinde gerekçe göstermeden
                  cayabilirsin. 14 gün dolmadan senin onayınla hizmetin ifasına başlanırsa (çekim, kayıt ya da tasarıma
                  başlanması, üyelik ayrıcalığının kullanılması), Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi
                  uyarınca cayma hakkı sona erer.
                </li>
                <li>
                  Belirli bir tarihte yapılan eğlence ve boş zaman etkinliklerine ait biletlerde, aynı madde uyarınca cayma
                  hakkı yoktur. Etkinlik iptal edilirse bedel iade edilir.
                </li>
                <li>
                  Cayma bildirimini {SELLER.email} adresine ya da {SELLER.phone} numarasına WhatsApp ile iletebilirsin.
                  İade, bildiriminin bize ulaştığı günden itibaren en geç 14 gün içinde yapılır.
                </li>
              </ul>
              <p>
                İptal ve iadenin ayrıntıları{" "}
                <a href="/teslimat-ve-iade-sartlari" className="underline underline-offset-4">
                  Teslimat ve İade Şartları
                </a>
                &apos;nda.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">6. Şikâyet ve uyuşmazlık</h2>
              <p>
                Şikâyet ve talepler için {SELLER.email} adresine yazabilirsin. Uyuşmazlıklarda, her yıl belirlenen parasal
                sınırlar içinde yerleşim yerindeki ya da satın aldığın yerdeki Tüketici Hakem Heyetine, bu sınırları aşan
                durumlarda Tüketici Mahkemesine başvurabilirsin.
              </p>
            </section>

            <section className="grid gap-2">
              <h2 className="text-base font-semibold text-white">7. Kişisel veriler</h2>
              <p>
                Kişisel verilerinin nasıl işlendiği{" "}
                <a href="/kvkk-aydinlatma" className="underline underline-offset-4">
                  KVKK Aydınlatma Metni
                </a>
                &apos;nde anlatılır.
              </p>
            </section>
          </ContentCard>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
