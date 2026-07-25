"use client";

import { Play, Pause } from "lucide-react";
import { usePreviewStore } from "@/lib/store/previewStore";
import { usePreviewPlaybackStore } from "@/lib/store/previewPlaybackStore";
import type { Track } from "@/types/track";

/**
 * The one play/pause affordance over a track's cover art — shared by every
 * surface that shows a track (Discover, Track Detail, Label Detail, "see
 * all tracks" lists, an artist's track list) instead of each one growing
 * its own copy. Only the button + its preview-store wiring is shared —
 * each surface keeps its own card/row layout, since those differ
 * genuinely (grid card vs. strip card vs. list row vs. hero), see
 * docs/feature-preview-vs-global-player.md.
 *
 * Must be placed inside a `relative` wrapper around the cover art, and
 * that wrapper (or an ancestor, e.g. the card's own `<Link>`) needs the
 * `group` class for the "lg" hover-reveal to work. Most cards/rows are
 * themselves `<Link>`s to Track Detail — this button stops the click from
 * bubbling into that navigation.
 */
export default function TrackPreviewButton({
  track,
  artistName,
  size = "lg",
}: {
  track: Track;
  artistName: string;
  /** "lg" — centered overlay + dark scrim, for grid/strip cards and the
   *  Track Detail hero. "sm" — small corner badge, for list-row thumbnails
   *  too small for a centered overlay without covering the whole image. */
  size?: "lg" | "sm";
}) {
  const activePreviewId = usePreviewStore((s) => s.activePreviewId);
  const startPreview = usePreviewStore((s) => s.startPreview);
  const enginePlaying = usePreviewPlaybackStore((s) => s.playing);
  const engineToggle = usePreviewPlaybackStore((s) => s.toggle);

  const isActive = activePreviewId === track.id;
  const isPlaying = isActive && enginePlaying;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) engineToggle();
    else startPreview(track, artistName);
  };

  const label = isPlaying ? `Pause preview of ${track.title}` : `Preview ${track.title}`;

  // No hover on touch devices, so the button can't hide behind a hover
  // reveal on mobile the way it does on desktop — it's always shown there.
  const visibility = isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 max-md:opacity-100";

  if (size === "sm") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={`absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full
          bg-accent text-white shadow-md transition-opacity ${visibility}`}
      >
        {isPlaying ? <Pause size={9} /> : <Play size={9} fill="currentColor" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`absolute inset-0 flex items-center justify-center transition-opacity ${visibility}`}
    >
      <span className="absolute inset-0 rounded-lg bg-black/40" />
      <span className="relative flex size-10 items-center justify-center rounded-full bg-white text-black shadow-lg">
        {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
      </span>
    </button>
  );
}
