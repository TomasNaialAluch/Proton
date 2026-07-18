"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface BpmRange {
  min: number;
  max: number;
}

interface BpmRangeFilterProps {
  /** Full selectable bounds (e.g. the min/max BPM actually present in the current list). */
  bounds: BpmRange;
  /** Current selection — `null` means "no filter applied" (full bounds). */
  value: BpmRange | null;
  onChange: (value: BpmRange | null) => void;
}

/**
 * Dual-handle BPM range slider + editable number fields, in a popover —
 * same open/close mechanics as FilterDropdown (controlled `open` state +
 * a real button, not native `<details>` — that was tried first, but its
 * browser-native toggle-on-click behavior fought with the "X to clear"
 * icon's own click handler). Filters live as you drag or type; there's no
 * separate "Apply" step.
 *
 * Deliberately not what Beatport does: their BPM filter opens a modal with
 * two plain number boxes (both starting at "0", no sense of where that
 * sits in the label's actual BPM range) and requires clicking "Aplicar"
 * before anything happens. This version shows the live range visually,
 * updates the result count as you drag, and can still be typed precisely
 * via the number inputs underneath the slider — dragging for a quick feel,
 * typing for an exact value, both write to the same state.
 *
 * Shared between Discover and a label's "view all releases" list.
 */
export default function BpmRangeFilter({ bounds, value, onChange }: BpmRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = value ?? bounds;
  const isActive = value !== null;

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const clamp = (n: number) => Math.min(Math.max(n, bounds.min), bounds.max);

  const setMin = (next: number) => {
    const min = Math.min(clamp(next), current.max);
    onChange({ min, max: current.max });
  };
  const setMax = (next: number) => {
    const max = Math.max(clamp(next), current.min);
    onChange({ min: current.min, max });
  };

  const span = bounds.max - bounds.min || 1;
  const minPct = ((current.min - bounds.min) / span) * 100;
  const maxPct = ((current.max - bounds.min) / span) * 100;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors
          ${isActive
            ? "border-accent bg-accent/10 text-accent"
            : "border-[var(--color-border)] bg-surface text-text-secondary hover:text-text-primary"
          }`}
      >
        <span className="whitespace-nowrap">
          {isActive ? `${current.min}–${current.max} BPM` : "BPM"}
        </span>
        {isActive ? (
          <X
            size={12}
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
          />
        ) : (
          <ChevronDown size={12} className="shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-64 rounded-xl border border-[var(--color-border)]
          bg-surface shadow-xl p-4">
          <div className="flex items-center justify-between mb-3 text-xs text-text-secondary">
            <span>{current.min} BPM</span>
            <span>{current.max} BPM</span>
          </div>

          {/* Dual-handle slider — two overlapping range inputs sharing one track. */}
          <div className="relative h-4 flex items-center mb-4">
            <div className="absolute inset-x-0 h-1 rounded-full bg-[var(--color-border)]" />
            <div
              className="absolute h-1 rounded-full bg-accent"
              style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
            />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              value={current.min}
              onChange={(e) => setMin(Number(e.target.value))}
              aria-label="Minimum BPM"
              className="range-slider-thumb absolute inset-x-0 w-full"
            />
            <input
              type="range"
              min={bounds.min}
              max={bounds.max}
              value={current.max}
              onChange={(e) => setMax(Number(e.target.value))}
              aria-label="Maximum BPM"
              className="range-slider-thumb absolute inset-x-0 w-full"
            />
          </div>

          {/* Precise numeric entry, synced with the slider. */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={current.min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--color-border)] bg-background px-2 py-1.5 text-xs
                text-text-primary outline-none focus:border-accent/50 transition-colors"
            />
            <span className="shrink-0 text-xs text-text-secondary">–</span>
            <input
              type="number"
              value={current.max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full rounded-lg border border-[var(--color-border)] bg-background px-2 py-1.5 text-xs
                text-text-primary outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {isActive && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="mt-3 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
}
