# Dashboard widgets (Proton)

Reference for the **artist dashboard widgets**: the in-code catalog, mock data for widgets that don’t have an API yet, and where to extend.

## Where it lives in the repo

| Piece | File |
|--------|---------|
| Default order, `WidgetId` type, persistence | `lib/store/dashboardStore.ts` |
| Shared mock data (new widgets) | `lib/mock/dashboardExtendedWidgets.ts` |
| id → component registry, modal meta | `components/dashboard/widgets/` (`registry.tsx`, `meta.ts`) |
| Orchestration: hero, DnD, modal, grid | `components/dashboard/DashboardContent.tsx` |

To add a new widget you must update at least: `DEFAULT_WIDGET_ORDER` in the store, `WIDGET_META` and `DASHBOARD_WIDGETS` in `components/dashboard/widgets/`, plus the new widget file in that same folder (and mocks if needed).

The store uses **`merge` in persist**: if the user had a saved order with fewer widgets, on load it **appends missing ids** at the end without losing the prior order. Widget ids that are **new compared to what was saved** are **hidden by default**, except for the four original ones (`DEFAULT_VISIBLE_WIDGET_IDS` in the store).

**First visit and Reset:** only the four original widgets are **visible** (Streams, Latest Tracks, Streams by Release, Royalties); the rest show up in **Manage widgets** and can be enabled anytime. If you previously had all 18 visible in `localStorage` from an earlier session, **Customize → Reset** returns to the “only the original four visible” behavior.

---

## Widgets in the dashboard (default order)

All widgets appear in **Manage widgets**; the user can hide, reorder (drag), and restore. Widgets marked **mock** use sample data until they’re connected to a backend.

| ID (`WidgetId`) | Title (UI) | Description |
|-----------------|-------------|-------------|
| `streams` | Streams | Streams over time (last 6 months). |
| `latest-tracks` | Latest Tracks | Most recent tracks. |
| `streams-by-release` | Streams by Release | Comparison by release. |
| `royalties` | Royalties | Progress toward the next payout. |
| `listeners-growth` | Listeners | Listeners / 7·28d trend · **mock** |
| `top-territories` | Top territories | Country ranking · **mock** |
| `play-sources` | Play sources | Playlist vs profile vs search · **mock** |
| `rising-tracks` | Rising tracks | Fastest-growing tracks · **mock** |
| `upcoming-releases` | Upcoming releases | Singles / EP / album calendar · **mock** |
| `distribution-status` | Distribution | In review, in stores, rejections · **mock** |
| `catalog-codes` | Catalog codes | ISRC / UPC + hint of the latest track · **mock** |
| `royalties-by-store` | Royalties by store | Breakdown by DSP · **mock** |
| `payout-history` | Payout history | Latest payouts · **mock** |
| `pending-tasks` | Pending tasks | Artwork, metadata, contracts · **mock** |
| `notifications-feed` | Notifications | Payments, strikes, approvals · **mock** |
| `smart-links` | Smart links | Pre-saves / bio link · **mock** |
| `social-overview` | Social | Posts and calendar · **mock** |
| `audio-metadata` | Audio & metadata | LUFS + field warnings · **mock** |

---

## From README “ideas” to implementation

Sections that used to exist only as ideas (**audience, catalog, revenue, tasks, promo, quality**) now have a corresponding **mock widget** in `components/dashboard/widgets/`, aligned with the historical `docs/README-dashboard-widgets.md`. Replacing mocks with real queries implies defining API contracts and passing data via `DashboardWidgetProps` (or widget-specific props).

---

## Suggested priority (connect to real data)

The highest value tends to come first from: **top territories**, **play sources**, **upcoming releases**, and **royalties by store**, because they fit naturally with streams, releases, and the existing royalties widget.
