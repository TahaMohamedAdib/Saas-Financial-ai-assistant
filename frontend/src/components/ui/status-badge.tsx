import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: "completed" | "pending" | "failed" }) {
  const variants = { completed: "bg-positive/10 text-positive", pending: "bg-warning/10 text-warning", failed: "bg-negative/10 text-negative" };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium capitalize", variants[status])}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}
