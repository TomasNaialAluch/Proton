"use client";

export type IssueSeverity = "info" | "warn" | "blocker";

const severityClasses: Record<IssueSeverity, string> = {
  info: "bg-sky-500/15 text-sky-300",
  warn: "bg-amber-500/15 text-amber-300",
  blocker: "bg-red-500/15 text-red-300",
};

export default function IssueBadge({
  children,
  severity = "info",
}: {
  children: React.ReactNode;
  severity?: IssueSeverity;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severityClasses[severity]}`}
    >
      {children}
    </span>
  );
}

