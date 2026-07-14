"use client";

import ArtistDetailClient from "./ArtistDetailClient";

/** No `params` prop: the id comes from `pathname` on the client, same pattern as labels/[slug]. */
export default function ArtistDetailPage() {
  return <ArtistDetailClient />;
}
