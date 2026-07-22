"use server";

import { sendContactMail } from "@/lib/mail/send";
import { addMember } from "@/lib/admin/store";

export async function submitJoin(formData: FormData) {
  const role = String(formData.get("role") || "");
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const city = String(formData.get("city") || "");
  const phone = String(formData.get("phone") || "");
  const instagram = String(formData.get("instagram") || "");
  const note = String(formData.get("note") || "");

  // Role specific
  const payload: Record<string, unknown> = { role };
  if (role === "dj") {
    payload.genres = String(formData.get("genres") || "");
    payload.experienceYears = String(formData.get("experienceYears") || "");
    payload.equipment = String(formData.get("equipment") || "");
    payload.mixes = String(formData.get("mixes") || "");
    payload.availability = String(formData.get("availability") || "");
  } else if (role === "participant") {
    payload.tastes = String(formData.get("tastes") || "");
    payload.age = String(formData.get("age") || "");
    payload.hasCar = String(formData.get("hasCar") || "no");
  } else if (role === "student") {
    payload.age = String(formData.get("age") || "");
    payload.socials = String(formData.get("q_socials") || "");
    payload.level = String(formData.get("q_level") || "");
    payload.genres = String(formData.get("q_genres") || "");
    payload.reason = String(formData.get("q_reason") || "");
    payload.goal = String(formData.get("q_goal") || "");
    payload.availability = Array.from(formData.getAll("q_availability")).map(String).join(", ");
    payload.hasGear = String(formData.get("q_has_gear") || "");
  }

  await addMember({
    name,
    email,
    city: city || undefined,
    phone: phone || undefined,
    instagram: instagram || undefined,
    note: note || undefined,
    role,
    extra: payload,
  } as any);

  // Google Sheets webhook (Apps Script vb.) — varsa gönder
  const webhookUrl = process.env.JOIN_SHEET_WEBHOOK_URL;
  if (webhookUrl) {
    const row = {
      timestamp: new Date().toISOString(),
      role,
      name,
      email,
      city,
      phone,
      instagram,
      note,
      details: payload,
    };
    try {
      // Google Apps Script exec URL'leri 302 ile googleusercontent'a yönlendirebilir.
      // 301/302'de POST -> GET dönüşmesin diye yönlendirmeyi manuel takip ediyoruz.
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(process.env.JOIN_SHEET_AUTH ? { Authorization: `Bearer ${process.env.JOIN_SHEET_AUTH}` } : {}),
      };
      const first = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(row),
        redirect: "manual",
      } as RequestInit);
      if (first.status >= 300 && first.status < 400) {
        const location = first.headers.get("location");
        if (location) {
          await fetch(location, {
            method: "POST",
            headers,
            body: JSON.stringify(row),
          });
        }
      } else if (!first.ok) {
        console.error("[join->sheets] status:", first.status);
      }
    } catch (e) {
      console.error("[join->sheets] gönderim hatası", e);
    }
  }

  const message = `Role: ${role}\nCity: ${city}\nPhone: ${phone}\nInstagram: ${instagram}\nNote: ${note}\n\nDetails: ${JSON.stringify(payload, null, 2)}`;
  // E‑posta bildirimi: JOIN_SEND_EMAIL_FALLBACK=0 ise kapat
  if (process.env.JOIN_SEND_EMAIL_FALLBACK !== "0") {
    await sendContactMail({ name, email, subject: `Membership (${role})`, message });
  }

  return { ok: true } as const;
}
