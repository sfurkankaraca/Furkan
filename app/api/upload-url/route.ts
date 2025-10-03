export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const BLOB_API = "https://api.vercel.com/v2/blob";

async function handleGenerate(request: Request) {
  const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN eksik (Vercel Env)" }, { status: 500 });
  }

  // İsteğin body’sinden metadata al
  let filename = `upload-${Date.now()}`;
  let contentType: string | undefined = undefined;
  try {
    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      if (typeof body?.filename === "string" && body.filename.trim()) filename = body.filename.trim();
      if (typeof body?.contentType === "string" && body.contentType.trim()) contentType = body.contentType.trim();
    }
  } catch {}

  const gen = await fetch(`${BLOB_API}/generate-upload-url`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ access: "public", filename, contentType }),
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

export async function GET(request: Request) { return handleGenerate(request); }
export async function POST(request: Request) { return handleGenerate(request); }


