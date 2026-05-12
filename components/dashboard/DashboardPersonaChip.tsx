"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Layers, X, User, Building2, Info } from "lucide-react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { LABEL_MANAGER_ENTRY, PRODUCER_ENTRY } from "@/lib/dashboard/dashboardShellRouting";

/**
 * Fixed chip (orange) — explains which prototype shell is active and opens a modal
 * listing Artist / producer vs Label manager for testers.
 */
export default function DashboardPersonaChip() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const view = usePrototypeViewStore((s) => s.view);
  const setView = usePrototypeViewStore((s) => s.setView);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const modal =
    mounted &&
    open &&
    createPortal(
      <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:items-center">
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          aria-label="Close dialog"
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="persona-modal-title"
          className="relative z-[111] w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-background shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Layers size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2
                  id="persona-modal-title"
                  className="font-display text-base font-bold tracking-tight text-text-primary"
                >
                  Prototype views
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Preview a different workspace. Only the <span className="font-semibold text-text-primary">Switch</span>{" "}
                  button changes the shell — tapping the rest of a card does nothing.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 rounded-lg p-2 text-text-secondary hover:bg-[var(--color-border)] hover:text-text-primary"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[min(70dvh,28rem)] overflow-y-auto px-5 py-4 space-y-3">
            <div
              className="flex gap-2.5 rounded-xl border border-accent/25 bg-accent/10 px-3 py-2.5 text-xs leading-snug text-text-primary"
              role="note"
            >
              <Info size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <p>
                To change views, tap <span className="font-semibold">Switch to…</span> on the workspace you want. The
                highlighted card shows what is active now.
              </p>
            </div>

            <article
              className={`rounded-xl border-2 p-4 transition-colors cursor-default ${
                view === "producer"
                  ? "border-accent bg-accent/5"
                  : "border-[var(--color-border)] bg-surface"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <User size={18} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-primary">Artist / producer</h3>
                    {view === "producer" ? (
                      <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setView("producer");
                          setOpen(false);
                          router.push(PRODUCER_ENTRY);
                        }}
                        className="cursor-pointer rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent/20"
                      >
                        Switch to producer
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                    Personal dashboard: profile, royalties, contracts, performance, and producer
                    tools (mock data).
                  </p>
                </div>
              </div>
            </article>

            <article
              className={`rounded-xl border p-4 transition-colors cursor-default ${
                view === "label_manager"
                  ? "border-accent bg-accent/5"
                  : "border-[var(--color-border)] bg-surface"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-border)] text-text-secondary">
                  <Building2 size={18} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-primary">Label manager</h3>
                    {view === "label_manager" ? (
                      <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setView("label_manager");
                          setOpen(false);
                          router.push(LABEL_MANAGER_ENTRY);
                        }}
                        className="cursor-pointer rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent/20"
                      >
                        Switch to label manager
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
                    Would cover roster, catalog, label-wide reporting, and release ops across
                    artists — a separate shell from the producer view (prototype scaffolding).
                  </p>
                </div>
              </div>
            </article>
          </div>

          <div className="border-t border-[var(--color-border)] px-5 py-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Got it
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Prototype views — tap Switch on the other card to change workspace."
        className="fixed right-4 z-[46] top-[4.75rem] inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-accent shadow-md ring-1 ring-accent/25 backdrop-blur-sm transition hover:bg-accent/30 hover:ring-accent/40 lg:top-4"
      >
        <span className="max-w-[10rem] truncate sm:max-w-none">
          {view === "producer" ? "Producer view" : "Label manager view"}
        </span>
        <Layers size={12} className="shrink-0 opacity-90" aria-hidden />
      </button>
      {modal}
    </>
  );
}
