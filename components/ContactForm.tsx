"use client";

import { useFormState, useFormStatus } from "react-dom";

type ActionResult = { ok: boolean } | { ok: false; error: string } | null;

export default function ContactForm({
  action,
}: {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useFormState(action, null);
  const { pending } = useFormStatus();

  return (
    <form action={formAction} className="grid gap-4">
      <label className="grid gap-2" htmlFor="name">
        <span className="text-sm text-white/80">Ad</span>
        <input id="name" name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Adınız" />
      </label>
      <label className="grid gap-2" htmlFor="email">
        <span className="text-sm text-white/80">E‑posta</span>
        <input id="email" type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="ornek@posta.com" />
      </label>
      <label className="grid gap-2" htmlFor="subject">
        <span className="text-sm text-white/80">Konu</span>
        <input id="subject" name="subject" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Kısa konu" />
      </label>
      <label className="grid gap-2" htmlFor="message">
        <span className="text-sm text-white/80">Mesaj</span>
        <textarea id="message" name="message" rows={6} required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Mesajınız" />
      </label>
      <button type="submit" disabled={pending} className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-50">
        {pending ? "Gönderiliyor..." : "Gönder"}
      </button>

      <div aria-live="polite" className="min-h-6 text-sm mt-1">
        {state && "ok" in state && state.ok && (
          <span className="text-green-400">Teşekkürler! Mesajınız gönderildi.</span>
        )}
        {state && "error" in state && !state.ok && (
          <span className="text-red-400">Gönderilemedi: {state.error}</span>
        )}
      </div>
    </form>
  );
} 