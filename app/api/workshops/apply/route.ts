import { NextResponse } from "next/server";
import { addWorkshopApplication } from "@/lib/admin/store";
import { sendWorkshopApplicationMail } from "@/lib/mail/send";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const kind = String(body.kind || "").trim();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    if (!kind || !name || !email) {
      return NextResponse.json({ ok: false, error: "Eksik alan" }, { status: 400 });
    }

    const payload = {
      kind,
      name,
      email,
      phone: body.phone ? String(body.phone) : undefined,
      city: body.city ? String(body.city) : undefined,
      instagram: body.instagram ? String(body.instagram) : undefined,
      answers: typeof body.answers === "object" && body.answers ? body.answers : {},
    } as const;

    await addWorkshopApplication(payload as any);
    await sendWorkshopApplicationMail(payload);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[workshops/apply]", e);
    return NextResponse.json({ ok: false, error: "Sunucu hatası" }, { status: 500 });
  }
}


