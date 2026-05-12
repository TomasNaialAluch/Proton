"use client";

import { useMemo } from "react";
import { User, X } from "lucide-react";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";

const shell =
  "flex h-10 w-full min-w-0 items-stretch overflow-hidden rounded-xl border border-[var(--color-border)] bg-surface " +
  "transition-colors hover:bg-[var(--color-border)] focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/20";

const iconCol = "flex w-9 shrink-0 items-center justify-center text-text-secondary";

const selectInner =
  "min-h-0 min-w-0 flex-1 cursor-pointer border-0 bg-transparent py-0 pl-0 pr-2 text-xs font-semibold leading-none " +
  "text-text-primary outline-none ring-0 focus:ring-0 focus-visible:outline-none";

export default function ArtistScopeFilter() {
  const activeArtistId = useLabelScopeStore((s) => s.activeArtistId);
  const setActiveArtist = useLabelScopeStore((s) => s.setActiveArtist);
  const clearActiveArtist = useLabelScopeStore((s) => s.clearActiveArtist);

  const activeArtist = useMemo(
    () => mockRosterArtists.find((a) => a.id === activeArtistId) ?? null,
    [activeArtistId]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="artist-scope">
            Artist filter
          </label>

          <div className={shell}>
            <div className={iconCol} aria-hidden>
              <User size={14} strokeWidth={1.75} className="shrink-0" />
            </div>
            <div className="flex min-w-0 flex-1 items-center">
              <select
                id="artist-scope"
                value={activeArtistId ?? "__all__"}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next === "__all__") clearActiveArtist();
                  else setActiveArtist(next);
                }}
                className={`${selectInner} h-10 w-full appearance-none`}
              >
                <option value="__all__">All artists</option>
                {mockRosterArtists.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={clearActiveArtist}
          disabled={!activeArtistId}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-surface px-3 text-xs font-semibold
            text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-text-secondary"
          aria-label="Clear artist filter"
        >
          <X size={14} strokeWidth={1.75} className="shrink-0" aria-hidden />
          Clear
        </button>
      </div>

      <p className="text-[10px] text-text-secondary">
        {activeArtist ? `Zoom: ${activeArtist.name}` : "Overview: all artists"}
      </p>
    </div>
  );
}
