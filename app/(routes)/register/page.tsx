"use client";

import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const r = await register(email, password, name || undefined);
    setLoading(false);
    if (r.ok) {
      router.push("/onboarding");
    } else {
      setError(r.error || "Hata");
    }
  };

  return (
    <PageShell>
      <div className="grid gap-8 max-w-2xl mx-auto">
        <PageHeader title="Kayıt" description="E-posta ve şifre ile ücretsiz hesap oluşturun." />
        <ContentCard className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm">
        <label className="grid gap-2" htmlFor="name">
          <span className="text-sm text-white/80">Ad (opsiyonel)</span>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Görünen ad"
          />
        </label>
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
          <span className="text-sm text-white/80">Şifre (en az 8 karakter)</span>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="••••••••"
          />
        </label>
        {error ? <div className="text-sm text-red-400">{error}</div> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Kaydediliyor..." : "Kayıt ol"}
        </button>
        <div className="relative py-1">
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
          Google ile kayıt ol
        </a>
        <p className="text-sm text-white/60">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="text-white underline-offset-2 hover:underline">
            Giriş yap
          </Link>
        </p>
          </form>
        </ContentCard>
      </div>
    </PageShell>
  );
}
