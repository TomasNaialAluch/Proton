"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Tag, ArrowDownUp, RotateCcw } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import FilterDropdown from "@/components/dashboard/discover/FilterDropdown";
import BpmRangeFilter, { type BpmRange } from "@/components/dashboard/discover/BpmRangeFilter";
import LoadMoreButton from "@/components/dashboard/_shared/LoadMoreButton";
import CoverArt, { genreColor, genreColorBg } from "@/components/dashboard/discover/CoverArt";
import TrackPreviewButton from "@/components/player/preview/TrackPreviewButton";
import { mockDiscoverTracks, discoverGenres, discoverLabels } from "@/lib/mock/discover";
import { mockLabels } from "@/lib/mock/labels";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";

const PAGE_SIZE = 12;

type SortOption = "newest" | "feedback";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "feedback", label: "Most feedback" },
];

export default function DiscoverPage() {
  const router = useRouter();
  const genres = discoverGenres();
  const labels = discoverLabels();
  const keys = useMemo(
    () => [...new Set(mockDiscoverTracks.map((t) => t.key).filter((k): k is string => Boolean(k)))].sort(),
    []
  );
  const producers = useMemo(
    () => [...new Set(mockDiscoverTracks.map((t) => t.producer.name))].sort(),
    []
  );
  const bpmBounds = useMemo<BpmRange>(() => {
    const bpms = mockDiscoverTracks.map((t) => t.bpm).filter((b): b is number => b !== undefined);
    return { min: Math.min(...bpms), max: Math.max(...bpms) };
  }, []);

  const [genre, setGenre] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [trackKey, setTrackKey] = useState<string | null>(null);
  const [producer, setProducer] = useState<string | null>(null);
  const [bpmRange, setBpmRange] = useState<BpmRange | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const resetAll = () => {
    setGenre(null);
    setLabel(null);
    setTrackKey(null);
    setProducer(null);
    setBpmRange(null);
  };
  const hasActiveFilters = Boolean(genre || label || trackKey || producer || bpmRange);

  const filtered = useMemo(() => {
    const matches = mockDiscoverTracks.filter((t) => {
      if (genre && t.genre !== genre) return false;
      if (label && t.label !== label) return false;
      if (trackKey && t.key !== trackKey) return false;
      if (producer && t.producer.name !== producer) return false;
      if (bpmRange && t.bpm !== undefined && (t.bpm < bpmRange.min || t.bpm > bpmRange.max)) return false;
      return true;
    });
    const sorted = [...matches].sort((a, b) =>
      sortBy === "newest"
        ? +new Date(b.openedForFeedbackAt) - +new Date(a.openedForFeedbackAt)
        : b.feedbackCount - a.feedbackCount
    );
    return sorted;
  }, [genre, label, trackKey, producer, bpmRange, sortBy]);

  const { visibleItems: visible, hasMore, remaining, loadMore } = usePaginatedList(
    filtered,
    PAGE_SIZE,
    `${genre ?? ""}-${label ?? ""}-${trackKey ?? ""}-${producer ?? ""}-${bpmRange?.min ?? ""}-${bpmRange?.max ?? ""}-${sortBy}`
  );

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-5xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Discover" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Discover</h1>
      <p className="text-sm text-text-secondary mb-6">
        Tracks other producers opened up for feedback — across every label, not just yours.
      </p>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--color-border)]
        bg-surface px-4 py-3 mb-3">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Compass size={14} />
          <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
        </div>
        <FilterDropdown
          label="Genre"
          options={genres}
          value={genre}
          onChange={setGenre}
        />
        <FilterDropdown
          label="Label"
          options={labels}
          value={label}
          onChange={setLabel}
        />
        <BpmRangeFilter bounds={bpmBounds} value={bpmRange} onChange={setBpmRange} />
        <FilterDropdown
          label="Key"
          options={keys}
          value={trackKey}
          onChange={setTrackKey}
        />
        <FilterDropdown
          label="Producer"
          options={producers}
          value={producer}
          onChange={setProducer}
        />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <RotateCcw size={11} /> Reset all
          </button>
        )}
        <span className="ml-auto text-xs text-text-secondary">
          {filtered.length} {filtered.length === 1 ? "track" : "tracks"}
        </span>
      </div>

      {/* ── Sort bar — reorders, doesn't narrow results, so it's separate from Filters ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6 px-1">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <ArrowDownUp size={13} />
          <span className="text-xs font-semibold uppercase tracking-wider">Sort</span>
        </div>
        <div className="flex gap-1 rounded-lg border border-[var(--color-border)] bg-surface p-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSortBy(opt.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors
                ${sortBy === opt.value
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map((track) => (
          <Link
            key={track.id}
            href={`/dashboard/discover/${track.id}`}
            className="group rounded-xl border border-[var(--color-border)] bg-surface p-3
              hover:border-accent/50 transition-colors"
          >
            <div className="relative mb-3">
              <CoverArt seed={track.id} className="transition-transform group-hover:scale-[1.02]" />
              <TrackPreviewButton track={track} artistName={track.producer.name} />
            </div>
            <p className="text-sm font-medium text-text-primary truncate">{track.title}</p>
            <p className="text-xs text-text-secondary truncate mb-2">
              {track.producer.name} ·{" "}
              {(() => {
                const realLabel = mockLabels.find((l) => l.name === track.label);
                if (!realLabel) return track.label;
                return (
                  <span
                    role="link"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(`/dashboard/labels/${realLabel.slug}`);
                    }}
                    className="hover:text-accent hover:underline underline-offset-2 transition-colors"
                  >
                    {track.label}
                  </span>
                );
              })()}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium truncate"
                style={{ color: genreColor(track.genre), backgroundColor: genreColorBg(track.genre) }}
              >
                <Tag size={9} className="shrink-0" />
                <span className="truncate">{track.genre}</span>
              </span>
              <span className="shrink-0 text-[10px] font-semibold text-text-secondary tabular-nums">
                {track.bpm} BPM
              </span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-sm text-text-secondary py-8 text-center">
            No open tracks match these filters.
          </p>
        )}
      </div>

      {hasMore && (
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
          <LoadMoreButton onClick={loadMore} remaining={remaining} pageSize={PAGE_SIZE} />
        </div>
      )}
    </main>
  );
}
