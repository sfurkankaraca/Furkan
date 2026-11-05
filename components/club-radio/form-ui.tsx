"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function Field({
  id,
  label,
  error,
  hint,
  className = "",
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-[15px] text-[#C9CBC3]">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="m-0 text-[13px] text-[#A6A9A0]">{hint}</p> : null}
      {error ? (
        <p id={`${id}-err`} role="alert" className="cr-err">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ChipGroup({
  legend,
  options,
  value,
  onChange,
  error,
  errorId,
  firstId,
}: {
  legend: string;
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  error?: string;
  errorId: string;
  firstId: string;
}) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2.5 p-0 text-[15px] text-[#C9CBC3]">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              id={i === 0 ? firstId : undefined}
              type="button"
              className="cr-chip"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
            >
              {o}
            </button>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="cr-err">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Botların dolduracağı gizli alan; dolarsa istek sessizce atılır. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label>
        Web sitesi
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

export function Consent({
  checked,
  onChange,
  error,
  text,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3 text-[14px] text-[#C9CBC3]">
        <input
          id="cr-consent"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-labelledby="cr-consent-label"
          aria-describedby={error ? "cr-consent-err" : undefined}
          className="mt-0.5 size-5 flex-none"
          style={{ accentColor: "#DDF76A" }}
        />
        <span id="cr-consent-label">
          {text}{" "}
          <Link href="/kvkk-aydinlatma" target="_blank" className="underline underline-offset-2">
            Aydınlatma metni
          </Link>
        </span>
      </label>
      {error ? (
        <p id="cr-consent-err" role="alert" className="cr-err">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[52px] cursor-pointer self-start rounded-full border-0 bg-[#DDF76A] px-7 py-4 text-[16px] font-bold uppercase tracking-[0.5px] text-[#0A0A0A] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Gönderiliyor…" : children}
    </button>
  );
}

export function FormMessage({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl border p-4 text-[15px] ${
        tone === "error" ? "border-[#ff8a7a] text-[#ffb3a8]" : "border-[#DDF76A] text-[#F4F4EE]"
      }`}
    >
      {children}
    </div>
  );
}

export async function postClubRequest(body: Record<string, unknown>): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/club-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (res.ok && data.ok) return { ok: true };
    return { ok: false, error: data.error || "Gönderilemedi. Lütfen tekrar dene." };
  } catch {
    return { ok: false, error: "Bağlantı kurulamadı. İnternetini kontrol edip tekrar dene." };
  }
}

export function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidPhone(v: string): boolean {
  if (!/^[+\d\s()\-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** İlk hatalı alana odaklan. */
export function focusFirstError(ids: string[]) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) {
      el.focus();
      return;
    }
  }
}
