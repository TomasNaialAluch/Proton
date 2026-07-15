"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import TrackDetailHeader from "@/components/dashboard/tracks/detail/TrackDetailHeader";
import TrackFeedbackCard from "@/components/dashboard/tracks/detail/TrackFeedbackCard";
import TrackRemixCard from "@/components/dashboard/tracks/detail/TrackRemixCard";
import { mockTracks } from "@/lib/mock/tracks";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { mockLabels } from "@/lib/mock/labels";
import { backChainForward, labelSlugFromReferrer } from "@/lib/utils/navigation";
import type { Track } from "@/types/track";

/** Same convention used across the app: derive id from pathname, not useParams(). */
function trackIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/tracks\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

/**
 * A track can come from the label sample catalog or the producer's own
 * catalog — both are the same `Track` type (see docs/feature-track-detail.md), so this page
 * doesn't care which array it came from.
 */
function findTrack(id: string): Track | undefined {
  return LABEL_SAMPLE_TRACKS.find((t) => t.id === id) ?? mockTracks.find((t) => t.id === id);
}

export default function TrackDetailClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = trackIdFromPath(pathname);
  const track = findTrack(id);
  if (!track) notFound();

  // Where "back" should go — set by whoever linked here (a label's
  // releases, an artist's track list). Deterministic, doesn't depend on
  // browser history state. See BackButton.tsx for why.
  const from = searchParams.get("from");

  // Carries this page's own `from` chain forward into Artist/Label links so
  // Back keeps unwinding the whole trail instead of resetting to one hop.
  // See docs/README-navigation-back-flow.md.
  const backChain = backChainForward(pathname, searchParams);

  const artistIds = track.artistIds ?? [track.artistId];
  const artists = artistIds
    .map((aid) => mockRosterArtists.find((a) => a.id === aid))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const label = track.labelSlug ? mockLabels.find((l) => l.slug === track.labelSlug) : undefined;

  // Breadcrumb only: fall back to the label the user actually browsed here
  // from when the track has no label of its own (see labelSlugFromReferrer
  // above). Everything else on this page (the label link/card, remix
  // gating) keeps using the track's real `label` — this fallback is purely
  // about not showing a broken/blank trail.
  const breadcrumbLabel = label ?? mockLabels.find((l) => l.slug === labelSlugFromReferrer(from));

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <BackButton href={from ?? undefined} fallbackHref="/dashboard/labels" label="Back" />

      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        ...(breadcrumbLabel
          ? [
              { label: "Labels", href: "/dashboard/labels" },
              { label: breadcrumbLabel.name, href: `/dashboard/labels/${breadcrumbLabel.slug}` },
            ]
          : []),
        { label: track.title },
      ]} />

      <TrackDetailHeader track={track} artists={artists} label={label} backChain={backChain} />
      <TrackFeedbackCard track={track} />
      <TrackRemixCard track={track} label={label} artists={artists} />
    </main>
  );
}
