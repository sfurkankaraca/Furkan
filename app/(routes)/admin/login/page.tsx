import Section from "@/components/Section";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Giriş | noqta" };

export default function AdminLoginPage({ searchParams }: { searchParams: { next?: string; e?: string } }) {
  async function action(formData: FormData) {
    "use server";
    const password = String(formData.get("password") || "");
    const next = String(formData.get("next") || "/admin");
    const expected = process.env.ADMIN_PASSWORD || "noqta";
    if (password !== expected) {
      redirect("/admin/login?e=1");
    }
    cookies().set("admin", "1", { httpOnly: true, sameSite: "lax", path: "/" });
    redirect(next);
  }

  const nextParam = searchParams?.next || "/admin";
  const hasError = !!searchParams?.e;

  return (
    <Section title="Admin Giriş" description="Yalnızca yetkili kullanıcılar için.">
      {/* basit form */}
      <form action={action} method="post" className="grid gap-4 max-w-sm">
        <input type="hidden" name="next" value={nextParam} />
        <label className="grid gap-2" htmlFor="password">
          <span className="text-sm text-white/80">Şifre</span>
          <input id="password" type="password" name="password" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="••••••••" />
        </label>
        {hasError ? <div className="text-sm text-red-400">Hatalı şifre</div> : null}
        <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Giriş yap</button>
      </form>
    </Section>
  );
}
