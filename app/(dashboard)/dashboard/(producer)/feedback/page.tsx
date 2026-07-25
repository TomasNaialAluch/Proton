"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronRight, Clock } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import FilterDropdown from "@/components/dashboard/discover/FilterDropdown";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import Skeleton from "@/components/ui/Skeleton";
import { fetchReceivedFeedback, fetchPendingToReview } from "@/lib/api/feedback";
import { fetchTracks } from "@/lib/api/tracks";
import { PEER_TRACKS } from "@/lib/mock/peerTracks";
import { FEEDBACK_CATEGORIES, type Feedback } from "@/types/feedback";
import type { Track } from "@/types/track";

function trackTitle(tracks: Track[], trackId: string) {
  return tracks.find((t) => t.id === trackId)?.title ?? "Unknown track";
}

function averageScore(scores: Record<string, number | undefined>) {
  const values = FEEDBACK_CATEGORIES.map((c) => scores[c.key]).filter(
    (v): v is number => v !== undefined
  );
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

type SortOption = "recent" | "most_feedback" | "highest_rated";

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Most recent",
  most_feedback: "Most feedback",
  highest_rated: "Highest rated",
};

interface TrackFeedbackSummary {
  track: Track;
  count: number;
  avg: number | null;
  lastAt: string;
  hasUnread: boolean;
}

/**
 * Groups individual `Feedback` rows by track — a track with several reviews
 * used to render as several separate rows with the same title repeated and
 * no aggregate, which doesn't scale once a track has more than a couple of
 * reviews (or a producer has many reviewed tracks). See
 * docs/feature-peer-feedback-tracks.md.
 */
function groupByTrack(feedback: Feedback[], tracks: Track[]): TrackFeedbackSummary[] {
  const byTrack = new Map<string, Feedback[]>();
  for (const fb of feedback) {
    const list = byTrack.get(fb.trackId) ?? [];
    list.push(fb);
    byTrack.set(fb.trackId, list);
  }

  return [...byTrack.entries()].flatMap(([trackId, entries]) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return [];
    const scored = entries.map((e) => averageScore(e.scores)).filter((v): v is number => v !== null);
    const avg = scored.length > 0 ? scored.reduce((a, b) => a + b, 0) / scored.length : null;
    const lastAt = entries.reduce((latest, e) => (e.createdAt > latest ? e.createdAt : latest), entries[0].createdAt);
    const hasUnread = entries.some((e) => !e.read);
    return [{ track, count: entries.length, avg, lastAt, hasUnread }];
  });
}

export default function FeedbackPage() {
  // Real fetchers behind lib/api/, not mock arrays imported straight into
  // the page — see docs/feature-peer-feedback-tracks.md. `myTracks` covers
  // "Received" (feedback on tracks I own); `PEER_TRACKS` covers "Pending
  // to review" (other producers' tracks) — a real API would resolve both
  // through one `GET /tracks/:id`-style lookup regardless of owner.
  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ["feedback", "pending"],
    queryFn: fetchPendingToReview,
  });
  const { data: received, isLoading: receivedLoading } = useQuery({
    queryKey: ["feedback", "received"],
    queryFn: fetchReceivedFeedback,
  });
  const { data: myTracks, isLoading: tracksLoading } = useQuery({
    queryKey: ["tracks"],
    queryFn: fetchTracks,
  });

  const isLoading = pendingLoading || receivedLoading || tracksLoading;
  const allTracks = useMemo(() => [...(myTracks ?? []), ...PEER_TRACKS], [myTracks]);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("recent");

  const summaries = useMemo(() => groupByTrack(received ?? [], allTracks), [received, allTracks]);
  const genres = useMemo(() => [...new Set(summaries.map((s) => s.track.genre))].sort(), [summaries]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return summaries.filter((s) => {
      const matchesQuery = query ? s.track.title.toLowerCase().includes(query) : true;
      const matchesGenre = genre ? s.track.genre === genre : true;
      return matchesQuery && matchesGenre;
    });
  }, [summaries, search, genre]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "recent":
        return list.sort((a, b) => b.lastAt.localeCompare(a.lastAt));
      case "most_feedback":
        return list.sort((a, b) => b.count - a.count);
      case "highest_rated":
        return list.sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));
    }
  }, [filtered, sort]);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Feedback" },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-6">Feedback</h1>

      {/* ── Pending to review ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Pending to review {!isLoading && `(${pending?.length ?? 0})`}
        </h2>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14" />
            <Skeleton className="h-14" />
          </div>
        ) : !pending || pending.length === 0 ? (
          <p className="text-sm text-text-secondary">Nothing assigned to you right now.</p>
        ) : (
          <ul className="space-y-2">
            {pending.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/dashboard/feedback/${req.id}?mode=give`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]
                    bg-surface px-4 py-3 hover:bg-[var(--color-border)]/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {trackTitle(allTracks, req.trackId)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      Requested by {req.fromProducer.name} · {timeAgo(req.requestedAt)}
                    </p>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-text-secondary" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Received — grouped by track, one row per track (not per review),
          filterable/sortable the same way Discover and a label's releases
          list are, since this is the same "find a track" problem. ── */}
      <section>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Received {!isLoading && `(${received?.length ?? 0})`}
        </h2>

        {!isLoading && summaries.length > 0 && (
          <div className="flex flex-col gap-3 mb-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search your tracks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[var(--color-border)]/40 text-sm
                  text-text-primary placeholder:text-text-secondary
                  border border-transparent focus:border-accent/50 outline-none transition-colors"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-text-secondary shrink-0">Sort by</label>
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
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : summaries.length === 0 ? (
          <p className="text-sm text-text-secondary">No feedback yet on your tracks.</p>
        ) : sorted.length === 0 ? (
          <p className="text-sm text-text-secondary">No tracks match these filters.</p>
        ) : (
          <ul className="space-y-2">
            {sorted.map((s) => (
              <li key={s.track.id}>
                <Link
                  href={`/dashboard/feedback/track/${s.track.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)]
                    bg-surface px-4 py-3 hover:bg-[var(--color-border)]/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <CoverArt seed={s.track.id} className="size-9" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate flex items-center gap-1.5">
                        {s.track.title}
                        {s.hasUnread && <span className="size-1.5 rounded-full bg-accent shrink-0" />}
                      </p>
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        {s.track.genre} · {s.count} review{s.count === 1 ? "" : "s"}
                        <Clock size={10} className="ml-1 opacity-60" /> {timeAgo(s.lastAt)}
                      </p>
                    </div>
                  </div>
                  {s.avg !== null && (
                    <span className="shrink-0 text-sm font-semibold text-text-primary tabular-nums">
                      {s.avg.toFixed(1)}
                      <span className="text-text-secondary text-xs">/10</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
