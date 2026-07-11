"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, ChevronRight, Radio } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import GenreTile from "@/components/dashboard/producer/labels/browse/GenreTile";
import { mockLabels } from "@/lib/mock/labels";
import { PROTON_GENRES } from "@/lib/data/genres";
import { useLabelSubmissionsStore } from "@/lib/store/labelSubmissionsStore";
import type { ProtonLabel } from "@/types/label";

function OpenBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 shrink-0">
      <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
      Open
    </span>
  );
}

function LabelPill({ label }: { label: ProtonLabel }) {
  return (
    <Link
      href={`/dashboard/labels/${label.slug}`}
      className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-surface px-3 py-2.5 hover:bg-[var(--color-border)]/40 transition-colors shrink-0"
      style={{ minWidth: 156 }}
    >
      <div
        className="size-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
        style={{ background: "rgba(26,188,156,0.10)", color: "#1ABC9C" }}
      >
        {label.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-primary truncate leading-tight">{label.name}</p>
        <p className="text-[11px] text-text-secondary truncate">{label.genres?.[0] ?? ""}</p>
      </div>
    </Link>
  );
}

function FeaturedCard({ label }: { label: ProtonLabel }) {
  return (
    <Link
      href={`/dashboard/labels/${label.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-surface p-5 hover:border-accent/40 transition-colors shrink-0"
      style={{ width: 210 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="size-12 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{
            background: "rgba(26,188,156,0.10)",
            color: "#1ABC9C",
            border: "1px solid rgba(26,188,156,0.18)",
          }}
        >
          {label.name.slice(0, 2).toUpperCase()}
        </div>
        {label.demoStatus === "open" && <OpenBadge />}
      </div>
      <div>
        <p className="font-semibold text-sm text-text-primary leading-snug">{label.name}</p>
        {label.releaseCount !== undefined && (
          <p className="text-xs text-text-secondary mt-0.5">{label.releaseCount} releases</p>
        )}
      </div>
      {label.description && (
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{label.description}</p>
      )}
    </Link>
  );
}

function SearchResult({ label }: { label: ProtonLabel }) {
  return (
    <Link
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
  );
}

export default function LabelsBrowsePage() {
  const [query, setQuery] = useState("");
  const submissions = useLabelSubmissionsStore((s) => s.submissions);

  const submittedSlugs = useMemo(
    () => new Set(submissions.map((s) => s.labelSlug)),
    [submissions]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return mockLabels.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.genres?.some((g) => g.toLowerCase().includes(q)) ||
        l.description?.toLowerCase().includes(q)
    );
  }, [query]);

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

  const isSearching = query.trim().length >= 2;

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
        <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden divide-y divide-[var(--color-border)]">
          {searchResults.length > 0 ? (
            searchResults.map((l) => <SearchResult key={l.id} label={l} />)
          ) : (
            <p className="text-sm text-text-secondary text-center py-10 px-4">
              No labels found for &ldquo;{query}&rdquo;
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Producer's Radar */}
          {radarLabels.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Radio size={13} className="text-accent" />
                <h2 className="text-sm font-semibold text-text-primary">Producer&apos;s Radar</h2>
                <span className="text-xs text-text-secondary">— open in your genres</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {radarLabels.map((l) => (
                  <LabelPill key={l.id} label={l} />
                ))}
              </div>
            </section>
          )}

          {/* Featured this week */}
          {featured.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Featured this week</h2>
              <div className="flex gap-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {featured.map((l) => (
                  <FeaturedCard key={l.id} label={l} />
                ))}
              </div>
            </section>
          )}

          {/* Open for demos */}
          {openForDemos.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-text-primary">Open for demos</h2>
                <span className="text-xs text-text-secondary">{openForDemos.length} labels</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {openForDemos.map((l) => (
                  <LabelPill key={l.id} label={l} />
                ))}
              </div>
            </section>
          )}

          {/* Browse by genre */}
          <section>
            <h2 className="text-sm font-semibold text-text-primary mb-3">Browse by genre</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PROTON_GENRES.map((g) => (
                <GenreTile key={g.slug} genre={g} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
