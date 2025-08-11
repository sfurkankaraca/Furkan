import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-8 text-sm text-white/60 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} noqta</p>
        <nav className="flex items-center gap-4">
          <Link href="https://www.instagram.com/noqtaverse?igsh=MjFidTUyazd2M3E4" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Instagram</Link>
          <Link href="https://open.spotify.com/user/31jte7ldctopxvipofwgucvts5sm?si=b4f418120f444a4e" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">Spotify</Link>
          <Link href="https://youtube.com/@noqtarecords?si=FOd1tTTnyjG8l2NJ" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">YouTube</Link>
          <Link href="https://wa.me/905417997973" className="hover:text-white transition" target="_blank" rel="noopener noreferrer">WhatsApp</Link>
        </nav>
      </div>
    </footer>
  );
}
