import Section from "@/components/Section";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Giriş | noqta" };

export default function LoginPage({ searchParams }: { searchParams: { next?: string; e?: string } }) {
  async function action(formData: FormData) {
    "use server";
    const username = String(formData.get("username") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();
    const next = String(formData.get("next") || "/");

    if (username === "admin") {
      const expected = String(process.env.ADMIN_PASSWORD || "noqta").trim();
      if (password !== expected) redirect("/login?e=1");
      cookies().set("admin", "1", { httpOnly: true, sameSite: "lax", path: "/" });
      redirect("/admin");
    } else {
      const expected = String(process.env.MEMBER_PASSWORD || "member").trim();
      if (password !== expected) redirect("/login?e=1");
      cookies().set("member", "1", { httpOnly: true, sameSite: "lax", path: "/" });
      redirect(next || "/");
    }
  }

  const hasError = !!searchParams?.e;

  return (
    <Section title="Giriş" description="Üyeler ve admin için giriş.">
      <form action={action} method="post" className="grid gap-4 max-w-sm">
        <label className="grid gap-2" htmlFor="username">
          <span className="text-sm text-white/80">Kullanıcı Adı</span>
          <input id="username" name="username" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="kullanici veya admin" />
        </label>
        <label className="grid gap-2" htmlFor="password">
          <span className="text-sm text-white/80">Şifre</span>
          <input id="password" type="password" name="password" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="••••••••" />
        </label>
        {hasError ? <div className="text-sm text-red-400">Hatalı kullanıcı adı veya şifre</div> : null}
        <button type="submit" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90">Giriş yap</button>
      </form>
    </Section>
  );
}
