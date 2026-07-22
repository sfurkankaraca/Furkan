export type SiteImageSlot = {
  id: string;
  /** Admin listesinde görünen görsel / alan başlığı */
  title: string;
  description: string;
  /** İlgili sayfa yolu */
  page: string;
  /** `image` veya `video` */
  mediaType?: "image" | "video";
  /** Admin boş bıraktığında kullanılacak yerel veya tam URL */
  defaultUrl?: string;
};

export const SITE_IMAGE_SLOTS: readonly SiteImageSlot[] = [
  {
    id: "home_hero_poster",
    title: "Kahraman alan posteri (video yüklenene kadar)",
    description: "Ana sayfa üst bölümü. Site ayarındaki hero videosu yüklenirken gösterilir.",
    page: "/",
  },
  {
    id: "booking_hero_poster",
    title: "Kahraman alan posteri",
    description: "Üst video yüklenirken kapak görseli. Boşsa /og.png kullanılır.",
    page: "/booking",
  },
  {
    id: "booking_media_1",
    title: "“Sahneden kareler” şeridi — Kare 1",
    description: "Booking sayfası orta bölümde yatay şeridin ilk görseli.",
    page: "/booking",
  },
  {
    id: "booking_media_2",
    title: "“Sahneden kareler” şeridi — Kare 2",
    description: "İkinci görsel.",
    page: "/booking",
  },
  {
    id: "booking_media_3",
    title: "“Sahneden kareler” şeridi — Kare 3",
    description: "Üçüncü görsel.",
    page: "/booking",
  },
  {
    id: "booking_media_4",
    title: "“Sahneden kareler” şeridi — Kare 4",
    description: "Dördüncü görsel.",
    page: "/booking",
  },
  {
    id: "booking_media_5",
    title: "“Sahneden kareler” şeridi — Kare 5",
    description: "Beşinci görsel.",
    page: "/booking",
  },
  {
    id: "booking_portfolio_video_1",
    title: "Portfolyo video — 1",
    description: "Booking sayfası için video portfolyo alanı.",
    page: "/booking",
    mediaType: "video",
  },
  {
    id: "booking_portfolio_video_2",
    title: "Portfolyo video — 2",
    description: "Booking sayfası için ikinci video.",
    page: "/booking",
    mediaType: "video",
  },
  {
    id: "booking_portfolio_video_3",
    title: "Portfolyo video — 3",
    description: "Booking sayfası için üçüncü video.",
    page: "/booking",
    mediaType: "video",
  },
  {
    id: "b2b_hero_poster",
    title: "Kahraman alan posteri",
    description: "B2B üst video alanı için poster. Boşsa /og.png.",
    page: "/b2b",
  },
  {
    id: "b2b_photo_1",
    title: "B2B fotoğraf — 1",
    description: "B2B sayfasındaki fotoğraf portfolyosu için ilk görsel.",
    page: "/b2b",
  },
  {
    id: "b2b_photo_2",
    title: "B2B fotoğraf — 2",
    description: "İkinci görsel.",
    page: "/b2b",
  },
  {
    id: "b2b_photo_3",
    title: "B2B fotoğraf — 3",
    description: "Üçüncü görsel.",
    page: "/b2b",
  },
  {
    id: "b2b_photo_4",
    title: "B2B fotoğraf — 4",
    description: "Dördüncü görsel.",
    page: "/b2b",
  },
  {
    id: "b2b_photo_5",
    title: "B2B fotoğraf — 5",
    description: "Beşinci görsel.",
    page: "/b2b",
  },
  {
    id: "b2b_photo_6",
    title: "B2B fotoğraf — 6",
    description: "Altıncı görsel.",
    page: "/b2b",
  },
  {
    id: "b2b_portfolio_video_1",
    title: "Portfolyo video — 1",
    description: "B2B sayfası için video portfolyo alanı.",
    page: "/b2b",
    mediaType: "video",
  },
  {
    id: "b2b_portfolio_video_2",
    title: "Portfolyo video — 2",
    description: "B2B sayfası için ikinci video.",
    page: "/b2b",
    mediaType: "video",
  },
  {
    id: "b2b_portfolio_video_3",
    title: "Portfolyo video — 3",
    description: "B2B sayfası için üçüncü video.",
    page: "/b2b",
    mediaType: "video",
  },
  {
    id: "academy_hero_poster",
    title: "Kahraman alan posteri",
    description: "Academy üst video alanı için poster. Boşsa /og.png.",
    page: "/academy",
  },
  {
    id: "academy_media_1",
    title: "“Sahneden kareler” / görsel şerit — Alan 1 (Ders ortamı)",
    description: "Academy sayfası alt bölümdeki şerit: soldan birinci kutu.",
    page: "/academy",
  },
  {
    id: "academy_media_2",
    title: "Şerit — Alan 2 (Workshop)",
    description: "İkinci kutu.",
    page: "/academy",
  },
  {
    id: "academy_media_3",
    title: "Şerit — Alan 3 (Öğrenci çıktısı)",
    description: "Üçüncü kutu.",
    page: "/academy",
  },
  {
    id: "academy_media_4",
    title: "Şerit — Alan 4 (Sahne pratiği)",
    description: "Dördüncü kutu.",
    page: "/academy",
  },
  {
    id: "academy_media_5",
    title: "Şerit — Alan 5 (Topluluk)",
    description: "Beşinci kutu.",
    page: "/academy",
  },
  {
    id: "events_hero_poster",
    title: "Kahraman alan posteri",
    description: "Etkinlikler listesi sayfası üst video posteri.",
    page: "/events",
  },
  {
    id: "radio_hero_poster",
    title: "Kahraman alan posteri",
    description: "Radio sayfası üst video posteri.",
    page: "/radio",
  },
  {
    id: "collective_hero_poster",
    title: "Kahraman alan posteri",
    description: "Collective sayfası üst video posteri.",
    page: "/collective",
  },
  {
    id: "club_hero_poster",
    title: "Kahraman alan posteri",
    description: "Noqta Club giriş sayfası üst video posteri.",
    page: "/noqta-club",
  },
  {
    id: "join_tier_1",
    title: "Üyelik kartı — 1. paket (başlangıç)",
    description: "Katıl sayfası yatay kartların ilki.",
    page: "/join",
    defaultUrl: "/1.JPG",
  },
  {
    id: "join_tier_2",
    title: "Üyelik kartı — 2. paket (döngü)",
    description: "İkinci kart.",
    page: "/join",
    defaultUrl: "/2.JPG",
  },
  {
    id: "join_tier_3",
    title: "Üyelik kartı — 3. paket (groove)",
    description: "Üçüncü kart.",
    page: "/join",
    defaultUrl: "/3.JPG",
  },
  {
    id: "join_tier_4",
    title: "Üyelik kartı — 4. paket (DJ adayları)",
    description: "Dördüncü kart.",
    page: "/join",
    defaultUrl: "/4.JPG",
  },
  {
    id: "join_tier_5",
    title: "Üyelik kartı — 5. paket (DJ+)",
    description: "Beşinci kart.",
    page: "/join",
    defaultUrl: "/5.JPG",
  },
  {
    id: "biz_kimiz_hero_poster",
    title: "Kahraman alan posteri",
    description: "Hakkımızda sayfası üst video posteri.",
    page: "/hakkimizda",
  },
  {
    id: "contact_hero_poster",
    title: "Kahraman alan posteri",
    description: "İletişim sayfası üst video posteri.",
    page: "/contact",
  },
  {
    id: "payment_iyzico_logo",
    title: "Ödeme logosu — iyzico ile Öde",
    description: "Ödeme ekranlarında görünen iyzico logosu.",
    page: "/odeme",
  },
  {
    id: "payment_card_logo",
    title: "Ödeme logosu — Visa / MasterCard",
    description: "Ödeme ekranlarında görünen kart ağı logosu (tek görsel).",
    page: "/odeme",
  },
  {
    id: "furkan_bio_photo",
    title: "Furkan Karaca — bio fotoğrafı",
    description: "Biyografi kartları ve /furkan-karaca başlık alanı profil fotoğrafı.",
    page: "/furkan-karaca",
  },
  {
    id: "furkan_photo_1",
    title: "Furkan Karaca — portfolyo fotoğraf 1",
    description: "/furkan-karaca sayfası portfolyo fotoğraf alanı.",
    page: "/furkan-karaca",
  },
  {
    id: "furkan_photo_2",
    title: "Furkan Karaca — portfolyo fotoğraf 2",
    description: "İkinci fotoğraf.",
    page: "/furkan-karaca",
  },
  {
    id: "furkan_photo_3",
    title: "Furkan Karaca — portfolyo fotoğraf 3",
    description: "Üçüncü fotoğraf.",
    page: "/furkan-karaca",
  },
  {
    id: "furkan_photo_4",
    title: "Furkan Karaca — portfolyo fotoğraf 4",
    description: "Dördüncü fotoğraf.",
    page: "/furkan-karaca",
  },
  {
    id: "furkan_photo_5",
    title: "Furkan Karaca — portfolyo fotoğraf 5",
    description: "Beşinci fotoğraf.",
    page: "/furkan-karaca",
  },
  {
    id: "furkan_photo_6",
    title: "Furkan Karaca — portfolyo fotoğraf 6",
    description: "Altıncı fotoğraf.",
    page: "/furkan-karaca",
  },
  {
    id: "furkan_portfolio_video_1",
    title: "Furkan Karaca — portfolyo video 1",
    description: "/furkan-karaca sayfası için video portfolyo alanı.",
    page: "/furkan-karaca",
    mediaType: "video",
  },
  {
    id: "furkan_portfolio_video_2",
    title: "Furkan Karaca — portfolyo video 2",
    description: "İkinci video.",
    page: "/furkan-karaca",
    mediaType: "video",
  },
  {
    id: "furkan_portfolio_video_3",
    title: "Furkan Karaca — portfolyo video 3",
    description: "Üçüncü video.",
    page: "/furkan-karaca",
    mediaType: "video",
  },
] as const;

