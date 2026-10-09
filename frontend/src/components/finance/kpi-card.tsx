import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({ label, value, change, positive, icon: Icon, muted = false }: { label: string; value: string; change: string; positive: boolean; icon: LucideIcon; muted?: boolean }) {
  return <article className="rounded-xl border border-border-subtle bg-card p-5 card-shadow transition hover:border-border"><div className="flex items-start justify-between"><span className={cn("grid size-8 place-items-center rounded-lg", muted ? "bg-muted text-muted-foreground" : "bg-primary-soft text-primary")}><Icon className="size-4" /></span><span className={cn("flex items-center gap-0.5 text-xs font-semibold", positive ? "text-positive" : "text-negative")}>{positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{change}</span></div><p className="mt-5 text-[13px] font-medium text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-[-.035em] tabular-nums">{value}</p></article>;
}
