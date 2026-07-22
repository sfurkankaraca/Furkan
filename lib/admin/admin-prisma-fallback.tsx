import { ContentCard } from "@/components/layout/PageShell";

/** Vercel / Neon: URL doğru, ssl, IP allowlist sorunlarında sorgu düşer */
export function AdminPrismaErrorCard({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <ContentCard className="bg-zinc-900/40 p-6 md:p-8">
      <h1 className="text-2xl font-semibold text-white">{title || "Admin"}</h1>
      {subtitle ? <p className="mt-1 text-sm text-zinc-500">{subtitle}</p> : null}
      <p className="mt-6 text-sm text-amber-400/90 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
        Veritabanı sorgusu başarısız. Neon yeni ise tablolar oluşmamış olabilir — depoda{" "}
        <code className="text-amber-200">prisma migrate deploy</code> Vercel build içinde çalışıyor;
        son deploy loglarında migrasyon hatası var mı bakın. Bağlantı için Vercel env&apos;de pool&apos;lu URL
        (tercihen <code className="text-amber-200">DATABASE_URL</code> veya{" "}
        <code className="text-amber-200">DATABASE_POSTGRES_URL</code>) tanımlı olmalı; kod Neon için{" "}
        <code className="text-amber-200">sslmode=require</code> ekler. Düzelince sayfayı yenileyin.
      </p>
    </ContentCard>
  );
}
