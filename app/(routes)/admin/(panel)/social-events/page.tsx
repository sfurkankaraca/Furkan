import { ContentCard } from "@/components/layout/PageShell";
import { requireAdmin } from "@/lib/admin/require-admin";
import { fetchSocialFeedEvents, type SocialFeedEvent } from "@/lib/noqt-social/events-feed";
import { readSocialEventSettings, type SocialEventSetting } from "@/lib/server/social-event-settings-store";
import { SITE_URL } from "@/lib/site-url";
import CopyButton from "./CopyButton";
import { saveSocialEventSetting } from "./actions";

export const metadata = { title: "noqt social etkinlikleri" };
export const dynamic = "force-dynamic";

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

const input = "rounded-lg border border-black/15 bg-white px-3 py-1.5 text-sm";

function EventRow({ ev, setting, site, flash }: { ev: SocialFeedEvent; setting?: SocialEventSetting; site: string; flash: "ok" | "err" | null }) {
  const url = `${site}/events/ns-${ev.id}`;
  const t = setting?.ticketing;
  return (
    <li id={`e-${ev.id}`} className="grid gap-3 rounded-xl border border-black/10 bg-white p-4">
      <div className="flex gap-4">
        {ev.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ev.imageUrl} alt="" className="h-20 w-16 flex-none rounded-lg object-cover" />
        ) : (
          <div className="h-20 w-16 flex-none rounded-lg bg-black/5" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium">{ev.title}</div>
          <div className="text-sm text-black/60">
            {fmt(ev.startAt)} · {[ev.venueName ?? ev.placeText, ev.city].filter(Boolean).join(", ")}
          </div>
          <a href={ev.socialUrl} target="_blank" rel="noopener" className="text-sm underline underline-offset-2">
            noqt social&apos;da aç ↗
          </a>
          {flash === "ok" ? <span className="ml-3 text-sm text-emerald-700">Kaydedildi</span> : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-black/60">Site bağlantısı:</span>
        <code className="break-all rounded bg-black/5 px-1.5 py-0.5">{url}</code>
        <CopyButton text={url} />
      </div>

      <form action={saveSocialEventSetting} className="grid gap-3">
        <input type="hidden" name="socialId" value={ev.id} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="listed" defaultChecked={setting?.listed === true} /> Sitede göster
        </label>
        <label className="grid gap-1 text-sm">
          Alt başlık
          <input name="subtitle" maxLength={200} defaultValue={setting?.subtitle ?? ""} className={input} />
        </label>
        <fieldset className="grid gap-3 rounded-lg border border-black/10 p-3 sm:grid-cols-2">
          <legend className="px-1 text-sm font-medium">Bilet</legend>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="ticketingEnabled" defaultChecked={t?.enabled === true} /> Bilet satışı açık
          </label>
          <label className="grid gap-1 text-sm">
            Fiyat (₺)
            <input name="ticketingPrice" type="number" min="0" step="0.01" defaultValue={t?.priceTry ?? ""} className={input} />
          </label>
          <label className="grid gap-1 text-sm">
            Sipariş başı en fazla
            <input name="ticketingMaxPerOrder" type="number" min="1" step="1" defaultValue={t?.maxPerOrder ?? ""} className={input} />
          </label>
          <label className="grid gap-1 text-sm">
            Toplam kontenjan
            <input name="ticketingTotalCap" type="number" min="1" step="1" defaultValue={t?.totalCap ?? ""} className={input} />
          </label>
          <label className="grid gap-1 text-sm">
            Not
            <input name="ticketingNote" maxLength={300} defaultValue={t?.note ?? ""} className={input} />
          </label>
        </fieldset>
        <div>
          <button type="submit" className="rounded-xl bg-foreground px-4 py-2 text-sm text-background">
            Kaydet
          </button>
        </div>
      </form>
    </li>
  );
}

export default async function AdminSocialEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; err?: string; id?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const [feed, settings] = await Promise.all([fetchSocialFeedEvents(), readSocialEventSettings()]);
  const site = SITE_URL;
  const now = Date.now();
  const upcoming = feed.filter((e) => Date.parse(e.endAt ?? e.startAt) >= now).sort((a, b) => a.startAt.localeCompare(b.startAt));
  const past = feed.filter((e) => Date.parse(e.endAt ?? e.startAt) < now).sort((a, b) => b.startAt.localeCompare(a.startAt));
  const flashFor = (id: string): "ok" | "err" | null => (sp.ok === id ? "ok" : null);

  return (
    <ContentCard className="bg-white p-6 md:p-8">
      <div className="grid gap-6">
        <div>
          <h1 className="text-xl font-medium">noqt social etkinlikleri</h1>
          <p className="mt-2 text-sm text-black/70">
            Etkinliği noqt social kurucu panelinden ekle; burada sitede gösterip bilet fiyatını belirle. Uygulamadaki bilet
            bağlantısı için: <code className="rounded bg-black/5 px-1">{site}/events/ns-&lt;id&gt;</code> (her etkinliğin kendi bağlantısı aşağıda).
          </p>
        </div>
        {sp.err ? (
          <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {sp.err}
            {sp.id ? (
              <>
                {" "}
                (<a href={`#e-${sp.id}`} className="underline">etkinliğe git</a>)
              </>
            ) : null}
          </p>
        ) : null}

        {feed.length === 0 ? (
          <p className="text-sm text-black/60">Akıştan etkinlik gelmedi (akış boş ya da ulaşılamıyor).</p>
        ) : null}

        {upcoming.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-medium">Yaklaşan ({upcoming.length})</h2>
            <ul className="m-0 grid list-none gap-3 p-0">
              {upcoming.map((ev) => (
                <EventRow key={ev.id} ev={ev} setting={settings[ev.id]} site={site} flash={flashFor(ev.id)} />
              ))}
            </ul>
          </section>
        ) : null}
        {past.length > 0 ? (
          <section className="grid gap-3">
            <h2 className="text-lg font-medium">Geçmiş ({past.length})</h2>
            <ul className="m-0 grid list-none gap-3 p-0">
              {past.map((ev) => (
                <EventRow key={ev.id} ev={ev} setting={settings[ev.id]} site={site} flash={flashFor(ev.id)} />
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </ContentCard>
  );
}
