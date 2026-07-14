"use client";

import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { mockDiscoverTracks } from "@/lib/mock/discover";
import { mockArtist } from "@/lib/mock/artist";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import type { Track } from "@/types/track";

/**
 * Conditional on the shared Track's `openForFeedback` flag — see
 * docs/feature-track-detail.md. "Give feedback" only links out if the
 * track is actually in Discover's list; otherwise shows an informational
 * line instead of a dead link.
 *
 * Hidden for label-manager view (feedback is a producer-to-producer
 * action) and for a producer viewing their own track (can't leave
 * feedback on yourself) — see docs/README-routing-architecture.md.
 */
export default function TrackFeedbackCard({ track }: { track: Track }) {
  const view = usePrototypeViewStore((s) => s.view);
  const credited = track.artistIds ?? [track.artistId];

  if (!track.openForFeedback) return null;
  if (view === "label_manager") return null;
  if (credited.includes(mockArtist.id)) return null;

  const inDiscover = mockDiscoverTracks.some((d) => d.id === track.id);

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquareText size={14} className="text-sky-500" />
        <h2 className="text-sm font-semibold text-text-primary">Open for feedback</h2>
      </div>
      {inDiscover ? (
        <>
          <p className="text-xs text-text-secondary mb-3">
            This track is open to structured feedback from other producers.
          </p>
          <Link
            href={`/dashboard/discover/${track.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Give feedback
          </Link>
        </>
      ) : (
        <p className="text-xs text-text-secondary">
          The artist opened this track to feedback — it&apos;ll be reachable from Discover once it&apos;s featured there.
        </p>
      )}
    </div>
  );
}
