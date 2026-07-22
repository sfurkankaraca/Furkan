import { ContentCard, PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "KVKK — Noqta Club | noqta" };

export default function NoqtaClubKvkkPage() {
  return (
    <PageShell withGlow={false}>
      <ContentCard className="bg-black/20 p-6 md:p-8">
        <div className="grid gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">KVKK Aydınlatma Metni — Noqta Club</h1>
          <p className="text-white/70 text-sm">
            Bu metin, Noqta Club başvuru formu aracılığıyla toplanan kişisel verilerin işlenmesine ilişkin genel bilgilendirmedir.
          </p>

          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">1) Amaç</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              Noqta Club başvurularının değerlendirilmesi, üyelik süreçlerinin yürütülmesi, başvurunun reddedilmesi/onaylanması ve gerekli
              iletişimin sağlanması amacıyla kişisel verileriniz işlenir.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">2) İşlenen kişisel veriler</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              Başvuru formunda paylaştığınız: ad-soyad, e-posta, telefon (opsiyonel), şehir, yaş, Instagram hesabı, referans ve bize nasıl
              ulaştığınıza ilişkin seçim, katılım amacı ve müzik ilginize ilişkin bilgiler ile KVKK onaylarına ilişkin kayıtlar.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">3) Toplama yöntemi ve hukuki sebep</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              Veriler Noqta Club başvuru formu üzerinden elektronik ortamda toplanır. İşleme, ilgili mevzuat kapsamında ve başvuru sürecinin yürütülmesi için
              gerekli ölçüde yapılır.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">4) Saklama süresi</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              Başvuru ve değerlendirme süreçleri tamamlanana kadar saklanır. Hukuki yükümlülükler veya olası uyuşmazlıklar için gerektiği ölçüde
              daha uzun süre saklanabilir.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">5) KVKK kapsamındaki haklarınız</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              KVKK’nın 11. maddesinde sayılan haklarınız (veri işlenip işlenmediğini öğrenme, amaçları bilme, düzeltme, silme/yok edilmesini isteme vb.)
              kapsamındadır.
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-lg font-semibold">6) İletişim</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              Başvurunuzla ilgili veri işleme soruları için bize ulaşabilirsiniz.
            </p>
          </section>
        </div>
      </ContentCard>
    </PageShell>
  );
}

