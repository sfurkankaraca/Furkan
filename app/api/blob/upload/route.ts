// web/app/api/blob/upload/route.ts
import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body: any = await request.json().catch(() => ({}));
  return handleUpload({
    request,
    body,
    onBeforeGenerateToken: async (ctx: any) => {
      const filename = ctx?.filename || 'file';
      return {
        allowedContentTypes: ['image/*'],
        maximumSizeInBytes: 10_000_000, // 10 MB
        token: process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
        pathname: `covers/${Date.now()}-${filename}`,
      };
    },
    onUploadCompleted: async ({ blob }: any) => {
      console.log('Upload completed:', blob?.url);
    },
  });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}