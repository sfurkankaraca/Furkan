import Link from "next/link";

export function ArticleDugunVeKurumsalEtkinlikIcinDjSecimi() {
  return (
    <>
      <p>
        Düğün, kurumsal gece veya marka davetinde <strong>doğru DJ seçimi</strong>, yalnızca “şarkı çalması” değil;
        akış, tempo ve misafir profiline uygun müzik kürasyonu demektir. Bu yazıda hem düğün DJ’i hem kurumsal etkinlik DJ’i
        için pratik bir kontrol listesi paylaşıyoruz.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Düğün DJ’i ile kurumsal DJ aynı mı?</h2>
      <p>
        Her ikisi de profesyonel performans gerektirir; fark genelde <strong>dinleyici beklentisi ve süre</strong>dedir.
        Düğünde jenerasyon geniş olabilir; kurumsal gecede marka tonu, konuşmacı araları ve networking blokları daha belirgin
        olur. Deneyimli bir DJ, bu iki format arasında geçiş yapabilir; yine de referans ve brifin net olması gerekir.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Seçimden önce netleştirmeniz gerekenler</h2>
      <ul className="list-disc pl-5 space-y-2 text-white/75">
        <li>
          <strong>Mekân ve ses:</strong> Salon büyüklüğü, sahne var mı, kablosuz mikrofon ihtiyacı, dış mekân mı iç mekân mı?
        </li>
        <li>
          <strong>Süre ve akış:</strong> Kokteyl, yemek, dans blokları; DJ’in sahne dışı hazırlık süresi.
        </li>
        <li>
          <strong>Müzik sınırları:</strong> Yasak türler, mutlaka çalınacak/çalınmayacak örnekler, aile dostu içerik beklentisi.
        </li>
        <li>
          <strong>Teknik ekipman:</strong> Venue’nün sistemi mi, taşınan ekipman mı; yedek plan (power, kablo) kimde?
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-white pt-2">Referans ve prova</h2>
      <p>
        Kısa <strong>set kayıtları</strong> veya benzer mekânlardaki referanslar, beklentinizi hizalamak için kritiktir.
        Mümkünse brifi yazılı paylaşın; özel anlar (ilk dans, ödül müziği, konuşma girişleri) için zaman kodu veya sıra
        numarası ekleyin.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Sonuç</h2>
      <p>
        İyi bir düğün veya kurumsal gece DJ’i, hem teknik hem duygusal akışı yönetir. Türkiye genelinde planlama ve net
        iletişim için{" "}
        <Link href="/booking" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
          DJ booking
        </Link>{" "}
        sayfamızdan teklif alabilir veya doğrudan iletişime geçebilirsiniz.
      </p>
    </>
  );
}
