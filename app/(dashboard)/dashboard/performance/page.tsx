"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Music2, Disc3, Star, Search } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";
import StreamsChart from "@/components/dashboard/StreamsChart";
import GenreDonut from "@/components/dashboard/GenreDonut";
import { fetchArtistWithTracks } from "@/lib/api/artist";
import { TRACK_STREAMS, TRACK_SALES, TRACK_GENRES } from "@/lib/mock/performance";
import type { ProtonTrack } from "@/lib/api/artist";

// ── Types ──────────────────────────────────────────────────────
type Range  = "30D" | "3M" | "6M" | "1Y" | "All";
type Filter = "Tracks" | "Releases" | "Labels" | "Genres";

const RANGES: Range[]  = ["30D", "3M", "6M", "1Y", "All"];
const FILTERS: Filter[] = ["Tracks", "Releases", "Labels", "Genres"];

// ── Helpers ────────────────────────────────────────────────────
function totalStreams(tracks: ProtonTrack[]) {
  return tracks.reduce((s, t) => s + (TRACK_STREAMS[t.id] ?? 0), 0);
}
function totalSales(tracks: ProtonTrack[]) {
  return tracks.reduce((s, t) => s + (TRACK_SALES[t.id] ?? 0), 0);
}
function topTrack(tracks: ProtonTrack[]) {
  return [...tracks].sort(
    (a, b) => (TRACK_STREAMS[b.id] ?? 0) - (TRACK_STREAMS[a.id] ?? 0)
  )[0];
}

