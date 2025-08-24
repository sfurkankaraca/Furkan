export const metadata = { title: "Admin | noqta" };

export default function AdminHome() {
  async function deployAction() {
    "use server";
    const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!hookUrl) return { ok: false, error: "VERCEL_DEPLOY_HOOK_URL tanımlı değil" } as const;
    try {
      const res = await fetch(hookUrl, { method: "POST" });
      if (!res.ok) return { ok: false, error: `Hook hata: ${res.status}` } as const;
      return { ok: true } as const;
    } catch (e) {
      return { ok: false, error: "İstek atanamadı" } as const;
    }
  }

  return (
    <div className="grid gap-6">
      <div className="text-white/80">Hoş geldin. Soldaki linklerden yönetim işlemlerine devam edebilirsin.</div>
      <ul className="list-disc list-inside text-white/70">
        <li><a className="underline" href="/admin/events">Etkinlikler</a></li>
        <li><a className="underline" href="/admin/events/new">Yeni Etkinlik</a></li>
      </ul>

      <form action={deployAction}>
        <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Yayınla (Deploy)</button>
      </form>
    </div>
  );
}
