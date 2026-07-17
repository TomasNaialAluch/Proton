"use client";

import { useState } from "react";
import { notFound, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import FeedbackTrackPlayer from "@/components/dashboard/feedback/FeedbackTrackPlayer";
import ScoreBar from "@/components/dashboard/feedback/ScoreBar";
import Skeleton from "@/components/ui/Skeleton";
import { fetchReceivedFeedback, fetchPendingToReview } from "@/lib/api/feedback";
import { fetchTrackById } from "@/lib/api/tracks";
import { FEEDBACK_CATEGORIES, type FeedbackCategoryKey, type FeedbackScores } from "@/types/feedback";
import type { Track } from "@/types/track";

/** Avoid useParams() here — the id is derived from the pathname (see royalties/[id] for the same convention). */
function feedbackIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/feedback\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function FeedbackDetailPage() {
  const pathname = usePathname();
  const id = feedbackIdFromPath(pathname);

  const { data: receivedList, isLoading: receivedLoading } = useQuery({
    queryKey: ["feedback", "received"],
    queryFn: fetchReceivedFeedback,
  });
  const { data: pendingList, isLoading: pendingLoading } = useQuery({
    queryKey: ["feedback", "pending"],
    queryFn: fetchPendingToReview,
  });

  const received = receivedList?.find((f) => f.id === id);
  const pending = pendingList?.find((r) => r.id === id);
  const trackId = received?.trackId ?? pending?.trackId;

  // fetchTrackById checks both "my tracks" and other producers' tracks —
  // a pending-to-review request always points at someone else's, see
  // docs/feature-peer-feedback-tracks.md. Only enabled once we know which
  // track to look up, so it doesn't fire on a bogus/loading id.
  const { data: track, isLoading: trackLoading } = useQuery({
    queryKey: ["track", trackId],
    queryFn: () => fetchTrackById(trackId!),
    enabled: Boolean(trackId),
  });

  const isLoading = receivedLoading || pendingLoading || (Boolean(trackId) && trackLoading);

  if (isLoading) {
    return (
      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
        <Skeleton className="h-8 w-2/3 mb-6" />
        <Skeleton className="h-32 mb-6" />
        <Skeleton className="h-48" />
      </main>
    );
  }

  if (!received && !pending) notFound();
  if (!track) notFound();

  if (received) {
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

  return <GiveFeedbackForm trackTitle={track.title} track={track} requesterName={pending!.fromProducer.name} />;
}

function GiveFeedbackForm({
  trackTitle,
  track,
  requesterName,
}: {
  trackTitle: string;
  track: Track;
  requesterName: string;
}) {
  const [scores, setScores] = useState<FeedbackScores>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const setScore = (key: FeedbackCategoryKey, value: number) =>
    setScores((prev) => ({ ...prev, [key]: value }));

  const allScored = FEEDBACK_CATEGORIES.every((c) => scores[c.key] !== undefined);

  if (submitted) {
    return (
      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
        <DashboardBreadcrumb items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Feedback", href: "/dashboard/feedback" },
          { label: trackTitle },
        ]} />
        <div className="flex flex-col items-center gap-3 text-center py-16">
          <CheckCircle2 size={36} className="text-accent" />
          <h1 className="text-xl font-bold text-text-primary">Feedback sent</h1>
          <p className="text-sm text-text-secondary max-w-sm">
            {requesterName} will be notified that you reviewed &ldquo;{trackTitle}&rdquo;.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Feedback", href: "/dashboard/feedback" },
        { label: trackTitle },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">Review {trackTitle}</h1>
      <p className="text-sm text-text-secondary mb-6">Requested by {requesterName}</p>

      <div className="mb-6">
        <FeedbackTrackPlayer track={track} />
      </div>

      <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5 space-y-4 mb-6">
        {FEEDBACK_CATEGORIES.map((cat) => (
          <ScoreBar
            key={cat.key}
            label={cat.label}
            value={scores[cat.key]}
            onChange={(value) => setScore(cat.key, value)}
          />
        ))}
      </div>

      <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5 mb-6">
        <label htmlFor="feedback-comment" className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
          Comment (optional)
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="What stands out, what would you change..."
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-background
            px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60
            focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <button
        type="button"
        disabled={!allScored}
        onClick={() => setSubmitted(true)}
        className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white
          disabled:opacity-40 transition-opacity"
      >
        {allScored ? "Send feedback" : "Score every category to send"}
      </button>
    </main>
  );
}
