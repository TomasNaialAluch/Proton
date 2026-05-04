"use client";

import { Suspense } from "react";
import ChartsView from "../ChartsView";

/** Cliente: evita que el inspector serialice `params` del segmento `[genre]` en un RSC. */
export default function ChartsGenrePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Loading charts…
          </p>
        </div>
      }
    >
      <ChartsView />
    </Suspense>
  );
}
