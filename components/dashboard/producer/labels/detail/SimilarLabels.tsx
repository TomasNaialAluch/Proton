import { Shuffle } from "lucide-react";
import LabelPill from "@/components/dashboard/producer/labels/browse/LabelPill";
import { mockLabels } from "@/lib/mock/labels";
import type { ProtonLabel } from "@/types/label";

function similarTo(label: ProtonLabel): ProtonLabel[] {
  return mockLabels
    .filter((l) => l.slug !== label.slug && l.genres?.some((g) => label.genres?.includes(g)))
    .slice(0, 3);
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
