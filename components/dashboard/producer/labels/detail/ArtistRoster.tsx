import Link from "next/link";
import { Mic2 } from "lucide-react";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import RosterArtistRow from "@/components/dashboard/producer/labels/detail/RosterArtistRow";
import type { ProtonLabel } from "@/types/label";

function rosterArtists() {
  const ids = new Set(LABEL_SAMPLE_TRACKS.flatMap((t) => t.artistIds ?? [t.artistId]));
  return mockRosterArtists.filter((a) => ids.has(a.id));
}

export default function ArtistRoster({ label }: { label: ProtonLabel }) {
  const artists = rosterArtists();
  if (artists.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Mic2 size={13} className="text-accent" />
          <h2 className="text-sm font-semibold text-text-primary">Artist roster</h2>
        </div>
        <Link href={`/dashboard/labels/${label.slug}/roster`} className="text-xs font-medium text-accent hover:underline underline-offset-2">
          View all
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {artists.map((artist) => (
          <RosterArtistRow key={artist.id} label={label} artist={artist} />
        ))}
      </div>
    </section>
  );
}
