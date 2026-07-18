"use client";

import { useMemo, type ReactNode } from "react";
import { User, X } from "lucide-react";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";

function ChipIcon({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-4 shrink-0 items-center justify-center text-text-secondary [&>svg]:block">
      {children}
    </span>
  );
}

/**
 * Only the artist-zoom chip remains here — which label you're scoped to is
 * no longer a variable state (fixed identity shown in `SidebarFooter`
 * instead), so there's nothing to show or clear for that anymore. This
 * renders nothing when no artist is focused.
 */
export default function ScopeFilterChips() {
  const activeArtistId = useLabelScopeStore((s) => s.activeArtistId);
  const clearActiveArtist = useLabelScopeStore((s) => s.clearActiveArtist);

  const activeArtist = useMemo(
    () => mockRosterArtists.find((a) => a.id === activeArtistId) ?? null,
    [activeArtistId]
  );

  if (!activeArtist) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex min-h-8 max-w-full items-center gap-2 rounded-full border border-[var(--color-border)] bg-surface py-1 pl-2.5 pr-1.5 text-[11px] font-semibold text-text-primary">
        <ChipIcon>
          <User size={13} strokeWidth={1.75} aria-hidden />
        </ChipIcon>
        <span className="min-w-0 truncate">{activeArtist.name}</span>
        <button
          type="button"
          onClick={clearActiveArtist}
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
          aria-label={`Clear ${activeArtist.name}`}
        >
          <X size={12} strokeWidth={2} className="shrink-0" aria-hidden />
        </button>
      </span>
    </div>
  );
}
