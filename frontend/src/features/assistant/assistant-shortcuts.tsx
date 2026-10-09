import type { LucideIcon } from "lucide-react";
import { Bell, ChartNoAxesCombined, Landmark, ReceiptText, Settings2, Target, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type AssistantShortcut = {
  label: string;
  question: string;
  icon: LucideIcon;
};

// Chaque raccourci correspond à une section réelle de Ledgerly et pose une question prête à envoyer.
const assistantShortcuts: AssistantShortcut[] = [
  { label: "Transactions", question: "Comment consulter, filtrer et catégoriser mes transactions dans Ledgerly ?", icon: ReceiptText },
  { label: "Comptes", question: "Où puis-je voir les soldes et l’activité de mes comptes ?", icon: Landmark },
  { label: "Budgets", question: "Comment créer ou modifier un budget mensuel dans Ledgerly ?", icon: Target },
  { label: "Analyses", question: "Que puis-je analyser dans la section Analyses ?", icon: ChartNoAxesCombined },
  { label: "Rapports", question: "Comment créer et exporter un rapport financier ?", icon: FileText },
  { label: "Alertes", question: "Comment gérer mes alertes et notifications financières ?", icon: Bell },
  { label: "Paramètres", question: "Comment modifier les paramètres de mon espace de travail ?", icon: Settings2 },
];

type AssistantShortcutsProps = {
  disabled?: boolean;
  onSelect: (question: string) => void;
};

export function AssistantShortcuts({ disabled = false, onSelect }: AssistantShortcutsProps) {
  return (
    <section aria-label="Raccourcis des fonctionnalités Ledgerly" className="mb-2.5">
      <div className="mb-1.5 flex items-center justify-between px-1">
        <p className="text-[11px] font-medium text-muted-foreground">Raccourcis Ledgerly</p>
        <span className="text-[10px] text-muted-foreground/80">Questions sur les fonctionnalités</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {assistantShortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(shortcut.question)}
              title={shortcut.question}
              aria-label={shortcut.question}
              className={cn(
                "group flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-black/[.08] bg-white px-2.5 text-[11px] font-medium text-muted-foreground shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/[.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[.10] dark:bg-[#2a2a2a] dark:hover:border-primary/50 dark:hover:bg-primary/10",
              )}
            >
              <Icon aria-hidden="true" className="size-3.5 text-primary/80 transition-colors group-hover:text-primary" />
              <span>{shortcut.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
