"use client";

import { notFound, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import FeedbackTrackPlayer from "@/components/dashboard/feedback/FeedbackTrackPlayer";
import ScoreBar from "@/components/dashboard/feedback/ScoreBar";
import Skeleton from "@/components/ui/Skeleton";
import { fetchReceivedFeedback } from "@/lib/api/feedback";
import { fetchTrackById } from "@/lib/api/tracks";
import { FEEDBACK_CATEGORIES, type Feedback, type FeedbackCategoryKey } from "@/types/feedback";

/** Same convention as feedback/[id]: derive id from pathname, not useParams(). */
function trackIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/feedback\/track\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Average of one category across every entry that scored it, rounded to a
 *  whole number — `ScoreBar` renders raw digits (e.g. "7.6666666666667/10"
 *  otherwise), and scores are given as whole numbers to begin with. */
function categoryAverage(entries: Feedback[], key: FeedbackCategoryKey): number | undefined {
  const values = entries.map((e) => e.scores[key]).filter((v): v is number => v !== undefined);
  if (values.length === 0) return undefined;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/**
 * All feedback received on one track — the counterpart to the grouped
 * "Received" list on `/dashboard/feedback`. Stacking every single review in
 * full (all 6 score bars + comment, one block per reviewer) doesn't scale
 * any better here than it did on the list page — a track with 300 reviews
 * would be 300 of those blocks. Instead: an averaged score block up top
 * (the actual signal most people want at a glance), the single latest
 * review in full detail, and older reviews collapsed to one line each.
 */
export default function TrackFeedbackPage() {
  const pathname = usePathname();
  const trackId = trackIdFromPath(pathname);

  const { data: received, isLoading: receivedLoading } = useQuery({
    queryKey: ["feedback", "received"],
    queryFn: fetchReceivedFeedback,
  });
  const { data: track, isLoading: trackLoading } = useQuery({
    queryKey: ["track", trackId],
    queryFn: () => fetchTrackById(trackId),
    enabled: Boolean(trackId),
  });

  const isLoading = receivedLoading || trackLoading;
  const entries = (received ?? [])
    .filter((f) => f.trackId === trackId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (isLoading) {
    return (
      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
        <Skeleton className="h-8 w-2/3 mb-6" />
        <Skeleton className="h-32 mb-6" />
        <Skeleton className="h-48" />
      </main>
    );
  }

  if (!track || entries.length === 0) notFound();

  const [latest, ...older] = entries;

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <BackButton fallbackHref="/dashboard/feedback" label="Back to Feedback" />

      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Feedback", href: "/dashboard/feedback" },
        { label: track.title },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Feedback on {track.title}</h1>
      <p className="text-sm text-text-secondary mb-6">
        {entries.length} review{entries.length === 1 ? "" : "s"}
      </p>

      <div className="mb-6">
        <FeedbackTrackPlayer track={track} />
      </div>

      {entries.length > 1 && (
        <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={15} className="text-accent" />
            <p className="text-sm font-semibold text-text-primary">
              Average across {entries.length} reviews
            </p>
          </div>
          <div className="space-y-3">
            {FEEDBACK_CATEGORIES.map((cat) => (
              <ScoreBar key={cat.key} label={cat.label} value={categoryAverage(entries, cat.key)} />
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-text-primary">
            {latest.fromProducer.name} {entries.length > 1 && <span className="font-normal text-text-secondary">· latest</span>}
          </p>
          <p className="text-xs text-text-secondary">{timeAgo(latest.createdAt)}</p>
        </div>
        <div className="space-y-3 mb-4">
          {FEEDBACK_CATEGORIES.map((cat) => (
            <ScoreBar key={cat.key} label={cat.label} value={latest.scores[cat.key]} />
          ))}
        </div>
        {latest.comment && (
          <p className="text-sm text-text-primary leading-relaxed border-t border-[var(--color-border)] pt-3">
            {latest.comment}
          </p>
        )}
      </div>

      {older.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Earlier reviews
          </p>
          <ul className="flex flex-col gap-2">
            {older.map((fb) => {
              const values = FEEDBACK_CATEGORIES.map((c) => fb.scores[c.key]).filter(
                (v): v is number => v !== undefined
              );
              const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;
              return (
                <li
                  key={fb.id}
                  className="rounded-xl border border-[var(--color-border)] bg-surface px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-text-primary">{fb.fromProducer.name}</p>
                    <div className="flex items-center gap-3 shrink-0">
                      {avg !== null && (
                        <span className="text-xs font-semibold text-text-secondary tabular-nums">
                          {avg.toFixed(1)}/10
                        </span>
                      )}
                      <span className="text-xs text-text-secondary">{timeAgo(fb.createdAt)}</span>
                    </div>
                  </div>
                  {fb.comment && (
                    <p className="mt-1 text-xs text-text-secondary leading-relaxed truncate">
                      {fb.comment}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </main>
  );
}
