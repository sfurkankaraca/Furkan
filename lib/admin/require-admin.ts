import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const jar = await cookies();
  if (jar.get("admin")?.value !== "1") {
    const h = await headers();
    const path = h.get("x-pathname") || "/admin";
    redirect(`/admin/login?next=${encodeURIComponent(path)}`);
  }
}
