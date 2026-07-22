/** İletişim sayfasında konu/mesaj ön doldurma */
export function contactHref(subject: string, message?: string) {
  const q = new URLSearchParams({ subject });
  if (message) q.set("message", message);
  return `/contact?${q.toString()}`;
}
