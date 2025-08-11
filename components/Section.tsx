import { ReactNode } from "react";

export default function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-2 text-white/60 max-w-2xl">{description}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-white/10 p-4 md:p-6 bg-white/5">
          {children}
        </div>
      </div>
    </section>
  );
}
