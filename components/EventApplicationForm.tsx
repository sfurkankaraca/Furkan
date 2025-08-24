"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";

type ActionResult = { ok: boolean } | { ok: false; error: string } | null;

export default function EventApplicationForm({
  action,
  defaultEventId,
  defaultEventTitle,
}: {
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>;
  defaultEventId: string;
  defaultEventTitle?: string;
}) {
  const [state, formAction] = useFormState(action, null);
  const { pending } = useFormStatus();
  const [otherGenreSelected, setOtherGenreSelected] = useState(false);

  const choiceClass = "accent-black bg-white pointer-events-auto z-10";

  return (
    <form action={formAction} className="grid gap-4">
      {/* Hidden event info */}
      <input type="hidden" name="eventId" value={defaultEventId} />
      {defaultEventTitle ? <input type="hidden" name="eventTitle" value={defaultEventTitle} /> : null}

      <label className="grid gap-2" htmlFor="email">
        <span className="text-sm text-white/80">Email *</span>
        <input id="email" type="email" name="email" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="ornek@posta.com" />
      </label>

      <label className="grid gap-2" htmlFor="name">
        <span className="text-sm text-white/80">Ad Soyad *</span>
        <input id="name" name="name" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Ad Soyad" />
      </label>

      <label className="grid gap-2" htmlFor="phone">
        <span className="text-sm text-white/80">Telefon *</span>
        <input id="phone" name="phone" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="5xx xxx xx xx" />
      </label>

      <label className="grid gap-2" htmlFor="birthDate">
        <span className="text-sm text-white/80">Doğum Tarihi *</span>
        <input id="birthDate" type="date" name="birthDate" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" />
      </label>

      <label className="grid gap-2" htmlFor="city">
        <span className="text-sm text-white/80">Yaşadığın Şehir? *</span>
        <input id="city" name="city" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Şehir" />
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm text-white/80">En çok hangisi için gelirsin? *</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            "DJ performansı",
            "Kokteyl",
            "Gökyüzü",
          ].map((v, i) => (
            <label key={v} className="flex items-center gap-2 text-white/90 cursor-pointer z-10">
              <input type="radio" name="mainReason" value={v} required={i === 0} className={choiceClass} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm text-white/80">En çok dinlediğin müzik türleri hangileri?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {["House","Afro House","Techno","Deep House","Pop","R&B","Türkçe Pop","Rap / Hip-Hop","Rock"].map((g) => (
            <label key={g} className="flex items-center gap-2 text-white/90 cursor-pointer z-10">
              <input type="checkbox" name="musicGenres" value={g} className={choiceClass} />
              <span>{g}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-white/90 cursor-pointer z-10">
            <input type="checkbox" onChange={(e) => setOtherGenreSelected(e.target.checked)} className={choiceClass} />
            <span>Diğer</span>
          </label>
        </div>
        {otherGenreSelected ? (
          <input name="musicGenres" placeholder="Diğer tür(ler)i yazın" className="mt-2 rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" />
        ) : null}
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm text-white/80">DJ setlerde seni en çok ne heyecanlandırır? *</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Güçlü basslar & yüksek enerji",
            "Melodik ve duygusal geçişler",
            "Sürpriz mash-up’lar",
            "Tanıdık hit parçalar",
            "Yeni ve keşfedilmemiş şarkılar",
          ].map((v, i) => (
            <label key={v} className="flex items-center gap-2 text-white/90 cursor-pointer z-10">
              <input type="radio" name="djExcitement" value={v} required={i === 0} className={choiceClass} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2">
        <legend className="text-sm text-white/80">Ulaşım için kendi aracın var mı? *</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-white/90 cursor-pointer z-10">
            <input type="radio" name="hasCar" value="yes" required className={choiceClass} />
            <span>Evet</span>
          </label>
          <label className="flex items-center gap-2 text-white/90 cursor-pointer z-10">
            <input type="radio" name="hasCar" value="no" className={choiceClass} />
            <span>Hayır</span>
          </label>
        </div>
      </fieldset>

      <label className="grid gap-2" htmlFor="instagram">
        <span className="text-sm text-white/80">Instagram kullanıcı adın *</span>
        <input id="instagram" name="instagram" required className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="@kullanici" />
      </label>

      <div className="grid gap-2">
        <label className="flex items-start gap-2 text-white/90 cursor-pointer z-10">
          <input type="checkbox" name="consentLocation" required className={`${choiceClass} mt-1`} />
          <span>Etkinlik özel olduğu için konumu paylaşmama ve gizlilik kuralını kabul ediyorum. *</span>
        </label>
        <label className="flex items-start gap-2 text-white/90 cursor-pointer z-10">
          <input type="checkbox" name="consentInstructions" required className={`${choiceClass} mt-1`} />
          <span>Etkinlik talimatlarını ve konum bilgisini yalnızca seçilen kişilerin alacağını kabul ediyorum. *</span>
        </label>
      </div>

      <label className="grid gap-2" htmlFor="referrer">
        <span className="text-sm text-white/80">Varsa referansınızın adı soyadı</span>
        <input id="referrer" name="referrer" className="rounded-xl bg-black border border-white/20 px-3 py-2 text-white placeholder:text-white/30 outline-none focus:ring-2 focus:ring-white/30" placeholder="Ad Soyad" />
      </label>

      <button type="submit" disabled={pending} className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 disabled:opacity-50">
        {pending ? "Gönderiliyor..." : "Başvuruyu Gönder"}
      </button>

      <div aria-live="polite" className="min-h-6 text-sm mt-1">
        {state && "ok" in state && state.ok && (
          <span className="text-green-400">Teşekkürler! Başvurun alındı.</span>
        )}
        {state && "error" in state && !state.ok && (
          <span className="text-red-400">Gönderilemedi: {state.error}</span>
        )}
      </div>
    </form>
  );
} 