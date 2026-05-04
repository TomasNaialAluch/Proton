"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { fetchCharts, type ChartEntry } from "@/lib/api/charts";
import ChartRow from "@/components/public/ChartRow";
import GenreChip from "@/components/public/GenreChip";

const GENRES = [
  { label: "Progressive", slug: "progressive" },
  { label: "Deep House", slug: "deep-house" },
  { label: "Techno", slug: "techno" },
  { label: "Electronica", slug: "electronica" },
];

function genreFromChartsPath(pathname: string): string {
  const m = pathname.match(/\/charts\/([^/]+)\/?$/);
  return m?.[1] ?? "progressive";
}

export default function ChartsView() {
  const pathname = usePathname();
  const activeGenre = genreFromChartsPath(pathname);
  const activeLabel = GENRES.find((g) => g.slug === activeGenre)?.label ?? "Progressive";

  const [chart, setChart] = useState<ChartEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCharts(activeGenre).then((rows) => {
      if (!cancelled) setChart(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [activeGenre]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-8">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold italic"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          Charts
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Top tracks by genre this month.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none">
        {GENRES.map(({ label, slug }) => (
          <GenreChip
            key={slug}
            label={label}
            active={activeGenre === slug}
            href={`/charts/${slug}`}
          />
        ))}
      </div>

      <div>
        <div
          className="flex items-center gap-4 px-3 pb-2 mb-1"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span className="w-7 shrink-0" />
          <span className="w-9 shrink-0" />
          <span className="flex-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
            {chart ? `${activeLabel} — Top ${chart.length}` : `${activeLabel} — …`}
          </span>
          <span className="hidden md:block text-[11px] font-semibold uppercase tracking-widest w-[120px]" style={{ color: "var(--color-text-secondary)" }}>
            Label
          </span>
          <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-widest w-12 text-right" style={{ color: "var(--color-text-secondary)" }}>
            Date
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest w-10 text-right" style={{ color: "var(--color-text-secondary)" }}>
            Time
          </span>
        </div>

        <div className="flex flex-col">
          {chart === null && (
            <p className="text-sm px-3 py-6" style={{ color: "var(--color-text-secondary)" }}>
              Loading chart…
            </p>
          )}
          {chart?.map((entry) => (
            <ChartRow key={entry.track.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
