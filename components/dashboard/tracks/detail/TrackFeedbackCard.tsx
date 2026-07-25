"use client";

import { useState } from "react";
import { MessageSquareText, ChevronDown, ChevronUp } from "lucide-react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import FeedbackScoreForm from "@/components/dashboard/feedback/FeedbackScoreForm";
import { mockArtist } from "@/lib/mock/artist";
import type { Track } from "@/types/track";

/**
 * Scoring is a global capability, not gated by whether the artist put this
 * track in Discover's curated feed — Discover controls which recent tracks
 * producers browse to stay connected with what's new; it was never meant
 * to be the only door into leaving feedback. Any track reachable here
 * (from a label's release list, an artist's catalog, wherever) can receive
 * a score. See docs/feature-discover-producers.md, "Scoring is global, not
 * Discover-only" — this replaces the old `track.openForFeedback` gate that
 * hid this card outright for every track not opted into that feed.
 *
 * Starts collapsed (just the CTA) and expands inline into the same
 * `FeedbackScoreForm` Discover's own page uses, instead of navigating away
 * — Track Detail already has the track's context on screen, no reason to
 * leave it to score.
 *
 * Hidden for label-manager view (feedback is a producer-to-producer
 * action) and for a producer viewing their own track (can't leave
 * feedback on yourself) — see docs/README-routing-architecture.md.
 */
export default function TrackFeedbackCard({ track }: { track: Track }) {
  const view = usePrototypeViewStore((s) => s.view);
  const [open, setOpen] = useState(false);
  const credited = track.artistIds ?? [track.artistId];

  if (view === "label_manager") return null;
  if (credited.includes(mockArtist.id)) return null;

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <MessageSquareText size={14} className="text-sky-500" />
          <span className="text-sm font-semibold text-text-primary">Give feedback</span>
        </span>
        {open ? (
          <ChevronUp size={14} className="text-text-secondary shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-text-secondary shrink-0" />
        )}
      </button>

      {!open && (
        <p className="mt-1 text-xs text-text-secondary">
          Score this track on groove, mix, arrangement, and more.
        </p>
      )}

      {open && (
        <div className="mt-4">
          <FeedbackScoreForm track={track} />
        </div>
      )}
    </div>
  );
}
