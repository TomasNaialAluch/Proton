"use client";

import { notFound, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import FeedbackTrackPlayer from "@/components/dashboard/feedback/FeedbackTrackPlayer";
import ScoreBar from "@/components/dashboard/feedback/ScoreBar";
import Skeleton from "@/components/ui/Skeleton";
import { fetchReceivedFeedback } from "@/lib/api/feedback";
import { fetchTrackById } from "@/lib/api/tracks";
import { FEEDBACK_CATEGORIES } from "@/types/feedback";

/** Avoid useParams() here — the id is derived from the pathname (see royalties/[id] for the same convention). */
function feedbackIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/feedback\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

/**
 * Read-only view of a single piece of feedback you already received —
 * reached from a notification deep link (see NotificationsPanel.tsx).
 * There's no "give feedback" mode here: that only ever happens on the
 * track's own page (TrackFeedbackCard's "Review this track" — a global
 * capability, not gated behind a formal request system). See
 * docs/feature-peer-feedback-tracks.md.
 */
export default function FeedbackDetailPage() {
  const pathname = usePathname();
  const id = feedbackIdFromPath(pathname);

  const { data: receivedList, isLoading: receivedLoading } = useQuery({
    queryKey: ["feedback", "received"],
    queryFn: fetchReceivedFeedback,
  });

  const received = receivedList?.find((f) => f.id === id);

  const { data: track, isLoading: trackLoading } = useQuery({
    queryKey: ["track", received?.trackId],
    queryFn: () => fetchTrackById(received!.trackId),
    enabled: Boolean(received?.trackId),
  });

  const isLoading = receivedLoading || (Boolean(received?.trackId) && trackLoading);

  if (isLoading) {
    return (
      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
        <Skeleton className="h-8 w-2/3 mb-6" />
        <Skeleton className="h-32 mb-6" />
        <Skeleton className="h-48" />
      </main>
    );
  }

  if (!received) notFound();
  if (!track) notFound();

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Feedback", href: "/dashboard/feedback" },
        { label: track.title },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Feedback on {track.title}</h1>
      <p className="text-sm text-text-secondary mb-6">From {received.fromProducer.name}</p>

      <div className="mb-6">
        <FeedbackTrackPlayer track={track} />
      </div>

      <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5 space-y-4 mb-6">
        {FEEDBACK_CATEGORIES.map((cat) => (
          <ScoreBar key={cat.key} label={cat.label} value={received.scores[cat.key]} />
        ))}
      </div>

      {received.comment && (
        <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Comment
          </p>
          <p className="text-sm text-text-primary leading-relaxed">{received.comment}</p>
        </div>
      )}
    </main>
  );
}
