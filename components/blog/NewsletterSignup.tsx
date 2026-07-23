"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type SubscribeResult } from "@/app/(routes)/blog/newsletter-actions";

export function NewsletterSignup({
  source = "journal",
  variant = "block",
}: {
  source?: string;
  variant?: "block" | "compact";
}) {
  const [state, formAction, pending] = useActionState<SubscribeResult | null, FormData>(
    subscribeNewsletter,
    null
  );

  const done = state?.ok;

  return (
    <section
      className={
        variant === "block"
          ? "rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-6 md:p-8"
          : ""
      }
      aria-labelledby="newsletter-baslik"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        Bülten
      </p>
      <h2 id="newsletter-baslik" className="mt-2 text-2xl font-black tracking-[-0.02em] md:text-3xl">
        Sahneyi kaçırma
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Yeni yazılar, sahne raporları ve duyurular doğrudan gelen kutuna. Spam yok, istediğin an çık.
      </p>

      {done ? (
        <p className="mt-5 text-sm font-medium text-foreground" role="status">
          ✓ {state?.message}
        </p>
      ) : (
        <form action={formAction} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
          <input type="hidden" name="source" value={source} />
          {/* honeypot — görünmez, botlar için */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              E-posta adresi
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder="e-posta adresin"
              className="w-full rounded-xl border border-foreground/20 bg-background px-4 py-3 text-sm outline-none transition focus:border-foreground"
            />
            {state && !state.ok ? (
              <p className="mt-2 text-xs text-red-600" role="alert">
                {state.message}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Gönderiliyor…" : "Abone ol"}
          </button>
        </form>
      )}
    </section>
  );
}
