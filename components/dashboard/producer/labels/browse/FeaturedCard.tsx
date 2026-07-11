import Link from "next/link";
import type { ProtonLabel } from "@/types/label";

export default function FeaturedCard({ label }: { label: ProtonLabel }) {
  return (
    <Link
      href={`/dashboard/labels/${label.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-surface p-5 hover:border-accent/40 transition-colors shrink-0"
      style={{ width: 210 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="size-12 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            background: "rgba(26,188,156,0.10)",
            color: "#1ABC9C",
            border: "1px solid rgba(26,188,156,0.18)",
          }}
        >
          {label.name.slice(0, 2).toUpperCase()}
        </div>
        {label.demoStatus === "open" && (
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 shrink-0">
            <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
            Open
          </span>
        )}
      </div>
      <div>
        <p className="font-semibold text-sm text-text-primary leading-snug">{label.name}</p>
        {label.releaseCount !== undefined && (
          <p className="text-xs text-text-secondary mt-0.5">{label.releaseCount} releases</p>
        )}
      </div>
      {label.description && (
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{label.description}</p>
      )}
    </Link>
  );
}
