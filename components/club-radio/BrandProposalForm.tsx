"use client";

import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/club-radio/i18n/client";
import type { Dict } from "@/lib/club-radio/i18n/dict";
import { BRAND_BUDGET_OPTIONS, BRAND_KINDS } from "@/lib/club-radio/content";
import { ChipGroup, Consent, EMAIL_RE, Field, FormMessage, Honeypot, SubmitButton, focusFirstError, isValidPhone, postClubRequest } from "./form-ui";

type Values = {
  brand: string;
  fullName: string;
  email: string;
  phone: string;
  kinds: string[];
  date: string;
  budget: string;
  message: string;
  consent: boolean;
};
type Errors = Partial<Record<keyof Values, string>>;

const INITIAL: Values = { brand: "", fullName: "", email: "", phone: "", kinds: ["Ortak gece"], date: "", budget: "", message: "", consent: false };
const FIELD_IDS: Record<keyof Values, string> = {
  brand: "marka",
  fullName: "kisi",
  email: "eposta",
  phone: "telefon",
  kinds: "cr-kinds-first",
  date: "tarih",
  budget: "butce",
  message: "fikir",
  consent: "cr-consent",
};
const MESSAGE_MAX = 2000;

function validate(v: Values, f: Dict["forms"]["brand"]): Errors {
  const e: Errors = {};
  if (!v.brand.trim()) e.brand = f.eBrand;
  if (v.fullName.trim().length < 2) e.fullName = f.eName;
  if (!v.email.trim()) e.email = f.eEmail;
  else if (!EMAIL_RE.test(v.email.trim())) e.email = f.eEmailBad;
  if (v.phone.trim() && !isValidPhone(v.phone.trim())) e.phone = f.ePhoneBad;
  if (v.kinds.length === 0) e.kinds = f.eKinds;
  if (v.message.trim().length < 5) e.message = f.eMsgShort;
  else if (v.message.trim().length > MESSAGE_MAX) e.message = f.eMsgLong(MESSAGE_MAX);
  if (!v.consent) e.consent = f.eConsent;
  return e;
}

export function BrandProposalForm() {
  const { lang, t } = useLang();
  const f = t.forms.brand;
  const kindLabels = lang === "en" ? t.forms.kindLabels : undefined;
  const budgetLabels = lang === "en" ? t.forms.budgetLabels : undefined;
  const [v, setV] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [serverError, setServerError] = useState("");

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    setV((p) => ({ ...p, [k]: val }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const inputProps = (k: keyof Values) => ({
    id: FIELD_IDS[k],
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${FIELD_IDS[k]}-err` : undefined,
  });

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (status === "sending") return;
    const errs = validate(v, f);
    setErrors(errs);
    setServerError("");
    const bad = (Object.keys(FIELD_IDS) as (keyof Values)[]).filter((k) => errs[k]).map((k) => FIELD_IDS[k]);
    if (bad.length) {
      focusFirstError(bad);
      return;
    }
    setStatus("sending");
    const res = await postClubRequest({
      kind: "brand",
      brand: v.brand.trim(),
      fullName: v.fullName.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
      kinds: v.kinds,
      date: v.date.trim(),
      budget: v.budget,
      message: v.message.trim(),
      consent: true,
      website: honeypot,
    }, lang);
    if (res.ok) setStatus("done");
    else {
      setStatus("idle");
      setServerError(res.error);
    }
  }

  if (status === "done") {
    return (
      <div className="flex flex-[1.6_1_520px] flex-col gap-3 rounded-2xl border border-[#2A2A2A] bg-[#161616] p-8">
        <FormMessage tone="success">
          <strong className="block text-[19px]">{f.doneTitle}</strong>
          {f.doneText}
        </FormMessage>
      </div>
    );
  }

  return (
    <form
      aria-label={f.aria}
      noValidate
      onSubmit={onSubmit}
      className="relative flex flex-[1.6_1_520px] flex-col gap-5 rounded-2xl border border-[#2A2A2A] bg-[#161616] p-5 min-[560px]:p-8"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="flex flex-wrap gap-4">
        <Field id="marka" label={f.brand} error={errors.brand} className="flex-[1_1_220px]">
          <input {...inputProps("brand")} type="text" autoComplete="organization" maxLength={150} value={v.brand} onChange={(e) => set("brand", e.target.value)} className="cr-input" />
        </Field>
        <Field id="kisi" label={f.fullName} error={errors.fullName} className="flex-[1_1_220px]">
          <input {...inputProps("fullName")} type="text" autoComplete="name" maxLength={100} value={v.fullName} onChange={(e) => set("fullName", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field id="eposta" label={f.email} error={errors.email} className="flex-[1_1_220px]">
          <input {...inputProps("email")} type="email" autoComplete="email" maxLength={200} value={v.email} onChange={(e) => set("email", e.target.value)} className="cr-input" />
        </Field>
        <Field id="telefon" label={f.phone} error={errors.phone} className="flex-[1_1_220px]">
          <input {...inputProps("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={v.phone} onChange={(e) => set("phone", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <ChipGroup legend={f.kinds} options={BRAND_KINDS} value={v.kinds} onChange={(n) => set("kinds", n)} error={errors.kinds} errorId="cr-kinds-err" firstId="cr-kinds-first" labels={kindLabels} />
      <div className="flex flex-wrap gap-4">
        <Field id="tarih" label={f.date} className="flex-[1_1_220px]">
          <input {...inputProps("date")} type="text" placeholder={f.datePlaceholder} maxLength={120} value={v.date} onChange={(e) => set("date", e.target.value)} className="cr-input" />
        </Field>
        <Field id="butce" label={f.budget} className="flex-[1_1_220px]">
          <select {...inputProps("budget")} value={v.budget} onChange={(e) => set("budget", e.target.value)} className="cr-input">
            <option value="">{f.choose}</option>
            {BRAND_BUDGET_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {budgetLabels?.[o] ?? o}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="fikir" label={f.message} error={errors.message} hint={`${v.message.length}/${MESSAGE_MAX}`}>
        <textarea {...inputProps("message")} rows={4} maxLength={MESSAGE_MAX + 200} value={v.message} onChange={(e) => set("message", e.target.value)} className="cr-input resize-y" />
      </Field>
      <Consent checked={v.consent} onChange={(c) => set("consent", c)} error={errors.consent} text={f.consent} />
      {serverError ? <FormMessage tone="error">{serverError}</FormMessage> : null}
      <SubmitButton pending={status === "sending"}>{f.submit}</SubmitButton>
    </form>
  );
}
