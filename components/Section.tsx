import { ReactNode } from "react";

export default function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
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
        <div className="relative isolate rounded-2xl border border-white/15 bg-white/5/50 backdrop-blur-xl p-4 md:p-6">
          {/* faint top light */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 bg-gradient-to-b from-white/10 to-transparent blur-2xl" />
          {children}
        </div>
      </div>
    </section>
  );
}
