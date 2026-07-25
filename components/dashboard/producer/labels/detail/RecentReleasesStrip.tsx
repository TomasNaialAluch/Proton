import Link from "next/link";
import HorizontalScroll from "@/components/dashboard/producer/labels/browse/HorizontalScroll";
import CoverArt from "@/components/dashboard/discover/CoverArt";
import TrackPreviewButton from "@/components/player/preview/TrackPreviewButton";
import { LABEL_SAMPLE_TRACKS, LABEL_DEMO_CATALOG_NOTICE } from "@/lib/mock/labelSampleCatalog";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import type { ProtonLabel } from "@/types/label";

function artistNames(t: { artistId: string; artistIds?: string[] }) {
  const ids = t.artistIds ?? [t.artistId];
  return ids
    .map((id) => mockRosterArtists.find((a) => a.id === id)?.name ?? "Unknown artist")
    .join(" & ");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecentReleasesStrip({ label, backChain }: { label: ProtonLabel; backChain: string }) {
  return (
    <section>
      <HorizontalScroll
        gap="gap-3"
        title={
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-text-primary">Recent releases</h2>
            <Link href={`/dashboard/labels/${label.slug}/releases?from=${encodeURIComponent(backChain)}`} className="text-xs font-medium text-accent hover:underline underline-offset-2">
              View all
            </Link>
          </div>
        }
      >
        {LABEL_SAMPLE_TRACKS.map((t) => (
          <Link
            key={t.id}
            href={`/dashboard/tracks/${t.id}?from=${encodeURIComponent(backChain)}`}
            className="group flex flex-col gap-2.5 rounded-xl border border-[var(--color-border)] bg-surface p-3.5 shrink-0
              hover:border-accent/50 transition-colors"
            style={{ width: 168 }}
          >
            <div className="relative">
              <CoverArt seed={t.id} className="w-full" />
              <TrackPreviewButton track={t} artistName={artistNames(t)} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate leading-tight">{t.title}</p>
              <p className="text-xs text-text-secondary truncate">{artistNames(t)}</p>
              <p className="text-[11px] text-text-secondary/70 mt-0.5">{formatDate(t.releaseDate)}</p>
            </div>
          </Link>
        ))}
      </HorizontalScroll>
      <p className="mt-2 text-[11px] text-text-secondary/70 italic">{LABEL_DEMO_CATALOG_NOTICE}</p>
    </section>
  );
}
