import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { getEventById } from "@/lib/server/events-store";
import { CLUB_SUBSCRIPTION_EVENT_ID } from "@/lib/club-subscription/constants";
import { checkoutFormInitialize } from "@/lib/iyzico";
import { getSiteUrl } from "@/lib/site-url";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitPayInit } from "@/lib/security/rate-limit";
import { getClubAccessForUser } from "@/lib/club-subscription/access";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Önce giriş yapmalısınız" }, { status: 401 });
  }

  const ip = getClientIp(req);
  const rl = await rateLimitPayInit(ip, session.sub);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Çok sık ödeme başlatma denemesi. Lütfen bekleyin." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Veritabanı yapılandırılmadı" }, { status: 503 });
  }

  let body: { eventId?: string; quantity?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const eventId = String(body.eventId || "");
  const quantity = Math.min(10, Math.max(1, Number(body.quantity) || 1));
  if (!eventId) {
    return NextResponse.json({ error: "Etkinlik gerekli" }, { status: 400 });
  }
  if (eventId === CLUB_SUBSCRIPTION_EVENT_ID) {
    return NextResponse.json({ error: "Kulüp aboneliği için /api/pay/club-subscription kullanın" }, { status: 400 });
  }

  const event = await getEventById(eventId);
  if (!event?.ticketing?.enabled || event.ticketing.priceTry <= 0) {
    return NextResponse.json({ error: "Bu etkinlik için bilet satışı yok" }, { status: 400 });
  }

  if (event.membersOnly) {
    const access = await getClubAccessForUser(prisma, session.sub, session.email);
    if (!access.fullMember) {
      return NextResponse.json(
        { error: "Bu etkinlik için bilet almak üzere onaylı Noqta Club üyeliği ve aktif abonelik gerekir." },
        { status: 403 }
      );
    }
  }

  const date = event.date ? new Date(event.date) : null;
  if (date && date.getTime() < Date.now()) {
    return NextResponse.json({ error: "Geçmiş etkinlik için bilet alınamaz" }, { status: 400 });
  }

  const maxPer = event.ticketing.maxPerOrder ?? 8;
  if (quantity > maxPer) {
    return NextResponse.json({ error: `En fazla ${maxPer} bilet` }, { status: 400 });
  }

  if (event.ticketing.totalCap) {
    const sold = await prisma.ticket.count({ where: { eventId } });
    if (sold + quantity > event.ticketing.totalCap) {
      return NextResponse.json({ error: "Yeterli kontenjan kalmadı" }, { status: 400 });
    }
  }

  const lineTotalTry = event.ticketing.priceTry * quantity;
  const amountKurus = Math.round(lineTotalTry * 100);
  const conversationId = randomBytes(12).toString("hex");

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 401 });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      eventId,
      eventTitle: event.title,
      quantity,
      amountKurus,
      status: "pending",
      conversationId,
    },
  });

  const site = getSiteUrl();
  const callbackUrl = `${site}/api/pay/iyzico/callback`;

  const displayName = (user.name || user.email.split("@")[0] || "Musteri").trim();
  const nameParts = displayName.split(/\s+/);
  const firstName = nameParts[0] || "Ad";
  const lastName = nameParts.slice(1).join(" ") || "Soyad";

  const identityNumber = process.env.IYZIPAY_BUYER_IDENTITY || "74300864791";
  const gsmNumber = process.env.IYZIPAY_BUYER_GSM || "+905350000000";

  try {
    const init = await checkoutFormInitialize({
      conversationId,
      priceTry: lineTotalTry,
      paidPriceTry: lineTotalTry,
      basketId: order.id,
      callbackUrl,
      buyer: {
        id: user.id,
        name: firstName,
        surname: lastName,
        email: user.email,
        gsmNumber,
        identityNumber,
        registrationAddress: "Turkey",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
        ip: getClientIp(req),
      },
      basketItems: [
        {
          id: eventId,
          name: `${event.title} x${quantity}`,
          category1: "Event",
          itemType: "VIRTUAL",
          price: lineTotalTry.toFixed(2),
        },
      ],
    });

    const ok = String(init.status || "").toLowerCase() === "success";
    if (!ok || !init.token) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } });
      return NextResponse.json(
        { error: init.errorMessage || init.errorCode || "Ödeme formu oluşturulamadı" },
        { status: 502 }
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { iyzicoToken: init.token },
    });

    return NextResponse.json({
      token: init.token,
      paymentPageUrl: init.paymentPageUrl,
      checkoutFormContent: init.checkoutFormContent,
    });
  } catch (e) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } });
    console.error("iyzico initialize", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Ödeme sağlayıcı hatası" },
      { status: 502 }
    );
  }
}
