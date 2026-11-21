import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeroVideo } from "@/components/layout/PageHeroVideo";
import { resolveRandomHeroSources } from "@/lib/page-hero-videos";
import { CONTACT_EMAIL } from "@/lib/club-radio/content";
import { LEGAL_ENTITY } from "@/lib/legal-entity";

export const metadata: Metadata = {
  title: "Çerez Politikası | noqt",
  description:
    "noqt.club, academy.noqt.club, noqt.events ve noqt social sitelerinde kullanılan çerezler, amaçları, süreleri ve tercihlerini nasıl değiştirebileceğin.",
};

const UPDATED = "17 Kasım 2026";

type Row = { name: string; who: string; purpose: string; life: string };

const NECESSARY: Row[] = [
  { name: "noqt_consent", who: "noqt (birinci taraf)", purpose: "Çerez tercihini hatırlar; bant her sayfada yeniden çıkmaz.", life: "180 gün" },
  { name: "Oturum çerezleri (ör. labs_session)", who: "noqt (birinci taraf)", purpose: "Hesabına giriş yaptığında oturumu açık tutar, güvenliği sağlar.", life: "Oturum süresince / en çok 30 gün" },
  { name: "Dil tercihi", who: "noqt (birinci taraf)", purpose: "Türkçe / İngilizce seçimini hatırlar.", life: "1 yıl" },
];

const MARKETING: Row[] = [
  { name: "_fbp, _fbc", who: "Meta Platforms (Facebook, Instagram)", purpose: "Meta reklamlarının sonucunu ölçer (ör. reklamdan gelen biri formu doldurdu mu) ve ilgilenebileceğin kişilere reklam göstermemizi sağlar.", life: "90 gün" },
  { name: "_gcl_au ve Google Ads çerezleri", who: "Google", purpose: "Google reklamlarından gelen ziyaretlerin dönüşümünü ölçer.", life: "90 gün" },
];

function Table({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-[13px] text-white/75">
        <thead className="bg-white/5 text-white/90">
          <tr><th className="p-3 font-semibold">Çerez</th><th className="p-3 font-semibold">Sağlayan</th><th className="p-3 font-semibold">Amaç</th><th className="p-3 font-semibold">Süre</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-white/10 align-top">
              <td className="p-3 font-medium text-white/90">{r.name}</td><td className="p-3">{r.who}</td><td className="p-3">{r.purpose}</td><td className="p-3 whitespace-nowrap">{r.life}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  const h2 = "mt-6 text-lg font-semibold text-white";
  const p = "text-sm leading-relaxed text-white/70";
  return (
    <main>
      <PageHeroVideo sources={resolveRandomHeroSources("/cerez-politikasi")} posterAlt="noqt — çerez politikası arka plan görseli">
        <PageShell withGlow={false}>
          <div className="grid max-w-3xl gap-3">
            <h1 className="text-2xl font-semibold text-white md:text-3xl">Çerez politikası</h1>
            <p className={p}>
              Bu politika <b>noqt.club</b>, <b>academy.noqt.club</b>, <b>noqt.events</b> ve <b>noqt social</b> sitelerinde kullanılan
              çerezleri anlatır. Veri sorumlusu: {LEGAL_ENTITY.name}, {LEGAL_ENTITY.address}. Kişisel verilerin işlenmesiyle ilgili
              ayrıntılar <a className="underline" href="/kvkk-aydinlatma">KVKK aydınlatma metninde</a>.
            </p>

            <h2 className={h2}>Çerez nedir?</h2>
            <p className={p}>
              Çerez, bir siteyi ziyaret ettiğinde tarayıcına kaydedilen küçük bir dosyadır. Bazıları sitenin çalışması için
              gereklidir; bazıları ise ölçüm ve reklam içindir ve yalnızca senin onayınla kullanılır.
            </p>

            <h2 className={h2}>1. Zorunlu çerezler (onay gerekmez)</h2>
            <p className={p}>Site bunlar olmadan çalışmaz. Kapatılamaz, reklam ya da profil çıkarma için kullanılmaz.</p>
            <Table rows={NECESSARY} />

            <h2 className={h2}>2. Ölçüm (çerezsiz)</h2>
            <p className={p}>
              Sayfa görüntüleme ve hız ölçümü için <b>Vercel Analytics</b> ve <b>Plausible</b> kullanıyoruz. İkisi de çerez koymaz,
              seni tanımlayan bir kimlik saklamaz ve verileri toplu sayılar olarak tutar. Bu yüzden onay istemez.
            </p>

            <h2 className={h2}>3. Pazarlama çerezleri (yalnızca onayınla)</h2>
            <p className={p}>
              Çerez bandında <b>Kabul et</b> dersen ya da ayarlarda <b>Pazarlama</b>yı açarsan kullanılır. <b>Reddet</b> dersen bu
              etiketler hiç yüklenmez ve site aynı şekilde çalışır. Onay verdiysen sitedeki form ya da satın alma gibi işlemler
              reklam ölçümü için sunucumuzdan da Meta'ya iletilebilir (Conversions API); bu iletimde e-posta ve telefon gibi
              bilgiler okunamaz hâle getirilerek (SHA-256 ile) gönderilir.
            </p>
            <Table rows={MARKETING} />

            <h2 className={h2}>Yurt dışına aktarım</h2>
            <p className={p}>
              Meta ve Google'ın sunucuları yurt dışındadır. Pazarlama çerezlerine verdiğin onay, bu çerezlerle toplanan verilerin
              KVKK'nın 9. maddesi kapsamında yurt dışına aktarılmasını da kapsar. Onay vermezsen aktarım olmaz.
            </p>

            <h2 className={h2}>Tercihini nasıl değiştirirsin?</h2>
            <p className={p}>
              Her sitenin alt kısmındaki <b>Çerez ayarları</b> bağlantısından seçimini istediğin zaman değiştirebilir ya da onayını
              geri alabilirsin. Tarayıcı ayarlarından da çerezleri silebilir veya engelleyebilirsin. Meta reklam tercihlerini
              Facebook ve Instagram'daki <i>Reklam tercihleri</i> menüsünden ayrıca yönetebilirsin.
            </p>

            <h2 className={h2}>Hakların ve iletişim</h2>
            <p className={p}>
              KVKK'nın 11. maddesindeki haklarını (verilerinin işlenip işlenmediğini öğrenme, düzeltme, silme, itiraz vb.) kullanmak
              için <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> adresine yazabilirsin. Başvurulara en geç 30 gün içinde yanıt veririz.
            </p>

            <p className="mt-4 text-xs text-white/45">Son güncelleme: {UPDATED}</p>
          </div>
        </PageShell>
      </PageHeroVideo>
    </main>
  );
}
