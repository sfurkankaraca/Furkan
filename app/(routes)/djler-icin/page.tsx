import type { Metadata } from "next";
import Link from "next/link";
import { ClubRadioShell } from "@/components/club-radio/ClubRadioShell";
import { ClubRadioHeader } from "@/components/club-radio/ClubRadioHeader";
import { ClubRadioFooter } from "@/components/club-radio/ClubRadioFooter";
import { DjApplicationForm } from "@/components/club-radio/DjApplicationForm";
import { FaqAccordion } from "@/components/club-radio/FaqAccordion";
import { Photo } from "@/components/club-radio/Photo";
import { CONTACT_EMAIL, SET_VIDEOS, YOUTUBE_CHANNEL_URL, youtubeWatchUrl } from "@/lib/club-radio/content";

export const metadata: Metadata = {
  title: "noqt'ta çal — DJ'ler için | noqt club radio",
  description:
    "Setini gönder, dinleyelim; stüdyoya, yayına ya da bir noqt gecesine çağıralım. Dolu bir oda, yayınlanan set, ortak çekim günleri ve bir DJ topluluğu.",
  alternates: { canonical: "/djler-icin" },
  openGraph: {
    title: "noqt'ta çal — DJ'ler için",
    description: "Setini gönder, dinleyelim; stüdyoya, yayına ya da bir geceye çağıralım.",
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/club-radio/studyo-b2b.jpg", width: 1800, height: 1013, alt: "noqt stüdyosunda iki DJ birlikte çalıyor" }],
  },
};

const SECTION = "mx-auto max-w-[1360px] px-6";
const H2 = "cr-display cr-sec-title m-0";

const OFFERS = [
  { n: "01", title: "Dolu bir oda", text: "Geceyi biz düzenliyoruz, tanıtımı biz yapıyoruz. Sen yalnızca setine odaklan." },
  { n: "02", title: "Setin yayında", text: "Stüdyoda video ve ses kaydını alıyoruz; YouTube ve SoundCloud'da noqt club radio adıyla yayınlıyoruz." },
  { n: "03", title: "Ortak çekim günleri", text: "Presskit fotoğrafı ve tanıtım videosu; stüdyo ve ekip masrafı katılan DJ'lere bölünüyor." },
  { n: "04", title: "Bir topluluk", text: "WhatsApp grupları, aylık buluşmalar, birbirine paslanan işler ve b2b setler." },
];

const STEPS = [
  { title: "Setini gönder", text: "SoundCloud, YouTube ya da Mixcloud bağlantısı yeterli. 30–60 dakikalık, kendi seçkin olan bir set." },
  { title: "Dinliyoruz", text: "Her başvuruyu ekip dinliyor ve WhatsApp'tan sana dönüyoruz." },
  { title: "Seni çağırıyoruz", text: "Önce bir stüdyo oturumu, sonra bir noqt gecesinin lineup'ı." },
];

const FAQ = [
  { q: "Set göndermek ücretli mi?", a: "Hayır, başvurmak ücretsiz." },
  { q: "Hiç sahneye çıkmadım, başvurabilir miyim?", a: "Evet. Setini dinleyip uygun görürsek önce stüdyo oturumuyla başlıyoruz." },
  { q: "Nasıl bir set göndermeliyim?", a: "Kendi seçkin olan, 30–60 dakikalık, kesintisiz bir kayıt. Canlı bir gecenin kaydı da olur." },
  { q: "Ne kadar sürede dönüş yapıyorsunuz?", a: "Setini dinledikten sonra WhatsApp üzerinden yazıyoruz." },
];

const SET_TITLES = ["House Mix · YSEIKO, Furkan Karaca, Aslound", "Halloween Nu Disco Mix · YSEİKO, Furkan Karaca, Mahmut Can"];

