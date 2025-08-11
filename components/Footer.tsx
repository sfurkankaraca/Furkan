import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-8 text-sm text-white/60 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} noqta</p>
        <nav className="flex items-center gap-4">
          <Link href="https://instagram.com/noqta" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Instagram</Link>
          <Link href="#" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Spotify</Link>
          <Link href="#" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">YouTube</Link>
        </nav>
      </div>
    </footer>
  );
}
