import { Mic2 } from "lucide-react";
import { DEMO_LABEL_TRACKS } from "@/lib/mock/labelDemoTracks";
import RosterArtistRow from "@/components/dashboard/producer/labels/detail/RosterArtistRow";
import type { ProtonLabel } from "@/types/label";

function uniqueArtists() {
  return [...new Set(DEMO_LABEL_TRACKS.map((t) => t.artistName))];
}

export default function ArtistRoster({ label }: { label: ProtonLabel }) {
  const artists = uniqueArtists();
  if (artists.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Mic2 size={13} className="text-accent" />
        <h2 className="text-sm font-semibold text-text-primary">Artist roster</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {artists.map((name) => (
          <RosterArtistRow key={name} label={label} artistName={name} />
        ))}
      </div>
    </section>
  );
}
