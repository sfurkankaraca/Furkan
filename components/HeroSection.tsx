"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection({ heroImages }: { heroImages: string[] }) {
  const images = heroImages.length > 0 ? heroImages : ["/1.JPG"];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="relative min-h-[90vh] flex flex-col">
      <div className="absolute inset-0">
        {/* Mobile: full bleed photo */}
        <div className="absolute inset-0 lg:hidden overflow-hidden">
          <Image
            src={images[current]!}
            alt="NOQT DJ Akademi"
            fill
            className="object-cover object-center transition-opacity duration-700"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Desktop: split — warm white left, photo right */}
        <div className="hidden lg:grid absolute inset-0 grid-cols-2">
          <div className="bg-background" />
          <div className="relative overflow-hidden">
            <Image
              src={images[current]!}
              alt="NOQT DJ Akademi"
              fill
              className="object-cover object-center transition-opacity duration-700"
              priority
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent w-2/5 z-10" />
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-noqt-lime" : "bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Fotoğraf ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-1 items-center">
        <div className="container mx-auto max-w-7xl px-6 py-28 lg:py-36 lg:w-1/2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 lg:text-muted-foreground mb-8">
            Kayseri · Nevşehir
          </p>
          <img
            src="/noqt-logo-transparent.png"
            alt="NOQT"
            className="h-20 md:h-28 w-auto object-contain invert lg:invert-0 mb-2"
          />
          <h1 className="text-5xl font-bold tracking-tight text-white lg:text-foreground md:text-6xl leading-tight">
            DJ{" "}
            <span className="relative inline-block">
              <span className="absolute inset-x-[-0.12em] bottom-[0.08em] hidden h-[0.42em] -rotate-1 rounded-sm bg-noqt-lime lg:block" aria-hidden />
              <span className="relative text-noqt-lime lg:text-foreground">Akademi</span>
            </span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/75 lg:text-muted-foreground max-w-md">
            Pratik odaklı DJ ve müzik prodüksiyon eğitimi.
            Kayseri merkezli, sahneye hazırlayan bir akademi.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="https://labs.noqt.club/register"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-noqt-lime px-7 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(221,247,106,0.45)] transition hover:brightness-95"
            >
              Detaylar için kaydol
              <ArrowRight className="size-4" aria-hidden />
            </a>
            <a
              href="https://wa.me/905417997973"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 lg:border-border bg-white/10 lg:bg-muted/50 px-7 py-3 text-sm font-medium text-white lg:text-foreground backdrop-blur-sm transition hover:bg-white/20 lg:hover:bg-muted"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <Link
              href="/#fiyatlar"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 lg:border-border bg-white/10 lg:bg-muted/50 px-7 py-3 text-sm font-medium text-white lg:text-foreground backdrop-blur-sm transition hover:bg-white/20 lg:hover:bg-muted"
            >
              Fiyatlar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
