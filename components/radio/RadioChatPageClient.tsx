"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

type Msg = { id: string; body: string; createdAt: string; authorLabel: string };

export function RadioChatPageClient() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [db, setDb] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/radio/chat", { cache: "no-store" });
      const j = await res.json().catch(() => ({}));
      if (Array.isArray(j?.messages)) {
        setMessages(j.messages as Msg[]);
        setDb(j.db !== false);
      }
    } catch {
      /* ignore poll errors */
    }
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 4500);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    const body = draft.trim();
    if (!body) return;
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/radio/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j?.error || "Gönderilemedi");
        setSending(false);
        return;
      }
      setDraft("");
      await load();
    } catch {
      setErr("Bağlantı hatası");
    }
    setSending(false);
  }

  return (
    <div className="mx-auto max-w-lg grid gap-4">
      <div className="flex items-center gap-2 text-white/80">
        <MessageCircle className="size-5 text-cyan-400/90" aria-hidden />
        <h2 className="text-lg font-semibold text-white">Canlı sohbet</h2>
      </div>
      <p className="text-sm text-white/55">
        Mesajları herkes okuyabilir. Yazmak için{" "}
        {user ? (
          <span className="text-white/80">hesabınızla giriş yaptınız.</span>
        ) : (
          <>
            <Link href="/login?next=/radio/chat" className="text-cyan-300 hover:underline">
              giriş
            </Link>{" "}
            gerekir.
          </>
        )}
      </p>

      {!db ? (
        <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
          Sohbet veritabanı kapalı. Sunucuda migrasyon ve <code className="text-amber-50">DATABASE_URL</code> gerekir.
        </p>
      ) : null}

      <div className="min-h-[280px] max-h-[55vh] overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-3 grid gap-2">
        {messages.length === 0 ? (
          <p className="text-sm text-white/40 py-6 text-center">Henüz mesaj yok.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-white/45">
                <span className="font-medium text-cyan-200/90">{m.authorLabel}</span>
                <time dateTime={m.createdAt} className="tabular-nums">
                  {new Date(m.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-white/90 leading-relaxed">{m.body}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {authLoading ? (
        <p className="text-sm text-white/40">Oturum kontrol ediliyor…</p>
      ) : user ? (
        <form onSubmit={send} className="grid gap-2">
          <label htmlFor="radio-chat-input" className="sr-only">
            Mesajınız
          </label>
          <textarea
            id="radio-chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            maxLength={420}
            placeholder="Mesajınız…"
            className="rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-cyan-500/30 resize-y min-h-[80px]"
          />
          {err ? <p className="text-sm text-red-400">{err}</p> : null}
          <Button type="submit" disabled={sending || !draft.trim()} className="rounded-xl w-fit">
            {sending ? "Gönderiliyor…" : "Gönder"}
          </Button>
        </form>
      ) : (
        <Button asChild className="rounded-xl w-fit">
          <Link href="/login?next=/radio/chat">Sohbete yazmak için giriş yap</Link>
        </Button>
      )}

      <p className="text-xs text-white/35">
        <Link href="/radio" className="text-white/50 hover:text-white/70 underline-offset-2 hover:underline">
          ← Radyo ana sayfa
        </Link>
      </p>
    </div>
  );
}
