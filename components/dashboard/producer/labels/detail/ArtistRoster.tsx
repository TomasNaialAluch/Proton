import { Mic2 } from "lucide-react";
import { DEMO_LABEL_TRACKS } from "@/lib/mock/labelDemoTracks";

function uniqueArtists() {
  return [...new Set(DEMO_LABEL_TRACKS.map((t) => t.artistName))];
}

export default function ArtistRoster() {
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
          <div
            key={name}
            className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-surface pl-1.5 pr-3 py-1.5"
          >
            <span className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-accent/10 text-accent shrink-0">
              {name.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-xs font-medium text-text-primary">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
