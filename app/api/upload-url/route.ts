export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const BLOB_API = "https://api.vercel.com/v2/blob";

export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Blob token not configured" }, { status: 500 });
    }

    const gen = await fetch(`${BLOB_API}/generate-upload-url`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ access: "public" }),
      // no-store to avoid caching in edge/CDN
      cache: "no-store",
    });

    if (!gen.ok) {
      const txt = await gen.text();
      return NextResponse.json({ error: `Failed to generate upload URL: ${gen.status} ${txt}` }, { status: 500 });
    }

    const json = await gen.json();
    // { url } where client should POST the file to
    return NextResponse.json({ url: json.url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 });
  }
}


