import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPrisma } from "@/lib/prisma";
import { readEventsJson } from "@/lib/server/events-store";
import { sendEventAnnouncementMail } from "@/lib/mail/send";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const jar = await cookies();
  if (jar.get("admin")?.value !== "1") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  let body: { eventId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }
  const eventId = String(body.eventId || "");
  if (!eventId) return NextResponse.json({ error: "eventId gerekli" }, { status: 400 });

  const events = await readEventsJson();
  const event = events.find((e) => e.id === eventId);
  if (!event) return NextResponse.json({ error: "Etkinlik bulunamadı" }, { status: 404 });

  const prisma = getPrisma();
  if (!prisma) return NextResponse.json({ error: "Veritabanı yapılandırılmadı" }, { status: 503 });
  const users = await prisma.user.findMany({
    where: { email: { not: "" } },
    select: { email: true },
    take: 1000,
  });
  const recipients = Array.from(
    new Set(users.map((u) => String(u.email || "").trim().toLowerCase()).filter(Boolean)),
  );
  if (recipients.length === 0) return NextResponse.json({ ok: true, sent: 0 });

  const site = getSiteUrl();
  const eventUrl = `${site}/events/${event.id}`;
  const ticketUrl = `${site}/events/${event.id}/bilet`;
  const mail = await sendEventAnnouncementMail({
    to: recipients,
    title: event.title,
    date: event.date,
    city: event.city,
    venue: event.venue,
    eventUrl,
    ticketUrl,
  });
  return NextResponse.json({ ok: !!mail.ok, sent: mail.sent || recipients.length });
}

