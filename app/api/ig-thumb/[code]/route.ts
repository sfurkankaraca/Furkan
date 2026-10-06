import { isListedInstagramCode } from "@/lib/academy-instagram";

// Instagram CDN görselleri "cross-origin-resource-policy: same-origin" ile geldiği için
// tarayıcıda doğrudan gösterilemiyor; kapak görselini sunucudan aktarıyoruz.
// Açık proxy olmasın diye yalnızca lib/academy-instagram.ts'teki gönderilere izin verilir.
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!isListedInstagramCode(code)) return new Response(null, { status: 404 });

  const upstream = await fetch(`https://www.instagram.com/p/${code}/media/?size=l`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    redirect: "follow",
    next: { revalidate: 86400 },
  }).catch(() => null);

  const type = upstream?.headers.get("content-type") ?? "";
  if (!upstream?.ok || !type.startsWith("image/")) return new Response(null, { status: 502 });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
