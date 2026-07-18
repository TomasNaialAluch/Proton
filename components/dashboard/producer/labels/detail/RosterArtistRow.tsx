import Link from "next/link";
import AvatarGradient from "@/components/dashboard/_shared/AvatarGradient";
import type { ProtonLabel } from "@/types/label";
import type { Artist } from "@/types/artist";

/**
 * Tapping an artist navigates to their real profile (Artist Detail) instead
 * of expanding an inline pitch form here — see docs/feature-artist-detail.md
 * for why the old chip-expand UX was replaced. `via` carries which
 * label mediated the visit, so Artist Detail knows who to message for a
 * collab request without needing its own stored label relationship.
 */
export default function RosterArtistRow({ label, artist, backChain }: { label: ProtonLabel; artist: Artist; backChain: string }) {
  return (
    <Link
      href={`/dashboard/artists/${artist.id}?via=${label.slug}&from=${encodeURIComponent(backChain)}`}
      className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-surface
        pl-1.5 pr-3 py-1.5 hover:border-accent/50 transition-colors"
    >
      <AvatarGradient seed={artist.id} initials={artist.name.slice(0, 2).toUpperCase()} className="size-6 text-[10px]" />
      <span className="text-xs font-medium text-text-primary">{artist.name}</span>
    </Link>
  );
}
