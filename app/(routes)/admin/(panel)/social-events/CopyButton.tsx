"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Kopyala" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          window.prompt("Bağlantıyı kopyala", text);
        }
      }}
      className="rounded-lg border border-black/15 px-2.5 py-1 text-xs hover:bg-black/5"
    >
      {done ? "Kopyalandı" : label}
    </button>
  );
}
