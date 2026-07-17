import Link from "next/link";
import { Repeat } from "lucide-react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { trackArtistsOptedInToRemix } from "@/lib/contests/remixConsent";
import { mockLabels } from "@/lib/mock/labels";
import { mockArtist } from "@/lib/mock/artist";
import type { Track } from "@/types/track";

/**
 * Links out to this track's real remix call (stems + submission) on the
 * owning label, instead of sending a bare text message — a track's remix
 * opportunity and its contest used to be two separate, disconnected
 * systems (one had a "Request to remix" button with no way to actually
 * get the stems); merged into one. See docs/feature-contest-flow.md,
 * "Merging remix opportunities into contests".
 *
 * Hidden entirely for label-manager view — see
 * docs/README-routing-architecture.md — and for a producer viewing their
 * own track (can't request to remix yourself).
 */
export default function TrackRemixCard({ track, backChain }: { track: Track; backChain: string }) {
  const view = usePrototypeViewStore((s) => s.view);
  const credited = track.artistIds ?? [track.artistId];

  const label = mockLabels.find((l) => l.activeContests?.some((c) => c.trackId === track.id));
  const contest = label?.activeContests?.find((c) => c.trackId === track.id);
  if (!label || !contest) return null;
  if (view === "label_manager") return null;
  if (credited.includes(mockArtist.id)) return null;

  const artistOptedIn = trackArtistsOptedInToRemix(track.id);

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Repeat size={14} className="text-violet-500" />
        <h2 className="text-sm font-semibold text-text-primary">Remix this track</h2>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        {artistOptedIn
          ? `${label.name} is looking for remixes of this track.`
          : `${label.name} approved this track for remix, but the artist hasn't opted in yet.`}
      </p>
      {artistOptedIn && (
        <Link
          href={`/dashboard/labels/${label.slug}/contests/${contest.id}?from=${encodeURIComponent(backChain)}`}
          className="inline-block rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          View remix call
        </Link>
      )}
    </div>
  );
}
