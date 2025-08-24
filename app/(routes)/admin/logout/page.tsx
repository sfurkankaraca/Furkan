import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLogoutPage() {
  "use server";
  cookies().delete("admin");
  redirect("/admin/login");
}
