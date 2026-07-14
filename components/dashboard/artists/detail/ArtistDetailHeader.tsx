import { MapPin } from "lucide-react";
import AvatarGradient from "@/components/dashboard/_shared/AvatarGradient";
import type { Artist } from "@/types/artist";

export default function ArtistDetailHeader({ artist }: { artist: Artist }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="flex items-start gap-4">
        {/* No real photo in the mock roster — a deterministic gradient per
            artist id, same idea as Track Detail's cover art. See
            docs/feature-artist-detail.md. */}
        <AvatarGradient seed={artist.id} initials={artist.name.slice(0, 2).toUpperCase()} className="size-16 text-xl" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-text-primary">{artist.name}</h1>
          {artist.country && (
            <p className="flex items-center gap-1 text-xs text-text-secondary mt-0.5">
              <MapPin size={11} /> {artist.country}
            </p>
          )}
          {artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {artist.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {artist.bio && (
        <p className="mt-4 text-sm text-text-secondary leading-relaxed">{artist.bio}</p>
      )}
    </div>
  );
}
