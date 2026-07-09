"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, CheckCircle2, PenLine, Building2, Disc3, ChevronRight, FileDown, Search } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import { useContractsStore } from "@/lib/store/contractsStore";
import { CONTRACT_LABEL_COLORS } from "@/lib/mock/contracts";

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_CONFIG = {
  signed:            { label: "Signed",  icon: CheckCircle2, classes: "bg-emerald-500/10 text-emerald-500" },
  pending_signature: { label: "Awaiting your signature", icon: PenLine, classes: "bg-amber-500/10 text-amber-500" },
  expired:           { label: "Expired", icon: FileText,     classes: "bg-red-500/10 text-red-500" },
};

/** Unsigned contracts need action, so they sort first; signed ones are just history. */
const STATUS_ORDER = { pending_signature: 0, expired: 1, signed: 2 };

export default function ContractsPage() {
  const contracts = useContractsStore((s) => s.contracts);
  const [search, setSearch] = useState("");

  const signed  = contracts.filter((c) => c.status === "signed");
  const pending = contracts.filter((c) => c.status === "pending_signature");
  const labels  = [...new Set(contracts.map((c) => c.label))];

  const query = search.trim().toLowerCase();
  const visibleContracts = (
    query
      ? contracts.filter(
          (c) => c.release.toLowerCase().includes(query) || c.label.toLowerCase().includes(query)
        )
      : contracts
  )
    .slice()
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Contracts" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">Contracts</h1>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-4">
          <div className="flex items-center gap-1.5 text-text-secondary mb-2">
            <FileText size={13} />
            <span className="text-xs font-medium">Total</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">{contracts.length}</span>
          <p className="text-xs text-text-secondary mt-0.5">contracts</p>
        </div>
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-4">
          <div className="flex items-center gap-1.5 text-emerald-500 mb-2">
            <CheckCircle2 size={13} />
            <span className="text-xs font-medium">Signed</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">{signed.length}</span>
          <p className="text-xs text-text-secondary mt-0.5">of {contracts.length}</p>
        </div>
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-4">
          <div className="flex items-center gap-1.5 text-text-secondary mb-2">
            <Disc3 size={13} />
            <span className="text-xs font-medium">Labels</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">{labels.length}</span>
          <p className="text-xs text-text-secondary mt-0.5">labels</p>
        </div>
      </div>

      {/* ── Pending alert ── */}
      {pending.length > 0 && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl
          bg-amber-500/8 border border-amber-500/20">
          <PenLine size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            You have <span className="font-semibold">{pending.length}</span> contract{pending.length > 1 ? "s" : ""} waiting on your signature.
          </p>
        </div>
      )}

      {/* ── Contracts list ── */}
      <div className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={15} className="text-text-secondary shrink-0" />
            <h2 className="text-sm font-semibold text-text-primary truncate">Contract history</h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-32 sm:w-44 pl-7 pr-3 py-1.5 rounded-lg bg-[var(--color-border)] text-xs
                  text-text-primary placeholder:text-text-secondary
                  border border-transparent focus:border-accent/50 outline-none transition-colors"
              />
            </div>
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {query ? `${visibleContracts.length} of ${contracts.length}` : `${contracts.length} releases`}
            </span>
          </div>
        </div>

        {visibleContracts.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-text-secondary">
            No contracts match &ldquo;{search}&rdquo;.
          </p>
        )}

        <ul className="divide-y divide-[var(--color-border)]">
          {visibleContracts.map((contract) => {
            const { label: statusLabel, icon: StatusIcon, classes } = STATUS_CONFIG[contract.status];
            const accentColor = CONTRACT_LABEL_COLORS[contract.labelSlug] ?? "#A78BFA";

            return (
              <li key={contract.id} className="flex items-center hover:bg-[var(--color-border)]/20 transition-colors">
                <Link
                  href={`/dashboard/contracts/${contract.id}`}
                  className="flex flex-1 items-start gap-3 px-5 py-4 min-w-0"
                >
                  <div
                    className="mt-0.5 size-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${accentColor}18` }}
                  >
                    <FileText size={14} style={{ color: accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-text-primary truncate">{contract.release}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${classes}`}>
                        <StatusIcon size={10} />
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{contract.label}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{formatDateShort(contract.signedAt)}</p>
                  </div>
                  <ChevronRight size={14} className="text-text-secondary shrink-0 mt-1.5" />
                </Link>
                {contract.documentUrl && (
                  <a
                    href={contract.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View document"
                    className="mr-4 shrink-0 rounded-lg p-2 text-text-secondary transition-colors hover:bg-accent/10 hover:text-accent"
                  >
                    <FileDown size={16} />
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-border)]/20">
          <p className="text-xs text-text-secondary text-center">
            Contracts and signatures live entirely on Proton — no email, no printing.
          </p>
        </div>
      </div>

      {/* ── Labels breakdown ── */}
      <div className="mt-6 bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">By label</h2>
          </div>
        </div>
        <ul className="divide-y divide-[var(--color-border)]">
          {labels.map((label) => {
            const labelContracts = contracts.filter((c) => c.label === label);
            const slug = labelContracts[0].labelSlug;
            const color = CONTRACT_LABEL_COLORS[slug] ?? "#A78BFA";
            return (
              <li key={label} className="flex items-center gap-3 px-5 py-4">
                <div
                  className="size-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Building2 size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {labelContracts.map((c) => c.release).join(" · ")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-text-primary">{labelContracts.length}</p>
                  <p className="text-xs text-text-secondary">releases</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

    </main>
  );
}
