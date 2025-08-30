import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, error: "Blob RW token yok (BLOB_READ_WRITE_TOKEN/VERCEL_BLOB_RW_TOKEN)" }, { status: 400 });
    }
    const body = await req.json().catch(() => ({} as any));
    const filename = typeof body?.filename === "string" ? body.filename : undefined;
    const contentType = typeof body?.contentType === "string" ? body.contentType : undefined;

    // Vercel Blob RW token, Authorization header'ı değil; body'deki `token` alanını bekler
    const res = await fetch("https://api.vercel.com/v2/blob/generate-upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access: "public", token, filename, contentType }),
    });
    const json = await res.json().catch(() => ({} as any));
    if (!res.ok) return NextResponse.json({ ok: false, error: json?.error?.message || json?.error || `Upload URL başarısız (status ${res.status})` }, { status: 500 });
    return NextResponse.json({ ok: true, ...json });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Upload URL error" }, { status: 500 });
  }
}
