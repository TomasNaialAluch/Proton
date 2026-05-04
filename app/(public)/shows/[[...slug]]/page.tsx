"use client";

import { Suspense } from "react";
import ShowsView from "../ShowsView";

/** Cliente: evita props `params` del catch-all en un Server Component al inspeccionar el árbol. */
export default function ShowsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Loading shows…
          </p>
        </div>
      }
    >
      <ShowsView />
    </Suspense>
  );
}
