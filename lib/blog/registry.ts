export type BlogCategory = "dj" | "egitim" | "booking" | "b2b" | "produksiyon" | "sahne" | "efsaneler" | "haber";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: BlogCategory;
  /** Arayüz etiketi */
  categoryLabel: string;
  keywords: string[];
};

export const BLOG_POSTS: readonly BlogPostMeta[] = [
  {
    slug: "dugun-ve-kurumsal-etkinlik-icin-dj-secimi",
    title: "Düğün ve kurumsal etkinlik için DJ seçimi: nelere dikkat edilmeli?",
    description:
      "Düğün DJ’i ile kurumsal gece DJ’i aynı mı? Mekân, süre, müzik zevki ve teknik ihtiyaçlara göre doğru DJ ve müzik kürasyonu nasıl seçilir?",
    publishedAt: "2026-04-08",
    category: "booking",
    categoryLabel: "Booking & etkinlik",
    keywords: [
      "düğün DJ",
      "kurumsal etkinlik DJ",
      "DJ seçimi",
      "etkinlik müziği",
      "profesyonel DJ",
    ],
  },
  {
    slug: "etkinlik-muzigi-brif-rehberi",
    title: "Etkinlik müziği brifi nasıl yazılır? Organizatör ve marka rehberi",
    description:
      "Net bir müzik brifi neden önemli? Hedef kitle, tempo, yasaklar ve özel anlar için pratik şablon ve ipuçları.",
    publishedAt: "2026-04-08",
    category: "booking",
    categoryLabel: "Booking & etkinlik",
    keywords: ["etkinlik müziği brifi", "DJ brif", "kurumsal etkinlik müziği", "düğün müzik listesi"],
  },
  {
    slug: "dj-olarak-sahneye-cikmak-ilk-adimlar",
    title: "DJ olarak sahneye çıkmak: ilk adımlar ve kulüp kültürü",
    description:
      "Evde mix’ten canlı performansa geçiş, kulüp dinleyicisiyle çalışma ve sürdürülebilir bir DJ pratiği için yol haritası.",
    publishedAt: "2026-04-08",
    category: "dj",
    categoryLabel: "DJ & performans",
    keywords: ["DJ olmak", "kulüp DJ", "canlı DJ performansı", "elektronik müzik sahne"],
  },
  {
    slug: "dj-egitimi-pratik-ve-akademi",
    title: "DJ eğitimi: nereden başlanır? Kurs, pratik ve Academy yaklaşımı",
    description:
      "DJ öğrenmek için ekipman, yazılım ve kulak eğitimini bir arada düşünmek gerekir. Noqta Academy ve pratik odaklı öğrenme.",
    publishedAt: "2026-04-08",
    category: "egitim",
    categoryLabel: "Eğitim",
    keywords: ["DJ eğitimi", "DJ kursu", "DJ öğrenmek", "prodüksiyon eğitimi", "Academy"],
  },
  {
    slug: "marka-etkinliginde-muzik-deneyim-tasarimi",
    title: "Marka etkinliğinde müzik ve deneyim tasarımı: B2B perspektifi",
    description:
      "Lansman, sponsorluk ve marka gecelerinde müzik; sadece arka plan değil deneyimin parçasıdır. Kimlik, tempo ve güvenlik.",
    publishedAt: "2026-04-08",
    category: "b2b",
    categoryLabel: "İş birlikleri",
    keywords: ["marka etkinliği", "B2B etkinlik", "deneyim tasarımı", "kurumsal DJ", "sponsorluk etkinliği"],
  },
  {
    slug: "turkiye-genelinde-dj-booking-sureci",
    title: "Türkiye genelinde DJ booking: süreç, teknik gereksinimler ve planlama",
    description:
      "Şehirler arası DJ performansında ulaşım, sahne kurulumu, süre ve sözleşme hatları. Organizatör ve sanatçı için net çerçeve.",
    publishedAt: "2026-04-08",
    category: "booking",
    categoryLabel: "Booking & etkinlik",
    keywords: ["DJ booking", "Türkiye DJ", "etkinlik organizasyonu", "canlı performans planlama"],
  },
  {
    slug: "dj-nasil-olunur-2026-rehberi",
    title: "DJ Nasıl Olunur? Sıfırdan Başlayanlar İçin 2026 Rehberi",
    description: "Ekipman seçiminden ilk setine, pratik rutininden sahneye çıkmaya kadar DJ'liğe başlamak için bilmen gereken her şey — gerçekçi bir yol haritası.",
    publishedAt: "2026-07-22",
    category: "dj",
    categoryLabel: "DJ & performans",
    keywords: ["dj nasıl olunur", "dj olmak", "dj eğitimi", "sıfırdan dj", "dj başlangıç rehberi", "dj ekipmanları"],
  },
  {
    slug: "baslangic-icin-dj-controller-onerileri",
    title: "Başlangıç İçin DJ Controller Önerileri (2026)",
    description: "İlk DJ controller'ını alırken nelere bakmalısın? Bütçe bantlarına göre öneriler, yazılım uyumu ve 'büyüyünce ne olacak' sorusunun cevabı.",
    publishedAt: "2026-07-22",
    category: "dj",
    categoryLabel: "DJ & performans",
    keywords: ["dj controller önerileri", "başlangıç dj controller", "dj setup", "DDJ-FLX4", "dj ekipman fiyatları"],
  },
  {
    slug: "rekordbox-serato-traktor-karsilastirmasi",
    title: "rekordbox mu, Serato mu, Traktor mu? DJ Yazılımı Karşılaştırması",
    description: "Üç büyük DJ yazılımının güçlü ve zayıf yönleri, hangi DJ profiline hangisinin uyduğu ve kulüp standardı gerçeği.",
    publishedAt: "2026-07-22",
    category: "dj",
    categoryLabel: "DJ & performans",
    keywords: ["rekordbox mu serato mu", "dj yazılımı karşılaştırma", "traktor pro", "serato dj", "rekordbox"],
  },
  {
    slug: "beatmatching-nedir-nasil-ogrenilir",
    title: "Beatmatching Nedir? Kulaktan Miks Yapmayı Öğrenme Rehberi",
    description: "Sync tuşu varken beatmatching öğrenmeye değer mi? Evet — işte nedeni ve adım adım kulaktan beatmatching çalışma yöntemi.",
    publishedAt: "2026-07-22",
    category: "dj",
    categoryLabel: "DJ & performans",
    keywords: ["beatmatching nedir", "kulaktan miks", "beatmatch öğrenme", "dj geçiş teknikleri", "sync tuşu"],
  },
  {
    slug: "ilk-dj-setini-hazirlama-rehberi",
    title: "İlk DJ Setini Hazırlama Rehberi: Seçkiden Kayda",
    description: "İyi bir DJ seti rastgele iyi parçalar dizmek değildir. Enerji eğrisi, parça seçimi, geçiş planı ve kayıt için pratik bir çerçeve.",
    publishedAt: "2026-07-22",
    category: "dj",
    categoryLabel: "DJ & performans",
    keywords: ["dj seti nasıl hazırlanır", "dj set enerji eğrisi", "mix hazırlama", "harmonic mixing", "dj kayıt"],
  },
  {
    slug: "muzik-produksiyonuna-nereden-baslanir",
    title: "Müzik Prodüksiyonuna Nereden Başlanır? İlk Adım Rehberi",
    description: "DAW seçimi, minimum ekipman, ilk parçanı bitirmenin yolu ve yeni başlayanların en sık düştüğü tuzaklar.",
    publishedAt: "2026-07-22",
    category: "produksiyon",
    categoryLabel: "Prodüksiyon",
    keywords: ["müzik prodüksiyonu nasıl yapılır", "prodüksiyona başlangıç", "DAW seçimi", "elektronik müzik üretimi", "beat yapma"],
  },
  {
    slug: "ableton-mu-fl-studio-mu",
    title: "Ableton mu, FL Studio mu? Elektronik Müzik İçin DAW Karşılaştırması",
    description: "İki dev DAW'ın iş akışı farkları, güçlü yönleri, fiyatlandırması ve hangi üretici profiline hangisinin uyduğu.",
    publishedAt: "2026-07-22",
    category: "produksiyon",
    categoryLabel: "Prodüksiyon",
    keywords: ["ableton mu fl studio mu", "DAW karşılaştırma", "ableton live", "fl studio", "müzik yazılımı"],
  },
  {
    slug: "house-techno-melodic-techno-farklari",
    title: "House, Techno, Melodic Techno: Türleri Ayırt Etme Rehberi",
    description: "\"Bu house mu techno mu?\" tartışmasına son: türlerin kökenleri, ayırt edici özellikleri ve dinleyerek öğrenme listesi.",
    publishedAt: "2026-07-22",
    category: "sahne",
    categoryLabel: "Sahne & kültür",
    keywords: ["house techno farkı", "melodic techno nedir", "elektronik müzik türleri", "techno nedir", "house müzik"],
  },
  {
    slug: "istanbulda-elektronik-muzik-mekanlari",
    title: "İstanbul'da Elektronik Müzik: Sahneyi Tanıma Rehberi",
    description: "İstanbul'un elektronik müzik sahnesi nasıl işliyor? Mekan tipleri, semt semt sahne haritası ve geceye çıkmadan bilmen gerekenler.",
    publishedAt: "2026-07-22",
    category: "sahne",
    categoryLabel: "Sahne & kültür",
    keywords: ["istanbul elektronik müzik mekanları", "istanbul techno kulüpleri", "kadıköy elektronik müzik", "istanbul gece hayatı", "istanbul club"],
  },
  {
    slug: "turkiyede-elektronik-muzik-festivalleri",
    title: "Türkiye'de Elektronik Müzik Festivalleri Rehberi",
    description: "Türkiye'nin elektronik müzik festival haritası: formatlar, sezon takvimi, bilet stratejisi ve ilk festival deneyimi için ipuçları.",
    publishedAt: "2026-07-22",
    category: "sahne",
    categoryLabel: "Sahne & kültür",
    keywords: ["türkiye elektronik müzik festivalleri", "festival takvimi", "techno festival türkiye", "koy festivali", "festival bilet"],
  },
  {
    slug: "kraftwerk-elektronik-muzigin-mimarlari",
    title: "Kraftwerk: Elektronik müziğin mimarları",
    description: "Düsseldorf'ta bir stüdyodan çıkıp techno'dan hip-hop'a her şeyi etkileyen Kraftwerk'in hikâyesi, albümleri ve bugüne uzanan mirası.",
    publishedAt: "2026-07-23",
    category: "efsaneler",
    categoryLabel: "Efsaneler",
    keywords: ["Kraftwerk","elektronik müzik tarihi","Autobahn","Trans-Europe Express","krautrock","techno kökeni"],
  },
  {
    slug: "frankie-knuckles-house-muzigin-babasi",
    title: "Frankie Knuckles: House müziğin babası",
    description: "Chicago'daki Warehouse'tan dünyaya yayılan house müziğin doğuşu ve Frankie Knuckles'ın DJ'liği bir sanata dönüştüren mirası.",
    publishedAt: "2026-07-23",
    category: "efsaneler",
    categoryLabel: "Efsaneler",
    keywords: ["Frankie Knuckles","house müzik","Chicago house","Warehouse","house müzik tarihi","DJ efsaneleri"],
  },
  {
    slug: "detroit-belleville-three-techno-dogusu",
    title: "Belleville Three: Detroit'te techno nasıl doğdu?",
    description: "Juan Atkins, Derrick May ve Kevin Saunderson'ın Detroit banliyösünde kurduğu techno'nun hikâyesi; Avrupa'ya yolculuğu ve bugünkü sahneye etkisi.",
    publishedAt: "2026-07-23",
    category: "efsaneler",
    categoryLabel: "Efsaneler",
    keywords: ["Belleville Three","Detroit techno","Juan Atkins","Derrick May","Kevin Saunderson","techno tarihi"],
  },
  {
    slug: "jeff-mills-the-wizard-techno-ustasi",
    title: "Jeff Mills: The Wizard ve techno'nun sınırları",
    description: "Detroit radyolarından dünya sahnelerine, Underground Resistance'tan uzay temalı konsept albümlere: Jeff Mills'in techno'yu sanata dönüştüren yolculuğu.",
    publishedAt: "2026-07-23",
    category: "efsaneler",
    categoryLabel: "Efsaneler",
    keywords: ["Jeff Mills","The Wizard","Underground Resistance","The Bells","Detroit techno","techno DJ"],
  },
  {
    slug: "daft-punk-elektronik-muzigi-pop-yapan-ikili",
    title: "Daft Punk: Elektronik müziği pop'un merkezine taşıyan ikili",
    description: "French touch'tan Grammy'lere, kasklı sahne kimliğinden Random Access Memories'e: Daft Punk'ın elektronik müziği ana akıma taşıyan hikâyesi.",
    publishedAt: "2026-07-23",
    category: "efsaneler",
    categoryLabel: "Efsaneler",
    keywords: ["Daft Punk","French touch","Homework","Discovery","Random Access Memories","elektronik müzik pop"],
  },
  {
    slug: "carl-cox-sahnenin-yasayan-efsanesi",
    title: "Carl Cox: Sahnenin yaşayan efsanesi",
    description: "Üç deck'li setlerden Ibiza rezidanlıklarına, acid house yıllarından bugüne Carl Cox'un techno ve house sahnesindeki kalıcı etkisi.",
    publishedAt: "2026-07-23",
    category: "efsaneler",
    categoryLabel: "Efsaneler",
    keywords: ["Carl Cox","techno DJ","Ibiza","acid house","Space Ibiza","DJ efsaneleri"],
  },
  {
    slug: "elektronik-muzik-haberleri-temmuz-2026",
    title: "Sahne raporu — Temmuz 2026: Festival sezonu, Villalobos'un Sun Ra kompilasyonu ve Berlin'in kulüp krizi",
    description: "Junction 2'nin 10. yılı, Stone Techno'nun küratör serisi, Dekmantel haftası, Barış K'nın yer aldığı Sun Ra reworks albümü ve Berlin kulüp sahnesinin gayrimenkul sınavı.",
    publishedAt: "2026-07-23",
    category: "haber",
    categoryLabel: "Haberler & duyurular",
    keywords: ["elektronik müzik haberleri","techno festival 2026","Junction 2 2026","Stone Techno Festival","Dekmantel 2026","Ricardo Villalobos Sun Ra","Berlin kulüp krizi"],
  },
] as const;

export function blogPostBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function blogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
