"use client";

import { useState } from "react";
import { BellRing, CheckCheck, CircleAlert, FileText, ShieldAlert, Sparkles } from "lucide-react";
import { notifications as initialNotifications } from "@/data/finance";
import { relativeTime } from "@/lib/format";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";

const icons = { budget: CircleAlert, security: ShieldAlert, report: FileText, insight: Sparkles };
export function NotificationsScreen() {
  const [items, setItems] = useState(initialNotifications);
  const markAll = () => setItems((current) => current.map((item) => ({ ...item, read: true })));
  const markOne = (id: string) => setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  const unread = items.filter((item) => !item.read).length;
  return <div className="space-y-6 lg:space-y-8"><PageHeader eyebrow="Stay informed" title="Notifications" description={unread ? `${unread} updates need your attention.` : "You are all caught up."} actions={<button onClick={markAll} disabled={!unread} className="inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"><CheckCheck className="size-4" />Mark all as read</button>} /><section className="overflow-hidden rounded-2xl border bg-card shadow-[0_2px_10px_rgba(23,32,51,.025)]"><div className="divide-y">{items.map((item) => { const Icon = icons[item.category]; return <button key={item.id} onClick={() => markOne(item.id)} className={cn("flex w-full gap-4 px-5 py-5 text-left transition hover:bg-muted/40 sm:px-6", !item.read && "bg-primary/[.025]")}><span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", item.category === "budget" ? "bg-amber-500/10 text-amber-600" : item.category === "security" ? "bg-rose-500/10 text-rose-600" : item.category === "report" ? "bg-primary/10 text-primary" : "bg-emerald-500/10 text-emerald-600")}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="font-medium">{item.title}</span>{!item.read && <span className="size-1.5 rounded-full bg-primary" />}</span><span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.body}</span><span className="mt-2 block text-xs text-muted-foreground">{relativeTime(item.createdAt)}</span></span></button>; })}</div></section><section className="rounded-2xl border border-dashed bg-muted/20 p-5 text-center"><BellRing className="mx-auto size-5 text-muted-foreground" /><p className="mt-2 text-sm font-medium">Notification preferences</p><a href="/settings" className="mt-1 text-sm text-primary hover:underline">Choose how Ledgerly keeps you updated</a></section></div>;
}
