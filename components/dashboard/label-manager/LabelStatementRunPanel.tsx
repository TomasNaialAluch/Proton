"use client";

import { useMemo, useState } from "react";
import { Check, FileText } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { LabelStatementRun, StatementPeriod } from "@/lib/mock/label-manager/labelStatements";

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LabelStatementRunPanel({
  runs,
  activePeriod,
  onPeriodChange,
  scopedArtistId,
}: {
  runs: LabelStatementRun[];
  activePeriod: StatementPeriod;
  onPeriodChange: (p: StatementPeriod) => void;
  scopedArtistId: string | null;
}) {
  const [approved, setApproved] = useState(false);

  const run = useMemo(() => runs.find((r) => r.period === activePeriod) ?? runs[0], [runs, activePeriod]);

  const lines = useMemo(() => {
    const base = run.lines.slice();
    const filtered = scopedArtistId ? base.filter((l) => l.artistId === scopedArtistId) : base;
    return filtered.sort((a, b) => b.netUsd - a.netUsd);
  }, [run.lines, scopedArtistId, run.period]);

  const totals = useMemo(() => {
    const gross = lines.reduce((s, l) => s + l.grossUsd, 0);
    const net = lines.reduce((s, l) => s + l.netUsd, 0);
    const streams = lines.reduce((s, l) => s + l.streams, 0);
    return { gross, net, streams };
  }, [lines]);

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-text-secondary" />
            <h2 className="text-sm font-medium text-text-primary">Royalty run</h2>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5">
            Preview “who gets paid what” before approving the run.
          </p>
        </div>

        <div className="shrink-0">
          <label className="sr-only" htmlFor="statement-period">
            Statement period
          </label>
          <select
            id="statement-period"
            value={activePeriod}
            onChange={(e) => {
              setApproved(false);
              onPeriodChange(e.target.value as StatementPeriod);
            }}
            className="appearance-none rounded-xl border border-[var(--color-border)] bg-background/40 px-3 py-2 text-xs font-semibold text-text-primary
              outline-none transition-colors hover:bg-[var(--color-border)] focus:border-accent/60 focus:ring-2 focus:ring-accent/20"
          >
            {runs.map((r) => (
              <option key={r.period} value={r.period}>
                {r.period}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <SummaryCard label="Streams" value={totals.streams.toLocaleString("en-US")} />
          <SummaryCard label="Gross" value={`$${fmtMoney(totals.gross)}`} />
          <SummaryCard label="Net" value={`$${fmtMoney(totals.net)}`} accent />
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-background/40 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-[var(--color-border)]">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Preview
            </p>
            <StatusBadge tone={approved ? "success" : "warning"}>
              {approved ? "Approved" : "Pending"}
            </StatusBadge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    Artist
                  </th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    Releases
                  </th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    Streams
                  </th>
                  <th className="px-2 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    Gross
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.artistId} className="border-t border-[var(--color-border)]">
                    <td className="px-3 py-2.5 text-sm text-text-primary font-medium">{l.artistName}</td>
                    <td className="px-2 py-2.5 text-xs text-text-secondary tabular-nums">{l.releases}</td>
                    <td className="px-2 py-2.5 text-xs text-text-secondary tabular-nums">
                      {l.streams.toLocaleString("en-US")}
                    </td>
                    <td className="px-2 py-2.5 text-xs text-text-secondary tabular-nums">
                      ${fmtMoney(l.grossUsd)}
                    </td>
                    <td className="px-3 py-2.5 text-right text-sm font-medium text-text-primary tabular-nums">
                      ${fmtMoney(l.netUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-secondary">
            Period: <span className="text-text-primary font-medium">{run.period}</span> ·{" "}
            <span className="text-text-secondary">{run.dateRange}</span>
          </p>
          <button
            type="button"
            onClick={() => setApproved(true)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              approved ? "bg-emerald-500/15 text-emerald-300" : "bg-accent/10 text-accent hover:bg-accent/20"
            }`}
          >
            <Check size={14} aria-hidden />
            {approved ? "Approved (mock)" : "Approve run"}
          </button>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-background/40 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{label}</p>
      <p className={`mt-1 text-sm font-semibold tabular-nums ${accent ? "text-accent" : "text-text-primary"}`}>
        {value}
      </p>
    </div>
  );
}
