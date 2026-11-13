import { ContentCard, PageShell } from "@/components/layout/PageShell";

export const metadata = { title: "KVKK — Noqta Club | noqta" };

export default function NoqtaClubKvkkPage() {
  return (
    <PageShell withGlow={false}>
      <ContentCard className="bg-black/20 p-6 md:p-8">
        <div className="grid gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">KVKK Aydınlatma Metni — Noqta Club</h1>
          <p className="text-white/70 text-sm">
            Bu metin, Noqta Club başvuru formu ve noqt.club bülten formu aracılığıyla toplanan kişisel verilerin işlenmesine ilişkin genel
            bilgilendirmedir.
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

          <section className="grid gap-2" id="ticari-ileti">
            <h2 className="text-lg font-semibold">Etkinlik duyuruları ve tanıtım e-postaları (ticari elektronik ileti onayı)</h2>
            <p className="text-white/75 text-sm leading-relaxed">
              noqt club ve noqt social etkinlik duyurularını ve tanıtım e-postalarını yalnız ayrıca onay verirseniz göndeririz (6563 sayılı
              Elektronik Ticaretin Düzenlenmesi Hakkında Kanun). Bu onay KVKK aydınlatmasından ayrıdır: kulüp başvurusunda isteğe bağlıdır ve
              başvurunuzun değerlendirilmesini etkilemez; bülten formunda ise bültenin kendisi e-posta olduğu için abonelik bu onayla alınır.
              Kutular varsayılan olarak boştur.
            </p>
            <p className="text-white/75 text-sm leading-relaxed">
              Onay verdiğinizde e-posta adresiniz, onay zamanı, onay metninin sürümü ve onayı verdiğiniz form saklanır. Bu kayıt, etkinlik
              e-postalarının tek listeden gönderilebilmesi için noqt social altyapısına (Google Firebase) aktarılır, e-postalar Resend (ABD)
              üzerinden gönderilir ve onaylar mevzuat gereği İleti Yönetim Sistemi&apos;ne (İYS) bildirilir.
            </p>
            <p className="text-white/75 text-sm leading-relaxed">
              Her tanıtım e-postasında tek tıkla çıkış bağlantısı vardır; destek@noqt.social adresine yazarak da çıkabilirsiniz. Çıktığınızda
              size bir daha tanıtım e-postası gönderilmez; çıkış kaydınız bunu kanıtlayabilmek için saklanır.
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
              Başvurunuzla ve e-posta tercihlerinizle ilgili veri işleme soruları için destek@noqt.social adresine yazabilirsiniz.
            </p>
          </section>
        </div>
      </ContentCard>
    </PageShell>
  );
}

