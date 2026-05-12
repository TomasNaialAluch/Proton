"use client";

import { useMemo, useState } from "react";
import { mockLabels } from "@/lib/mock/labels";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { mockLabelCatalog, type LabelCatalogRelease } from "@/lib/mock/label-manager/labelCatalog";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import StatusBadge from "@/components/ui/StatusBadge";
import IssueBadge from "@/components/ui/IssueBadge";
import LabelReleaseDetailsDrawer from "@/components/dashboard/label-manager/LabelReleaseDetailsDrawer";

export default function LabelReleasesPipeline() {
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const activeArtistId = useLabelScopeStore((s) => s.activeArtistId);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);

  const releases = useMemo(() => {
    return mockLabelCatalog.filter((r) => {
      if (mode === "label" && activeLabelId && r.labelId !== activeLabelId) return false;
      if (activeArtistId && r.artistId !== activeArtistId) return false;
      return true;
    });
  }, [mode, activeLabelId, activeArtistId]);

  const selectedRelease = useMemo(
    () => releases.find((r) => r.id === selectedReleaseId) ?? null,
    [releases, selectedReleaseId]
  );

  const groups = useMemo(() => {
    const order: LabelCatalogRelease["status"][] = ["draft", "qa", "scheduled", "delivered", "live"];
    const labelByStatus: Record<LabelCatalogRelease["status"], string> = {
      draft: "Draft",
      qa: "QA",
      scheduled: "Scheduled",
      delivered: "Delivered",
      live: "Live",
    };
    const toneByStatus: Record<LabelCatalogRelease["status"], "neutral" | "warning" | "info" | "success"> = {
      draft: "neutral",
      qa: "warning",
      scheduled: "neutral",
      delivered: "info",
      live: "success",
    };

    const map = new Map<LabelCatalogRelease["status"], LabelCatalogRelease[]>();
    for (const s of order) map.set(s, []);
    for (const r of releases) map.get(r.status)?.push(r);

    return order.map((status) => ({
      status,
      title: labelByStatus[status],
      tone: toneByStatus[status],
      items: (map.get(status) ?? []).slice().sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)),
    }));
  }, [releases]);

  return (
    <>
      <section className="space-y-4">
        {groups.map((g) => (
          <div
            key={g.status}
            className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-medium text-text-primary">{g.title}</h2>
                  <StatusBadge tone={g.tone}>{g.items.length}</StatusBadge>
                </div>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  {g.status === "qa"
                    ? "Resolve blockers before scheduling."
                    : g.status === "scheduled"
                      ? "Keep an eye on territories and assets."
                      : g.status === "delivered"
                        ? "Waiting for DSP go-live."
                        : g.status === "live"
                          ? "Monitor performance and reporting."
                          : "Work in progress, not delivered yet."}
                </p>
              </div>
            </div>

            {g.items.length === 0 ? (
              <div className="px-4 py-6">
                <p className="text-sm text-text-secondary italic">No releases in this stage.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {g.items.map((r) => {
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
                            <p className="text-sm font-semibold text-text-primary truncate">{r.title}</p>
                            <p className="mt-1 text-xs text-text-secondary truncate">
                              {artist} · {label} · {r.releaseDate}
                            </p>
                            <p className="mt-1 text-[11px] text-text-secondary truncate">
                              UPC {r.upc} · {r.tracks.length} track{r.tracks.length === 1 ? "" : "s"}
                            </p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
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
          </div>
        ))}
      </section>

      <LabelReleaseDetailsDrawer
        open={selectedReleaseId != null}
        release={selectedRelease}
        onClose={() => setSelectedReleaseId(null)}
      />
    </>
  );
}
