"use client";

import { useActionState } from "react";
import { useLang } from "@/lib/club-radio/i18n/client";
import { subscribeNewsletter, type SubscribeResult } from "@/app/(routes)/blog/newsletter-actions";

export function NewsletterSignup({
  source = "journal",
  variant = "block",
}: {
  source?: string;
  variant?: "block" | "compact";
}) {
  const { t: dict, lang } = useLang();
  const t = dict.blog.newsletter;
  const [state, formAction, pending] = useActionState<SubscribeResult | null, FormData>(
    subscribeNewsletter,
    null
  );

  const done = state?.ok;

  return (
    <section
      className={
        variant === "block"
          ? "rounded-2xl border border-border bg-card p-6 md:p-8"
          : ""
      }
      aria-labelledby="newsletter-baslik"
    >
      <p className="cr-eyebrow m-0 text-noqt-lime">
        {t.eyebrow}
      </p>
      <h2 id="newsletter-baslik" className="mt-2 text-2xl font-black tracking-[-0.02em] md:text-3xl">
        {t.title}
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        {t.text}
      </p>

      {done ? (
        <p className="mt-5 text-sm font-medium text-foreground" role="status">
          ✓ {state?.message}
        </p>
      ) : (
        <form action={formAction} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="lang" value={lang} />
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
              {t.emailLabel}
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder={t.placeholder}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-noqt-lime"
            />
            {state && !state.ok ? (
              <p className="mt-2 text-xs text-red-400" role="alert">
                {state.message}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 rounded-full bg-noqt-lime px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#0A0A0A] transition hover:brightness-95 disabled:opacity-50"
          >
            {pending ? t.sending : t.submit}
          </button>
        </form>
      )}
    </section>
  );
}
