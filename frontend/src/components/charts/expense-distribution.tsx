"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { expenseDistribution } from "@/data/finance";
import { formatCurrency } from "@/lib/format";

export function ExpenseDistribution() {
  const total = expenseDistribution.reduce((sum, item) => sum + item.value, 0);
  return <section className="rounded-xl border border-border-subtle bg-card p-5 card-shadow sm:p-6"><div><h2 className="font-semibold tracking-tight">Expense distribution</h2><p className="mt-1 text-sm text-muted-foreground">How your money moved this month</p></div><div className="relative mt-2 h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", boxShadow: "0 8px 18px rgba(16,24,40,.08)" }} /><Pie data={expenseDistribution} dataKey="value" nameKey="name" innerRadius={62} outerRadius={84} paddingAngle={3} stroke="none">{expenseDistribution.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-xl font-semibold tracking-tight tabular-nums">{formatCurrency(total, "EUR", true)}</p><p className="text-xs text-muted-foreground">Total spend</p></div></div></div><div className="grid grid-cols-2 gap-x-3 gap-y-3 border-t border-border-subtle pt-4">{expenseDistribution.slice(0, 4).map((item) => <div key={item.name} className="min-w-0"><div className="flex items-center gap-1.5"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} /><span className="truncate text-xs text-muted-foreground">{item.name}</span></div><p className="mt-1 text-sm font-semibold tabular-nums">{formatCurrency(item.value, "EUR", true)}</p></div>)}</div></section>;
}
