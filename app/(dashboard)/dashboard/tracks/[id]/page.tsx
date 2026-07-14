"use client";

import TrackDetailClient from "./TrackDetailClient";

/** No `params` prop: the id comes from `pathname` on the client, same pattern as labels/[slug]. */
export default function TrackDetailPage() {
  return <TrackDetailClient />;
}
