// web/app/api/blob/upload/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log(">> POST /api/blob/upload tetiklendi");
  
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  console.log(">> Blob token mevcut mu?:", blobToken ? "evet" : "hayır");
  
  if (!blobToken) {
    console.error(">> BLOB_READ_WRITE_TOKEN bulunamadı");
    return NextResponse.json({ error: "Blob token not configured" }, { status: 500 });
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    console.log(">> Dosya alındı:", file.name, file.type, file.size);
    
    const { url } = await put(`covers/${Date.now()}-${file.name}`, file, {
      access: 'public',
      token: blobToken,
    });
    
    console.log(">> Upload başarılı:", url);
    
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error(">> Upload HATASI:", err?.message || err);
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}

export async function GET() {
  console.log(">> GET /api/blob/upload çağrıldı");
  return NextResponse.json({ ok: true });
}