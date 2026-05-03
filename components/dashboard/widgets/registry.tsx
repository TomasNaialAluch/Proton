"use client";

import type { ComponentType } from "react";
import type { WidgetId } from "@/lib/store/dashboardStore";
import { StreamsWidget } from "./StreamsWidget";
import { LatestTracksWidget } from "./LatestTracksWidget";
import { StreamsByReleaseWidget } from "./StreamsByReleaseWidget";
import RoyaltiesWidget from "./RoyaltiesWidget";
import { ListenersGrowthWidget } from "./ListenersGrowthWidget";
import { TopTerritoriesWidget } from "./TopTerritoriesWidget";
import { PlaySourcesWidget } from "./PlaySourcesWidget";
import { RisingTracksWidget } from "./RisingTracksWidget";
import { UpcomingReleasesWidget } from "./UpcomingReleasesWidget";
import { DistributionStatusWidget } from "./DistributionStatusWidget";
import { CatalogCodesWidget } from "./CatalogCodesWidget";
import { RoyaltiesByStoreWidget } from "./RoyaltiesByStoreWidget";
import { PayoutHistoryWidget } from "./PayoutHistoryWidget";
import { PendingTasksWidget } from "./PendingTasksWidget";
import { NotificationsFeedWidget } from "./NotificationsFeedWidget";
import { SmartLinksWidget } from "./SmartLinksWidget";
import { SocialOverviewWidget } from "./SocialOverviewWidget";
import { AudioMetadataWidget } from "./AudioMetadataWidget";
import type { DashboardWidgetProps } from "./types";

/** Mapa `WidgetId` → componente. Añadir un widget nuevo: archivo en esta carpeta + entrada aquí + store/meta. */
export const DASHBOARD_WIDGETS: Record<WidgetId, ComponentType<DashboardWidgetProps>> = {
  streams: StreamsWidget,
  "latest-tracks": LatestTracksWidget,
  "streams-by-release": StreamsByReleaseWidget,
  royalties: RoyaltiesWidget,
  "listeners-growth": ListenersGrowthWidget,
  "top-territories": TopTerritoriesWidget,
  "play-sources": PlaySourcesWidget,
  "rising-tracks": RisingTracksWidget,
  "upcoming-releases": UpcomingReleasesWidget,
  "distribution-status": DistributionStatusWidget,
  "catalog-codes": CatalogCodesWidget,
  "royalties-by-store": RoyaltiesByStoreWidget,
  "payout-history": PayoutHistoryWidget,
  "pending-tasks": PendingTasksWidget,
  "notifications-feed": NotificationsFeedWidget,
  "smart-links": SmartLinksWidget,
  "social-overview": SocialOverviewWidget,
  "audio-metadata": AudioMetadataWidget,
};