// ── Main Page ──────────────────────────────────────────────────
export default function PerformancePage() {
  const [range,  setRange]  = useState<Range>("All");
  const [filter, setFilter] = useState<Filter>("Tracks");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"streams" | "sales" | "date">("streams");
  const [sortAsc, setSortAsc] = useState(false);

  const { data: artist, isLoading } = useQuery({
    queryKey: ["artist", "88457"],
    queryFn: () => fetchArtistWithTracks("88457"),
  });

  const tracks = artist?.tracks ?? [];

  // Build table rows depending on active filter
  const tableRows = buildRows(tracks, filter, search, sortKey, sortAsc);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">

        <DashboardBreadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Performance" },
          ]}
        />

        {/* ── Page header + range selector ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-text-primary">Performance</h1>
            <p className="text-xs text-text-secondary mt-0.5">Streams, sales and catalog analytics</p>
          </div>
          <div className="flex items-center gap-1 bg-surface border border-[var(--color-border)] rounded-xl p-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  range === r
                    ? "bg-accent text-background"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI cards ── */}
        <section className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4">
          <KpiCard
            icon={<TrendingUp size={14} />}
            label="Total Streams"
            value={isLoading ? "—" : totalStreams(tracks).toString()}
            accent
          />
          <KpiCard
            icon={<Disc3 size={14} />}
            label="Total Sales"
            value={isLoading ? "—" : totalSales(tracks).toString()}
          />
          <KpiCard
            icon={<Star size={14} />}
            label="Top Track"
            value={isLoading ? "—" : (topTrack(tracks)?.title ?? "—")}
            small
          />
          <KpiCard
            icon={<Music2 size={14} />}
            label="Releases"
            value={isLoading ? "—" : new Set(tracks.map((t) => t.release.id)).size.toString()}
          />
        </section>

        {/* ── Charts row ── */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-4 space-y-4 lg:space-y-0 mb-6">

          <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-text-primary">Streams over time</h2>
              <span className="text-xs text-accent font-medium">+37% ↑</span>
            </div>
            <Suspense fallback={<div className="h-40 animate-pulse rounded-lg bg-[var(--color-border)]" />}>
              <StreamsChart />
            </Suspense>
          </section>

          <section className="bg-surface rounded-2xl border border-[var(--color-border)] p-4">
            <h2 className="text-sm font-medium text-text-primary mb-3">Streams by Genre</h2>
            {isLoading ? (
              <div className="h-48 animate-pulse rounded-lg bg-[var(--color-border)]" />
            ) : (
              <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-[var(--color-border)]" />}>
                <GenreDonut tracks={tracks} />
              </Suspense>
            )}
          </section>
        </div>

        {/* ── Tracks table ── */}
        <section className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">

          {/* Filter tabs + search */}
          <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
            <div className="flex gap-1 overflow-x-auto">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative shrink-0">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 pl-7 pr-3 py-1.5 rounded-lg bg-[var(--color-border)] text-xs
                  text-text-primary placeholder:text-text-secondary
                  border border-transparent focus:border-accent/50 outline-none transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg animate-pulse bg-[var(--color-border)]" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary w-8">
                      #
                    </th>
                    <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      {filter === "Releases" ? "Release" : filter === "Labels" ? "Label" : filter === "Genres" ? "Genre" : "Title"}
                    </th>
                    {filter === "Tracks" && (
                      <th className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-text-secondary hidden md:table-cell">
                        Release
                      </th>
                    )}
                    <SortHeader label="Streams" sortKey="streams" current={sortKey} asc={sortAsc} onSort={handleSort} />
                    <SortHeader label="Sales"   sortKey="sales"   current={sortKey} asc={sortAsc} onSort={handleSort} />
                    <SortHeader label="Date"    sortKey="date"    current={sortKey} asc={sortAsc} onSort={handleSort} />
                  </tr>
                </thead>
                <tbody>
                  {tableRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-secondary italic">
                        No results found.
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((row, i) => (
                      <tr
                        key={row.id}
                        className="border-t border-[var(--color-border)] hover:bg-[var(--color-border)] transition-colors"
                      >
                        <td className="px-4 py-3 text-xs text-text-secondary tabular-nums">{i + 1}</td>
                        <td className="px-2 py-3">
                          <p className="text-sm text-text-primary truncate max-w-[160px]">{row.name}</p>
                          {row.sub && <p className="text-xs text-text-secondary mt-0.5">{row.sub}</p>}
                        </td>
                        {filter === "Tracks" && (
                          <td className="px-2 py-3 text-xs text-text-secondary hidden md:table-cell">
                            {row.release}
                          </td>
                        )}
                        <td className="px-2 py-3 text-sm text-text-primary tabular-nums font-medium">
                          {row.streams > 0 ? row.streams : <span className="text-text-secondary">—</span>}
                        </td>
                        <td className="px-2 py-3 text-sm tabular-nums">
                          {row.sales > 0
                            ? <span className="text-accent font-medium">{row.sales}</span>
                            : <span className="text-text-secondary">—</span>
                          }
                        </td>
                        <td className="px-2 py-3 text-xs text-text-secondary tabular-nums">{row.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-4 py-3 border-t border-[var(--color-border)]">
            <p className="text-xs text-text-secondary">
              Showing {tableRows.length} {filter.toLowerCase()}
            </p>
          </div>
        </section>

      </main>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function KpiCard({
  icon, label, value, accent = false, small = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: boolean;
  small?: boolean;
}) {
  return (
    <div className="bg-surface rounded-xl border border-[var(--color-border)] px-3 py-4 flex flex-col gap-2">
      <div className={`flex items-center gap-1.5 ${accent ? "text-accent" : "text-text-secondary"}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={`font-semibold tabular-nums text-text-primary truncate ${small ? "text-base" : "text-2xl"}`}>
        {value}
      </span>
    </div>
  );
}

function SortHeader({
  label, sortKey, current, asc, onSort,
}: {
  label: string;
  sortKey: "streams" | "sales" | "date";
  current: string;
  asc: boolean;
  onSort: (k: "streams" | "sales" | "date") => void;
}) {
  const active = current === sortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="px-2 py-3 text-left text-[10px] font-semibold uppercase tracking-wider
        text-text-secondary cursor-pointer hover:text-text-primary transition-colors select-none"
    >
      {label} {active ? (asc ? "↑" : "↓") : ""}
    </th>
  );
}

// ── Table row builder ──────────────────────────────────────────

interface Row {
  id: string;
  name: string;
  sub?: string;
  release?: string;
  streams: number;
  sales: number;
  date: string;
}

function buildRows(
  tracks: ProtonTrack[],
  filter: Filter,
  search: string,
  sortKey: "streams" | "sales" | "date",
  sortAsc: boolean
): Row[] {
  const q = search.toLowerCase();
  let rows: Row[] = [];

  if (filter === "Tracks") {
    rows = tracks.map((t) => ({
      id:      t.id,
      name:    t.title,
      sub:     TRACK_GENRES[t.id],
      release: t.release.name,
      streams: TRACK_STREAMS[t.id] ?? 0,
      sales:   TRACK_SALES[t.id]   ?? 0,
      date:    t.release.date,
    }));
  } else if (filter === "Releases") {
    const map = new Map<string, Row>();
    for (const t of tracks) {
      const id = t.release.id;
      const existing = map.get(id);
      if (existing) {
        existing.streams += TRACK_STREAMS[t.id] ?? 0;
        existing.sales   += TRACK_SALES[t.id]   ?? 0;
      } else {
        map.set(id, {
          id,
          name:    t.release.name,
          sub:     t.release.label.name,
          streams: TRACK_STREAMS[t.id] ?? 0,
          sales:   TRACK_SALES[t.id]   ?? 0,
          date:    t.release.date,
        });
      }
    }
    rows = Array.from(map.values());
  } else if (filter === "Labels") {
    const map = new Map<string, Row>();
    for (const t of tracks) {
      const id = t.release.label.id;
      const existing = map.get(id);
      if (existing) {
        existing.streams += TRACK_STREAMS[t.id] ?? 0;
        existing.sales   += TRACK_SALES[t.id]   ?? 0;
      } else {
        map.set(id, {
          id,
          name:    t.release.label.name,
          streams: TRACK_STREAMS[t.id] ?? 0,
          sales:   TRACK_SALES[t.id]   ?? 0,
          date:    t.release.date,
        });
      }
    }
    rows = Array.from(map.values());
  } else if (filter === "Genres") {
    const map = new Map<string, Row>();
    for (const t of tracks) {
      const genre = TRACK_GENRES[t.id] ?? "Other";
      const existing = map.get(genre);
      if (existing) {
        existing.streams += TRACK_STREAMS[t.id] ?? 0;
        existing.sales   += TRACK_SALES[t.id]   ?? 0;
      } else {
        map.set(genre, {
          id:      genre,
          name:    genre,
          streams: TRACK_STREAMS[t.id] ?? 0,
          sales:   TRACK_SALES[t.id]   ?? 0,
          date:    t.release.date,
        });
      }
    }
    rows = Array.from(map.values());
  }

  // Filter by search
  if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q));

  // Sort
  rows.sort((a, b) => {
    let diff = 0;
    if (sortKey === "streams") diff = b.streams - a.streams;
    else if (sortKey === "sales") diff = b.sales - a.sales;
    else diff = b.date.localeCompare(a.date);
    return sortAsc ? -diff : diff;
  });

  return rows;
}
