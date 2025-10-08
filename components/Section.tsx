import { ReactNode } from "react";

export default function Section({
  title,
  description,
  children,
  backgroundImageUrl,
  backgroundDimClass,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  backgroundImageUrl?: string;
  backgroundDimClass?: string; // tailwind classes to dim/tint image
}) {
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">{title}</h2>
          {description ? (
            typeof description === "string" ? (
              <p className="mt-2 text-white/60 max-w-2xl">{description}</p>
            ) : (
              <div className="mt-2 text-white/60 max-w-2xl space-y-3">{description}</div>
            )
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5 relative isolate">
          {/* Optional background image at the very back of the section content */}
          {backgroundImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={backgroundImageUrl}
                alt=""
                className={`absolute inset-0 -z-10 h-full w-full object-cover ${backgroundDimClass || "brightness-[0.45]"}`}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
            </>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
