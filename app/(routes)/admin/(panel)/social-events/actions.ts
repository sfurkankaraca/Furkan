"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/require-admin";
import type { EventTicketing } from "@/lib/event-types";
import { setSocialEventSetting } from "@/lib/server/social-event-settings-store";

const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const BASE = "/admin/social-events";

function back(params: Record<string, string>): never {
  redirect(`${BASE}?${new URLSearchParams(params).toString()}`);
}

function optionalInt(raw: string, label: string, id: string): number | undefined {
  if (!raw) return undefined;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) back({ err: `${label} 1 veya daha büyük bir tam sayı olmalı`, id });
  return n;
}

export async function saveSocialEventSetting(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("socialId") || "");
  if (!ID_PATTERN.test(id)) back({ err: "Geçersiz etkinlik" });

  const listed = formData.get("listed") === "on";
  const subtitle = String(formData.get("subtitle") || "").trim().slice(0, 200);
  const ticketingEnabled = formData.get("ticketingEnabled") === "on";

  let ticketing: EventTicketing | undefined;
  const priceRaw = String(formData.get("ticketingPrice") || "").trim().replace(",", ".");
  const price = priceRaw === "" ? 0 : Number(priceRaw);
  if (!Number.isFinite(price) || price < 0) back({ err: "Fiyat 0 veya daha büyük bir sayı olmalı", id });
  const maxPerOrder = optionalInt(String(formData.get("ticketingMaxPerOrder") || "").trim(), "Sipariş başı en fazla", id);
  const totalCap = optionalInt(String(formData.get("ticketingTotalCap") || "").trim(), "Toplam kontenjan", id);
  const note = String(formData.get("ticketingNote") || "").trim().slice(0, 300);

  if (ticketingEnabled) {
    if (price <= 0) back({ err: "Bilet satışı açıkken fiyat 0'dan büyük olmalı", id });
    ticketing = {
      enabled: true,
      priceTry: Math.round(price * 100) / 100,
      ...(maxPerOrder ? { maxPerOrder } : {}),
      ...(totalCap ? { totalCap } : {}),
      ...(note ? { note } : {}),
    };
  }

  try {
    await setSocialEventSetting(id, {
      listed,
      ...(ticketing ? { ticketing } : {}),
      ...(subtitle ? { subtitle } : {}),
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[admin/social-events] kaydedilemedi", e);
    back({ err: "Kaydedilemedi (blob erişimi?)", id });
  }

  revalidateTag("public-events");
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/ns-${id}`);
  back({ ok: id });
}
