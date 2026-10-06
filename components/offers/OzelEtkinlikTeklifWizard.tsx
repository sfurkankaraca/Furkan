"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  EMPTY_PAYLOAD,
  TEKLIF_WIZARD_STEPS,
  type OzelEtkinlikPayload,
  type WizardStep,
  eventTypeFromBookingSec,
  KVKK_CHECKBOX_LABELS,
  wizardStepFields,
  wizardStepIsSkippable,
} from "@/lib/ozel-etkinlik-teklif-config";
import type { submitOzelEtkinlikTeklif } from "@/app/(routes)/teklif/actions";
import { fireTeklifFormGoogleAdsConversion } from "@/lib/google-ads-conversion";

type ActionState = Awaited<ReturnType<typeof submitOzelEtkinlikTeklif>>;

function getStringField(p: OzelEtkinlikPayload, field: keyof OzelEtkinlikPayload): string {
  const v = p[field];
  return typeof v === "string" ? v : "";
}

function clearStepFields(step: WizardStep, prev: OzelEtkinlikPayload): OzelEtkinlikPayload {
  const next = { ...prev };
  for (const key of wizardStepFields(step)) {
    (next as Record<string, unknown>)[key as string] = EMPTY_PAYLOAD[key];
  }
  return next;
}

function stepValid(step: WizardStep, p: OzelEtkinlikPayload): boolean {
  if (step.kind === "static") return true;
  if (step.kind === "kvkk") return p.kvkkProcess && p.kvkkAccurate;
  if (step.kind === "date") {
    if (step.optional) return true;
    return Boolean(getStringField(p, step.field).trim());
  }
  if (step.kind === "text") {
    if (!step.required) return true;
    return Boolean(getStringField(p, step.field).trim());
  }
  if (step.kind === "radio") {
    if (!step.required) return true;
    return Boolean(getStringField(p, step.field).trim());
  }
  if (step.kind === "multi") {
    if (!step.required) return true;
    return p[step.field].length > 0;
  }
  if (step.kind === "group") {
    return step.fields.every((f) => {
      if (!f.required) return true;
      return Boolean(getStringField(p, f.field).trim());
    });
  }
  return true;
}

