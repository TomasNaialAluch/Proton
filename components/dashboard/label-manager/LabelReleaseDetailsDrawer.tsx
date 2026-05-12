"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import IssueBadge from "@/components/ui/IssueBadge";
import type { LabelCatalogRelease } from "@/lib/mock/label-manager/labelCatalog";

function statusTone(status: LabelCatalogRelease["status"]) {
  switch (status) {
    case "live":
      return "success" as const;
    case "delivered":
      return "info" as const;
    case "scheduled":
      return "neutral" as const;
    case "qa":
      return "warning" as const;
    case "draft":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

export default function LabelReleaseDetailsDrawer({
  open,
  release,
  onClose,
}: {
  open: boolean;
  release: LabelCatalogRelease | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !release) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close drawer"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Release details"
        className="relative z-[121] w-full max-w-lg rounded-t-2xl border border-[var(--color-border)] bg-background shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="min-w-0 truncate font-display text-base font-bold tracking-tight text-text-primary">
                {release.title}
              </h2>
              <StatusBadge tone={statusTone(release.status)}>{release.status}</StatusBadge>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              UPC {release.upc} · {release.releaseDate} · {release.tracks.length} track
              {release.tracks.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[min(75dvh,32rem)] overflow-y-auto px-5 py-4 space-y-4">
          {release.issues.length > 0 && (
            <section className="rounded-xl border border-[var(--color-border)] bg-surface p-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Issues
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {release.issues.map((i) => (
                  <IssueBadge
                    key={`${i.code}-${i.label}`}
                    severity={i.severity === "blocker" ? "blocker" : "warn"}
                  >
                    {i.label}
                  </IssueBadge>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-xl border border-[var(--color-border)] bg-surface p-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Tracklist
            </h3>
            <ul className="mt-2 space-y-2">
              {release.tracks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-background/40 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{t.title}</p>
                    <p className="mt-0.5 text-[11px] text-text-secondary truncate">
                      ISRC {t.isrc} · {t.genre}
                    </p>
                  </div>
                  <span className="text-xs tabular-nums text-text-secondary">
                    {Math.floor(t.durationSec / 60)}:{String(t.durationSec % 60).padStart(2, "0")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-[var(--color-border)] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-accent/10 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
