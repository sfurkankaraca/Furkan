import type { CanonicalRadioCategory } from "./radio-categories";

export function getRadioCoverFallback(category: CanonicalRadioCategory) {
  const palettes: Record<
    CanonicalRadioCategory,
    { a: string; b: string; c: string; glow: string }
  > = {
    "Tech House": { a: "#a855f7", b: "#22c55e", c: "#06b6d4", glow: "#22c55e" },
    Techno: { a: "#60a5fa", b: "#a855f7", c: "#f472b6", glow: "#a855f7" },
    House: { a: "#f59e0b", b: "#22c55e", c: "#60a5fa", glow: "#f59e0b" },
    "R&B": { a: "#fb7185", b: "#a78bfa", c: "#38bdf8", glow: "#fb7185" },
    Rock: { a: "#ef4444", b: "#f59e0b", c: "#a855f7", glow: "#ef4444" },
    "Hip Hop": { a: "#8b5cf6", b: "#f97316", c: "#22c55e", glow: "#f97316" },
    Disco: { a: "#f472b6", b: "#60a5fa", c: "#f59e0b", glow: "#f472b6" },
    Indie: { a: "#34d399", b: "#60a5fa", c: "#a78bfa", glow: "#34d399" },
    Ambient: { a: "#38bdf8", b: "#a78bfa", c: "#34d399", glow: "#38bdf8" },
    Pop: { a: "#f97316", b: "#60a5fa", c: "#f472b6", glow: "#f472b6" },
    Live: { a: "#22c55e", b: "#f59e0b", c: "#60a5fa", glow: "#22c55e" },
    Diğer: { a: "#a855f7", b: "#60a5fa", c: "#22c55e", glow: "#a855f7" },
  };

  const p = palettes[category] ?? palettes["Diğer"];

  // 512x512 tek renkli, yazısız placeholder kapak.
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <radialGradient id="g1" cx="30%" cy="25%" r="70%">
        <stop offset="0%" stop-color="${p.a}" stop-opacity="0.95" />
        <stop offset="55%" stop-color="${p.b}" stop-opacity="0.55" />
        <stop offset="100%" stop-color="${p.c}" stop-opacity="0.20" />
      </radialGradient>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${p.a}" stop-opacity="0.95" />
        <stop offset="50%" stop-color="${p.b}" stop-opacity="0.55" />
        <stop offset="100%" stop-color="${p.c}" stop-opacity="0.35" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="10" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="512" height="512" fill="#07060a" />
    <rect width="512" height="512" fill="url(#g1)" opacity="0.85"/>
    <circle cx="256" cy="256" r="190" fill="none" stroke="url(#g2)" stroke-width="10" opacity="0.65" filter="url(#glow)"/>
    <circle cx="256" cy="256" r="130" fill="none" stroke="${p.glow}" stroke-width="3" opacity="0.55"/>
    <g opacity="0.35">
      <path d="M-20 360 C 60 260, 140 520, 260 320 C 320 220, 420 460, 560 290" fill="none" stroke="${p.b}" stroke-width="10" stroke-linecap="round"/>
      <path d="M-30 180 C 70 90, 160 220, 260 150 C 330 100, 450 210, 560 120" fill="none" stroke="${p.c}" stroke-width="8" stroke-linecap="round"/>
    </g>
    <g opacity="0.55">
      <circle cx="110" cy="110" r="7" fill="${p.a}"/>
      <circle cx="420" cy="150" r="6" fill="${p.c}"/>
      <circle cx="380" cy="420" r="8" fill="${p.b}"/>
      <circle cx="140" cy="420" r="5" fill="${p.glow}"/>
    </g>
  </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

