import { getPrisma } from "@/lib/prisma";
import UploadForm from "./UploadForm";
import AssetGrid from "./AssetGrid";

export const metadata = { title: "Görseller | Admin" };

const CATEGORY_LABELS: Record<string, string> = {
  hero: "Hero / Ana Görsel",
  academy: "Academy Sayfası",
  instructor: "Eğitmen Fotoğrafı",
  events: "Etkinlik Görselleri",
  workshops: "Workshop",
  booking: "Booking Sayfası",
  club: "Noqta Club",
  collective: "Collective",
  radio: "Radio",
  other: "Diğer",
};

const CATEGORY_ORDER = ["hero", "academy", "instructor", "events", "workshops", "booking", "club", "collective", "radio", "other"];

export default async function GorsellerPage() {
  const prisma = getPrisma();
  const assets = prisma
    ? await prisma.siteAsset.findMany({ orderBy: { createdAt: "desc" } })
    : [];

  // Kategoriye göre grupla
  const grouped: Record<string, typeof assets> = {};
  for (const asset of assets) {
    if (!grouped[asset.category]) grouped[asset.category] = [];
    grouped[asset.category]!.push(asset);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Görseller</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Site genelinde kullanılan görsel ve videoları yönet
        </p>
      </div>

      <UploadForm />

      {!prisma && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
          Veritabanı bağlantısı yok — görseller kaydedilemez.
        </div>
      )}

      {assets.length === 0 && prisma && (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <p className="text-4xl mb-4">🖼</p>
          <p className="text-foreground font-medium">Henüz görsel yüklenmedi</p>
          <p className="text-sm text-muted-foreground mt-1">
            Yukarıdaki formu kullanarak ilk görseli yükle
          </p>
        </div>
      )}

      {orderedCategories.map((category) => (
        <section key={category} className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {grouped[category]?.length}
            </span>
          </div>
          <AssetGrid assets={grouped[category] ?? []} />
        </section>
      ))}
    </div>
  );
}
