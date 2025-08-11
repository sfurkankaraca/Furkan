export const metadata = { title: "Sayfa bulunamadı | noqta" };

export default function NotFound() {
  return (
    <main className="min-h-[60svh] grid place-items-center text-center p-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">404</h1>
        <p className="mt-2 text-white/70">Aradığınız sayfa bulunamadı.</p>
      </div>
    </main>
  );
}
