"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, usePathname, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import LoadMoreButton from "@/components/dashboard/_shared/LoadMoreButton";
import FilterDropdown from "@/components/dashboard/discover/FilterDropdown";
import BpmRangeFilter, { type BpmRange } from "@/components/dashboard/discover/BpmRangeFilter";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import TrackPreviewButton from "@/components/player/preview/TrackPreviewButton";
import { LABEL_SAMPLE_TRACKS, LABEL_DEMO_CATALOG_NOTICE } from "@/lib/mock/labelSampleCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { mockLabels } from "@/lib/mock/labels";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { backChainForward } from "@/lib/utils/navigation";
import type { Track } from "@/types/track";

const PAGE_SIZE = 25;

type SortOption = "newest" | "oldest" | "title_az" | "title_za" | "genre_az" | "genre_za";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest to oldest",
  oldest: "Oldest to newest",
  title_az: "Title A-Z",
  title_za: "Title Z-A",
  genre_az: "Genre A-Z",
  genre_za: "Genre Z-A",
};

function labelSlugFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/labels\/([^/]+)\/releases\/?$/);
  return m?.[1] ?? "";
}

function artistNames(t: { artistId: string; artistIds?: string[] }) {
  const ids = t.artistIds ?? [t.artistId];
  return ids.map((id) => mockRosterArtists.find((a) => a.id === id)?.name ?? "Unknown artist").join(" & ");
}

function sortTracks(tracks: Track[], sort: SortOption): Track[] {
  const sorted = [...tracks];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    case "oldest":
      return sorted.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
    case "title_az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title_za":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "genre_az":
      return sorted.sort((a, b) => a.genre.localeCompare(b.genre));
    case "genre_za":
      return sorted.sort((a, b) => b.genre.localeCompare(a.genre));
  }
}

export default function LabelReleasesPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const slug = labelSlugFromPath(pathname);
  const label = mockLabels.find((l) => l.slug === slug);
  if (!label) notFound();

  // Where "back" should go (the label's own chain, forwarded via the
  // "View all" link), and what to hand off to Track links so Back keeps
  // unwinding correctly. See docs/README-navigation-back-flow.md.
  const from = searchParams.get("from");
  const backChain = backChainForward(pathname, searchParams);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [trackKey, setTrackKey] = useState<string | null>(null);
  const [artist, setArtist] = useState<string | null>(null);
  const [bpmRange, setBpmRange] = useState<BpmRange | null>(null);
  const [sort, setSort] = useState<SortOption>("newest");
  const query = search.trim().toLowerCase();

  const genres = [...new Set(LABEL_SAMPLE_TRACKS.map((t) => t.genre))].sort();
  const keys = [...new Set(LABEL_SAMPLE_TRACKS.map((t) => t.key).filter((k): k is string => Boolean(k)))].sort();
  const artists = [...new Set(LABEL_SAMPLE_TRACKS.flatMap((t) => (t.artistIds ?? [t.artistId])
    .map((id) => mockRosterArtists.find((a) => a.id === id)?.name)
    .filter((n): n is string => Boolean(n))))].sort();
  const bpmBounds: BpmRange = (() => {
    const bpms = LABEL_SAMPLE_TRACKS.map((t) => t.bpm).filter((b): b is number => b !== undefined);
    return bpms.length ? { min: Math.min(...bpms), max: Math.max(...bpms) } : { min: 100, max: 160 };
  })();

  const resetAll = () => {
    setGenre(null);
    setTrackKey(null);
    setArtist(null);
    setBpmRange(null);
  };
  const hasActiveFilters = Boolean(genre || trackKey || artist || bpmRange);

  const filtered = LABEL_SAMPLE_TRACKS.filter((t) => {
    const matchesQuery = query
      ? t.title.toLowerCase().includes(query) || artistNames(t).toLowerCase().includes(query)
      : true;
    const matchesGenre = genre ? t.genre === genre : true;
    const matchesKey = trackKey ? t.key === trackKey : true;
    const matchesArtist = artist ? artistNames(t).includes(artist) : true;
    const matchesBpm = bpmRange && t.bpm !== undefined ? t.bpm >= bpmRange.min && t.bpm <= bpmRange.max : true;
    return matchesQuery && matchesGenre && matchesKey && matchesArtist && matchesBpm;
  });
  const sorted = sortTracks(filtered, sort);

  const { visibleItems: pagedTracks, hasMore, remaining, loadMore } = usePaginatedList(
    sorted,
    PAGE_SIZE,
    `${query}-${genre ?? ""}-${trackKey ?? ""}-${artist ?? ""}-${bpmRange?.min ?? ""}-${bpmRange?.max ?? ""}-${sort}`
  );

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <BackButton href={from ?? undefined} fallbackHref={`/dashboard/labels/${label.slug}`} label="Back" />

      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: label.name, href: `/dashboard/labels/${label.slug}` },
        { label: "Releases" },
      ]} />

      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">All releases</h1>
        <p className="text-sm text-text-secondary">{label.name}</p>
      </div>

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search releases…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[var(--color-border)]/40 text-sm
            text-text-primary placeholder:text-text-secondary
            border border-transparent focus:border-accent/50 outline-none transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-text-secondary shrink-0">
          Sort by
        </label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2 text-xs
            text-text-primary outline-none focus:border-accent/50 transition-colors"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>{SORT_LABELS[key]}</option>
          ))}
        </select>

        <FilterDropdown label="Genre" options={genres} value={genre} onChange={setGenre} />
        <BpmRangeFilter bounds={bpmBounds} value={bpmRange} onChange={setBpmRange} />
        <FilterDropdown label="Key" options={keys} value={trackKey} onChange={setTrackKey} />
        <FilterDropdown label="Artist" options={artists} value={artist} onChange={setArtist} />
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <RotateCcw size={11} /> Reset all
          </button>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
        {pagedTracks.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-text-secondary">No releases match these filters.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {pagedTracks.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/dashboard/tracks/${t.id}?from=${encodeURIComponent(backChain)}`}
                  className="group flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-border)]/30 transition-colors"
                >
                  <div className="relative shrink-0">
                    <CoverArt seed={t.id} className="size-11" />
                    <TrackPreviewButton track={t} artistName={artistNames(t)} size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{t.title}</p>
                    <p className="text-xs text-text-secondary truncate">{artistNames(t)}</p>
                    <p className="text-[11px] text-text-secondary/70 truncate mt-0.5">
                      {t.genre}{t.bpm ? ` · ${t.bpm} BPM` : ""}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {hasMore && <LoadMoreButton onClick={loadMore} remaining={remaining} pageSize={PAGE_SIZE} />}
      </div>

      <p className="text-[11px] text-text-secondary/70 italic">{LABEL_DEMO_CATALOG_NOTICE}</p>
    </main>
  );
}
