"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { usePlayerAudio } from "./PlayerAudioContext";
import {
  sortYoutubeQualityIds,
  youtubeQualityLabel,
} from "@/lib/player/youtubeQualityLabels";

type Variant = "bar" | "compact";

export default function PlayerYouTubeQualityControl({
  variant = "bar",
}: {
  variant?: Variant;
}) {
  const menuId = useId();
  const audioApi = usePlayerAudio();
  const qc = audioApi.youtubeQualityControls;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const optionIds = useMemo(() => {
    if (!qc) return [];
    const base = qc.availableQualityIds;
    const pref = qc.preferredQualityId;
    if (pref && !base.includes(pref)) {
      return sortYoutubeQualityIds([...base, pref]);
    }
    return base;
  }, [qc]);

  useEffect(() => {
    if (!open) return;
    const closeIfOutside = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeIfOutside, true);
    document.addEventListener("touchstart", closeIfOutside, { passive: true, capture: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", closeIfOutside, true);
      document.removeEventListener("touchstart", closeIfOutside, { capture: true });
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!qc) return null;

  const actualLabel = youtubeQualityLabel(qc.actualQualityId);
  const prefLabel = qc.preferredQualityId
    ? youtubeQualityLabel(qc.preferredQualityId)
    : "Auto";
  const title =
    prefLabel === actualLabel || !qc.preferredQualityId
      ? `Playing: ${actualLabel}. Tap to change quality.`
      : `Preference: ${prefLabel}. Playing: ${actualLabel}. Tap to change.`;

  const choose = (id: string) => {
    qc.setPreferredQualityId(id);
    setOpen(false);
  };

  const menu = (
    <div
      id={menuId}
      role="listbox"
      aria-label="Video quality"
      className="absolute bottom-full right-0 z-[60] mb-1 min-w-[9rem] overflow-hidden rounded-lg border border-[var(--color-border)] py-1 shadow-lg"
      style={{
        background: "var(--color-surface)",
        backdropFilter: "blur(12px)",
      }}
    >
      <button
        type="button"
        role="option"
        aria-selected={!qc.preferredQualityId}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-primary)] hover:bg-white/5"
        onClick={() => choose("")}
      >
        <span>Auto</span>
        {!qc.preferredQualityId ? (
          <Check size={14} className="shrink-0 text-[var(--color-accent)]" aria-hidden />
        ) : null}
      </button>
      {optionIds.map((id) => (
        <button
          key={id}
          type="button"
          role="option"
          aria-selected={qc.preferredQualityId === id}
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs text-[var(--color-text-primary)] hover:bg-white/5"
          onClick={() => choose(id)}
        >
          <span>{youtubeQualityLabel(id)}</span>
          {qc.preferredQualityId === id ? (
            <Check size={14} className="shrink-0 text-[var(--color-accent)]" aria-hidden />
          ) : null}
        </button>
      ))}
    </div>
  );

  const triggerClassBar =
    "flex shrink-0 items-center tabular-nums transition-colors " +
    "max-md:min-h-10 max-md:min-w-[2.5rem] max-md:justify-center max-md:rounded-md max-md:border-0 max-md:bg-transparent max-md:px-1 max-md:py-1 max-md:text-xs max-md:text-[var(--color-text-primary)] max-md:active:bg-white/10 " +
    "md:max-w-[6.5rem] md:justify-between md:gap-1 md:rounded-md md:border md:border-[var(--color-border)] md:bg-transparent md:px-2 md:py-1 md:text-xs md:text-[var(--color-text-primary)] md:hover:bg-white/5";

  const triggerClass =
    variant === "compact"
      ? "flex w-full items-center justify-between gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-background)] px-2.5 py-2 text-xs text-[var(--color-text-primary)] hover:bg-white/5"
      : triggerClassBar;

  const trigger = (
    <button
      type="button"
      className={triggerClass}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={open ? menuId : undefined}
      aria-label={`Video quality, playing ${actualLabel}. Open menu.`}
      title={title}
      onClick={() => setOpen((o) => !o)}
    >
      <span className="min-w-0 truncate max-md:text-center">{actualLabel}</span>
      <ChevronDown
        size={variant === "compact" ? 16 : 14}
        className={`hidden shrink-0 text-[var(--color-text-secondary)] transition-transform duration-150 md:block ${open ? "md:rotate-180" : ""}`}
        aria-hidden
      />
    </button>
  );

  if (variant === "compact") {
    return (
      <div
        ref={rootRef}
        className="relative w-full min-w-0 border-t border-[var(--color-border)] px-3 py-2"
      >
        {trigger}
        {open ? menu : null}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative flex min-w-0 shrink-0 items-center max-md:mr-0.5">
      <span className="mr-1 hidden whitespace-nowrap text-xs text-[var(--color-text-secondary)] md:inline">
        Quality
      </span>
      {trigger}
      {open ? menu : null}
    </div>
  );
}
