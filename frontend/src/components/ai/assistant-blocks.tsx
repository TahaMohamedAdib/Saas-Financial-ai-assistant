import { AlertTriangle, ArrowDownRight, ArrowUpRight, Lightbulb } from "lucide-react";
import type { AssistantBlock } from "@/types/assistant";
import { cn } from "@/lib/utils";

export function AssistantBlocks({ blocks }: { blocks: AssistantBlock[] }) {
  return (
    <div className="mt-4 space-y-2.5">
      {blocks.map((block, index) => {
        if (block.type === "text") {
          return <p key={index} className="text-[15px] leading-7 text-muted-foreground">{block.content}</p>;
        }

        if (block.type === "metric") {
          return (
            <article key={index} className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 rounded-xl bg-[#f6f6f6] px-4 py-3.5 dark:bg-[#2a2a2a]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.1em] text-muted-foreground">{block.label}</p>
                <p className="mt-1.5 text-[22px] font-semibold tracking-[-.04em] tabular-nums">{block.value}</p>
              </div>
              <span className={cn("mb-1 inline-flex items-center gap-1 text-xs font-medium", block.direction === "up" ? "text-negative" : "text-positive")}>
                {block.direction === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {block.change}
              </span>
            </article>
          );
        }

        if (block.type === "warning") {
          return (
            <article key={index} className="flex gap-3 rounded-xl border border-warning/20 bg-warning/[.07] px-3.5 py-3 dark:bg-warning/[.09]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{block.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{block.detail}</p>
              </div>
            </article>
          );
        }

        if (block.type === "recommendation") {
          return (
            <article key={index} className="flex gap-3 rounded-xl border border-primary/15 bg-primary/[.055] px-3.5 py-3 dark:bg-primary/[.10]">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{block.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{block.detail}</p>
                <p className="mt-2 text-xs font-semibold text-primary">{block.impact}</p>
              </div>
            </article>
          );
        }

        return (
          <div key={index} className="overflow-hidden rounded-xl border border-border-subtle bg-card dark:border-white/[.08] dark:bg-[#292929]">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/75 text-muted-foreground dark:bg-white/[.045]"><tr>{block.headers.map((header) => <th key={header} className="px-3.5 py-2.5 font-medium">{header}</th>)}</tr></thead>
              <tbody className="divide-y divide-border-subtle dark:divide-white/[.08]">{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, valueIndex) => <td key={valueIndex} className="px-3.5 py-2.5">{value}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
