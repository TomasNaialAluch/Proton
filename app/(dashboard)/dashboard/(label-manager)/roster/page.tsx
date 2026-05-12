"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ScopeFilterChips from "@/components/dashboard/label-manager/ScopeFilterChips";
import StatusBadge from "@/components/ui/StatusBadge";
import IssueBadge from "@/components/ui/IssueBadge";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";

export default function LabelRosterPage() {
  const router = useRouter();
  const view = usePrototypeViewStore((s) => s.view);
  const setActiveArtist = useLabelScopeStore((s) => s.setActiveArtist);

  const rows = useMemo(() => {
    return mockRosterArtists.map((a, idx) => {
      const active = idx % 5 !== 0;
      const nextReleaseDays = 7 + (idx * 9) % 46;
      const streams30d = 18_000 + idx * 7_450;
      const issues = active ? (idx % 3 === 0 ? 1 : 0) : 2;
      return { artist: a, active, nextReleaseDays, streams30d, issues };
    });
  }, []);

  const kpis = useMemo(() => {
    const active = rows.filter((r) => r.active).length;
    const inactive = rows.length - active;
    const issues = rows.reduce((s, r) => s + r.issues, 0);
    const next30 = rows.filter((r) => r.nextReleaseDays <= 30).length;
    return { active, inactive, issues, next30 };
  }, [rows]);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Roster" },
        ]}
      />

      <header className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary">Roster</h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Label-wide artist overview. Tap an artist to zoom into their catalog.
        </p>
      </header>

      {view === "label_manager" && (
        <section className="mb-4">
          <ScopeFilterChips />
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
        <KpiCard label="Active artists" value={kpis.active} tone="success" />
        <KpiCard label="Inactive" value={kpis.inactive} tone="neutral" />
        <KpiCard label="Releases next 30d" value={kpis.next30} tone="info" />
        <KpiCard label="Issues" value={kpis.issues} tone={kpis.issues > 0 ? "warning" : "neutral"} />
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
          <div className="min-w-0">
            <h2 className="text-sm font-medium text-text-primary">Artists</h2>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Click a row to set Artist focus (zoom) for other tabs.
            </p>
          </div>
          <StatusBadge tone="info">{rows.length} total</StatusBadge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  Artist
                </th>
                <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  Status
                </th>
                <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  Next release
                </th>
                <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  30d streams
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  Issues
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.artist.id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                  onClick={() => {
                    setActiveArtist(r.artist.id);
                    router.push("/dashboard/catalog");
                  }}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm text-text-primary font-medium truncate max-w-[12rem]">
                      {r.artist.name}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5 truncate max-w-[12rem]">
                      {r.artist.country} · {r.artist.genres[0] ?? "—"}
                    </p>
                  </td>
                  <td className="px-2 py-3">
                    {r.active ? (
                      <StatusBadge tone="success">Active</StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Inactive</StatusBadge>
                    )}
                  </td>
                  <td className="px-2 py-3 text-xs text-text-secondary tabular-nums">
                    {r.nextReleaseDays}d
                  </td>
                  <td className="px-2 py-3 text-sm text-text-primary tabular-nums font-medium">
                    {r.streams30d.toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.issues > 0 ? (
                      <IssueBadge severity={r.issues > 1 ? "blocker" : "warn"}>
                        {r.issues} issue{r.issues > 1 ? "s" : ""}
                      </IssueBadge>
                    ) : (
                      <StatusBadge tone="neutral">—</StatusBadge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[var(--color-border)]">
          <p className="text-xs text-text-secondary">
            Tip: switch labels (scope) in the header/sidebar, then zoom into an artist from this table.
          </p>
        </div>
      </section>
    </main>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "success" | "warning" | "info";
}) {
  const badgeTone =
    tone === "info" ? "info" : tone === "success" ? "success" : tone === "warning" ? "warning" : "neutral";
  return (
    <div className="bg-surface rounded-xl border border-[var(--color-border)] px-3 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-secondary">{label}</span>
        <StatusBadge tone={badgeTone}>{tone}</StatusBadge>
      </div>
      <span className="text-2xl font-medium tabular-nums text-text-primary">{value}</span>
    </div>
  );
}

