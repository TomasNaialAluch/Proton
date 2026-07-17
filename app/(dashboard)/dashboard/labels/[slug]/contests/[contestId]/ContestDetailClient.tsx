"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Download, Calendar, Gift } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import AvatarGradient from "@/components/dashboard/_shared/AvatarGradient";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import ContestSubmitCard from "@/components/dashboard/producer/labels/detail/ContestSubmitCard";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { trackArtistsOptedInToRemix } from "@/lib/contests/remixConsent";
import { mockLabels } from "@/lib/mock/labels";
import { mockTracks } from "@/lib/mock/tracks";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { backChainForward } from "@/lib/utils/navigation";
import type { Track } from "@/types/track";

function slugAndContestFromPath(pathname: string): { slug: string; contestId: string } {
  const m = pathname.match(/\/dashboard\/labels\/([^/]+)\/contests\/([^/]+)\/?$/);
  return { slug: m?.[1] ?? "", contestId: m?.[2] ?? "" };
}

function findTrack(id: string): Track | undefined {
  return LABEL_SAMPLE_TRACKS.find((t) => t.id === id) ?? mockTracks.find((t) => t.id === id);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** Days remaining until `deadline`, or null if there's no deadline. Negative once passed. */
function daysUntil(deadline?: string): number | null {
  if (!deadline) return null;
  const diffMs = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function StatusPill({ daysLeft }: { daysLeft: number | null }) {
  if (daysLeft === null || daysLeft > 7) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
        Open
      </span>
    );
  }
  if (daysLeft >= 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-amber-500/15 text-amber-500">
        Closes in {daysLeft} {daysLeft === 1 ? "day" : "days"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[var(--color-border)] text-text-secondary">
      Closed
    </span>
  );
}

export default function ContestDetailClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = usePrototypeViewStore((s) => s.view);
  const { slug, contestId } = slugAndContestFromPath(pathname);

  const label = mockLabels.find((l) => l.slug === slug);
  if (!label) notFound();

  const contest = label.activeContests?.find((c) => c.id === contestId);
  if (!contest) notFound();

  const track = findTrack(contest.trackId);
  const artists = track
    ? (track.artistIds ?? [track.artistId])
        .map((aid) => mockRosterArtists.find((a) => a.id === aid))
        .filter((a): a is NonNullable<typeof a> => Boolean(a))
    : [];

  const daysLeft = daysUntil(contest.deadline);
  const isClosed = daysLeft !== null && daysLeft < 0;
  // The label putting this up isn't enough on its own — the credited
  // artist(s) also have to have opted into remix requests before the
  // contest actually opens (stems + submission). See
  // docs/feature-contest-flow.md, "Merging remix opportunities into
  // contests".
  const artistOptedIn = trackArtistsOptedInToRemix(contest.trackId);

  const from = searchParams.get("from");
  const backChain = backChainForward(pathname, searchParams);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <BackButton href={from ?? undefined} fallbackHref={`/dashboard/labels/${label.slug}`} label="Back" />

      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: label.name, href: `/dashboard/labels/${label.slug}` },
        { label: contest.title },
      ]} />

      {/* Header */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
        <div className="flex items-start gap-3">
          <AvatarGradient seed={label.slug} initials={label.name.slice(0, 2).toUpperCase()} shapeClassName="rounded-xl" className="size-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <Link href={`/dashboard/labels/${label.slug}?from=${encodeURIComponent(backChain)}`} className="text-xs font-medium text-accent hover:underline underline-offset-2">
              {label.name}
            </Link>
            <h1 className="text-xl font-bold text-text-primary mt-0.5">{contest.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
              <StatusPill daysLeft={daysLeft} />
              {contest.deadline && (
                <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                  <Calendar size={10} /> Closes {formatDate(contest.deadline)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Track being remixed */}
      {track && (
        <Link
          href={`/dashboard/tracks/${track.id}?from=${encodeURIComponent(backChain)}`}
          className="rounded-2xl border border-[var(--color-border)] bg-surface p-4 flex items-center gap-3 hover:border-accent/50 transition-colors"
        >
          <CoverArt seed={track.id} className="size-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary truncate">{track.title}</p>
            <p className="text-xs text-text-secondary truncate">
              {artists.length > 0 ? artists.map((a) => a.name).join(" & ") : "Unknown artist"}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-border)] text-text-secondary">
                {track.genre}
              </span>
              {track.bpm && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-border)] text-text-secondary">
                  {track.bpm} BPM
                </span>
              )}
              {track.key && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-border)] text-text-secondary">
                  {track.key}
                </span>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* The label's pitch */}
      <p className="text-sm text-text-secondary leading-relaxed">{contest.description}</p>

      {/* Prize, if any */}
      {contest.prize && (
        <p className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Gift size={12} className="shrink-0" /> {contest.prize}
        </p>
      )}

      {isClosed ? (
        <p className="text-sm text-text-secondary italic text-center py-6">This remix call has closed.</p>
      ) : !artistOptedIn ? (
        <p
          className="text-sm text-text-secondary italic text-center py-6"
          title="The label put this track up, but the artist hasn't opted into remix requests yet"
        >
          Awaiting artist — {label.name} approved this track, but the credited artist hasn't opted in yet.
        </p>
      ) : (
        <>
          {/* Stems — honestly stubbed, no real audio infra in this prototype */}
          <button
            type="button"
            disabled
            title="Prototype — no real audio asset to download"
            className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)]
              px-4 py-3 text-sm font-medium text-text-secondary opacity-60 cursor-not-allowed"
          >
            <Download size={14} /> Download stems (prototype)
          </button>

          {view === "producer" && (
            <ContestSubmitCard label={label} contestId={contest.id} contestTitle={contest.title} trackId={contest.trackId} />
          )}
        </>
      )}
    </main>
  );
}
