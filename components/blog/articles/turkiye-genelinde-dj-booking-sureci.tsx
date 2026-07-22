import Link from "next/link";

export function ArticleTurkiyeGenelindeDjBookingSureci() {
  return (
    <>
      <p>
        <strong>Türkiye genelinde DJ booking</strong> planlarken ulaşım, yükleme-süreleri ve mekân tekniği gibi başlıklar
        İstanbul veya bölgesel şehir fark etmeksizin netleşmelidir. Bu rehber hem organizatör hem sanatçı tarafı için süreci
        çerçeveler.
      </p>

      <h2>Tekliften sahneye tipik adımlar</h2>
      <ol>
        <li>Tarih, şehir, süre ve misafir profili ile ilk brif</li>
        <li>Teklif ve müsaitlik; teknik gereksinim listesi (input, monitör, kurulum saati)</li>
        <li>Sözleşme / ön ödeme takvimi; venue ile teknik onay</li>
        <li>Gün içi soundcheck ve akış koordinasyonu</li>
      </ol>

      <h2>Teknik minimumlar</h2>
      <p>
        CDJ mi kontrolcü mü, venue’nün hangi girişleri var, monitör yeterli mi? Bu sorular gece günü değil, <strong>haftalar
        önce</strong> netleşmeli. Yedek USB, güç uzatması ve kablo seti gibi küçük detaylar sahne güvenini artırır.
      </p>

      <h2>Şehirler arası lojistik</h2>
      <p>
        Uçuş veya kara yolu, ekipmanın venue ile mi yoksa sanatçı ile mi hareket ettiği, yükleme personeli… Bunlar bütçeyi
        ve zamanı etkiler. Şeffaf planlama, son dakika stresini azaltır.
      </p>

      <h2>Teklif almak</h2>
      <p>
        Kayseri merkezli olsak da Türkiye genelinde projeler yürütüyoruz. Tarih ve brifinizle{" "}
        <Link href="/booking" className="text-foreground underline-offset-4 hover:underline">
          DJ booking
        </Link>{" "}
        sayfasından ulaşabilir veya{" "}
        <Link href="/contact" className="text-foreground underline-offset-4 hover:underline">
          iletişim
        </Link>{" "}
        formunu kullanabilirsiniz.
      </p>
    </>
  );
}
