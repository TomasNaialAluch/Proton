import { Sparkles, Tag } from "lucide-react";
import type { ConnectionMatchReason } from "@/types/connection";

const TYPE_LABEL: Record<ConnectionMatchReason["type"], string> = {
  similar: "Similar profile",
  complementary: "Complementary profile",
};

/** Always shown — the suggestion is never a black box, per the no-incomodar principle. */
export default function MatchReasonCard({ reason }: { reason: ConnectionMatchReason }) {
  return (
    <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} className="text-accent" />
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Why we're suggesting this
        </span>
      </div>

      <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent mb-3">
        {TYPE_LABEL[reason.type]}
      </span>

      <ul className="space-y-2 mb-3">
        {reason.highlights.map((h, i) => (
          <li key={i} className="text-sm text-text-primary leading-relaxed flex gap-2">
            <span className="text-accent mt-1.5 size-1 rounded-full bg-accent shrink-0" />
            {h}
          </li>
        ))}
      </ul>

      {reason.sharedGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--color-border)]">
          <Tag size={11} className="text-text-secondary shrink-0" />
          {reason.sharedGenres.map((g) => (
            <span key={g} className="text-[11px] text-text-secondary">
              {g}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
