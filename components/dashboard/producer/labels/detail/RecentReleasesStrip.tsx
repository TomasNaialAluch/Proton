import { Music } from "lucide-react";
import HorizontalScroll from "@/components/dashboard/producer/labels/browse/HorizontalScroll";
import { DEMO_LABEL_TRACKS, LABEL_DEMO_CATALOG_NOTICE } from "@/lib/mock/labelDemoTracks";

export default function RecentReleasesStrip() {
  return (
    <section>
      <HorizontalScroll
        gap="gap-3"
        title={<h2 className="text-sm font-semibold text-text-primary">Recent releases</h2>}
      >
        {DEMO_LABEL_TRACKS.map((t) => (
          <div
            key={t.id}
            className="flex flex-col gap-2.5 rounded-xl border border-[var(--color-border)] bg-surface p-3.5 shrink-0"
            style={{ width: 168 }}
          >
            <div className="size-full aspect-square rounded-lg flex items-center justify-center bg-accent/10 border border-accent/20">
              <Music size={20} className="text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate leading-tight">{t.title}</p>
              <p className="text-xs text-text-secondary truncate">{t.artistName}</p>
              <p className="text-[11px] text-text-secondary/70 mt-0.5">{t.releaseDate}</p>
            </div>
          </div>
        ))}
      </HorizontalScroll>
      <p className="mt-2 text-[11px] text-text-secondary/70 italic">{LABEL_DEMO_CATALOG_NOTICE}</p>
    </section>
  );
}