export function OzelEtkinlikTeklifWizard({ action }: { action: typeof submitOzelEtkinlikTeklif }) {
  const searchParams = useSearchParams();
  const [state, formAction] = useFormState<ActionState | null, FormData>(action, null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OzelEtkinlikPayload>(EMPTY_PAYLOAD);
  const conversionFiredRef = useRef(false);

  useEffect(() => {
    if (!state?.ok || conversionFiredRef.current) return;
    conversionFiredRef.current = true;
    fireTeklifFormGoogleAdsConversion();
  }, [state]);

  useEffect(() => {
    const kaynak = searchParams.get("kaynak");
    const sec = searchParams.get("sec");
    setAnswers((prev) => ({
      ...prev,
      kaynak: kaynak === "b2b" ? "b2b" : "booking",
      eventType: eventTypeFromBookingSec(sec) || prev.eventType,
    }));
  }, [searchParams]);

  const total = TEKLIF_WIZARD_STEPS.length;
  const current = TEKLIF_WIZARD_STEPS[step];
  const progress = ((step + 1) / total) * 100;
  const canNext = current ? stepValid(current, answers) : false;
  const skippable = current ? wizardStepIsSkippable(current) : false;
  const isLast = step >= total - 1;

  const update = useCallback(<K extends keyof OzelEtkinlikPayload>(field: K, value: OzelEtkinlikPayload[K]) => {
    setAnswers((a) => ({ ...a, [field]: value }));
  }, []);

  const goNext = () => {
    if (!canNext) return;
    if (isLast) {
      const fd = new FormData();
      fd.set("payload", JSON.stringify(answers));
      formAction(fd);
      return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const goSkip = () => {
    if (!current || !skippable) return;
    const cleared = clearStepFields(current, answers);
    setAnswers(cleared);
    if (isLast) {
      const fd = new FormData();
      fd.set("payload", JSON.stringify(cleared));
      formAction(fd);
    } else {
      setStep((s) => Math.min(s + 1, total - 1));
    }
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-8 flex items-center gap-2 text-white/80">
        <Sparkles className="size-5 shrink-0 text-noqt-lime" aria-hidden />
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Özel etkinlik</p>
          <h1 className="text-lg font-semibold tracking-tight text-white md:text-xl">Teklif talebi</h1>
        </div>
      </div>
      {state?.ok ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 py-6 text-center"
        >
          <CheckCircle2 className="size-14 text-emerald-400/90" aria-hidden />
          <h2 className="text-xl font-semibold text-white">Teşekkürler</h2>
          <p className="max-w-md text-sm leading-relaxed text-white/65">
            Talebin alındı. Kısa süre içinde dönüş yapılacak. Acil durumda WhatsApp’tan da yazabilirsin.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl bg-white text-black hover:bg-white/90">
              <Link href="/">Ana sayfa</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/5 hover:bg-white/10">
              <a href="https://wa.me/905417997973" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="mb-8 space-y-2">
            <div className="flex items-center justify-between gap-3 text-xs text-white/45">
              <span>
                Adım {step + 1} / {total}
              </span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-noqt-lime to-noqt-sky"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-[12rem]"
              >
                <StepFields step={current} answers={answers} update={update} />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {state && "ok" in state && !state.ok ? (
            <p className="mt-4 text-center text-sm text-red-400/90" role="alert">
              {state.error}
            </p>
          ) : null}

          <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl text-white/70 hover:bg-white/5 hover:text-white"
              onClick={goPrev}
              disabled={step === 0}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Geri
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
              {skippable ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-white/20 bg-transparent text-white/80 hover:bg-white/10"
                  onClick={goSkip}
                >
                  {isLast ? "Atla ve gönder" : "Atla"}
                </Button>
              ) : null}
              <Button
                type="button"
                className="rounded-xl bg-white text-black shadow-sm hover:bg-white/90 disabled:opacity-40"
                onClick={goNext}
                disabled={!canNext}
              >
                {isLast ? "Gönder" : "İleri"}
                {!isLast ? <ArrowRight className="size-4" aria-hidden /> : null}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function chipInputClass(active: boolean) {
  return cn(
    "rounded-2xl border px-4 py-3 text-left text-sm transition duration-200",
    active
      ? "border-noqt-lime/50 bg-white/[0.1] text-white shadow-md shadow-noqt-lime/10"
      : "border-white/12 bg-white/[0.03] text-white/80 hover:border-white/22 hover:bg-white/[0.06]",
  );
}

function StepFields({
  step,
  answers,
  update,
}: {
  step: WizardStep;
  answers: OzelEtkinlikPayload;
  update: <K extends keyof OzelEtkinlikPayload>(field: K, value: OzelEtkinlikPayload[K]) => void;
}) {
  if (step.kind === "static") {
    return (
      <div>
        <h2 className="text-balance text-lg font-semibold text-white md:text-xl">{step.label}</h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/60">{step.body}</p>
        <p className="mt-6 text-xs text-white/40">Devam ederek ödeme koşullarını okumuş sayılırsınız.</p>
      </div>
    );
  }

  if (step.kind === "kvkk") {
    return (
      <div>
        <h2 className="text-balance text-lg font-semibold text-white md:text-xl">Onay ve izin metinleri</h2>
        <p className="mt-2 text-sm text-white/55">KVKK ve onaylar — zorunlu olanları işaretleyin.</p>
        <ul className="mt-6 space-y-4">
          {KVKK_CHECKBOX_LABELS.map((label, i) => {
            const key = i === 0 ? "kvkkProcess" : i === 1 ? "kvkkMarketing" : "kvkkAccurate";
            const checked = answers[key];
            const optional = i === 1;
            return (
              <li key={label}>
                <label className="flex cursor-pointer gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/18">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 rounded border-white/30 bg-black accent-noqt-lime"
                    checked={checked}
                    onChange={(e) => update(key, e.target.checked)}
                  />
                  <span className="text-sm leading-relaxed text-white/75">
                    {label}
                    {optional ? <span className="ml-1 text-white/40">(isteğe bağlı)</span> : null}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  if (step.kind === "date") {
    const v = getStringField(answers, step.field);
    return (
      <div>
        <h2 className="text-balance text-lg font-semibold text-white md:text-xl">{step.label}</h2>
        {step.optional ? <p className="mt-2 text-sm text-white/50">Henüz net değilse &quot;Atla&quot; ile geçebilirsiniz.</p> : null}
        <label className="mt-6 grid max-w-xs gap-2 [color-scheme:dark]">
          <span className="sr-only">{step.label}</span>
          <input
            type="date"
            value={v}
            onChange={(e) => update(step.field, e.target.value)}
            className="w-full rounded-xl border border-white/18 bg-black/40 px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-noqt-lime/35"
          />
        </label>
      </div>
    );
  }

  if (step.kind === "group") {
    return (
      <div>
        <h2 className="text-balance text-lg font-semibold text-white md:text-xl">{step.label}</h2>
        {step.subtitle ? <p className="mt-1 text-sm text-white/50">{step.subtitle}</p> : null}
        <div className="mt-6 space-y-5">
          {step.fields.map((f) => (
            <label key={String(f.field)} className="grid gap-2">
              <span className="text-sm text-white/75">{f.label}</span>
              <input
                value={getStringField(answers, f.field)}
                onChange={(e) => update(f.field, e.target.value)}
                required={f.required}
                placeholder={f.placeholder}
                className="rounded-xl border border-white/18 bg-black/40 px-3 py-2.5 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-noqt-lime/35"
              />
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (step.kind === "text") {
    const v = getStringField(answers, step.field);
    const fieldClass =
      "w-full rounded-xl border border-white/18 bg-black/40 px-3 py-2.5 text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-noqt-lime/35";
    const optional = !step.required;
    return (
      <div>
        <h2 className="text-balance text-lg font-semibold text-white md:text-xl">{step.label}</h2>
        {optional ? <p className="mt-2 text-xs text-white/45">Doldurmak istemezseniz Atla ile geçin.</p> : null}
        <label className="mt-6 grid gap-2">
          <span className="sr-only">{step.label}</span>
          {step.multiline ? (
            <textarea
              value={v}
              onChange={(e) => update(step.field, e.target.value)}
              required={step.required}
              placeholder={step.placeholder}
              rows={5}
              className={fieldClass}
            />
          ) : (
            <input
              value={v}
              onChange={(e) => update(step.field, e.target.value)}
              required={step.required}
              placeholder={step.placeholder}
              className={fieldClass}
            />
          )}
        </label>
      </div>
    );
  }

  if (step.kind === "radio") {
    const v = getStringField(answers, step.field);
    return (
      <div>
        <h2 className="text-balance text-lg font-semibold text-white md:text-xl">{step.label}</h2>
        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {step.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => update(step.field, opt)}
              className={chipInputClass(v === opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step.kind === "multi") {
    const arr = answers[step.field];
    const optional = !step.required;
    return (
      <div>
        <h2 className="text-balance text-lg font-semibold text-white md:text-xl">{step.label}</h2>
        <p className="mt-2 text-xs text-white/45">
          {optional ? "İstemiyorsanız Atla ile geçin. " : null}
          Birden fazla seçebilirsiniz.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {step.options.map((opt) => {
            const on = arr.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const next = on ? arr.filter((x) => x !== opt) : [...arr, opt];
                  update(step.field, next);
                }}
                className={cn(
                  "rounded-full border px-3.5 py-2 text-xs font-medium transition",
                  on
                    ? "border-noqt-lime/55 bg-noqt-lime/15 text-white"
                    : "border-white/14 bg-white/[0.04] text-white/70 hover:border-white/25",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
