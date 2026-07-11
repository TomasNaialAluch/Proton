import Link from "next/link";
import type { ProtonLabel } from "@/types/label";

export default function LabelPill({ label }: { label: ProtonLabel }) {
  return (
    <Link
      href={`/dashboard/labels/${label.slug}`}
      className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-surface px-3 py-2.5 hover:bg-[var(--color-border)]/40 transition-colors shrink-0"
      style={{ minWidth: 156 }}
    >
      <div
        className="size-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
        style={{ background: "rgba(26,188,156,0.10)", color: "#1ABC9C" }}
      >
        {label.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary truncate leading-tight">{label.name}</p>
        <p className="text-[11px] text-text-secondary truncate">{label.genres?.[0] ?? ""}</p>
      </div>
    </Link>
  );
}
