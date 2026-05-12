"use client";

import { useMemo, type ReactNode } from "react";
import { Layers, User, X } from "lucide-react";
import { mockLabels } from "@/lib/mock/labels";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";

function ChipIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center text-text-secondary [&>svg]:block">
      {children}
    </span>
  );
}

function Chip({
  icon,
  label,
  onClear,
}: {
  icon: ReactNode;
  label: string;
  onClear?: () => void;
}) {
  return (
    <span className="inline-flex min-h-8 max-w-full items-center gap-2 rounded-full border border-[var(--color-border)] bg-surface py-1 pl-2.5 pr-1.5 text-[11px] font-semibold text-text-primary">
      {icon}
      <span className="min-w-0 truncate">{label}</span>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
          aria-label={`Clear ${label}`}
        >
          <X size={12} strokeWidth={2} className="shrink-0" aria-hidden />
        </button>
      )}
    </span>
  );
}

export default function ScopeFilterChips() {
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const activeArtistId = useLabelScopeStore((s) => s.activeArtistId);
  const setAllLabels = useLabelScopeStore((s) => s.setAllLabels);
  const clearActiveArtist = useLabelScopeStore((s) => s.clearActiveArtist);

  const activeLabel = useMemo(
    () => mockLabels.find((l) => l.id === activeLabelId) ?? null,
    [activeLabelId]
  );

  const activeArtist = useMemo(
    () => mockRosterArtists.find((a) => a.id === activeArtistId) ?? null,
    [activeArtistId]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Chip
        icon={
          <ChipIcon>
            <Layers size={13} strokeWidth={1.75} aria-hidden />
          </ChipIcon>
        }
        label={mode === "all_labels" ? "All labels" : activeLabel?.name ?? "Selected label"}
        onClear={mode === "all_labels" ? undefined : setAllLabels}
      />
      {activeArtist && (
        <Chip
          icon={
            <ChipIcon>
              <User size={13} strokeWidth={1.75} aria-hidden />
            </ChipIcon>
          }
          label={activeArtist.name}
          onClear={clearActiveArtist}
        />
      )}
    </div>
  );
}
