import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    return NextResponse.json({ error: "Dosya yükleme yapılandırılmamış" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Dosya yok" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "En fazla 5 MB" }, { status: 400 });
    }
    const type = file.type || "";
    if (!/^image\/(jpeg|png|webp|gif)$/i.test(type)) {
      return NextResponse.json({ error: "Sadece JPEG, PNG, WebP veya GIF" }, { status: 400 });
    }

    const safe = String(file.name || "avatar").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80);
    const path = `avatars/${session.sub}/${Date.now()}-${safe}`;

    const { url } = await put(path, file, {
      access: "public",
      token: blobToken,
    });

    return NextResponse.json({ url });
  } catch (e) {
    console.error("upload-avatar", e);
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}
