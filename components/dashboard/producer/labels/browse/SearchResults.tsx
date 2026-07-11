import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProtonLabel } from "@/types/label";

function OpenBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 shrink-0">
      <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
      Open
    </span>
  );
}

interface Props {
  results: ProtonLabel[];
  query: string;
}

export default function SearchResults({ results, query }: Props) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden divide-y divide-[var(--color-border)]">
      {results.length > 0 ? (
        results.map((label) => (
          <Link
            key={label.id}
            href={`/dashboard/labels/${label.slug}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-border)]/30 transition-colors"
          >
            <div
              className="size-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
              style={{ background: "rgba(26,188,156,0.10)", color: "#1ABC9C" }}
            >
              {label.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{label.name}</p>
              <p className="text-xs text-text-secondary">{label.genres?.join(" · ")}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {label.demoStatus === "open" && <OpenBadge />}
              <ChevronRight size={14} className="text-text-secondary" />
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-text-secondary text-center py-10 px-4">
          No labels found for &ldquo;{query}&rdquo;
        </p>
      )}
    </div>
  );
}
