# noqta journal — editoryal kurallar

Journal (`/blog`) bir **online elektronik müzik dergisi**. İçerik `lib/blog/registry.ts` (künye) +
`components/blog/articles/*.tsx` (gövde) + `lib/blog/covers.ts` (kapak) üçlüsünde yaşar.
Diziler `lib/blog/series.ts`'te tanımlıdır.

---

## 1. Doğruluk protokolü (zorunlu)

Bu kural, 2026-07 tarihinde yaşanan bir olaydan sonra yazıldı: arama motoru, 2020 tarihli
"Mixmag basılı yayını durduruyor" haberini güncel bir sonuç olarak sundu. Kaynak açılıp
tarihi görülmeseydi altı yıllık bir haber "bu ayın gelişmesi" diye yayımlanacaktı.

**Hiçbir olgusal iddia hafızadan yazılmaz.** Haber, tarih, isim, rakam, tarihçe — hepsi kaynağa dayanır.

Yayın öncesi her olgusal madde için:

1. **Kaynağı aç.** Arama sonucundaki özet yeterli değildir; sayfanın kendisi açılır.
2. **Tarihi kontrol et.** Haberin yayın tarihi görülmeden "güncel" denmez. Arama motorları
   eski içeriği güncel gibi sıralayabilir.
3. **İkinci kaynak ara.** Özellikle iddialı başlıklarda (kapanış, iflas, ayrılık, ödül) tek kaynak yetmez.
4. **Birincil kaynağı tercih et.** Etiketin/festivalin/sanatçının kendi duyurusu > haber sitesi > blog derlemesi.
5. **Emin değilsen yazma.** Zayıf doğrulanan madde yayımlanmaz; çıkarılır.

**Yasak:** Uydurma haber, uydurma alıntı, uydurma tarih/lineup, "muhtemelen böyledir" diye
yazılmış detay. Bir sanatçının fotoğrafı, o kişi olduğu doğrulanmadan kullanılmaz
(dosya adına güvenilmez — görsel açılıp bakılır).

**Belirsizliği yaz.** Tarih aralığı net değilse "duyurulan tarihlerle", iddia tartışmalıysa
"kaynağa göre" gibi ifadelerle aktarılır.

---

## 2. Görsel ve telif

- Telifli basın fotoğrafı **kullanılmaz**. Yalnızca (a) noqta'nın kendi arşivi,
  (b) serbest lisanslı görseller (CC BY / CC BY-SA / CC0 / kamu malı).
- Kaynak olarak Wikimedia Commons kullanılıyorsa lisans API'den doğrulanır
  ("fair use" / "non-free" olanlar elenir).
- Her fotoğraf için künye zorunlu: **fotoğrafçı + lisans + kaynak linki** (`covers.ts` içindeki
  `credit` / `creditUrl`). Bu, CC lisanslarının atıf şartıdır — süs değildir.
- İndirilen her görsel gözle kontrol edilir: doğru kişi/mekan mı?
- Kapağı olmayan yazı tipografik kapağa düşer; boş kapak bırakmak yerine bu kullanılır.

---

## 3. Diziler ve ritim

Dergiyi ayakta tutan şey tek tek yazılar değil, **devam eden diziler**. Okur bir diziyi takip
eder; arama motoru düzenli tazeliği ödüllendirir.

| Dizi | Ritim | Ne yapar |
|---|---|---|
| Sahne raporu | Aylık | Haber derlemesi — doğrulama protokolü burada en kritik |
| Parçanın hikâyesi | Haftalık | Tek bir kaydın hikâyesi — tarihsel, doğrulanabilir, evergreen |
| Efsaneler | İki haftada bir | Portre — köken, kilit işler, etki, dinleme listesi |
| Sahne haritası | Aylık | Şehir rehberi — yerel SEO'da güçlü |
| Başlangıç seti | İki haftada bir | Tür/konu giriş rehberi ve seçki |

**Neden bu karışım:** Sahne raporu güncellik (taze içerik sinyali) sağlar ama sürekli doğrulama
ister. Diğer dört dizi tarihsel/evergreen olduğu için doğrulama yükü düşüktür ve arşiv değeri
zamanla artar. Haber tek başına taşınmaz; evergreen diziler yükü dengeler.

**Yeni dizi eklerken:** `lib/blog/series.ts` içine tanım gir, ritmi gerçekçi seç
(tutulamayacak söz verilmez), en az 2-3 bölümlük fikir listesi hazır olsun.

---

## 4. Yazı standardı

- Uzunluk ≥ 1000 kelime; ince liste yazısı yok.
- Yapı: giriş paragrafı (H1 başlıktan sonra), H2/H3 hiyerarşisi, kapanış/özet.
- Her yazı en az bir başka Journal yazısına iç bağlantı verir.
- `keywords` alanı boş bırakılmaz — hedef sorgular yazılır.
- Dil: Türkçe, samimi ama bilgili; çeviri kokmaz. Uluslararası basından alınan bilgi
  **yorumla birlikte** aktarılır, çeviri olarak değil.

---

## 5. Yayın akışı

1. İçeriği yaz → `components/blog/articles/<slug>.tsx`
2. Künyeyi ekle → `lib/blog/registry.ts` (slug, title, description, publishedAt, category,
   categoryLabel, series, keywords)
3. Gövdeyi kaydet → `components/blog/article-bodies.tsx`
4. Kapak (varsa) → `lib/blog/covers.ts` + görsel `public/journal/<slug>.jpg`
5. `npm run build` ile doğrula
6. `main`'e push → Vercel otomatik production deploy
7. Canlıda kontrol et (liste + yazı sayfası + kapak künyesi)

Sitemap otomatik: `blogSlugs()` üzerinden beslenir, elle iş gerekmez.
