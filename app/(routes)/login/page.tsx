"use client";

import Section from "@/components/Section";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (login(username, password)) {
      if (username === 'admin') {
        router.push("/admin/events");
      } else {
        router.push("/");
      }
    } else {
      setError("Hatalı kullanıcı adı veya şifre");
      setLoading(false);
    }
  };

  return (
    <Section title="Giriş" description="Üyeler ve admin için giriş.">
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-sm">
        <label className="grid gap-2" htmlFor="username">
          <span className="text-sm text-white/80">Kullanıcı Adı</span>
          <input 
            id="username" 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" 
            placeholder="Kullanıcı adı" 
          />
        </label>
        <label className="grid gap-2" htmlFor="password">
          <span className="text-sm text-white/80">Şifre</span>
          <input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" 
            placeholder="Şifre" 
          />
        </label>
        {error ? <div className="text-sm text-red-400">{error}</div> : null}
        <button 
          type="submit" 
          disabled={loading}
          className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </Section>
  );
}
