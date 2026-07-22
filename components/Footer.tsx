import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} noqta</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="https://www.instagram.com/noqtaverse?igsh=MjFidTUyazd2M3E4" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">Instagram</Link>
          <Link href="https://open.spotify.com/user/31jte7ldctopxvipofwgucvts5sm?si=bf4008478d634b86" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">Spotify</Link>
          <Link href="https://youtube.com/@noqtarecords?si=FOd1tTTnyjG8l2NJ" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">YouTube</Link>
          <Link href="https://wa.me/905417997973" className="hover:text-foreground transition" target="_blank" rel="noopener noreferrer">WhatsApp</Link>
          <span className="text-border hidden md:inline">|</span>
          <Link href="/gizlilik-politikasi" className="hover:text-foreground transition">Gizlilik Politikası</Link>
          <Link href="/kullanim-kosullari" className="hover:text-foreground transition">Kullanım Koşulları</Link>
          <span className="text-border hidden md:inline">|</span>
          <a href="https://www.noqt.events" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition font-medium">DJ Hizmeti → noqt.events</a>
        </nav>
      </div>
    </footer>
  );
}
