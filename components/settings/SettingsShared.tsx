import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

/* ── Page header with back button ── */
export function SettingsHeader({
  title,
  subtitle,
  backHref = "/dashboard/settings/account",
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-4
      border-b border-[var(--color-border)] bg-background/80 backdrop-blur-md">
      <Link
        href={backHref}
        className="size-8 rounded-full flex items-center justify-center
          bg-[var(--color-border)] hover:opacity-80 transition-opacity shrink-0"
      >
        <ChevronLeft size={16} className="text-text-primary" />
      </Link>
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
        {subtitle && <p className="text-xs text-text-secondary">{subtitle}</p>}
      </div>
    </header>
  );
}

/* ── Card section wrapper ── */
export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
      {title && (
        <p className="px-4 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {title}
        </p>
      )}
      {children}
    </section>
  );
}

/* ── Tappable field row ── */
export function Field({
  label,
  value,
  hint,
  disabled = false,
  accent = false,
  placeholder = false,
}: {
  label: string;
  value: string;
  hint?: string;
  disabled?: boolean;
  accent?: boolean;
  placeholder?: boolean;
}) {
  const valueClass = disabled
    ? "text-text-secondary italic"
    : placeholder
    ? "text-text-secondary italic"
    : accent
    ? "text-accent font-medium"
    : "text-text-primary";

  return (
    <button
      disabled={disabled}
      className="w-full flex items-center justify-between px-4 py-3
        border-t border-[var(--color-border)] text-left
        hover:bg-[var(--color-border)] transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className={`text-sm mt-0.5 truncate ${valueClass}`}>{value}</p>
        {hint && <p className="text-xs text-text-secondary mt-0.5 normal-case font-normal leading-relaxed">{hint}</p>}
      </div>
      {!disabled && <ChevronRight size={14} className="text-text-secondary shrink-0 ml-3" />}
    </button>
  );
}

/* ── Toggle row (display only — no client state) ── */
export function ToggleField({
  label,
  hint,
  enabled,
}: {
  label: string;
  hint?: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3
      border-t border-[var(--color-border)]">
      <div className="min-w-0">
        <p className="text-sm text-text-primary">{label}</p>
        {hint && <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div className={`relative shrink-0 w-10 h-5 rounded-full transition-colors mt-0.5 ${
        enabled ? "bg-accent" : "bg-text-secondary/25"
      }`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "left-5" : "left-0.5"
        }`} />
      </div>
    </div>
  );
}

/* ── Info banner (amber warning) ── */
export function InfoBanner({
  children,
  variant = "warning",
}: {
  children: React.ReactNode;
  variant?: "warning" | "info";
}) {
  const styles = {
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    info:    "bg-accent/10 border-accent/30 text-text-secondary",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 text-xs leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
}

/* ── Empty state ── */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-8 text-center border-t border-[var(--color-border)]">
      <p className="text-sm text-text-secondary italic">{message}</p>
    </div>
  );
}
