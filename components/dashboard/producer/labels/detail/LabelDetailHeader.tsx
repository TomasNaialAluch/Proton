import Image from "next/image";
import { Users, Calendar } from "lucide-react";
import type { ProtonLabel } from "@/types/label";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function DemoStatusBadge({ status }: { status: ProtonLabel["demoStatus"] }) {
  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
        Open for demos
      </span>
    );
  }
  if (status === "closed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[var(--color-border)] text-text-secondary">
        Closed for demos
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[var(--color-border)] text-text-secondary">
      Demo status unknown
    </span>
  );
}

export default function LabelDetailHeader({ label }: { label: ProtonLabel }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="flex items-start gap-4">
        <div className="size-14 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-accent/10 border border-accent/20">
          {label.image?.url ? (
            <Image src={label.image.url} alt={label.name} width={56} height={56} className="object-contain" />
          ) : (
            <span className="text-lg font-bold text-accent">{label.name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-text-primary">{label.name}</h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-text-secondary">
            {label.artistCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users size={11} /> {label.artistCount} artists
              </span>
            )}
            {label.foundedYear !== undefined && (
              <span className="flex items-center gap-1">
                <Calendar size={11} /> Since {label.foundedYear}
              </span>
            )}
            {label.releaseCount !== undefined && <span>{label.releaseCount} releases</span>}
            {label.lastReleaseDate && <span>Last: {formatDate(label.lastReleaseDate)}</span>}
          </div>

          {label.genres && label.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {label.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                  {g}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2.5">
            <DemoStatusBadge status={label.demoStatus} />
          </div>
        </div>
      </div>

      {label.description && (
        <p className="mt-4 text-sm text-text-secondary leading-relaxed">{label.description}</p>
      )}
    </div>
  );
}
