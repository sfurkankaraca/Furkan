import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { checkoutFormInitialize } from "@/lib/iyzico";
import { getSiteUrl } from "@/lib/site-url";
import { getClientIp } from "@/lib/security/client-ip";
import { rateLimitPayInit } from "@/lib/security/rate-limit";
import { isNoqtaClubApproved } from "@/lib/noqta-club/membership";
import {
  CLUB_SUBSCRIPTION_EVENT_ID,
  getClubSubscriptionPriceTry,
} from "@/lib/club-subscription/constants";
import { readClubPackages } from "@/lib/club-subscription/packages";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Önce giriş yapmalısınız" }, { status: 401 });
  }

  const approved = await isNoqtaClubApproved(session.email);
  if (!approved) {
    return NextResponse.json({ error: "Önce Noqta Club başvurunuzun onaylanması gerekir" }, { status: 403 });
  }

  let packageId = "";
  try {
    const body = await req.json().catch(() => ({}));
    packageId = String((body as { packageId?: string })?.packageId || "");
  } catch {
    // no-op: packageId opsiyonel
  }

  const packageList = await readClubPackages();
  const selected = packageList.find((p) => p.id === packageId) ?? packageList[0];
  const fallback = getClubSubscriptionPriceTry();
  const priceTry = selected?.priceTry ?? fallback;
  if (!(priceTry > 0)) {
    return NextResponse.json({ error: "Abonelik fiyatı yapılandırılmamış" }, { status: 503 });
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

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 401 });
  }

  const amountKurus = Math.round(priceTry * 100);
  const conversationId = randomBytes(12).toString("hex");

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      eventId: CLUB_SUBSCRIPTION_EVENT_ID,
      eventTitle: selected?.name ? `Noqta Club - ${selected.name}` : "Noqta Club aylık üyelik",
      quantity: 1,
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
      priceTry,
      paidPriceTry: priceTry,
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
          id: CLUB_SUBSCRIPTION_EVENT_ID,
          name: selected?.name || "Noqta Club aylık üyelik",
          category1: "Subscription",
          itemType: "VIRTUAL",
          price: priceTry.toFixed(2),
        },
      ],
    });

    const ok = String(init.status || "").toLowerCase() === "success";
    if (!ok || !init.token) {
      await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } });
      return NextResponse.json(
        { error: (init as { errorMessage?: string }).errorMessage || "Ödeme formu oluşturulamadı" },
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
    await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } }).catch(() => {});
    console.error("club subscription checkout", e);
    return NextResponse.json({ error: "Ödeme sağlayıcı hatası" }, { status: 502 });
  }
}
