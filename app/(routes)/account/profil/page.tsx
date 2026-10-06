"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ContentCard, PageHeader, PageShell } from "@/components/layout/PageShell";
import UploadWidget from "@/components/UploadWidget";

const GENRE_OPTIONS = [
  "Techno",
  "House",
  "Disco",
  "Funk",
  "Hip-hop",
  "R&B",
  "Pop",
  "Rock",
  "Indie",
  "Jazz",
  "Klasik",
  "Drum & bass",
  "UK garage",
  "Afro",
  "Latin",
  "Diğer",
] as const;

export default function AccountProfilPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, needsOnboarding, refresh } = useAuth();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [genres, setGenres] = useState<Set<string>>(new Set());
  const [favoriteArtists, setFavoriteArtists] = useState("");
  const [musicNotes, setMusicNotes] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/me/profile", { credentials: "include" });
      const j = await res.json().catch(() => ({}));
      if (res.status === 401) {
        router.replace("/login?next=/account/profil");
        return;
      }
      if (!res.ok) {
        setErr(j?.error || "Yüklenemedi");
        setLoading(false);
        return;
      }
      if (j.needsOnboarding) {
        router.replace("/onboarding");
        return;
      }
      const g: string[] = Array.isArray(j.profile?.musicGenres) ? j.profile.musicGenres : [];
      setGenres(new Set(g));
      setFavoriteArtists(String(j.profile?.favoriteArtists ?? ""));
      setMusicNotes(String(j.profile?.musicNotes ?? ""));
      setImage(String(j.image ?? ""));
      setBio(String(j.profile?.bio ?? ""));
      const ig = String(j.profile?.instagramHandle ?? "");
      setInstagramHandle(ig ? `@${ig}` : "");
    } catch {
      setErr("Bağlantı hatası");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      router.replace("/login?next=/account/profil");
      return;
    }
    void load();
  }, [authLoading, isLoggedIn, load, router]);

  function toggleGenre(g: string) {
    setGenres((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (genres.size < 1) {
      setErr("En az bir müzik türü seçin");
      return;
    }
    setBusy(true);
    setErr("");
    setOk(false);
    try {
      const res = await fetch("/api/me/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          mode: "settings",
          data: {
            musicGenres: [...genres],
            favoriteArtists,
            musicNotes,
            image,
            bio,
            instagramHandle: instagramHandle.replace(/^@+/, "").trim() === "" ? "" : instagramHandle,
          },
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j?.error || "Kaydedilemedi");
        setBusy(false);
        return;
      }
      setOk(true);
      await refresh();
      if (j.profile?.instagramHandle) {
        setInstagramHandle(`@${j.profile.instagramHandle}`);
      }
    } catch {
      setErr("Bağlantı hatası");
    }
    setBusy(false);
  }

  if (authLoading || loading || needsOnboarding) {
    return (
      <PageShell>
        <div className="container mx-auto max-w-2xl px-4 py-16 text-white/60">Yükleniyor…</div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="grid gap-8 max-w-xl mx-auto">
        <PageHeader title="Profilim" description="Fotoğraf, biyo, Instagram ve müzik tercihlerin." />
        <ContentCard className="p-6 md:p-8">
          <form onSubmit={(e) => void handleSave(e)} className="grid gap-5">
            {err ? <div className="text-sm text-red-400">{err}</div> : null}
            {ok ? <div className="text-sm text-emerald-400">Kaydedildi.</div> : null}

            <div className="grid gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
              <span className="text-sm text-white/70">Profil fotoğrafı</span>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/5">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/35">Yok</div>
                  )}
                </div>
                <div className="grid gap-2 min-w-0 flex-1">
                  <UploadWidget
                    uploadApiPath="/api/me/upload-avatar"
                    withCredentials
                    buttonLabel="Fotoğraf yükle"
                    onUploadComplete={(url) => setImage(url)}
                  />
                  <p className="text-xs text-white/45">
                    JPEG / PNG / WebP / GIF, en fazla 5 MB. Yükledikten sonra değişikliği kaydetmek için <strong className="text-white/60">Kaydet</strong>’e bas.
                  </p>
                </div>
              </div>
              {image ? (
                <button
                  type="button"
                  className="text-left text-xs text-red-400/90 hover:text-red-300 w-fit"
                  onClick={() => setImage("")}
                >
                  Fotoğrafı kaldır
                </button>
              ) : null}
            </div>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Biyo</span>
              <textarea
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-[88px] text-sm"
                placeholder="Kendini kısaca tanıt…"
                maxLength={500}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <span className="text-xs text-white/40">{bio.length}/500</span>
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Instagram</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                placeholder="@kullaniciadi veya profil linki"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                autoComplete="off"
              />
              <span className="text-xs text-white/45">Herkese açık sayfanda @kullaniciadi olarak gösterilir.</span>
            </label>

            <div className="h-px bg-white/10 my-1" />

            <div className="grid gap-2">
              <span className="text-sm text-white/70">Müzik türleri *</span>
              <div className="flex flex-wrap gap-2">
                {GENRE_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                      genres.has(g)
                        ? "bg-noqt-lime border-noqt-lime text-black"
                        : "border-white/20 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Favori sanatçılar</span>
              <input
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white"
                value={favoriteArtists}
                onChange={(e) => setFavoriteArtists(e.target.value)}
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-white/70">Not</span>
              <textarea
                className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white min-h-[72px]"
                value={musicNotes}
                onChange={(e) => setMusicNotes(e.target.value)}
              />
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" className="rounded-xl" disabled={busy}>
                {busy ? "Kaydediliyor…" : "Kaydet"}
              </Button>
              <Button asChild type="button" variant="outline" className="rounded-xl border-white/25">
                <Link href="/events">Etkinliklere dön</Link>
              </Button>
            </div>
          </form>
        </ContentCard>
      </div>
    </PageShell>
  );
}
