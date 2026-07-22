import Link from "next/link";

export function ArticleDjEgitimiPratikVeAkademi() {
  return (
    <>
      <p>
        <strong>DJ eğitimi</strong> arayan biri için piyasada onlarca video ve kurs var; fark yaratan şey, bilgiyi düzenli
        pratiğe ve geri bildirime bağlamaktır. Noqta Academy yaklaşımı; yazılım, kulak ve sahne disiplinini birlikte ele alır.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Önce hedefi netleştirin</h2>
      <p>
        Ev partileri için mi, kulüp için mi, yoksa prodüksiyonla birlikte canlı set mi? Hedef farklıysa öğrenme sırası da
        değişir. <strong>DJ yazılımı</strong> ve kontrolcü eşlemesi, kulak eğitimi ve ritim hissi, ardından kayıt seçimi ve
        uzun form mix pratiği tipik bir yoldur.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Pratik rutin önerisi</h2>
      <ul className="list-disc pl-5 space-y-2 text-white/75">
        <li>Haftada en az iki kez 60–90 dakika odaklı mix; telefon yerine kayıt alıp dinleyin.</li>
        <li>Bir tür veya BPM bandında haftalık mini hedef (ör. breakbeat → house geçişleri).</li>
        <li>Referans DJ setlerini yalnızca dinlemeyin; geçiş noktalarını not edin.</li>
      </ul>

      <h2 className="text-xl font-semibold text-white pt-2">Academy ve Labs ile derinleşme</h2>
      <p>
        Academy çatısı altında workshop ve lab içerikleri, hem başlangıç hem ileri seviye katmanlar sunar. Oyunlaştırılmış
        pratik için{" "}
        <Link href="/games" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
          Games
        </Link>{" "}
        bölümüne de bakabilirsiniz. Güncel program ve başvuru için{" "}
        <Link href="/academy" className="text-cyan-300/90 hover:text-cyan-200 underline-offset-4 hover:underline">
          /academy
        </Link>{" "}
        ana sayfası en doğru kaynaktır.
      </p>

      <h2 className="text-xl font-semibold text-white pt-2">Kısa özet</h2>
      <p>
        DJ öğrenmek maraton; tek seferlik “sihirli formül” yoktur. Disiplin + geri bildirim + sahne deneyimi birleşince öğrenme
        hızlanır.
      </p>
    </>
  );
}
