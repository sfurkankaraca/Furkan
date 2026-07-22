export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const blobToken =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VERCEL_BLOB_RW_TOKEN ||
  process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

export async function POST(request: Request) {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  // Yalnızca aynı origin'den gelen istekleri kabul et (temel CSRF/abuse freni).
  if (host && origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return NextResponse.json({ error: "Geçersiz origin" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Geçersiz origin" }, { status: 403 });
    }
  }
  if (!blobToken) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN eksik (Vercel Env)" }, { status: 500 });
  }
  try {
    const body = await request.json();
    const jsonResponse = await handleUpload({
      token: blobToken,
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const normalizedPath = (pathname || "").replace(/^\/+/, "");
        // Rastgele dosya yazımını engelle: tüm yüklemeler uploads/ altında olmalı.
        if (!normalizedPath.startsWith("uploads/")) {
          throw new Error("Geçersiz upload yolu");
        }
        return {
          allowedContentTypes: ["image/*", "video/*"],
          maximumSizeInBytes: 1024 * 1024 * 500, // 500MB
        };
      },
      onUploadCompleted: async () => {
        // Bu projede callback sonrası ek işlem yok.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload URL oluşturulamadı";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


