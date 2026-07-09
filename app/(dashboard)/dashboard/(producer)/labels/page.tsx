"use client";

import { useMemo, useState } from "react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import LabelsTabs from "@/components/dashboard/producer/labels/LabelsTabs";
import FilterDropdown from "@/components/dashboard/discover/FilterDropdown";
import LabelCard from "@/components/public/LabelCard";
import { mockLabels } from "@/lib/mock/labels";

export default function LabelsBrowsePage() {
  const [genre, setGenre] = useState<string | null>(null);

  const genres = useMemo(
    () => [...new Set(mockLabels.flatMap((l) => l.genres ?? []))].sort(),
    []
  );

  const labels = genre ? mockLabels.filter((l) => l.genres?.includes(genre)) : mockLabels;

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Labels</h1>
      <p className="text-sm text-text-secondary mb-6">
        Browse labels on Proton, filter by genre, and send a demo straight from their profile.
      </p>

      <LabelsTabs />

      <div className="mb-5 flex items-center justify-between gap-3">
        <FilterDropdown label="Genre" options={genres} value={genre} onChange={setGenre} />
        <span className="text-xs text-text-secondary shrink-0">{labels.length} labels</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {labels.map((label) => (
          <LabelCard key={label.id} label={label} href={`/dashboard/labels/${label.slug}`} />
        ))}
      </div>

      {labels.length === 0 && (
        <p className="text-sm text-text-secondary text-center py-12">No labels match that genre.</p>
      )}
    </main>
  );
}
