"use client";

import { useState, type FormEvent } from "react";
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

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.stageName.trim()) e.stageName = "Sahne adını yaz.";
  if (v.fullName.trim().length < 2) e.fullName = "Adını ve soyadını yaz.";
  if (!v.phone.trim()) e.phone = "WhatsApp telefon numaranı yaz.";
  else if (!isValidPhone(v.phone.trim())) e.phone = "Telefon numarası geçerli görünmüyor.";
  if (!v.city.trim()) e.city = "Şehrini yaz.";
  if (v.genres.length === 0) e.genres = "En az bir tür seç.";
  if (!v.setUrl.trim()) e.setUrl = "Set bağlantını ekle.";
  else if (!isHttpUrl(v.setUrl.trim())) e.setUrl = "Bağlantı http:// ya da https:// ile başlamalı.";
  const ig = v.instagram.trim();
  if (ig && !/^@?[A-Za-z0-9._]{1,30}$/.test(ig) && !/^https?:\/\/(www\.)?instagram\.com\//i.test(ig)) {
    e.instagram = "Instagram hesabı geçerli görünmüyor.";
  }
  if (!v.consent) e.consent = "Devam etmek için onay vermen gerekiyor.";
  return e;
}

export function DjApplicationForm() {
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
    });
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
          <strong className="block text-[19px]">Setin bize ulaştı.</strong>
          Dinleyip WhatsApp&apos;tan dönüyoruz.
        </FormMessage>
      </div>
    );
  }

  return (
    <form
      aria-label="DJ başvuru formu"
      noValidate
      onSubmit={onSubmit}
      className="relative flex flex-[1.6_1_520px] flex-col gap-5 rounded-2xl border border-[#2A2A2A] bg-[#161616] p-5 min-[560px]:p-8"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="flex flex-wrap gap-4">
        <Field id="sahne" label="Sahne adın" error={errors.stageName} className="flex-[1_1_220px]">
          <input {...inputProps("stageName")} type="text" autoComplete="nickname" maxLength={100} value={v.stageName} onChange={(e) => set("stageName", e.target.value)} className="cr-input" />
        </Field>
        <Field id="adsoyad" label="Adın soyadın" error={errors.fullName} className="flex-[1_1_220px]">
          <input {...inputProps("fullName")} type="text" autoComplete="name" maxLength={100} value={v.fullName} onChange={(e) => set("fullName", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4">
        <Field id="tel" label="Telefon (WhatsApp)" error={errors.phone} className="flex-[1_1_220px]">
          <input {...inputProps("phone")} type="tel" autoComplete="tel" inputMode="tel" maxLength={30} value={v.phone} onChange={(e) => set("phone", e.target.value)} className="cr-input" />
        </Field>
        <Field id="sehir" label="Şehir" error={errors.city} className="flex-[1_1_220px]">
          <input {...inputProps("city")} type="text" autoComplete="address-level2" maxLength={80} value={v.city} onChange={(e) => set("city", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <ChipGroup legend="Ne çalıyorsun?" options={DJ_GENRES} value={v.genres} onChange={(n) => set("genres", n)} error={errors.genres} errorId="cr-genres-err" firstId="cr-genres-first" />
      <Field id="set" label="Set bağlantın" error={errors.setUrl}>
        <input {...inputProps("setUrl")} type="url" inputMode="url" maxLength={500} placeholder="soundcloud.com/… · youtube.com/… · mixcloud.com/…" value={v.setUrl} onChange={(e) => set("setUrl", e.target.value)} className="cr-input" />
      </Field>
      <div className="flex flex-wrap gap-4">
        <Field id="ig" label="Instagram (isteğe bağlı)" error={errors.instagram} className="flex-[1_1_220px]">
          <input {...inputProps("instagram")} type="text" placeholder="@" maxLength={100} value={v.instagram} onChange={(e) => set("instagram", e.target.value)} className="cr-input" />
        </Field>
        <Field id="deneyim" label="Daha önce nerelerde çaldın? (isteğe bağlı)" error={errors.experience} className="flex-[1_1_220px]">
          <input {...inputProps("experience")} type="text" maxLength={300} value={v.experience} onChange={(e) => set("experience", e.target.value)} className="cr-input" />
        </Field>
      </div>
      <Consent checked={v.consent} onChange={(c) => set("consent", c)} error={errors.consent} text="Bilgilerimin başvurumu değerlendirmek için kullanılmasını kabul ediyorum." />
      {serverError ? <FormMessage tone="error">{serverError}</FormMessage> : null}
      <SubmitButton pending={status === "sending"}>Setimi gönder</SubmitButton>
    </form>
  );
}
