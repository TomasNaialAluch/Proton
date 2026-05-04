"use client";

import { Suspense } from "react";
import LabelDetailView from "@/components/public/LabelDetailView";

/** Cliente: evita que el inspector serialice `params` del segmento `[slug]` en un RSC. */
export default function LabelDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Loading…
          </p>
        </div>
      }
    >
      <LabelDetailView />
    </Suspense>
  );
}
