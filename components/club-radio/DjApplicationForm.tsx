"use client";

import { useState, type FormEvent } from "react";
import { useLang } from "@/lib/club-radio/i18n/client";
import type { Dict } from "@/lib/club-radio/i18n/dict";
import { DJ_GENRES } from "@/lib/club-radio/content";
import { ChipGroup, Consent, Field, FormMessage, Honeypot, SubmitButton, focusFirstError, isHttpUrl, isValidPhone, postClubRequest } from "./form-ui";

type Values = {
  stageName: string;
  fullName: string;
  phone: string;
  city: string;
  genres: string[];
  setUrl: string;
  instagram: string;
  experience: string;
  consent: boolean;
};
type Errors = Partial<Record<keyof Values, string>>;

const INITIAL: Values = { stageName: "", fullName: "", phone: "", city: "", genres: ["House"], setUrl: "", instagram: "", experience: "", consent: false };
const FIELD_IDS: Record<keyof Values, string> = {
  stageName: "sahne",
  fullName: "adsoyad",
  phone: "tel",
  city: "sehir",
  genres: "cr-genres-first",
  setUrl: "set",
  instagram: "ig",
  experience: "deneyim",
  consent: "cr-consent",
};

function validate(v: Values, f: Dict["forms"]["dj"]): Errors {
  const e: Errors = {};
  if (!v.stageName.trim()) e.stageName = f.eStage;
  if (v.fullName.trim().length < 2) e.fullName = f.eName;
  if (!v.phone.trim()) e.phone = f.ePhone;
  else if (!isValidPhone(v.phone.trim())) e.phone = f.ePhoneBad;
  if (!v.city.trim()) e.city = f.eCity;
  if (v.genres.length === 0) e.genres = f.eGenres;
  if (!v.setUrl.trim()) e.setUrl = f.eSet;
  else if (!isHttpUrl(v.setUrl.trim())) e.setUrl = f.eSetBad;
  const ig = v.instagram.trim();
  if (ig && !/^@?[A-Za-z0-9._]{1,30}$/.test(ig) && !/^https?:\/\/(www\.)?instagram\.com\//i.test(ig)) {
    e.instagram = f.eInsta;
  }
  if (!v.consent) e.consent = f.eConsent;
  return e;
}

export function DjApplicationForm() {
  const { lang, t } = useLang();
  const f = t.forms.dj;
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
      kind: "dj",
      stageName: v.stageName.trim(),
      fullName: v.fullName.trim(),
      phone: v.phone.trim(),
      city: v.city.trim(),
      genres: v.genres,
      setUrl: v.setUrl.trim(),
      instagram: v.instagram.trim(),
      experience: v.experience.trim(),
      consent: true,
      website: honeypot,
    }, lang);
    if (res.ok) {
      setStatus("done");
    } else {
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
        <Field id="sahne" label={f.stageName} error={errors.stageName} className="flex-[1_1_220px]">
          <input {...inputProps("stageName")} type="text" autoComplete="nickname" maxLength={100} value={v.stageName} onChange={(e) => set("stageName", e.target.value)} className="cr-input" />
        </Field>
        <Field id="adsoyad" label={f.fullName} error={errors.fullName} className="flex-[1_1_220px]">
          <input {...inputProps("fullName")} type="text" autoComplete="name" maxLength={100} value={v.fullName} onChange={(e) => set("fullName", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field id="tel" label={f.phone} error={errors.phone} className="flex-[1_1_220px]">
          <input {...inputProps("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={v.phone} onChange={(e) => set("phone", e.target.value)} className="cr-input" />
        </Field>
        <Field id="sehir" label={f.city} error={errors.city} className="flex-[1_1_220px]">
          <input {...inputProps("city")} type="text" autoComplete="address-level2" maxLength={80} value={v.city} onChange={(e) => set("city", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <ChipGroup legend={f.genres} options={DJ_GENRES} value={v.genres} onChange={(n) => set("genres", n)} error={errors.genres} errorId="cr-genres-err" firstId="cr-genres-first" />
      <Field id="set" label={f.setUrl} error={errors.setUrl}>
        <input {...inputProps("setUrl")} type="url" inputMode="url" maxLength={500} placeholder={f.setPlaceholder} value={v.setUrl} onChange={(e) => set("setUrl", e.target.value)} className="cr-input" />
      </Field>
      <div className="flex flex-wrap gap-4">
        <Field id="ig" label={f.instagram} error={errors.instagram} className="flex-[1_1_220px]">
          <input {...inputProps("instagram")} type="text" placeholder="@" maxLength={100} value={v.instagram} onChange={(e) => set("instagram", e.target.value)} className="cr-input" />
        </Field>
        <Field id="deneyim" label={f.experience} error={errors.experience} className="flex-[1_1_220px]">
          <input {...inputProps("experience")} type="text" maxLength={300} value={v.experience} onChange={(e) => set("experience", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <Consent checked={v.consent} onChange={(c) => set("consent", c)} error={errors.consent} text={f.consent} />
      {serverError ? <FormMessage tone="error">{serverError}</FormMessage> : null}
      <SubmitButton pending={status === "sending"}>{f.submit}</SubmitButton>
    </form>
  );
}
