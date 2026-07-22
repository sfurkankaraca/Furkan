export const metadata = { title: "Admin Giriş | noqta" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; e?: string }>;
}) {
  const sp = await searchParams;
  const nextParam = sp?.next || "/admin";
  const hasError = !!sp?.e;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Admin Giriş</h1>
          <p className="mt-1 text-sm text-muted-foreground">Yalnızca yetkili kullanıcılar için.</p>
        </div>
        <form action="/api/auth/admin-login" method="post" className="grid gap-4">
          <input type="hidden" name="next" value={nextParam} />
          <label className="grid gap-2" htmlFor="password">
            <span className="text-sm font-medium text-foreground">Şifre</span>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/40"
              placeholder="••••••••"
            />
          </label>
          {hasError ? <div className="text-sm text-red-600">Hatalı şifre. Tekrar deneyin.</div> : null}
          <button
            type="submit"
            className="rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Giriş yap
          </button>
        </form>
      </div>
    </div>
  );
}
