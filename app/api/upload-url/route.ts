export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const BLOB_API = "https://api.vercel.com/v2/blob";

async function handleGenerate() {
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN eksik (Vercel Env)" }, { status: 500 });
  }

  const gen = await fetch(`${BLOB_API}/generate-upload-url`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ access: "public" }),
    cache: "no-store",
  });

  const text = await gen.text();
  if (!gen.ok) {
    return NextResponse.json({ error: `Blob API hata: ${gen.status} ${text}` }, { status: 500 });
  }
  try {
    const json = JSON.parse(text);
    return NextResponse.json({ url: json.url });
  } catch {
    return NextResponse.json({ error: `Blob API beklenmeyen yanıt: ${text}` }, { status: 500 });
  }
}

export async function GET() { return handleGenerate(); }
export async function POST() { return handleGenerate(); }


