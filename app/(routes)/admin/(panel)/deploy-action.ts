"use server";

export async function triggerDeployAction() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hookUrl) return { ok: false as const, error: "VERCEL_DEPLOY_HOOK_URL tanımlı değil" };
  try {
    const res = await fetch(hookUrl, { method: "POST" });
    if (!res.ok) return { ok: false as const, error: `Hook hata: ${res.status}` };
    return { ok: true as const };
  } catch {
    return { ok: false as const, error: "İstek atanamadı" };
  }
}
