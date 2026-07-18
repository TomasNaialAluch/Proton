"use client";

import type { ComponentType } from "react";
import type { LabelWidgetId } from "@/lib/store/label-manager/labelDashboardStore";
import { RevenueTrendWidget } from "./RevenueTrendWidget";
import { LatestReleasesWidget } from "./LatestReleasesWidget";
import { ActivityFeedWidget } from "./ActivityFeedWidget";
import { PendingTasksWidget } from "./PendingTasksWidget";
import { StreamsByReleaseWidget } from "./StreamsByReleaseWidget";
import { StatementsProgressWidget } from "./StatementsProgressWidget";
import { RosterGrowthWidget } from "./RosterGrowthWidget";
import { TopTerritoriesWidget } from "./TopTerritoriesWidget";
import { PlaySourcesWidget } from "./PlaySourcesWidget";
import { RisingTracksWidget } from "./RisingTracksWidget";
import { UpcomingReleasesWidget } from "./UpcomingReleasesWidget";
import { DistributionStatusWidget } from "./DistributionStatusWidget";
import { CatalogCodesWidget } from "./CatalogCodesWidget";
import { RoyaltiesByStoreWidget } from "./RoyaltiesByStoreWidget";
import { PayoutHistoryWidget } from "./PayoutHistoryWidget";
import { AudioMetadataWidget } from "./AudioMetadataWidget";
import type { LabelWidgetProps } from "./types";

/** Mapa `LabelWidgetId` → componente. Añadir un widget nuevo: archivo en esta
 *  carpeta + entrada aquí + `meta.ts` + `labelDashboardStore.ts`. Mirrors
 *  `components/dashboard/widgets/registry.tsx` on the producer side. */
export const LABEL_DASHBOARD_WIDGETS: Record<LabelWidgetId, ComponentType<LabelWidgetProps>> = {
  "revenue-trend": RevenueTrendWidget,
  "latest-releases": LatestReleasesWidget,
  "activity-feed": ActivityFeedWidget,
  "pending-tasks": PendingTasksWidget,
  "streams-by-release": StreamsByReleaseWidget,
  "statements-progress": StatementsProgressWidget,
  "roster-growth": RosterGrowthWidget,
  "top-territories": TopTerritoriesWidget,
  "play-sources": PlaySourcesWidget,
  "rising-tracks": RisingTracksWidget,
  "upcoming-releases": UpcomingReleasesWidget,
  "distribution-status": DistributionStatusWidget,
  "catalog-codes": CatalogCodesWidget,
  "royalties-by-store": RoyaltiesByStoreWidget,
  "payout-history": PayoutHistoryWidget,
  "audio-metadata": AudioMetadataWidget,
};
