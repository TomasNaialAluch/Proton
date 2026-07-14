import { Shuffle } from "lucide-react";
import LabelPill from "@/components/dashboard/producer/labels/browse/LabelPill";
import { mockLabels } from "@/lib/mock/labels";
import type { ProtonLabel } from "@/types/label";

/**
 * Ranked by how many genres actually overlap (not just "any" match), with
 * activity level (release count) as a tiebreaker — a label putting out a
 * similar volume of music reads as more comparable than one an order of
 * magnitude bigger or smaller, even with the same genre tags. Roster
 * overlap would be a stronger signal but isn't real data yet — every
 * label shows the same shared sample roster today (see
 * docs/feature-labels-detail.md), so computing it would just make every
 * label 100% "similar" to every other one.
 */
function similarTo(label: ProtonLabel): ProtonLabel[] {
  const labelGenres = new Set(label.genres ?? []);

  return mockLabels
    .filter((l) => l.slug !== label.slug)
    .map((l) => ({
      label: l,
      overlap: (l.genres ?? []).filter((g) => labelGenres.has(g)).length,
    }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      const scaleDiffA = Math.abs((a.label.releaseCount ?? 0) - (label.releaseCount ?? 0));
      const scaleDiffB = Math.abs((b.label.releaseCount ?? 0) - (label.releaseCount ?? 0));
      return scaleDiffA - scaleDiffB;
    })
    .slice(0, 3)
    .map((x) => x.label);
}

export default function SimilarLabels({ label }: { label: ProtonLabel }) {
  const similar = similarTo(label);
  if (similar.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Shuffle size={13} className="text-accent" />
        <h2 className="text-sm font-semibold text-text-primary">Similar labels</h2>
      </div>
      <div className="flex flex-col gap-2">
        {similar.map((l) => (
          <LabelPill key={l.id} label={l} />
        ))}
      </div>
    </section>
  );
}
