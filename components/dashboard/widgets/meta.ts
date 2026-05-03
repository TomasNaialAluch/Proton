import type { WidgetId } from "@/lib/store/dashboardStore";

export const WIDGET_META: Record<WidgetId, { label: string; description: string }> = {
  streams: { label: "Streams", description: "Stream evolution (last 6 months)" },
  "latest-tracks": { label: "Latest Tracks", description: "Your most recent tracks" },
  "streams-by-release": { label: "Streams by Release", description: "Comparison by release" },
  royalties: { label: "Royalties", description: "Progress toward next payment" },
  "listeners-growth": { label: "Listeners", description: "Totals and 7 / 28 day trend (mock)" },
  "top-territories": { label: "Top territories", description: "Stream share by country (mock)" },
  "play-sources": { label: "Play sources", description: "Playlist vs profile vs search (mock)" },
  "rising-tracks": { label: "Rising tracks", description: "Growth vs previous period (mock)" },
  "upcoming-releases": { label: "Upcoming releases", description: "Calendar of singles, EPs, albums (mock)" },
  "distribution-status": { label: "Distribution", description: "Review, live, rejected (mock)" },
  "catalog-codes": { label: "Catalog codes", description: "ISRC / UPC quick reference (mock)" },
  "royalties-by-store": { label: "Royalties by store", description: "Breakdown by DSP (mock)" },
  "payout-history": { label: "Payout history", description: "Recent statements (mock)" },
  "pending-tasks": { label: "Pending tasks", description: "Art, metadata, contracts (mock)" },
  "notifications-feed": { label: "Notifications", description: "Payments, strikes, approvals (mock)" },
  "smart-links": { label: "Smart links", description: "Pre-saves and bio link clicks (mock)" },
  "social-overview": { label: "Social", description: "Posts and schedule snapshot (mock)" },
  "audio-metadata": { label: "Audio & metadata", description: "LUFS and field warnings (mock)" },
};
