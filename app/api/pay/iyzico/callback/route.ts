import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { checkoutFormRetrieve } from "@/lib/iyzico";
import { getSiteUrl } from "@/lib/site-url";
import { makeTicketCode } from "@/lib/ticket-code";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitIyzicoCallback } from "@/lib/security/rate-limit";
import { CLUB_SUBSCRIPTION_EVENT_ID } from "@/lib/club-subscription/constants";
import { extendClubSubscriptionPeriod } from "@/lib/club-subscription/extend-subscription";
import { getEventById } from "@/lib/server/events-store";
import { sendTicketPurchasedMail } from "@/lib/mail/send";

export const runtime = "nodejs";

async function handleToken(req: Request, token: string) {
  const site = getSiteUrl();
  const fail = () => NextResponse.redirect(`${site}/account/biletlerim?pay=fail`);

  const ip = getClientIp(req);
  const rl = await rateLimitIyzicoCallback(ip);
  if (!rl.success) {
    return NextResponse.redirect(`${site}/account/biletlerim?pay=fail`);
  }

  if (!token) return fail();

  const prisma = getPrisma();
  if (!prisma) return fail();

  const paidAlready = await prisma.order.findFirst({
    where: { iyzicoToken: token, status: "paid" },
  });
  if (paidAlready) {
    const dest =
      paidAlready.eventId === CLUB_SUBSCRIPTION_EVENT_ID
        ? `${site}/account/club?pay=ok`
        : `${site}/account/biletlerim?pay=ok`;
    return NextResponse.redirect(dest);
  }

  const pendingOrder = await prisma.order.findFirst({
    where: { iyzicoToken: token, status: "pending" },
  });
  if (!pendingOrder) {
    return fail();
  }

  let retrieved: Awaited<ReturnType<typeof checkoutFormRetrieve>>;
  try {
    retrieved = await checkoutFormRetrieve(token);
  } catch (e) {
    console.error("iyzico retrieve", e);
    return fail();
  }

  const conv = retrieved.conversationId;
  if (!conv || conv !== pendingOrder.conversationId) {
    return fail();
  }

  const ok = String(retrieved.status || "").toLowerCase() === "success";
  const paid = String(retrieved.paymentStatus || "").toUpperCase() === "SUCCESS";
  if (!ok || !paid) {
    await prisma.order.updateMany({
      where: { conversationId: conv, status: "pending" },
      data: { status: "failed" },
    });
    return fail();
  }

  const paidPriceRaw = (retrieved as { paidPrice?: string }).paidPrice;
  if (paidPriceRaw != null && paidPriceRaw !== "") {
    const expectedTry = pendingOrder.amountKurus / 100;
    const gotTry = Number(String(paidPriceRaw).replace(",", "."));
    if (Number.isFinite(gotTry) && Math.abs(gotTry - expectedTry) > 0.05) {
      console.error("iyzico amount mismatch", { gotTry, expectedTry, orderId: pendingOrder.id });
      return fail();
    }
  }

  const paymentId = retrieved.paymentId || undefined;

  try {
    await prisma.$transaction(async (tx) => {
      const current = await tx.order.findUnique({ where: { id: pendingOrder.id } });
      if (!current || current.status !== "pending") return;

      await tx.order.update({
        where: { id: pendingOrder.id },
        data: {
          status: "paid",
          iyzicoPaymentId: paymentId,
          iyzicoToken: token,
        },
      });

      if (pendingOrder.eventId === CLUB_SUBSCRIPTION_EVENT_ID) {
        await extendClubSubscriptionPeriod(tx, pendingOrder.userId);
      } else {
        const existing = await tx.ticket.count({ where: { orderId: pendingOrder.id } });
        if (existing === 0) {
          for (let i = 0; i < pendingOrder.quantity; i++) {
            await tx.ticket.create({
              data: {
                code: makeTicketCode(),
                userId: pendingOrder.userId,
                orderId: pendingOrder.id,
                eventId: pendingOrder.eventId,
                eventTitle: pendingOrder.eventTitle || undefined,
              },
            });
          }
        }
      }
    });
  } catch (e) {
    console.error("callback persist", e);
    return fail();
  }

  if (pendingOrder.eventId !== CLUB_SUBSCRIPTION_EVENT_ID) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: pendingOrder.userId },
        select: { email: true, name: true },
      });
      const tickets = await prisma.ticket.findMany({
        where: { orderId: pendingOrder.id },
        select: { code: true },
      });
      const event = await getEventById(pendingOrder.eventId);
      if (user?.email && tickets.length > 0) {
        await sendTicketPurchasedMail({
          to: user.email,
          name: user.name,
          eventTitle: pendingOrder.eventTitle || event?.title || "Etkinlik",
          date: event?.date,
          city: event?.city,
          venue: event?.venue,
          ticketCodes: tickets.map((t) => t.code),
          ticketsUrl: `${site}/account/biletlerim`,
        });
      }
    } catch (e) {
      console.error("ticket purchase mail failed", e);
    }
  }

  const successDest =
    pendingOrder.eventId === CLUB_SUBSCRIPTION_EVENT_ID
      ? `${site}/account/club?pay=ok`
      : `${site}/account/biletlerim?pay=ok`;
  return NextResponse.redirect(successDest);
}

export async function POST(req: Request) {
  let token = "";
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await req.json();
      token = String(j?.token || "");
    } else {
      const form = await req.formData();
      token = String(form.get("token") || "");
    }
  } catch {
    return handleToken(req, "");
  }
  return handleToken(req, token);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  return handleToken(req, token);
}
