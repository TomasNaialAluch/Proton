"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import PreviewInlinePanel from "@/components/player/preview/PreviewInlinePanel";
import ScoreBar from "./ScoreBar";
import { FEEDBACK_CATEGORIES, type FeedbackCategoryKey, type FeedbackScores } from "@/types/feedback";
import type { Track } from "@/types/track";

/**
 * The actual "give feedback" action — extracted out of what used to be
 * inlined entirely inside `discover/[trackId]/page.tsx` (player + 6 score
 * bars + comment + submit + confirmation, ~60 lines of page-level state and
 * markup with no reuse boundary). Now a single component so it can be
 * embedded anywhere a track is reachable, not just from Discover's feed —
 * see docs/feature-discover-producers.md, "Scoring is global, not
 * Discover-only": Discover curates *which* recent tracks producers browse,
 * but any track (reached via Track Detail, a label's release list, an
 * artist's catalog) should be scoreable.
 *
 * No metadata header (title/genre/BPM/key) — the caller is expected to
 * already show that (Track Detail's own header, or Discover's page-level
 * title line), so this only renders playback + the scoring UI itself.
 *
 * Note: like the page it was extracted from, this doesn't persist
 * anywhere yet — `submitted` is local state only, nothing is written to a
 * store or notifies the track's artist. Flagging so it doesn't read as
 * more finished than it is.
 */
export default function FeedbackScoreForm({
  track,
  showPlayer = true,
}: {
  track: Track;
  /** Off for Track Detail's embedded card, for now — see
   *  docs/feature-discover-producers.md. Discover's own standalone page
   *  still wants it (no player exists anywhere else on that page). */
  showPlayer?: boolean;
}) {
  const [scores, setScores] = useState<FeedbackScores>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const setScore = (key: FeedbackCategoryKey, value: number) =>
    setScores((prev) => ({ ...prev, [key]: value }));

  const allScored = FEEDBACK_CATEGORIES.every((c) => scores[c.key] !== undefined);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 text-center py-10">
        <CheckCircle2 size={32} className="text-accent" />
        <p className="text-sm font-semibold text-text-primary">Feedback sent</p>
        <p className="text-xs text-text-secondary max-w-xs">
          The artist will be notified that you reviewed &ldquo;{track.title}&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {showPlayer && (
        <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5">
          <PreviewInlinePanel track={track} />
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5 space-y-4">
        {FEEDBACK_CATEGORIES.map((cat) => (
          <ScoreBar key={cat.key} label={cat.label} value={scores[cat.key]} onChange={(value) => setScore(cat.key, value)} />
        ))}
      </div>

      <div className="bg-surface rounded-2xl border border-[var(--color-border)] p-5">
        <label htmlFor={`feedback-comment-${track.id}`} className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">
          Comment (optional)
        </label>
        <textarea
          id={`feedback-comment-${track.id}`}
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
    </div>
  );
}
