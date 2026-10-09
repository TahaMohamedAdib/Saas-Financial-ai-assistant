import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div>{eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.12em] text-primary">{eyebrow}</p>}<h1 className="text-[30px] font-semibold leading-9 tracking-[-.045em] sm:text-[32px]">{title}</h1><p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p></div>{actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}</div>;
}
