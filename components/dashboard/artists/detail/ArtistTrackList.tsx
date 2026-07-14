import Link from "next/link";
import { Music } from "lucide-react";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import type { Track } from "@/types/track";

/**
 * Tracks credited to this artist — same shared `Track` entity as Label
 * Detail and Discover (see docs/feature-track-detail.md). `linkFrom` is
 * the pre-built `from` target for each Track Detail link, so "back" from
 * there returns here (see components/dashboard/_shared/BackButton.tsx).
 */
export default function ArtistTrackList({ tracks, linkFrom }: { tracks: Track[]; linkFrom: string }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Music size={13} className="text-accent" />
        <h2 className="text-sm font-semibold text-text-primary">Tracks</h2>
      </div>
      {tracks.length === 0 ? (
        <p className="text-sm text-text-secondary">No tracks yet.</p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
          {tracks.map((t) => (
            <li key={t.id}>
              <Link
                href={`/dashboard/tracks/${t.id}?from=${encodeURIComponent(linkFrom)}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-border)]/30 transition-colors"
              >
                <CoverArt seed={t.id} className="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">{t.title}</p>
                  <p className="text-xs text-text-secondary truncate">{t.releaseName ?? t.genre}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
