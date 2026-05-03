"use client";

import { Hash } from "lucide-react";
import { mockCatalogCodes } from "@/lib/mock/dashboardExtendedWidgets";
import type { DashboardWidgetProps } from "./types";

export function CatalogCodesWidget({ topTracks }: DashboardWidgetProps) {
  const latestTitle = topTracks[0]?.title;

  return (
    <section className="h-full rounded-2xl border border-[var(--color-border)] bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash size={14} className="text-text-secondary" />
          <h2 className="text-sm font-medium text-text-primary">Catalog codes</h2>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">Mock</span>
      </div>
      <p className="mb-3 text-xs text-text-secondary">
        {mockCatalogCodes.releaseName}
        {latestTitle ? ` · last track: ${latestTitle}` : ""}
      </p>
      <dl className="space-y-3">
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">ISRC</dt>
          <dd className="mt-0.5 font-mono text-sm text-text-primary">{mockCatalogCodes.isrc}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-medium uppercase tracking-wide text-text-secondary">UPC</dt>
          <dd className="mt-0.5 font-mono text-sm text-text-primary">{mockCatalogCodes.upc}</dd>
        </div>
      </dl>
    </section>
  );
}
