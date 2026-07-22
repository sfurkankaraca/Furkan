import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function isAdmin() {
  const jar = await cookies();
  return jar.get("admin")?.value === "1";
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Veritabanı yapılandırılmadı" }, { status: 503 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      clubSubscription: { select: { periodEnd: true, updatedAt: true } },
    },
    take: 300,
  });

  const now = Date.now();
  const rows = users.map((u) => {
    const periodEnd = u.clubSubscription?.periodEnd ?? null;
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
      periodEnd,
      active: !!periodEnd && new Date(periodEnd).getTime() > now,
      updatedAt: u.clubSubscription?.updatedAt ?? null,
    };
  });
  return NextResponse.json({ members: rows });
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Veritabanı yapılandırılmadı" }, { status: 503 });
  }

  let body: { userId?: string; action?: "activate30" | "deactivate" | "setDate"; periodEnd?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON" }, { status: 400 });
  }

  const userId = String(body.userId || "");
  if (!userId) return NextResponse.json({ error: "userId gerekli" }, { status: 400 });

  const action = body.action;
  if (!action) return NextResponse.json({ error: "action gerekli" }, { status: 400 });

  const current = await prisma.clubSubscription.findUnique({ where: { userId } });
  const now = new Date();

  if (action === "deactivate") {
    await prisma.clubSubscription.upsert({
      where: { userId },
      create: { userId, periodEnd: new Date(0) },
      update: { periodEnd: new Date(0) },
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "activate30") {
    const base = current?.periodEnd && current.periodEnd > now ? current.periodEnd : now;
    const next = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);
    await prisma.clubSubscription.upsert({
      where: { userId },
      create: { userId, periodEnd: next },
      update: { periodEnd: next },
    });
    return NextResponse.json({ ok: true, periodEnd: next.toISOString() });
  }

  if (action === "setDate") {
    const raw = String(body.periodEnd || "");
    const d = new Date(raw);
    if (!raw || Number.isNaN(d.getTime())) {
      return NextResponse.json({ error: "Geçerli periodEnd gerekli" }, { status: 400 });
    }
    await prisma.clubSubscription.upsert({
      where: { userId },
      create: { userId, periodEnd: d },
      update: { periodEnd: d },
    });
    return NextResponse.json({ ok: true, periodEnd: d.toISOString() });
  }

  return NextResponse.json({ error: "Geçersiz action" }, { status: 400 });
}

