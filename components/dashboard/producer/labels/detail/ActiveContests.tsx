"use client";

import Link from "next/link";
import { Trophy, Calendar, Gift, ChevronRight } from "lucide-react";
import { trackArtistsOptedInToRemix } from "@/lib/contests/remixConsent";
import { useLabelContests } from "@/lib/contests/useLabelContests";
import type { ProtonLabel } from "@/types/label";

function formatDeadline(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * The contest itself stays visible to every viewer (same content for
 * everyone — see docs/README-routing-architecture.md) — this card is
 * purely informational and links out to the real contest page, where
 * submitting is the producer-only action. Shows "Awaiting artist" when
 * the label put the track up but the credited artist(s) haven't opted
 * into remix requests yet — same rule that used to live in a separate
 * `remixOpportunities` system, now just a check against this same
 * contest. See docs/feature-contest-flow.md.
 */
function ContestRow({ label, contest, backChain }: { label: ProtonLabel; contest: NonNullable<ProtonLabel["activeContests"]>[number]; backChain: string }) {
  const artistOptedIn = trackArtistsOptedInToRemix(contest.trackId);

  return (
    <Link
      href={`/dashboard/labels/${label.slug}/contests/${contest.id}?from=${encodeURIComponent(backChain)}`}
      className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 hover:border-amber-500/40 transition-colors"
    >
      <Trophy size={14} className="text-amber-500 mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-text-primary">{contest.title}</p>
        <p className="mt-0.5 text-xs text-text-secondary leading-relaxed">{contest.description}</p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-text-secondary">
          {contest.deadline && (
            <span className="flex items-center gap-1">
              <Calendar size={10} /> Ends {formatDeadline(contest.deadline)}
            </span>
          )}
          {contest.prize && (
            <span className="flex items-center gap-1">
              <Gift size={10} /> {contest.prize}
            </span>
          )}
          {!artistOptedIn && (
            <span className="italic text-text-secondary/70" title="The label put this up, but the artist hasn't opted into remix requests yet">
              Awaiting artist
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={14} className="text-text-secondary/50 shrink-0 mt-0.5" />
    </Link>
  );
}

export default function ActiveContests({ label, backChain }: { label: ProtonLabel; backChain: string }) {
  const contests = useLabelContests(label);
  if (contests.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold text-text-primary mb-3">Active contests</h2>
      <div className="flex flex-col gap-3">
        {contests.map((c) => (
          <ContestRow key={c.id} label={label} contest={c} backChain={backChain} />
        ))}
      </div>
    </section>
  );
}
