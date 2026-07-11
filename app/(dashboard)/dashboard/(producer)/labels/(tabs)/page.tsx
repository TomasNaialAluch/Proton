"use client";

import { useState, useMemo } from "react";
import { Search, X, Radio } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import HorizontalScroll from "@/components/dashboard/producer/labels/browse/HorizontalScroll";
import LabelPill from "@/components/dashboard/producer/labels/browse/LabelPill";
import FeaturedCard from "@/components/dashboard/producer/labels/browse/FeaturedCard";
import SearchResults from "@/components/dashboard/producer/labels/browse/SearchResults";
import GenreTile from "@/components/dashboard/producer/labels/browse/GenreTile";
import { mockLabels } from "@/lib/mock/labels";
import { PROTON_GENRES } from "@/lib/data/genres";
import { useLabelSubmissionsStore } from "@/lib/store/labelSubmissionsStore";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function LabelsBrowsePage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const submissions = useLabelSubmissionsStore((s) => s.submissions);

  const submittedSlugs = useMemo(
    () => new Set(submissions.map((s) => s.labelSlug)),
    [submissions]
  );

  const searchResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return mockLabels.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.genres?.some((g) => g.toLowerCase().includes(q)) ||
        l.description?.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  const featured = useMemo(() => mockLabels.filter((l) => l.featured), []);

  const openForDemos = useMemo(
    () => mockLabels.filter((l) => l.demoStatus === "open"),
    []
  );

  const radarLabels = useMemo(
    () =>
      mockLabels
        .filter(
          (l) =>
            l.demoStatus === "open" &&
            l.genres?.some((g) => ["Progressive", "Melodic House"].includes(g)) &&
            !submittedSlugs.has(l.slug)
        )
        .slice(0, 5),
    [submittedSlugs]
  );

  const isSearching = debouncedQuery.trim().length >= 2;

  return (
    <>
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Labels" },
        ]}
      />

      {/* Search */}
      <div className="relative mb-7">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search labels by name or genre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-surface pl-9 pr-9 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent/60 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isSearching ? (
        <SearchResults results={searchResults} query={debouncedQuery} />
      ) : (
        <>
          {radarLabels.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Radio size={13} className="text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">Producer&apos;s Radar</h2>
                <span className="text-xs text-text-secondary">— open in your genres</span>
              </div>
              <HorizontalScroll>
                {radarLabels.map((l) => <LabelPill key={l.id} label={l} />)}
              </HorizontalScroll>
            </section>
          )}

          {featured.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Featured this week</h2>
              <HorizontalScroll gap="gap-4">
                {featured.map((l) => <FeaturedCard key={l.id} label={l} />)}
              </HorizontalScroll>
            </section>
          )}

          {openForDemos.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-text-primary">Open for demos</h2>
                <span className="text-xs text-text-secondary">{openForDemos.length} labels</span>
              </div>
              <HorizontalScroll>
                {openForDemos.map((l) => <LabelPill key={l.id} label={l} />)}
              </HorizontalScroll>
            </section>
          )}

          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-3">Browse by genre</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PROTON_GENRES.map((g) => <GenreTile key={g.slug} genre={g} />)}
            </div>
          </section>
        </>
      )}
    </>
  );
}
