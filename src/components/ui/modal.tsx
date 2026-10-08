"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps { open: boolean; onClose: () => void; title: string; description?: string; children: React.ReactNode; className?: string; }

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    if (open) { document.addEventListener("keydown", closeOnEscape); return () => document.removeEventListener("keydown", closeOnEscape); }
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#101828]/35 p-4 backdrop-blur-[2px] sm:items-center" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className={cn("w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150", className)} onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="modal-title" className="text-lg font-semibold tracking-tight">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div><button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"><X className="size-4" /></button></div>
        {children}
      </section>
    </div>
  );
}
