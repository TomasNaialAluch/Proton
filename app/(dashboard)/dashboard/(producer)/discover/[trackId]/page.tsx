"use client";

import { notFound, usePathname } from "next/navigation";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import FeedbackScoreForm from "@/components/dashboard/feedback/FeedbackScoreForm";
import { mockDiscoverTracks } from "@/lib/mock/discover";

/** Same convention as feedback/[id] and royalties/[id]: derive id from pathname, not useParams(). */
function trackIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/discover\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

export default function DiscoverTrackPage() {
  const pathname = usePathname();
  const trackId = trackIdFromPath(pathname);

  const track = mockDiscoverTracks.find((t) => t.id === trackId);
  if (!track) notFound();

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-3xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Discover", href: "/dashboard/discover" },
        { label: track.title },
      ]} />

      <h1 className="text-2xl font-bold text-text-primary mb-1">{track.title}</h1>
      <p className="text-sm text-text-secondary mb-6">
        {track.producer.name} · {track.label} · {track.genre}
        {track.bpm ? ` · ${track.bpm} BPM` : ""}
        {track.key ? ` · ${track.key}` : ""}
      </p>

      <FeedbackScoreForm track={track} />
    </main>
  );
}
