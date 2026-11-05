"use client";

import { useState, type FormEvent } from "react";
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

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.brand.trim()) e.brand = "Marka ya da şirket adını yaz.";
  if (v.fullName.trim().length < 2) e.fullName = "Adını ve soyadını yaz.";
  if (!v.email.trim()) e.email = "E-posta adresini yaz.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "E-posta adresi geçerli görünmüyor.";
  if (v.phone.trim() && !isValidPhone(v.phone.trim())) e.phone = "Telefon numarası geçerli görünmüyor.";
  if (v.kinds.length === 0) e.kinds = "En az bir işbirliği türü seç.";
  if (v.message.trim().length < 5) e.message = "Fikrini kısaca anlat.";
  else if (v.message.trim().length > MESSAGE_MAX) e.message = `Mesaj en fazla ${MESSAGE_MAX} karakter olabilir.`;
  if (!v.consent) e.consent = "Devam etmek için onay vermen gerekiyor.";
  return e;
}

export function BrandProposalForm() {
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
    const errs = validate(v);
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
    });
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
          <strong className="block text-[19px]">Teklifin bize ulaştı.</strong>
          En kısa sürede e-postayla dönüyoruz.
        </FormMessage>
      </div>
    );
  }

  return (
    <form
      aria-label="Marka işbirliği teklif formu"
      noValidate
      onSubmit={onSubmit}
      className="relative flex flex-[1.6_1_520px] flex-col gap-5 rounded-2xl border border-[#2A2A2A] bg-[#161616] p-5 min-[560px]:p-8"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="flex flex-wrap gap-4">
        <Field id="marka" label="Marka ya da şirket" error={errors.brand} className="flex-[1_1_220px]">
          <input {...inputProps("brand")} type="text" autoComplete="organization" maxLength={150} value={v.brand} onChange={(e) => set("brand", e.target.value)} className="cr-input" />
        </Field>
        <Field id="kisi" label="Adın soyadın" error={errors.fullName} className="flex-[1_1_220px]">
          <input {...inputProps("fullName")} type="text" autoComplete="name" maxLength={100} value={v.fullName} onChange={(e) => set("fullName", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field id="eposta" label="E-posta" error={errors.email} className="flex-[1_1_220px]">
          <input {...inputProps("email")} type="email" autoComplete="email" maxLength={200} value={v.email} onChange={(e) => set("email", e.target.value)} className="cr-input" />
        </Field>
        <Field id="telefon" label="Telefon (isteğe bağlı)" error={errors.phone} className="flex-[1_1_220px]">
          <input {...inputProps("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={v.phone} onChange={(e) => set("phone", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <ChipGroup legend="Ne düşünüyorsun?" options={BRAND_KINDS} value={v.kinds} onChange={(n) => set("kinds", n)} error={errors.kinds} errorId="cr-kinds-err" firstId="cr-kinds-first" />
      <div className="flex flex-wrap gap-4">
        <Field id="tarih" label="Düşündüğün tarih (isteğe bağlı)" className="flex-[1_1_220px]">
          <input {...inputProps("date")} type="text" placeholder="Ör. Aralık sonu" maxLength={120} value={v.date} onChange={(e) => set("date", e.target.value)} className="cr-input" />
        </Field>
        <Field id="butce" label="Bütçe aralığı (isteğe bağlı)" className="flex-[1_1_220px]">
          <select {...inputProps("budget")} value={v.budget} onChange={(e) => set("budget", e.target.value)} className="cr-input">
            <option value="">Seçiniz</option>
            {BRAND_BUDGET_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field id="fikir" label="Fikrini kısaca anlat" error={errors.message} hint={`${v.message.length}/${MESSAGE_MAX}`}>
        <textarea {...inputProps("message")} rows={4} maxLength={MESSAGE_MAX + 200} value={v.message} onChange={(e) => set("message", e.target.value)} className="cr-input resize-y" />
      </Field>
      <Consent checked={v.consent} onChange={(c) => set("consent", c)} error={errors.consent} text="Bilgilerimin teklifimi değerlendirmek için kullanılmasını kabul ediyorum." />
      {serverError ? <FormMessage tone="error">{serverError}</FormMessage> : null}
      <SubmitButton pending={status === "sending"}>Teklifi gönder</SubmitButton>
    </form>
  );
}
