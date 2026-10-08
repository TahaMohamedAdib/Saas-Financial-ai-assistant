import { Building2, ChevronRight, RefreshCw } from "lucide-react";
import type { Account } from "@/types/finance";
import { formatCurrency } from "@/lib/format";

export function AccountCard({ account }: { account: Account }) {
  return <article className="group rounded-xl border border-border-subtle bg-card p-5 card-shadow transition-colors hover:border-border"><div className="flex items-start justify-between"><span className="grid size-9 place-items-center rounded-lg text-white" style={{ backgroundColor: account.color }}><Building2 className="size-4" /></span><button aria-label={`Open ${account.name}`} className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-hover-surface group-hover:opacity-100"><ChevronRight className="size-4" /></button></div><div className="mt-5"><p className="text-sm font-medium">{account.name}</p><p className="mt-1 text-xs text-muted-foreground">{account.institution} · {account.ending}</p><p className="mt-4 text-2xl font-semibold tracking-[-.035em] tabular-nums">{formatCurrency(account.balance)}</p></div><div className="mt-5 flex items-center justify-between border-t border-border-subtle pt-4 text-xs text-muted-foreground"><span>{account.type}</span><span className="flex items-center gap-1"><RefreshCw className="size-3" />{account.lastSynced}</span></div></article>;
}
