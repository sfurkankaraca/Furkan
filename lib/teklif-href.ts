/** Özel etkinlik teklif sihirbazı — B2B / booking’ten yönlendirme */
export function teklifHref(opts?: { kaynak?: "booking" | "b2b"; sec?: string }) {
  const q = new URLSearchParams();
  if (opts?.kaynak) q.set("kaynak", opts.kaynak);
  if (opts?.sec) q.set("sec", opts.sec);
  const s = q.toString();
  return s ? `/teklif?${s}` : "/teklif";
}