export default function DjlerIcinPage() {
  return (
    <ClubRadioShell>
      <ClubRadioHeader current="djler" />
      <main>
        <section id="ust" className="cr-on-lime bg-[#DDF76A] text-[#0A0A0A]">
          <div className="mx-auto max-w-[1360px] px-6 pb-20 pt-6">
            <p className="cr-mono m-0 mb-2 text-[14px] uppercase tracking-[1.5px]">DJ&apos;ler için</p>
            <h1 className="cr-display cr-wm cr-wm-dj m-0">
              noqt&apos;ta
              <br />
              çal
            </h1>
            <div className="mt-12 flex flex-wrap items-end gap-x-12 gap-y-8">
              <div className="flex flex-[1_1_420px] flex-col gap-6">
                <p className="cr-display m-0 max-w-[560px] text-[24px] min-[560px]:text-[30px]" style={{ fontWeight: 800, fontStretch: "100%", lineHeight: 1.15 }}>
                  Setini gönder. Dinleyelim; stüdyoya, yayına ya da bir geceye çağıralım.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="#basvuru" className="cr-pill cr-pill-dark px-[26px]">Setimi gönder</Link>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="cr-pill cr-pill-line-dark px-[26px]">Daha önce çaldım</a>
                </div>
              </div>
              <figure className="m-0 flex min-w-0 flex-[1_1_520px] flex-col gap-2">
                <Photo src="/club-radio/studyo-b2b.jpg" alt="noqt stüdyosunda iki DJ birlikte çalıyor, arkada kalabalık" sizes="(max-width: 900px) 100vw, 50vw" position="45% 40%" priority className="aspect-[16/10]" />
                <figcaption className="cr-mono text-[12px] uppercase tracking-[1px]">House Mix at noqtastudio</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section aria-labelledby="sunduklarimiz" className={`${SECTION} pt-28`}>
          <h2 id="sunduklarimiz" className={`${H2} mb-9`}>Ne sunuyoruz</h2>
          <div className="flex flex-wrap gap-7">
            <div className="relative min-h-[320px] min-w-0 flex-[1_1_380px] overflow-hidden rounded-[14px] min-[901px]:min-h-[420px]">
              <Photo src="/club-radio/gece-dj-masasi.jpg" alt="Bir noqt gecesinde DJ masasının çevresinde dans eden kalabalık" fill sizes="(max-width: 900px) 100vw, 40vw" />
            </div>
            <div className="grid min-w-0 flex-[1.4_1_520px] gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]">
              {OFFERS.map((o) => (
                <div key={o.n} className="flex flex-col gap-2.5 rounded-[14px] border border-[#2A2A2A] bg-[#161616] p-[26px]">
                  <span className="cr-mono text-[13px] text-[#DDF76A]">{o.n}</span>
                  <h3 className="cr-display m-0 text-[26px] leading-[1.05]" style={{ fontStretch: "112%", lineHeight: 1.05 }}>{o.title}</h3>
                  <p className="m-0 text-[#C9CBC3]">{o.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="nasil" className={`${SECTION} pt-28`}>
          <h2 id="nasil" className={`${H2} mb-9`}>Nasıl işliyor</h2>
          <ol className="m-0 grid list-none gap-7 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3 border-t-2 border-[#DDF76A] pt-5">
                <span aria-hidden="true" className="cr-display cr-step-num text-[#DDF76A]" style={{ fontStretch: "125%", lineHeight: 0.9 }}>{i + 1}</span>
                <h3 className="m-0 text-[24px] font-semibold">{s.title}</h3>
                <p className="m-0 text-[#C9CBC3]">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="kanit" className={`${SECTION} pt-28`}>
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="kanit" className={H2}>Stüdyodan setler</h2>
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="cr-sec-link">YouTube kanalı ↗</a>
          </div>
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {SET_VIDEOS.map((v, i) => (
              <a key={v.id} href={youtubeWatchUrl(v.id)} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-3 no-underline">
                <span className="relative block aspect-video w-full overflow-hidden rounded-xl">
                  <Photo src={v.image} alt="" fill bw={false} sizes="(max-width: 900px) 100vw, 50vw" />
                  <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex size-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#DDF76A] text-[#0A0A0A]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                  </span>
                </span>
                <span className="text-[19px] font-bold">{SET_TITLES[i] ?? v.title}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="basvuru" aria-labelledby="basvuru-baslik" className={`${SECTION} scroll-mt-4 pt-28`}>
          <div className="flex flex-wrap gap-x-14 gap-y-10">
            <div className="flex flex-[1_1_340px] flex-col gap-[18px]">
              <h2 id="basvuru-baslik" className={H2}>Set gönder</h2>
              <p className="m-0 max-w-[420px] text-[17px] text-[#C9CBC3]">Birkaç bilgi ve dinleyebileceğimiz bir set. Gerisini birlikte konuşuruz.</p>
              <p className="m-0 mt-2 text-[15px] text-[#C9CBC3]">
                Daha önce noqt&apos;ta çaldıysan formu doldurmana gerek yok:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="cr-ul">{CONTACT_EMAIL}</a>
              </p>
            </div>
            <DjApplicationForm />
          </div>
        </section>

        <section aria-labelledby="sss" className={`${SECTION} pt-28`}>
          <div className="flex flex-wrap gap-x-14 gap-y-8">
            <h2 id="sss" className={`${H2} flex-[1_1_340px]`}>Sorular</h2>
            <FaqAccordion items={FAQ} />
          </div>
        </section>

        <section aria-labelledby="academy" className={`${SECTION} pt-28`}>
          <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-5 rounded-2xl border border-[#2A2A2A] bg-[#161616] p-6 min-[560px]:p-10">
            <div className="flex flex-[1_1_480px] flex-col gap-2.5">
              <span className="cr-eyebrow text-[#6EC0F3]">NOQT Academy</span>
              <h2 id="academy" className="cr-display m-0 text-[28px] min-[560px]:text-[36px]">Henüz başlamadın mı?</h2>
              <p className="m-0 text-[#C9CBC3]">DJ&apos;liği sıfırdan öğren; hazır olduğunda setini gönder.</p>
            </div>
            <a href="https://academy.noqt.club" className="cr-pill flex-none border-[1.5px] border-[#6EC0F3] px-[26px] text-[#6EC0F3]">academy.noqt.club ↗</a>
          </div>
        </section>
      </main>
      <div className="pt-12">
        <ClubRadioFooter />
      </div>
    </ClubRadioShell>
  );
}
