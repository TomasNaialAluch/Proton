import { ClipboardList } from "lucide-react";
import type { ProtonLabel } from "@/types/label";

function formatLabel(format: NonNullable<ProtonLabel["demoPolicy"]>["preferredFormat"]) {
  if (format === "wav") return "WAV";
  if (format === "mp3") return "MP3";
  if (format === "either") return "WAV or MP3";
  return null;
}

export default function DemoPolicyCard({ label }: { label: ProtonLabel }) {
  const policy = label.demoPolicy;
  if (!policy) return null;

  const format = formatLabel(policy.preferredFormat);

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList size={13} className="text-accent" />
        <h2 className="text-sm font-semibold text-text-primary">Demo policy</h2>
      </div>

      <dl className="space-y-2.5 text-sm">
        {label.demoGenres && label.demoGenres.length > 0 && (
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <dt className="text-text-secondary shrink-0">Preferred genres</dt>
            <dd className="flex flex-wrap gap-1.5">
              {label.demoGenres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                  {g}
                </span>
              ))}
            </dd>
          </div>
        )}

        {format && (
          <div className="flex items-baseline gap-2">
            <dt className="text-text-secondary shrink-0">Format</dt>
            <dd className="text-text-primary">{format}</dd>
          </div>
        )}

        {policy.estimatedResponseTime && (
          <div className="flex items-baseline gap-2">
            <dt className="text-text-secondary shrink-0">Response time</dt>
            <dd className="text-text-primary">{policy.estimatedResponseTime}</dd>
          </div>
        )}

        {policy.notes && (
          <div className="pt-1 border-t border-[var(--color-border)] mt-2.5">
            <dd className="text-text-secondary italic leading-relaxed">&ldquo;{policy.notes}&rdquo;</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
