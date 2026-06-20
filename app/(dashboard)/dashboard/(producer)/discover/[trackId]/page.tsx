"use client";

import { useState } from "react";
import { notFound, usePathname } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import FeedbackTrackPlayer from "@/components/dashboard/feedback/FeedbackTrackPlayer";
import ScoreBar from "@/components/dashboard/feedback/ScoreBar";
import { mockDiscoverTracks } from "@/lib/mock/discover";
import { FEEDBACK_CATEGORIES, type FeedbackCategoryKey, type FeedbackScores } from "@/types/feedback";

/** Same convention as feedback/[id] and royalties/[id]: derive id from pathname, not useParams(). */
function trackIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/discover\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function DiscoverTrackPage() {
  const pathname = usePathname();
  const trackId = trackIdFromPath(pathname);

  const track = mockDiscoverTracks.find((t) => t.id === trackId);
  if (!track) notFound();

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
          { label: "Discover", href: "/dashboard/discover" },
          { label: track.title },
        ]} />
        <div className="flex flex-col items-center gap-3 text-center py-16">
          <CheckCircle2 size={36} className="text-accent" />
          <h1 className="text-xl font-bold text-text-primary">Feedback sent</h1>
          <p className="text-sm text-text-secondary max-w-sm">
            {track.producer.name} will be notified that you reviewed &ldquo;{track.title}&rdquo;.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Discover", href: "/dashboard/discover" },
        { label: track.title },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">{track.title}</h1>
      <p className="text-sm text-text-secondary mb-6">
        {track.producer.name} · {track.label}
      </p>

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
        <label htmlFor="discover-feedback-comment" className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
          Comment (optional)
        </label>
        <textarea
          id="discover-feedback-comment"
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
