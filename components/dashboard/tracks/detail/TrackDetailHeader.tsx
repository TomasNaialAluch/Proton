import Link from "next/link";
import { Building2, ExternalLink } from "lucide-react";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import TrackPreviewButton from "@/components/player/preview/TrackPreviewButton";
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
        <div className="group relative shrink-0">
          <CoverArt seed={track.id} className="size-20" />
          <TrackPreviewButton
            track={track}
            artistName={artists.length > 0 ? artists.map((a) => a.name).join(" & ") : "Unknown artist"}
          />
        </div>
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

          {/* Only for tracks actually released — a draft/pending track has
              nothing to buy anywhere yet, and implying otherwise would be
              exactly the kind of copyright overreach this needs to avoid.
              See docs/feature-preview-vs-global-player.md section 5.2. */}
          {label && track.status === "published" && (
            <a
              href={`https://www.beatport.com/search?q=${encodeURIComponent(`${artists.length > 0 ? artists.map((a) => a.name).join(" ") : ""} ${track.title}`.trim())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1 text-xs font-medium text-accent hover:underline underline-offset-2 w-fit"
            >
              Get full track <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
