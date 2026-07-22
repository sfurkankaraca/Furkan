import Link from "next/link";

export function ArticleEtkinlikMuzigiBrifRehberi() {
  return (
    <>
      <p>
        <strong>Etkinlik müziği brifi</strong>, organizatör ile DJ veya müzik direktörü arasındaki sözleşmenin görünmez
        kısmıdır. Ne kadar net olursa, sahne o kadar güvenli ve keyifli geçer. Aşağıda hem marka hem özel etkinlikler için
        uygulanabilir bir çerçeve bulacaksınız.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Brif neden gerekli?</h2>
      <p>
        “Eğlenceli bir şeyler” ifadesi herkes için farklı anlam taşır. Brif; <strong>hedef kitle yaş aralığı</strong>, etkinlik
        tonu (resmi / kutlama / underground), yasaklar ve öne çıkarmak istediğiniz anları yazılı kılar. Böylece hem bütçe
        hem risk yönetimi kolaylaşır.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Şablona yakın bir liste</h2>
      <ul className="list-disc pl-5 space-y-2 text-white/75">
        <li>Etkinlik türü, tarih, şehir, tahmini misafir sayısı ve mekân tipi</li>
        <li>Program akışı: varış, yemek, konuşma, dans veya after blokları</li>
        <li>Referans setler veya Spotify/YouTube playlist’leri (3–10 parça yeter)</li>
        <li>Kesinlikle istenmeyen türler veya örnek parçalar</li>
        <li>Özel anlar: giriş müziği, logo reveal, ödül töreni, ilk dans vb.</li>
        <li>Teknik kontak: venue ses sorumlusu, sahne planı, kurulum saati</li>
      </ul>

      <h2 className="text-xl font-semibold text-white pt-2">Marka etkinlikleri için ek notlar</h2>
      <p>
        Marka ses tonu (premium, genç, minimal) ile müzik seçimi uyumlu olmalıdır. Telif ve yayın ihtiyacı varsa önceden
        belirtilmeli; bazı venue’lerde içerik politikaları farklıdır. B2B ve sponsorluk projelerinde{" "}
        <Link href="/b2b" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
          iş birlikleri
        </Link>{" "}
        hattımızdan da sürece dahil olabilirsiniz.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Özet</h2>
      <p>
        İyi brif = daha az sürpriz, daha iyi enerji. Brifinizi hazırladıktan sonra{" "}
        <Link href="/booking" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
          booking
        </Link>{" "}
        formu veya iletişim kanalları üzerinden paylaşmanız yeterli.
      </p>
    </>
  );
}
