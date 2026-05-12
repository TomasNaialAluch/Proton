# Proton Radio — Public Area (B2C) — Implementation guide

> **Area:** `(public)` — the redesign of `protonradio.com`  
> **Status:** files are scaffolded; implementation pending.  
> This document is the full roadmap to build the public area.

---

## Two areas, one project

The project unifies two sites that currently exist separately under a single domain and design system:

| Area | Route group | Base URL | Audience | Rendering | Auth |
|---|---|---|---|---|---|
| **Public (B2C)** | `app/(public)/` | `/` | Listeners and fans | Server Components (SSR) | Not required |
| **Dashboard (B2B)** | `app/(dashboard)/` | `/dashboard` | Artists, labels | Client Components | Required |

Route groups in parentheses (`(public)`, `(dashboard)`) are a Next.js App Router feature: they **group files without affecting the URL**. Each group has its own `layout.tsx`, its own Navbar, container styles, and dependencies. They should not be mixed.

The only connection point between the two areas is the **“For Artists”** button in `PublicNavbar` → `/dashboard`.

---

## File architecture — current and complete state

```text
proton/
│
├── app/
│   ├── layout.tsx                          ← Root layout: fonts, ThemeProvider, QueryProvider
│   ├── globals.css                         ← Design tokens (colors, typography) ✅
│   │
│   ├── (public)/                           ← Public area — SSR — no auth
│   │   ├── layout.tsx                      ← PublicNavbar + GlobalPlayer ⚠️ empty
│   │   ├── page.tsx                        ← / — Home ⚠️ empty
│   │   ├── shows/
│   │   │   └── page.tsx                    ← /shows ⚠️ empty
│   │   ├── charts/
│   │   │   └── page.tsx                    ← /charts ⚠️ empty
│   │   ├── labels/
│   │   │   └── page.tsx                    ← /labels ⚠️ empty
│   │   └── [artist-name]/
│   │       └── page.tsx                    ← /naial, /andy-green ⚠️ empty
│   │
│   └── (dashboard)/                        ← Private area — Client — auth
│       ├── layout.tsx                      ← AppSidebar + DashboardNavbar ✅
│       └── dashboard/
│           ├── page.tsx                    ✅
│           ├── performance/page.tsx        ✅
│           ├── releases/page.tsx           ✅
│           ├── contracts/page.tsx          ✅
│           ├── royalties/page.tsx          ✅
│           ├── royalties/[qid]/page.tsx    ✅
│           └── settings/...               ✅
│
├── components/
│   ├── public/                             ← Public-only components
│   │   ├── Navbar.tsx                      ← PublicNavbar ⚠️ empty (rename internally if needed)
│   │   ├── HamburgerMenu.tsx               ⬜ to create
│   │   ├── MixCard.tsx                     ⬜ to create
│   │   ├── GenreGrid.tsx                   ⬜ to create
│   │   ├── GenreChip.tsx                   ⬜ to create
│   │   ├── NowPlayingHero.tsx              ⬜ to create
│   │   ├── ArtistHero.tsx                  ⬜ to create
│   │   ├── ArtistCard.tsx                  ⬜ to create
│   │   ├── LabelCard.tsx                   ⬜ to create
│   │   └── ChartRow.tsx                    ⬜ to create
│   │
│   ├── dashboard/                          ← Dashboard-only ✅ complete
│   │   ├── AppSidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── DashboardNavbar.tsx
│   │   ├── DashboardContent.tsx
│   │   ├── NotificationsPanel.tsx
│   │   ├── HamburgerMenu.tsx
│   │   ├── StreamsChart.tsx
│   │   ├── GenreDonut.tsx
│   │   ├── ReleasesChart.tsx
│   │   └── widgets/
│   │
│   ├── player/
│   │   └── GlobalPlayer.tsx                ← Shared (visible in public area) ⚠️ empty
│   │
│   ├── providers/                          ← Global ✅
│   │   ├── ThemeProvider.tsx
│   │   └── QueryProvider.tsx
│   │
│   └── settings/                           ← Dashboard ✅
│       └── SettingsShared.tsx
│
├── lib/
│   ├── api/
│   │   ├── protonApi.ts                    ← Base GraphQL client ✅
│   │   ├── artist.ts                       ← fetchArtistWithTracks(id) ✅
│   │   ├── tracks.ts                       ← fetchTracks() — dashboard mock ✅
│   │   ├── mixes.ts                        ← fetchLatestMixes, fetchMixById ⬜
│   │   ├── labels.ts                       ← fetchLabels, fetchLabelById ⬜
│   │   └── charts.ts                       ← fetchCharts(genre) ⬜
│   │
│   ├── mock/
│   │   ├── tracks.ts
│   │   ├── streams.ts
│   │   ├── contracts.ts
│   │   ├── royalties.ts
│   │   ├── performance.ts
│   │   ├── artist.ts
│   │   ├── account.ts
│   │   ├── mixes.ts                        ← Public fallback ⬜
│   │   ├── labels.ts                       ← Public fallback ⬜
│   │   └── charts.ts                       ← Public (may stay mock) ⬜
│   │
│   └── store/
│       ├── dashboardStore.ts               ✅
│       ├── themeStore.ts                   ✅
│       └── playerStore.ts                  ⚠️ refactor
│
└── types/
    ├── track.ts                            ✅
    ├── artist.ts                           ✅
    ├── contract.ts                         ✅
    ├── royalty.ts                          ✅
    ├── mix.ts                              ⬜ (public area)
    └── label.ts                            ⬜ (public area)
```

