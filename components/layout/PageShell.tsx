import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  withGlow = false,
}: {
  children: ReactNode;
  className?: string;
  withGlow?: boolean;
}) {
  return (
    <div className={cn("relative overflow-x-clip overflow-y-visible", className)}>
      {withGlow ? (
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[min(100%,56rem)] -translate-x-1/2 rounded-full bg-gradient-to-b from-fuchsia-500/10 via-purple-500/8 to-transparent blur-3xl"
          aria-hidden
        />
      ) : null}
      <div className="container relative mx-auto max-w-7xl min-w-0 px-4 py-12 md:py-16">{children}</div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="grid gap-5 max-w-3xl">
      {eyebrow ? <div>{eyebrow}</div> : null}
      <div className="grid gap-3">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl md:leading-tight text-foreground">{title}</h1>
        {description ? (
          <div className="text-base leading-relaxed text-muted-foreground md:text-lg">{description}</div>
        ) : null}
      </div>
      {actions ? <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
    </header>
  );
}

export function PageBlockTitle({
  title,
  description,
  sectionId,
}: {
  title: string;
  description?: ReactNode;
  sectionId?: string;
}) {
  return (
    <div className="mb-6 grid gap-2 max-w-2xl">
      <h2 id={sectionId} className="text-xl font-semibold tracking-tight md:text-2xl text-foreground">{title}</h2>
      {description ? <div className="text-sm text-muted-foreground md:text-base">{description}</div> : null}
    </div>
  );
}

export function ContentCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 md:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