export const BOOKING_MEDIA_SLOT_IDS: readonly string[] = [
  "booking_media_1",
  "booking_media_2",
  "booking_media_3",
  "booking_media_4",
  "booking_media_5",
] as const;

export const ACADEMY_MEDIA_SLOT_IDS: readonly string[] = [
  "academy_media_1",
  "academy_media_2",
  "academy_media_3",
  "academy_media_4",
  "academy_media_5",
] as const;

export const JOIN_TIER_SLOT_IDS: readonly string[] = [
  "join_tier_1",
  "join_tier_2",
  "join_tier_3",
  "join_tier_4",
  "join_tier_5",
] as const;

export const BOOKING_PORTFOLIO_VIDEO_SLOT_IDS: readonly string[] = [
  "booking_portfolio_video_1",
  "booking_portfolio_video_2",
  "booking_portfolio_video_3",
] as const;

export const B2B_PHOTO_SLOT_IDS: readonly string[] = [
  "b2b_photo_1",
  "b2b_photo_2",
  "b2b_photo_3",
  "b2b_photo_4",
  "b2b_photo_5",
  "b2b_photo_6",
] as const;

export const B2B_PORTFOLIO_VIDEO_SLOT_IDS: readonly string[] = [
  "b2b_portfolio_video_1",
  "b2b_portfolio_video_2",
  "b2b_portfolio_video_3",
] as const;

export const FURKAN_PHOTO_SLOT_IDS: readonly string[] = [
  "furkan_photo_1",
  "furkan_photo_2",
  "furkan_photo_3",
  "furkan_photo_4",
  "furkan_photo_5",
  "furkan_photo_6",
] as const;

export const FURKAN_PORTFOLIO_VIDEO_SLOT_IDS: readonly string[] = [
  "furkan_portfolio_video_1",
  "furkan_portfolio_video_2",
  "furkan_portfolio_video_3",
] as const;
