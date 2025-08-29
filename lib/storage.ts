import { put as vercelBlobPut } from "@vercel/blob";

export async function uploadEventImage(params: {
  fileBuffer: Buffer;
  contentType: string;
  fileName: string;
}): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const { url } = await vercelBlobPut(`events/${params.fileName}` , params.fileBuffer, {
      access: "public",
      contentType: params.contentType || "application/octet-stream",
    });
    return { ok: true, url } as const;
  } catch (e) {
    console.error("[storage] vercel blob upload failed", e);
    return { ok: false, error: "Upload başarısız" } as const;
  }
}


