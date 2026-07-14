"use client";

import { useState } from "react";
import Link from "next/link";
import { Repeat } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { mockArtist } from "@/lib/mock/artist";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import type { Track } from "@/types/track";
import type { Artist } from "@/types/artist";
import type { ProtonLabel } from "@/types/label";

/**
 * 2-step approval, same rule as the label-curated `RemixOpportunities`
 * section on Label Detail: the LABEL has to have approved this specific
 * track first (it must appear in `label.remixOpportunities` by id —
 * resolving a label alone isn't enough, that only proves who released
 * it), and only then does a credited artist's own `openToRemix` opt-in
 * matter. See docs/feature-track-detail.md, "The 2-step remix approval".
 *
 * Hidden entirely for label-manager view — granting remix approval is a
 * separate catalog-management action, not something surfaced on this
 * request-focused card (see docs/README-routing-architecture.md) — and
 * for a producer viewing their own track (can't request to remix
 * yourself).
 */
export default function TrackRemixCard({
  track,
  label,
  artists,
}: {
  track: Track;
  label?: ProtonLabel;
  artists: Artist[];
}) {
  const view = usePrototypeViewStore((s) => s.view);
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [remixRequested, setRemixRequested] = useState(false);
  const [remixConversationId, setRemixConversationId] = useState<string | null>(null);

  const credited = track.artistIds ?? [track.artistId];
  const labelApprovedRemix = Boolean(label?.remixOpportunities?.some((o) => o.trackId === track.id));
  if (!labelApprovedRemix) return null;
  if (view === "label_manager") return null;
  if (credited.includes(mockArtist.id)) return null;

  const canRequestRemix = artists.some((a) => a.openToRemix);

  const requestRemix = () => {
    if (!label) return;
    const conversationId = sendLabelRequest({
      label,
      kind: "remix",
      text: `I'd like to remix "${track.title}" by ${artists.map((a) => a.name).join(" & ")}.`,
    });
    setRemixConversationId(conversationId);
    setRemixRequested(true);
  };

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Repeat size={14} className="text-violet-500" />
        <h2 className="text-sm font-semibold text-text-primary">Remix this track</h2>
      </div>
      <p className="text-xs text-text-secondary mb-3">
        {canRequestRemix
          ? `${artists.find((a) => a.openToRemix)?.name} is open to remix requests on this track.`
          : `${label!.name} approved this track for remix, but the artist hasn't opted in yet.`}
      </p>
      {!canRequestRemix ? null : remixRequested ? (
        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Sent
          {remixConversationId && (
            <>
              {" — "}
              <Link href={`/dashboard/labels/chat/${remixConversationId}`} className="underline underline-offset-2">
                view conversation
              </Link>
            </>
          )}
        </p>
      ) : (
        <button
          type="button"
          onClick={requestRemix}
          className="rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Request to remix
        </button>
      )}
    </div>
  );
}
