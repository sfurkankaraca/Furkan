"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

type ActionResult = { ok: boolean } | { ok: false; error: string } | null;

export default function ContactForm({
  action,
  defaultSubject,
  defaultMessage,
}: {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  defaultSubject?: string;
  defaultMessage?: string;
}) {
  const [state, formAction] = useFormState(action, null);
  const { pending } = useFormStatus();
  const [formType, setFormType] = useState<"booking" | "b2b" | "collective" | "general">("general");
  const subjectPlaceholder = useMemo(() => {
    if (formType === "booking") return "Etkinlik booking talebi";
    if (formType === "b2b") return "Marka iş birliği talebi";
    if (formType === "collective") return "Collective başvuru";
    return "Kısa konu";
  }, [formType]);

  return (
    <form action={formAction} className="grid gap-4">
      <label className="grid gap-2" htmlFor="formType">
        <span className="text-sm text-white/80">Form tipi</span>
        <select
          id="formType"
          name="formType"
          value={formType}
          onChange={(e) => setFormType(e.target.value as "booking" | "b2b" | "collective" | "general")}
          className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-white/30"
        >
          <option value="general">Genel iletişim</option>
          <option value="booking">Booking</option>
          <option value="b2b">B2B / marka iş birliği</option>
          <option value="collective">Collective</option>
        </select>
      </label>

      <label className="grid gap-2" htmlFor="name">
        <span className="text-sm text-white/80">Ad</span>
        <input id="name" name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Adınız" />
      </label>
      <label className="grid gap-2" htmlFor="email">
        <span className="text-sm text-white/80">E‑posta</span>
        <input id="email" type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="ornek@posta.com" />
      </label>
      <label className="grid gap-2" htmlFor="phone">
        <span className="text-sm text-white/80">Telefon (opsiyonel)</span>
        <input id="phone" name="phone" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="+90 ..." />
      </label>

      {formType === "booking" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input name="eventDate" placeholder="Etkinlik tarihi" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="eventCity" placeholder="Şehir / mekan" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="guestCount" placeholder="Tahmini kişi sayısı" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="budget" placeholder="Bütçe aralığı" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
        </div>
      ) : null}

      {formType === "b2b" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input name="brandName" placeholder="Marka / şirket adı" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="timeline" placeholder="Zaman planı" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="campaignType" placeholder="Kampanya / aktivasyon türü" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="budget" placeholder="Bütçe aralığı" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
        </div>
      ) : null}

      {formType === "collective" ? (
        <div className="grid gap-3 md:grid-cols-2">
          <input name="stageName" placeholder="Sahne adı" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="city" placeholder="Şehir" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="genres" placeholder="Türler" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
          <input name="links" placeholder="SoundCloud/IG/YouTube linkleri" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white" />
        </div>
      ) : null}

      <label className="grid gap-2" htmlFor="subject">
        <span className="text-sm text-white/80">Konu</span>
        <input
          id="subject"
          name="subject"
          required
          defaultValue={defaultSubject}
          className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
          placeholder={subjectPlaceholder}
        />
      </label>
      <label className="grid gap-2" htmlFor="message">
        <span className="text-sm text-white/80">Mesaj</span>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={defaultMessage}
          className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30"
          placeholder="Mesajınız"
        />
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