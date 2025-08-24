export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <nav className="text-sm text-white/70 flex gap-3">
          <a href="/admin" className="hover:text-white">Dashboard</a>
          <a href="/admin/events" className="hover:text-white">Etkinlikler</a>
          <a href="/admin/events/new" className="hover:text-white">Yeni Etkinlik</a>
          <a href="/admin/logout" className="hover:text-white">Çıkış</a>
        </nav>
      </div>
      <div className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
        {children}
      </div>
    </div>
  );
}
