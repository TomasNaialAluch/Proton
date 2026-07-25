"use client";

import { useState } from "react";
import Link from "next/link";
import { Repeat, Send, CheckCircle2 } from "lucide-react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { trackArtistsOptedInToRemix } from "@/lib/contests/remixConsent";
import { useContestsStore } from "@/lib/store/label-manager/contestsStore";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { mockLabels } from "@/lib/mock/labels";
import { mockArtist } from "@/lib/mock/artist";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import type { Track } from "@/types/track";
import type { ProtonLabel } from "@/types/label";

/**
 * Links out to this track's real remix call (stems + submission) on the
 * owning label, instead of sending a bare text message — a track's remix
 * opportunity and its contest used to be two separate, disconnected
 * systems (one had a "Request to remix" button with no way to actually
 * get the stems); merged into one. See docs/feature-contest-flow.md,
 * "Merging remix opportunities into contests".
 *
 * When the label hasn't opened a remix call for this specific track yet,
 * falls back to a proactive "Request a remix" action instead of showing
 * nothing — a producer can ask the label to open one up, same
 * `sendLabelRequest` flow used everywhere else in Labels. Requires the
 * track to have a `labelSlug` (there has to be someone to ask).
 *
 * Hidden entirely for label-manager view — see
 * docs/README-routing-architecture.md — and for a producer viewing their
 * own track (can't request to remix yourself).
 */
export default function TrackRemixCard({
  track,
  backChain,
  label,
}: {
  track: Track;
  backChain: string;
  /** The track's own label, already resolved by the caller via `labelSlug`. */
  label?: ProtonLabel;
}) {
  const view = usePrototypeViewStore((s) => s.view);
  const extraContests = useContestsStore((s) => s.extraContests);
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [requested, setRequested] = useState(false);

  const credited = track.artistIds ?? [track.artistId];
  const creditedNames = credited
    .map((id) => mockRosterArtists.find((a) => a.id === id)?.name)
    .filter((name): name is string => Boolean(name));

  const seededLabel = mockLabels.find((l) => l.activeContests?.some((c) => c.trackId === track.id));
  const seededContest = seededLabel?.activeContests?.find((c) => c.trackId === track.id);
  const extraMatch = extraContests.find((e) => e.contest.trackId === track.id);
  const contestLabel = seededLabel ?? mockLabels.find((l) => l.id === extraMatch?.labelId);
  const contest = seededContest ?? extraMatch?.contest;

  if (view === "label_manager") return null;
  if (credited.includes(mockArtist.id)) return null;

  // Case 1: the label already has an open remix call for this exact track.
  if (contestLabel && contest) {
    const artistOptedIn = trackArtistsOptedInToRemix(track.id);
    return (
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Repeat size={14} className="text-violet-500" />
          <h2 className="text-sm font-semibold text-text-primary">Remix this track</h2>
        </div>
        <p className="text-xs text-text-secondary mb-3">
          {artistOptedIn
            ? `${contestLabel.name} is looking for remixes of this track.`
            : `${contestLabel.name} approved this track for remix, but the artist hasn't opted in yet.`}
        </p>
        {artistOptedIn && (
          <Link
            href={`/dashboard/labels/${contestLabel.slug}/contests/${contest.id}?from=${encodeURIComponent(backChain)}`}
            className="inline-block rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
          >
            View remix call
          </Link>
        )}
      </div>
    );
  }

  // Case 2: no remix call exists yet — nothing to ask, if we don't even
  // know which label owns this track.
  if (!label) return null;

  // Case 3: no remix call yet, but we know the label — let the producer
  // ask for one. The confirmation deliberately doesn't link to a chat —
  // this isn't the start of a conversation, it's a request pending the
  // same 2-step approval used everywhere else remix consent is checked
  // (label first, then the credited artist): sendLabelRequest still
  // notifies the label for real (shows up in their Requests inbox), but
  // the producer-facing state is "pending both approvals," not "go talk
  // to someone."
  const request = () => {
    sendLabelRequest({
      label,
      kind: "remix",
      text: `I'd like to remix "${track.title}". Would you be open to putting it up for a remix call?`,
    });
    setRequested(true);
  };

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Repeat size={14} className="text-violet-500" />
        <h2 className="text-sm font-semibold text-text-primary">Remix this track</h2>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        {label.name} hasn&apos;t opened a remix call for this track yet — ask them to.
      </p>
      {requested ? (
        <div className="flex items-start gap-2 text-xs text-text-secondary">
          <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-emerald-500" />
          <span>
            Request sent. Waiting on {label.name}
            {creditedNames.length > 0 ? ` and ${creditedNames.join(" & ")}` : " and the artist"} to approve —
            you&apos;ll be notified once this track opens for remix.
          </span>
        </div>
      ) : (
        <button
          onClick={request}
          className="flex items-center gap-1.5 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Send size={12} /> Request a remix
        </button>
      )}
    </div>
  );
}
