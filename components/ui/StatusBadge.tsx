"use client";

export type StatusBadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<StatusBadgeTone, string> = {
  neutral: "bg-[var(--color-border)] text-text-secondary",
  success: "bg-emerald-500/15 text-emerald-300",
  warning: "bg-amber-500/15 text-amber-300",
  danger: "bg-red-500/15 text-red-300",
  info: "bg-accent/15 text-accent",
};

export default function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: StatusBadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

