"use client";

import { FileText, CheckCircle2, Clock, Building2, Disc3, ExternalLink } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import { mockContracts, CONTRACT_LABEL_COLORS } from "@/lib/mock/contracts";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_CONFIG = {
  signed:  { label: "Signed",  icon: CheckCircle2, classes: "bg-emerald-500/10 text-emerald-500" },
  pending: { label: "Pending", icon: Clock,         classes: "bg-amber-500/10 text-amber-500"    },
  expired: { label: "Expired", icon: Clock,         classes: "bg-red-500/10 text-red-500"        },
};

export default function ContractsPage() {
  const signed  = mockContracts.filter((c) => c.status === "signed");
  const pending = mockContracts.filter((c) => c.status === "pending");
  const labels  = [...new Set(mockContracts.map((c) => c.label))];

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Contracts" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">Contracts</h1>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-4">
          <div className="flex items-center gap-1.5 text-text-secondary mb-2">
            <FileText size={13} />
            <span className="text-xs font-medium">Total</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">{mockContracts.length}</span>
          <p className="text-xs text-text-secondary mt-0.5">contracts</p>
        </div>
        <div className="bg-surface rounded-xl border border-[var(--color-border)] px-4 py-4">
          <div className="flex items-center gap-1.5 text-emerald-500 mb-2">
            <CheckCircle2 size={13} />
            <span className="text-xs font-medium">Signed</span>
          </div>
          <span className="text-2xl font-bold text-text-primary">{signed.length}</span>
          <p className="text-xs text-text-secondary mt-0.5">of {mockContracts.length}</p>
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
          <Clock size={15} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-600 dark:text-amber-400">
            You have <span className="font-semibold">{pending.length}</span> contract{pending.length > 1 ? "s" : ""} pending signature.
          </p>
        </div>
      )}

      {/* ── Contracts list ── */}
      <div className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <FileText size={15} className="text-text-secondary" />
            <h2 className="text-sm font-semibold text-text-primary">Contract history</h2>
          </div>
          <span className="text-xs text-text-secondary">{mockContracts.length} releases</span>
        </div>

        {/* Desktop header */}
        <div className="hidden lg:grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 px-5 py-2.5
          border-b border-[var(--color-border)] bg-[var(--color-border)]/30">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary w-24">Date</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Release</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Label</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Status</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">Contract</span>
        </div>

        {/* Rows */}
        <ul className="divide-y divide-[var(--color-border)]">
          {mockContracts.map((contract) => {
            const { label: statusLabel, icon: StatusIcon, classes } = STATUS_CONFIG[contract.status];
            const accentColor = CONTRACT_LABEL_COLORS[contract.labelSlug] ?? "#A78BFA";

            return (
              <li key={contract.id} className="hover:bg-[var(--color-border)]/20 transition-colors">

                {/* Mobile layout */}
                <div className="flex items-start gap-3 px-5 py-4 lg:hidden">
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
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 items-center px-5 py-4">
                  <span className="text-xs text-text-secondary tabular-nums w-24">
                    {formatDateShort(contract.signedAt)}
                  </span>

                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="size-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accentColor}18` }}
                    >
                      <FileText size={13} style={{ color: accentColor }} />
                    </div>
                    <span className="text-sm font-medium text-text-primary truncate">{contract.release}</span>
                  </div>

                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="size-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: accentColor }}
                    />
                    <span className="text-sm text-text-secondary truncate">{contract.label}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${classes}`}>
                    <StatusIcon size={11} />
                    {statusLabel}
                  </span>

                  {contract.documentUrl ? (
                    <a
                      href={contract.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-accent
                        hover:opacity-80 transition-opacity px-3 py-1.5 rounded-lg
                        bg-accent/10 hover:bg-accent/20"
                    >
                      <ExternalLink size={12} /> View
                    </a>
                  ) : (
                    <span className="text-xs text-text-secondary px-3 py-1.5">—</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-border)]/20">
          <p className="text-xs text-text-secondary text-center">
            Contracts are sent by email from Proton SoundSystem · Questions? Contact your label
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
            const labelContracts = mockContracts.filter((c) => c.label === label);
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
