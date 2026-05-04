"use client";

import { Suspense } from "react";
import ArtistProfileView from "./ArtistProfileView";

/** Página cliente: el segmento dinámico no expone props `params` en un Server Component. */
export default function ArtistPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-10">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Loading…
          </p>
        </div>
      }
    >
      <ArtistProfileView />
    </Suspense>
  );
}
