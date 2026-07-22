import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/onboarding");
  }

  const prisma = getPrisma();
  if (prisma) {
    try {
      const u = await prisma.user.findUnique({
        where: { id: session.sub },
        select: { profileCompletedAt: true },
      });
      if (u?.profileCompletedAt != null) {
        redirect("/account/biletlerim");
      }
    } catch (e) {
      console.error("[onboarding/layout] prisma", e);
    }
  }

  return <>{children}</>;
}
