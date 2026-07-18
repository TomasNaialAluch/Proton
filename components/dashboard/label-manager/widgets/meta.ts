import type { LabelWidgetId } from "@/lib/store/label-manager/labelDashboardStore";

export const LABEL_WIDGET_META: Record<LabelWidgetId, { label: string; description: string }> = {
  "revenue-trend": { label: "Revenue trend", description: "Streams & revenue evolution (last 6 months)" },
  "latest-releases": { label: "Latest releases", description: "Most recent releases across the label" },
  "activity-feed": { label: "Activity", description: "New contest entries, remix requests, scouting replies" },
  "pending-tasks": { label: "Pending tasks", description: "Assets, metadata, and QA issues across the catalog" },
  "streams-by-release": { label: "Streams by release", description: "Comparison across the label's releases" },
  "statements-progress": { label: "Statements", description: "This period's royalty run, by status" },
  "roster-growth": { label: "Roster growth", description: "Artists added over time" },
  "top-territories": { label: "Top territories", description: "Stream share by country (mock)" },
  "play-sources": { label: "Play sources", description: "Playlist vs profile vs search (mock)" },
  "rising-tracks": { label: "Rising tracks", description: "Growth vs previous period, across the roster (mock)" },
  "upcoming-releases": { label: "Upcoming releases", description: "Calendar of scheduled releases" },
  "distribution-status": { label: "Distribution", description: "Draft, QA, scheduled, delivered, live" },
  "catalog-codes": { label: "Catalog codes", description: "ISRC / UPC quick reference" },
  "royalties-by-store": { label: "Royalties by store", description: "Breakdown by DSP" },
  "payout-history": { label: "Payout history", description: "Recent statement runs" },
  "audio-metadata": { label: "Audio & metadata", description: "Missing or flagged track metadata" },
};
