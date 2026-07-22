"use client";

import { useState, useEffect } from "react";

import { deleteEvent } from "./actions";
import { ContentCard } from "@/components/layout/PageShell";

export default function AdminEventsList() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin/events", { credentials: "include", cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  async function notifyUsers(eventId: string) {
    setSendingId(eventId);
    try {
      const res = await fetch("/api/admin/events/announce", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(j?.error || "Mail gönderimi başarısız");
        return;
      }
      alert(`Bildirim gönderildi. Alıcı: ${j?.sent ?? 0}`);
    } catch {
      alert("Bağlantı hatası");
    } finally {
      setSendingId("");
    }
  }

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Etkinlikler</h2>
          <a href="/admin/events/new" className="rounded-xl bg-foreground text-background px-3 py-1.5 text-sm">
            Yeni
          </a>
        </div>
        <div className="rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="px-3 py-2">Başlık</th>
                <th className="px-3 py-2">Tarih</th>
                <th className="px-3 py-2">Şehir</th>
                <th className="px-3 py-2">Foto</th>
                <th className="px-3 py-2">Spotify</th>
                <th className="px-3 py-2">Detay</th>
                <th className="px-3 py-2">Düzenle</th>
                <th className="px-3 py-2">Bildirim</th>
                <th className="px-3 py-2">Sil</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-3 py-2">
                    {e.title}
                    {e.membersOnly ? (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-fuchsia-600">Kulüp</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">{new Date(e.date).toLocaleString()}</td>
                  <td className="px-3 py-2">{e.city}</td>
                  <td className="px-3 py-2">{e.photos?.length || 0}</td>
                  <td className="px-3 py-2">{e.playlists?.length || 0}</td>
                  <td className="px-3 py-2">
                    <a className="underline" href={`/events/${e.id}`} target="_blank">
                      görüntüle
                    </a>
                  </td>
                  <td className="px-3 py-2">
                    <a className="underline" href={`/admin/events/${e.id}/edit`}>
                      düzenle
                    </a>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => void notifyUsers(e.id)}
                      disabled={sendingId === e.id}
                      className="underline text-cyan-300 hover:text-cyan-200 disabled:opacity-60"
                    >
                      {sendingId === e.id ? "gönderiliyor..." : "mail gönder"}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <form
                      action={deleteEvent}
                      onSubmit={(ev) => {
                        if (!confirm("Bu etkinliği silmek istediğine emin misin?")) ev.preventDefault();
                      }}
                    >
                      <input type="hidden" name="eventId" value={e.id} />
                      <button type="submit" className="underline text-red-400 hover:text-red-300">
                        sil
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ContentCard>
  );
}