---

## URL routes — full project map

### Public area — `(public)`

| URL | File | Description | Status |
|---|---|---|---|
| `/` | `app/(public)/page.tsx` | Home: now playing + latest shows + genres + top 100 | ⚠️ empty |
| `/shows` | `app/(public)/shows/page.tsx` | All mixes with genre filter | ⚠️ empty |
| `/charts` | `app/(public)/charts/page.tsx` | Top tracks by genre | ⚠️ empty |
| `/labels` | `app/(public)/labels/page.tsx` | Labels directory | ⚠️ empty |
| `/[artist-name]` | `app/(public)/[artist-name]/page.tsx` | Public artist profile (SSR + SEO) | ⚠️ empty |

> **Note:** the original site uses numeric IDs (`/artists/88457/naial/mixes`).  
> This redesign uses the slug only (`/naial`) — cleaner and more SEO-friendly.  
> Internally, we map slug → API id.

### Private area — `(dashboard)`

| URL | File | Status |
|---|---|---|
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | ✅ |
| `/dashboard/performance` | `.../performance/page.tsx` | ✅ |
| `/dashboard/releases` | `.../releases/page.tsx` | ✅ |
| `/dashboard/contracts` | `.../contracts/page.tsx` | ✅ |
| `/dashboard/royalties` | `.../royalties/page.tsx` | ✅ |
| `/dashboard/royalties/[qid]` | `.../royalties/[qid]/page.tsx` | ✅ |
| `/dashboard/settings` | `.../settings/page.tsx` | ✅ |
| `/dashboard/settings/profile` | `.../settings/profile/page.tsx` | ✅ |
| `/dashboard/settings/account` | `.../settings/account/...` | ✅ |

---

## Key technical differences between the two areas

| | Dashboard (B2B) | Public (B2C) |
|---|---|---|
| **Rendering** | Client Components (`"use client"`) | Server Components (RSC) — direct `async/await` |
| **Data fetching** | TanStack Query | `async/await` inside Server Components |
| **Cache** | React Query cache in client | Next.js fetch cache (`next: { revalidate: 300 }`) |
| **Auth** | Requires login (mock for now) | No auth — free access |
| **SEO** | Not needed | Critical — `generateMetadata()` on artist profiles |
| **Interactivity** | High (drag & drop, filters, charts) | Low — the player is the only global state |
| **Global state** | `dashboardStore` (widgets), `themeStore` | `playerStore` (play/pause), `themeStore` |

---

## Issues to solve before starting

### 1. Refactor `playerStore.ts`

The current store uses the dashboard `Track` type (`status: draft/pending/published`, `audioUrl`). The public player needs `ProtonMix` (with `youtubeId`).

**Solution:** refactor the store to use the new `ProtonMix` type defined in `types/mix.ts`.

### 2. Add Cloudinary to `next.config.ts`

Show images come from Cloudinary. Without this, `next/image` will block those URLs.

### 3. Add `types/label.ts`

Create `ProtonLabel` type for the public area.

---

## GraphQL API — config and queries

### Base client — already exists

```text
Endpoint: https://api.protonradio.com/graphql
Headers:
  Content-Type: application/json
  origin: https://www.protonradio.com
  referer: https://www.protonradio.com/
Cache: next: { revalidate: 300 } — 5 minutes
```

### Confirmed queries (used in the dashboard)

```graphql
query GetArtistWithTracks($id: ID!) {
  artist(id: $id) {
    id name
    image { url }
    tracks {
      id title
      release { id name date label { id name } }
    }
  }
}
```

### Queries to explore for the public area

Test them in [Altair GraphQL](https://altairgraphql.dev/) with the headers above before implementing.

```graphql
query GetLatestMixes($limit: Int, $genre: String) {
  mixes(limit: $limit, genre: $genre) {
    id title date youtubeId genre
    artist { id name image { url } }
  }
}
```

> If a query doesn’t exist, use typed mock data in `lib/mock/`. Charts are likely to remain mock for the prototype.

---

## Roadmap — implementation order

The order is driven by dependencies: you can’t build Home without Layout, and you can’t build Layout without Navbar and Player.

> **Legend:** ✅ Complete · ⚠️ Exists but empty or needs changes · ⬜ Create from scratch

