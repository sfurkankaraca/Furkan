import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/account/biletlerim");
  }

  const prisma = getPrisma();
  if (prisma) {
    try {
      const u = await prisma.user.findUnique({
        where: { id: session.sub },
        select: { profileCompletedAt: true },
      });
      if (u && u.profileCompletedAt == null) {
        redirect("/onboarding");
      }
    } catch (e) {
      console.error("[account/layout] prisma", e);
    }
  }

  return <>{children}</>;
}
