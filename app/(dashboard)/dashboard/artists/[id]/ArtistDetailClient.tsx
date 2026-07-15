"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import ArtistDetailHeader from "@/components/dashboard/artists/detail/ArtistDetailHeader";
import ArtistTrackList from "@/components/dashboard/artists/detail/ArtistTrackList";
import ArtistCollabCard from "@/components/dashboard/artists/detail/ArtistCollabCard";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { mockArtist } from "@/lib/mock/artist";
import { mockTracks } from "@/lib/mock/tracks";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { mockLabels } from "@/lib/mock/labels";
import { useArtistProfileStore } from "@/lib/store/artistProfileStore";
import { backChainForward, labelSlugFromReferrer } from "@/lib/utils/navigation";
import type { Track } from "@/types/track";

/** Same convention used across the app: derive id from pathname, not useParams(). */
function artistIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/artists\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

function tracksByArtist(artistId: string): Track[] {
  const all = [...mockTracks, ...LABEL_SAMPLE_TRACKS];
  const seen = new Set<string>();
  return all.filter((t) => {
    if (seen.has(t.id)) return false;
    const credited = t.artistIds ?? [t.artistId];
    const match = credited.includes(artistId);
    if (match) seen.add(t.id);
    return match;
  });
}

export default function ArtistDetailClient() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = artistIdFromPath(pathname);

  const baseArtist = mockRosterArtists.find((a) => a.id === id);
  if (!baseArtist) notFound();

  // Settings > Artist Profile edits your own social links live (see
  // lib/store/artistProfileStore.ts) — merge them in when you're viewing
  // your own profile, so an edit actually shows up here. Every other
  // artist's socialLinks stays whatever's in the static roster mock.
  const ownSocialLinks = useArtistProfileStore((s) => s.socialLinks);
  const artist = baseArtist.id === mockArtist.id
    ? { ...baseArtist, socialLinks: { ...baseArtist.socialLinks, ...ownSocialLinks } }
    : baseArtist;

  const tracks = tracksByArtist(artist.id);

  // Which label mediated this visit (came from that label's roster) — see
  // RosterArtistRow.tsx. Without it, there's no label to route a collab
  // request through, so the action just doesn't render (browsing-only).
  const viaSlug = searchParams.get("via");
  const viaLabel = viaSlug ? mockLabels.find((l) => l.slug === viaSlug) : undefined;

  // Deterministic "back" target — set when linked here (e.g. from a track's
  // credited-artist link). Falls back to the via label's roster/page when
  // there's no explicit `from`, so "back" still lands somewhere specific
  // instead of the generic Labels list. See BackButton.tsx.
  const from = searchParams.get("from") ?? (viaSlug ? `/dashboard/labels/${viaSlug}` : null);

  // Carries this page's own `from`/`via` chain forward into Track links so
  // Back keeps unwinding the whole trail instead of resetting to one hop.
  // See docs/README-navigation-back-flow.md.
  const backChain = backChainForward(pathname, searchParams);

  // Breadcrumb only: when there's no `via`, fall back to whatever label
  // page is at the head of the `from` chain — same reasoning as Track
  // Detail. See docs/README-navigation-back-flow.md.
  const breadcrumbLabel = viaLabel ?? mockLabels.find((l) => l.slug === labelSlugFromReferrer(from));

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
        { label: artist.name },
      ]} />

      <ArtistDetailHeader artist={artist} />
      <ArtistTrackList tracks={tracks} linkFrom={backChain} />
      <ArtistCollabCard artist={artist} viaLabel={viaLabel} />
    </main>
  );
}
