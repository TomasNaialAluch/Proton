"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import LabelRow from "@/components/dashboard/producer/labels/browse/LabelRow";
import { mockLabels } from "@/lib/mock/labels";
import { genreBySlug } from "@/lib/data/genres";
import type { ProtonLabel } from "@/types/label";

type DemoFilter = "all" | "open" | "closed";
type SortKey = "trending" | "newest" | "az" | "most";

function activityScore(label: ProtonLabel): number {
  const daysSinceLast = label.lastReleaseDate
    ? (Date.now() - new Date(label.lastReleaseDate).getTime()) / 86_400_000
    : 999;
  const recency = Math.max(0, 1 - daysSinceLast / 365);
  const size = Math.log10(Math.max(1, label.releaseCount ?? 1)) / 4;
  return recency * 0.7 + size * 0.3;
}

export default function LabelGenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const genre = genreBySlug(slug);

  const [demoFilter, setDemoFilter] = useState<DemoFilter>("all");
  const [sort, setSort] = useState<SortKey>("trending");

  const allInGenre = useMemo(() => {
    if (!genre) return [];
    return mockLabels.filter((l) =>
      l.genres?.some((g) => g.toLowerCase() === genre.label.toLowerCase())
    );
  }, [genre]);

  const labels = useMemo(() => {
    let list = allInGenre;
    if (demoFilter === "open") list = list.filter((l) => l.demoStatus === "open");
    if (demoFilter === "closed") list = list.filter((l) => l.demoStatus === "closed");

    switch (sort) {
      case "trending":
        return [...list].sort((a, b) => activityScore(b) - activityScore(a));
      case "newest":
        return [...list].sort((a, b) => {
          const da = a.lastReleaseDate ? new Date(a.lastReleaseDate).getTime() : 0;
          const db = b.lastReleaseDate ? new Date(b.lastReleaseDate).getTime() : 0;
          return db - da;
        });
      case "az":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case "most":
        return [...list].sort((a, b) => (b.releaseCount ?? 0) - (a.releaseCount ?? 0));
    }
  }, [allInGenre, demoFilter, sort]);

  if (!genre) {
    return (
      <p className="text-sm text-text-secondary text-center py-20">Genre not found.</p>
    );
  }

  return (
    <>
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Labels", href: "/dashboard/labels" },
          { label: genre.label },
        ]}
      />

      {/* Genre header */}
      <div
        className="relative overflow-hidden rounded-2xl mb-6 p-5"
        style={{
          background: `linear-gradient(135deg, ${genre.bgFrom} 0%, ${genre.bgTo} 100%)`,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="relative">
          <h1 className="text-xl font-bold text-white">{genre.label}</h1>
          <p className="text-sm mt-0.5" style={{ color: genre.accent }}>
            {allInGenre.length} {allInGenre.length === 1 ? "label" : "labels"} on Proton
          </p>
        </div>
      </div>

      {/* Filters + sort */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(["all", "open", "closed"] as DemoFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setDemoFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              demoFilter === f
                ? "bg-accent text-white"
                : "bg-[var(--color-border)]/60 text-text-secondary hover:text-text-primary"
            }`}
          >
            {f === "all" ? "All" : f === "open" ? "Open for demos" : "Closed"}
          </button>
        ))}

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-[var(--color-border)] bg-surface px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:border-accent/60 transition-colors"
          >
            <option value="trending">Trending</option>
            <option value="newest">Newest release</option>
            <option value="az">A–Z</option>
            <option value="most">Most releases</option>
          </select>
        </div>
      </div>

      {/* Label list */}
      {labels.length > 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden divide-y divide-[var(--color-border)]">
          {labels.map((l) => (
            <LabelRow key={l.id} label={l} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-secondary text-center py-12">
          No labels match that filter.
        </p>
      )}
    </>
  );
}
