import { NextResponse } from "next/server";
import { sendEventApplicationMail, type EventApplicationPayload } from "@/lib/mail/send";
import { addApplication } from "@/lib/admin/store";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<EventApplicationPayload>;

    // Basit zorunlu alan kontrolü
    const required: Array<keyof EventApplicationPayload> = [
      "eventId",
      "name",
      "email",
      "phone",
      "birthDate",
      "city",
      "mainReason",
      "musicGenres",
      "djExcitement",
      "hasCar",
      "instagram",
      "consentLocation",
      "consentInstructions",
    ];

    for (const key of required) {
      if (body[key] === undefined || body[key] === null || body[key] === "") {
        return NextResponse.json({ ok: false, error: `Eksik alan: ${key}` }, { status: 400 });
      }
    }

    const payload: EventApplicationPayload = {
      eventId: String(body.eventId),
      eventTitle: body.eventTitle ? String(body.eventTitle) : undefined,
      name: String(body.name),
      email: String(body.email),
      phone: String(body.phone),
      birthDate: String(body.birthDate),
      city: String(body.city),
      mainReason: body.mainReason as EventApplicationPayload["mainReason"],
      musicGenres: Array.isArray(body.musicGenres) ? body.musicGenres.map(String) : [],
      djExcitement: body.djExcitement as EventApplicationPayload["djExcitement"],
      hasCar: Boolean(body.hasCar),
      instagram: String(body.instagram),
      consentLocation: Boolean(body.consentLocation),
      consentInstructions: Boolean(body.consentInstructions),
      referrer: body.referrer ? String(body.referrer) : undefined,
    };

    // Store'a yaz
    await addApplication({
      eventId: payload.eventId,
      eventTitle: payload.eventTitle,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      birthDate: payload.birthDate,
      city: payload.city,
      mainReason: payload.mainReason,
      musicGenres: payload.musicGenres,
      djExcitement: payload.djExcitement,
      hasCar: payload.hasCar,
      instagram: payload.instagram,
      consentLocation: payload.consentLocation,
      consentInstructions: payload.consentInstructions,
      referrer: payload.referrer,
    });

    const res = await sendEventApplicationMail(payload);
    return NextResponse.json(res);
  } catch (error) {
    console.error("[events/apply]", error);
    return NextResponse.json({ ok: false, error: "Sunucu hatası" }, { status: 500 });
  }
} 