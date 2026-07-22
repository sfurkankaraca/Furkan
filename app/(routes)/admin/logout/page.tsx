import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminLoginSecureFromRequest, clearAdminSessionCookieOpts } from "@/lib/admin/admin-session-cookie";

export default async function AdminLogoutPage() {
  const h = await headers();
  const secure = adminLoginSecureFromRequest({ headers: h });
  const jar = await cookies();
  jar.set("admin", "", clearAdminSessionCookieOpts(secure));
  redirect("/admin/login");
}
