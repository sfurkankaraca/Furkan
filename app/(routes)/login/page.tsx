"use client";

import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { useAuth } from "@/lib/auth-context";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const googleErrors: Record<string, string> = {
  google_config: "Google girişi yapılandırılmamış.",
  google_denied: "Google girişi iptal edildi.",
  google_invalid: "Geçersiz Google yanıtı.",
  google_state: "Oturum doğrulanamadı. Tekrar deneyin.",
  no_db: "Sunucu veritabanı kapalı.",
  google_token: "Google oturumu alınamadı.",
  google_profile: "Google profili okunamadı.",
  google_unverified: "Google hesabındaki e-posta doğrulanmamış.",
  google_email_conflict: "Bu e-posta başka bir hesaba bağlı.",
  no_auth_secret:
    "Oturum anahtarı eksik: sunucuda AUTH_SECRET tanımlayın (en az 32 karakter). Vercel Environment Variables’a ekleyip yeniden deploy edin.",
};

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/events";
  const gErr = searchParams.get("error");
  const oauthHint = gErr ? googleErrors[gErr] || "Giriş tamamlanamadı." : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await login(email, password);
    setLoading(false);
    if (r.ok) {
      if (r.needsOnboarding) {
        router.push("/onboarding");
      } else {
        router.push(next.startsWith("/") ? next : "/");
      }
    } else {
      setError(r.error || "Hata");
    }
  };

  return (
    <PageShell>
      <div className="grid gap-8 max-w-2xl mx-auto">
        <PageHeader title="Giriş" description="Biletlerinizi görmek ve satın almak için hesabınıza giriş yapın." />
        <ContentCard className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm">
        <label className="grid gap-2" htmlFor="email">
          <span className="text-sm text-white/80">E-posta</span>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="ornek@mail.com"
          />
        </label>
        <label className="grid gap-2" htmlFor="password">
          <span className="text-sm text-white/80">Şifre</span>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="••••••••"
          />
        </label>
        {oauthHint ? <div className="text-sm text-amber-400">{oauthHint}</div> : null}
        {error ? <div className="text-sm text-red-400">{error}</div> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/15" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="bg-black px-2 text-white/40">veya</span>
          </div>
        </div>
        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white/95"
        >
          Google ile devam et
        </a>
        <p className="text-sm text-white/60">
          Hesabın yok mu?{" "}
          <Link href="/register" className="text-white underline-offset-2 hover:underline">
            Kayıt ol
          </Link>
        </p>
          </form>
        </ContentCard>
      </div>
    </PageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto max-w-7xl px-4 py-10">Yükleniyor...</div>}>
      <LoginForm />
    </Suspense>
  );
}
