import { NextResponse } from "next/server";
import { sendEventApplicationMail, type EventApplicationPayload } from "@/lib/mail/send";

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

    const res = await sendEventApplicationMail(payload);
    return NextResponse.json(res);
  } catch (error) {
    console.error("[events/apply]", error);
    return NextResponse.json({ ok: false, error: "Sunucu hatası" }, { status: 500 });
  }
} 