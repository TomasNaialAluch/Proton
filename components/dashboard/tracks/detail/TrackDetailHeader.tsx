import Link from "next/link";
import { Building2 } from "lucide-react";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import type { Track } from "@/types/track";
import type { Artist } from "@/types/artist";
import type { ProtonLabel } from "@/types/label";

function formatDate(iso: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatDuration(seconds: number) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TrackDetailHeader({
  track,
  artists,
  label,
  backChain,
}: {
  track: Track;
  artists: Artist[];
  label?: ProtonLabel;
  /** This page's own `from` chain, forwarded so Back from Artist/Label
   *  keeps unwinding the whole trail — see docs/README-navigation-back-flow.md. */
  backChain: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="flex items-start gap-4">
        {/* No real cover art in the mock catalog — a deterministic gradient
            per track id reads as a specific release, not a generic icon
            repeated everywhere. See docs/feature-track-detail.md. */}
        <CoverArt seed={track.id} className="size-20" />
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-text-primary">{track.title}</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {artists.length > 0 ? (
              artists.map((a, i) => (
                <span key={a.id}>
                  {i > 0 && " & "}
                  <Link
                    href={`/dashboard/artists/${a.id}?${label ? `via=${label.slug}&` : ""}from=${encodeURIComponent(backChain)}`}
                    className="text-accent hover:underline underline-offset-2"
                  >
                    {a.name}
                  </Link>
                </span>
              ))
            ) : (
              "Unknown artist"
            )}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
              {track.genre}
            </span>
            {track.bpm && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                {track.bpm} BPM
              </span>
            )}
            {track.key && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                {track.key}
              </span>
            )}
            {formatDuration(track.duration) && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                {formatDuration(track.duration)}
              </span>
            )}
          </div>

          {(track.releaseName || track.releaseDate) && (
            <p className="text-xs text-text-secondary mt-2">
              {track.releaseName}
              {track.releaseName && formatDate(track.releaseDate) && " — "}
              {formatDate(track.releaseDate)}
            </p>
          )}

          {label && (
            <Link
              href={`/dashboard/labels/${label.slug}?from=${encodeURIComponent(backChain)}`}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline underline-offset-2"
            >
              <Building2 size={11} /> {label.name}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
