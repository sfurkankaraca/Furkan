import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin/require-admin";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[oklch(0.97_0.005_80)]">
      <Suspense
        fallback={
          <>
            <aside className="hidden md:flex w-56 shrink-0 flex-col bg-foreground min-h-screen" aria-hidden />
            <div className="md:hidden flex items-center justify-between bg-foreground px-4 py-3 sticky top-0 z-30 h-12" aria-hidden />
          </>
        }
      >
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 md:px-8">{children}</div>
      </main>
    </div>
  );
}
