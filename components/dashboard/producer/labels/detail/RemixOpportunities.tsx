"use client";

import { useState } from "react";
import Link from "next/link";
import { Repeat, Calendar, CheckCircle2 } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { mockTracks } from "@/lib/mock/tracks";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import type { ProtonLabel } from "@/types/label";

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function findTrack(trackId: string) {
  return LABEL_SAMPLE_TRACKS.find((t) => t.id === trackId) ?? mockTracks.find((t) => t.id === trackId);
}

/**
 * The track/approval info stays visible to every viewer (same content for
 * everyone — see docs/README-routing-architecture.md); only "Request to
 * remix" itself is a producer action, hidden for label-manager view.
 */
function RemixRow({ label, opportunity }: { label: ProtonLabel; opportunity: NonNullable<ProtonLabel["remixOpportunities"]>[number] }) {
  const view = usePrototypeViewStore((s) => s.view);
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [requested, setRequested] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const track = findTrack(opportunity.trackId);
  if (!track) return null;

  const artists = (track.artistIds ?? [track.artistId])
    .map((id) => mockRosterArtists.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  // 2-step approval: the label approved this track (it's in remixOpportunities
  // at all), but that's not enough on its own — the credited artist also has
  // to have opted in. See docs/feature-track-detail.md, "The 2-step remix approval".
  const artistApproved = artists.some((a) => a.openToRemix);

  const request = () => {
    const id = sendLabelRequest({
      label,
      kind: "remix",
      text: `I'd like to remix "${track.title}" by ${artists.map((a) => a.name).join(" & ")}.`,
    });
    setConversationId(id);
    setRequested(true);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
      <div className="size-9 rounded-lg flex items-center justify-center shrink-0 bg-violet-500/10 text-violet-500">
        <Repeat size={14} />
      </div>
      <Link
        href={`/dashboard/tracks/${track.id}?from=${encodeURIComponent(`/dashboard/labels/${label.slug}`)}`}
        className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
      >
        <p className="text-sm font-medium text-text-primary truncate">{track.title}</p>
        <p className="text-xs text-text-secondary truncate">{artists.map((a) => a.name).join(" & ")}</p>
        {opportunity.deadline && (
          <p className="flex items-center gap-1 text-[11px] text-text-secondary/70 mt-0.5">
            <Calendar size={9} /> Ends {formatDeadline(opportunity.deadline)}
          </p>
        )}
      </Link>

      {requested ? (
        <div className="flex items-center gap-1 shrink-0 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} />
          {conversationId ? (
            <Link href={`/dashboard/labels/chat/${conversationId}`} className="font-semibold underline underline-offset-2">
              Sent
            </Link>
          ) : (
            "Sent"
          )}
        </div>
      ) : artistApproved && view === "producer" ? (
        <button
          onClick={request}
          className="shrink-0 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Request to remix
        </button>
      ) : artistApproved ? (
        <span className="shrink-0 text-[11px] text-emerald-600 dark:text-emerald-400">
          Approved
        </span>
      ) : (
        <span
          className="shrink-0 text-[11px] text-text-secondary/70 italic"
          title="The label approved this track, but the artist hasn't opted into remix requests yet"
        >
          Awaiting artist
        </span>
      )}
    </div>
  );
}

export default function RemixOpportunities({ label }: { label: ProtonLabel }) {
  const opportunities = label.remixOpportunities;
  if (!opportunities || opportunities.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-text-primary mb-3">Remix opportunities</h2>
      <div className="flex flex-col gap-2">
        {opportunities.map((o) => (
          <RemixRow key={o.id} label={label} opportunity={o} />
        ))}
      </div>
    </section>
  );
}
