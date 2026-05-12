"use client";

import { useMemo, useState } from "react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ArtistScopeFilter from "@/components/dashboard/label-manager/ArtistScopeFilter";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import LabelReleaseDetailsDrawer from "@/components/dashboard/label-manager/LabelReleaseDetailsDrawer";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { mockLabels } from "@/lib/mock/labels";
import { mockLabelCatalog } from "@/lib/mock/label-manager/labelCatalog";
import StatusBadge from "@/components/ui/StatusBadge";
import IssueBadge from "@/components/ui/IssueBadge";

export default function LabelCatalogPage() {
  const view = usePrototypeViewStore((s) => s.view);
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const activeArtistId = useLabelScopeStore((s) => s.activeArtistId);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);

  const filteredReleases = useMemo(() => {
    return mockLabelCatalog.filter((r) => {
      if (mode === "label" && activeLabelId && r.labelId !== activeLabelId) return false;
      if (activeArtistId && r.artistId !== activeArtistId) return false;
      return true;
    });
  }, [mode, activeLabelId, activeArtistId]);

  const selectedRelease = useMemo(
    () => filteredReleases.find((r) => r.id === selectedReleaseId) ?? null,
    [filteredReleases, selectedReleaseId]
  );

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Catalog" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Catalog</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Releases and tracks across the active label (prototype scaffolding).
        </p>
      </header>

      {view === "label_manager" && (
        <section className="mb-4">
          <ArtistScopeFilter />
          <div className="mt-3">
            <ScopeFilterChips />
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
          <div className="min-w-0">
            <h2 className="text-sm font-medium text-text-primary">Releases</h2>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Filtered by label scope and artist focus (zoom).
            </p>
          </div>
          <StatusBadge tone="info">{filteredReleases.length} items</StatusBadge>
        </div>

        {filteredReleases.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-text-primary">No releases found</p>
            <p className="mt-1 text-xs text-text-secondary">
              Clear filters or switch the active label/artist scope.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {filteredReleases.map((r) => {
              const label = mockLabels.find((l) => l.id === r.labelId)?.name ?? "Label";
              const artist = mockRosterArtists.find((a) => a.id === r.artistId)?.name ?? "Artist";
              const issueCount = r.issues.length;
              const severity = r.issues.some((i) => i.severity === "blocker")
                ? "blocker"
                : issueCount > 0
                  ? "warn"
                  : null;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedReleaseId(r.id)}
                    className="w-full text-left px-4 py-4 hover:bg-[var(--color-border)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {r.title}
                        </p>
                        <p className="mt-1 text-xs text-text-secondary truncate">
                          {artist} · {label} · {r.releaseDate}
                        </p>
                        <p className="mt-1 text-[11px] text-text-secondary truncate">
                          UPC {r.upc} · {r.tracks.length} track{r.tracks.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <StatusBadge
                          tone={
                            r.status === "live"
                              ? "success"
                              : r.status === "delivered"
                                ? "info"
                                : r.status === "qa"
                                  ? "warning"
                                  : "neutral"
                          }
                        >
                          {r.status}
                        </StatusBadge>
                        {issueCount > 0 ? (
                          <IssueBadge severity={severity ?? "warn"}>
                            {issueCount} issue{issueCount === 1 ? "" : "s"}
                          </IssueBadge>
                        ) : (
                          <StatusBadge tone="neutral">—</StatusBadge>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <LabelReleaseDetailsDrawer
        open={selectedReleaseId != null}
        release={selectedRelease}
        onClose={() => setSelectedReleaseId(null)}
      />
    </main>
  );
}

