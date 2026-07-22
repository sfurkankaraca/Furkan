import Link from "next/link";

export function ArticleMarkaEtkinligindeMuzikDeneyimTasarimi() {
  return (
    <>
      <p>
        <strong>Marka etkinliğinde müzik</strong>, çoğu zaman son ana bırakılan bir detay gibi görünür; oysa deneyimin
        hızını, konukların kalış süresini ve sosyal paylaşımı doğrudan etkiler. Bu yazı B2B ve sponsorluk projeleri için
        stratejik bir bakış sunar.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Müzik = marka tonunun uzantısı</h2>
      <p>
        Premium lansmanda agresif trap, aile odaklı aktivasyonda ağır techno uyumsuz olabilir. Marka kılavuzu ile müzik
        seçkisini hizalamak; <strong>deneyim tasarımı</strong> ekibi, ajans ve DJ arasında ortak bir dil oluşturur.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Program blokları ve “sessiz” anlar</h2>
      <ul className="list-disc pl-5 space-y-2 text-white/75">
        <li>Konuşma ve sunum öncesi enerjiyi düşürmek için planlı düşüşler</li>
        <li>Networking sırasında konuşmayı engellemeyen dinamik seviye</li>
        <li>Photo moment veya ürün tanıtımı için kısa sessiz/ambient geçişler</li>
      </ul>

      <h2 className="text-xl font-semibold text-white pt-2">Sponsor ve venue uyumu</h2>
      <p>
        Venue ses limitleri, telif ve canlı yayın ihtiyaçları proje başında netleşmeli. Birden fazla paydaş varsa teknik
        sorumluların iletişim hattı önceden yazılı olmalıdır.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Noqta ile iş birliği</h2>
      <p>
        Marka geceleri, deneyim alanları ve uzun soluklu ortaklıklar için{" "}
        <Link href="/b2b" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
          B2B sayfamız
        </Link>{" "}
        üzerinden talep bırakabilir; müzik kürasyonunu etkinlik hedefleriyle birlikte kurgulayabiliriz.
      </p>
    </>
  );
}
