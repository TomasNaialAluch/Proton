# Proton Radio — Work Log and Implementation Guide

---

## ✅ Dashboard (B2B) — What was built in this session

Everything below was implemented and is located in the `/dashboard` area. The project runs on Next.js 15, TypeScript, Tailwind CSS v4, and TanStack Query.

**Product vision / roadmap (sidebar Producer tools + Platform, auth):** [`docs/README-dashboard-vision-roadmap.md`](docs/README-dashboard-vision-roadmap.md).

---

### 1. Contracts Page — `/dashboard/contracts`

**File:** `app/(dashboard)/dashboard/contracts/page.tsx`
**Mock data:** `lib/mock/contracts.ts`
**Types:** `types/contract.ts`

Complete artist contracts page with:

- **3 summary cards:** Total contracts · Signed · Number of labels
- **Pending contracts alert** (amber banner, conditional)
- **Contracts list** with dual layout:
  - Mobile: compact layout with color icon per label, release name, label, and date
  - Desktop: table with columns Date · Release · Label · Status · Contract (PDF link)
- **Breakdown by label** at the bottom of the page: name, release count, unique colors per label
- **Colors per label** defined in `CONTRACT_LABEL_COLORS`: `outer-space-oasis` → purple `#A78BFA`, `toxic-astronaut` → green `#34D399`
- **Contract statuses:** `signed` (green), `pending` (amber), `expired` (red) — with Lucide icons

**Current mock releases:**
| Release | Label | Status |
|---|---|---|
| Tied Inside | Outer Space Oasis | Signed |
| Mind Altered | Outer Space Oasis | Signed |
| Balance | Outer Space Oasis | Signed |
| Beyond Living | Toxic Astronaut | Signed |

---

### 2. Royalties Page — `/dashboard/royalties`

**File:** `app/(dashboard)/dashboard/royalties/page.tsx`
**Mock data:** `lib/mock/royalties.ts`

Main royalties page with:

- **Total accumulated card** with progress bar toward payout threshold (`$50 USD`)
- **Next statement card** (date + period)
- **Payment method card** (USDC on Base via Coinbase Commerce)
- **Statement history** — list of quarterly periods with:
  - Period (e.g., "Q1 2026"), date range, amount, status (withheld/paid)
  - CSV button → direct link to `soundsystem.protonradio.com` with real `id` and `qid`
  - Arrow to go to detail for each statement

---

### 3. Statement Detail — `/dashboard/royalties/[qid]`

**File:** `app/(dashboard)/dashboard/royalties/[qid]/page.tsx`

Quarterly detail page with 4 tables:

1. **Release Summary** — period releases, sales and streams (this quarter vs. cumulative)
2. **Track Sales & Streams** — per track: sold, streams, store, royalty percentage, amount
3. **Stores & Services** — breakdown by platform (Spotify, Beatport, etc.)
4. **Advance & Expense Debits** — deductions for mastering, design, etc. in amber (with explanation note)

- Header with CSV download button direct to real Proton SoundSystem URL
- When detail not available: empty state with download button
- Breadcrumb: Dashboard → Royalties → Period
- `PRO_USER_ID = 67325` hardcoded for download links

---

### 4. Performance Page — `/dashboard/performance`

**File:** `app/(dashboard)/dashboard/performance/page.tsx`

The most complex dashboard page. Uses **TanStack Query** to fetch real tracks from Proton API:

- **4 KPI cards:** Total Streams · Total Sales · Tracks · Top Track
- **Streams chart** (`StreamsChart` with Recharts) — filterable by range: 30D / 3M / 6M / 1Y / All
- **Genre donut** (`GenreDonut` with Recharts) — streams distribution by genre
- **Tracks table** with:
  - Filters by category: Tracks · Releases · Labels · Genres
  - Real-time search (filters by title or label)
  - Sorting by Streams / Sales / Date (toggle asc/desc)
  - Skeleton loading state during API fetch
- Mock data in `lib/mock/performance.ts` (streams and sales per `trackId`)
- Genres in `TRACK_GENRES` — dictionary `trackId → genre`

---

### 5. Notifications Panel — `NotificationsPanel`

**File:** `components/dashboard/NotificationsPanel.tsx`

Sidebar drawer that slides in from the right (`translate-x-full` → `translate-x-0`):

- Blur backdrop that closes panel on click
- Closes with `Escape`
- 5 mock notifications: new release approved, royalties available, streams spike, pending contract, release rejected
- Orange read indicators on unread notifications
- Badge with unread counter in header
- "Clear all" button in footer
- Empty state with `CheckCheck` icon when no notifications remain

Connected from both **DashboardNavbar** (mobile) and **AppSidebar** (desktop).

---

### 6. Collapsible Sidebar — `AppSidebar`

**File:** `components/dashboard/AppSidebar.tsx`

Desktop sidebar (`lg:flex`) with:

- **Collapse toggle** — saved to `localStorage` (`proton-sidebar-collapsed`). Expanded: 256px, collapsed: 64px, with 300ms CSS transition
- **Collapsed width:** icons only, centered with `title` tooltip
- **Logo** (image `logo txt.png`) visible only when expanded
- **Notifications bell** (opens `NotificationsPanel`) with orange badge
- **Navigation links:** Artists · Performance · Royalties · Contracts · Settings — with orange highlight on active route
- **Producer tools:** Release Links (route within dashboard)
- **Platform:** Shows · Labels · DJ Mixes → hub `/dashboard/platform`. **Public site:** Radio · Shows · Charts · Labels (public routes; exits dashboard). **Performance** in Dashboard nav.
- **Footer:** artist avatar + link to settings/profile + collapse/expand button

---

### 7. Mobile Navbar — `DashboardNavbar`

**File:** `components/dashboard/DashboardNavbar.tsx`

Sticky mobile-only navbar (`lg:hidden`) with:

- Hamburger button (left) → opens `HamburgerMenu`
- "Proton" logo centered
- Notifications bell button (right) → opens `NotificationsPanel` (with orange badge)

---

### 8. Dashboard Store — Zustand

**File:** `lib/store/dashboardStore.ts`

Zustand store with `persist` middleware for dashboard widget layout:

```typescript
interface DashboardState {
  widgetOrder: WidgetId[];      // draggable widget order
  hiddenWidgets: WidgetId[];    // widgets hidden by user
  setWidgetOrder, hideWidget, showWidget, resetLayout
}
```

Widgets: `streams` · `latest-tracks` · `streams-by-release` · `royalties`
Persisted to `localStorage` under key `proton-dashboard-layout`.

---

### Summary of files created/modified in this session

| File | Status | What it does |
|---|---|---|
| `app/(dashboard)/dashboard/contracts/page.tsx` | ✅ New | Complete contracts page |
| `app/(dashboard)/dashboard/royalties/page.tsx` | ✅ Enhanced | History + progress bar + payout config |
| `app/(dashboard)/dashboard/royalties/[qid]/page.tsx` | ✅ New | Statement detail with 4 tables |
| `app/(dashboard)/dashboard/performance/page.tsx` | ✅ Enhanced | KPIs + charts + tracks table with search/sort |
| `components/dashboard/NotificationsPanel.tsx` | ✅ New | Notifications drawer |
| `components/dashboard/DashboardNavbar.tsx` | ✅ Updated | Connects bell → NotificationsPanel |
| `components/dashboard/AppSidebar.tsx` | ✅ Updated | Collapsible sidebar + bell + notifications |
| `components/dashboard/DashboardContent.tsx` | ✅ Updated | Dashboard main layout |
| `components/dashboard/BottomNav.tsx` | ✅ Updated | Mobile bottom nav |
| `lib/mock/contracts.ts` | ✅ New | 4 mock contracts with colors per label |
| `lib/mock/royalties.ts` | ✅ Updated | Quarterly statements + payout config |
| `lib/store/dashboardStore.ts` | ✅ New | Zustand store for widget layout |
| `types/contract.ts` | ✅ Updated | Contract types |
| `types/royalty.ts` | ✅ Updated | Royalty and Statement types |

---

## 🗺️ Public Area Guide — Next Steps (B2C)

> Implementation guide for the public area (`(public)`) — the B2C part of the platform.
> The dashboard (`(dashboard)`) already has its foundation built. This document is the roadmap to build what would be **protonradio.com**: live radio, shows, charts, labels, and artist profiles.

---

## Quick Context

| Area | Base Route | Audience | Status |
|---|---|---|---|
| **Dashboard (B2B)** | `/dashboard` | Artists, producers, labels | ✅ In progress |
| **Public (B2C)** | `/` | Listeners, fans | ⬜ To be built |

The public area **unifies** what today are two separate sites: `protonradio.com` (radio) and `soundsystem.protonradio.com` (dashboard). Dashboard access is through the public navbar with a **"For Artists"** button → `/dashboard`.

---

## File Structure — already exists (empty)

```
app/(public)/
├── layout.tsx                ← Empty layout — Navbar + Global Player go here
├── page.tsx                  ← / — Home
├── shows/page.tsx            ← /shows
├── charts/page.tsx           ← /charts
├── labels/page.tsx           ← /labels
└── [artist-name]/page.tsx    ← /naial, /andy-green, etc.
```

**All files exist but are empty.** The work is to build them one by one following this guide.

---

## API — Real GraphQL available

Already configured and working in `lib/api/protonApi.ts`:

```
Endpoint: https://api.protonradio.com/graphql
Headers:
  Content-Type: application/json
  origin: https://www.protonradio.com
  referer: https://www.protonradio.com/
Cache: revalidate every 300s (5 min) — Next.js fetch cache
```

### Already tested queries (used in dashboard)

```graphql
# Artist with tracks
query GetArtistWithTracks($id: ID!) {
  artist(id: $id) {
    id
    name
    image { url }
    tracks {
      id
      title
      release {
        id
        name
        date
        label { id name }
      }
    }
  }
}
```

### Queries to explore for public area

These queries **probably exist** — need to test against the API:

```graphql
# Recent shows / mixes
query GetLatestMixes($limit: Int, $genre: String) {
  mixes(limit: $limit, genre: $genre) {
    id
    title
    date
    youtubeId
    genre
    artist { id name image { url } }
  }
}

# Specific show (for detail page)
query GetMix($id: ID!) {
  mix(id: $id) {
    id
    title
    date
    youtubeId
    tracklist { position title artist duration }
    artist { id name image { url } }
  }
}

# Charts by genre
query GetCharts($genre: String!) {
  charts(genre: $genre) {
    position
    track {
      id
      title
      artist { name }
      label { name }
      release { date }
    }
  }
}

# List of labels
query GetLabels {
  labels {
    id
    name
    slug
    image { url }
    artistCount
  }
}

# Artists from a label
query GetLabelArtists($id: ID!) {
  label(id: $id) {
    id
    name
    artists { id name slug image { url } }
  }
}

# Now playing / live stream
query GetNowPlaying {
  nowPlaying {
    artist { name }
    showName
    youtubeStreamId
    startTime
  }
}
```

> **How to test:** Use a tool like [Altair GraphQL](https://altairgraphql.dev/) or simply `fetch` from the browser console pointing to the endpoint with the correct headers. You can also do introspection (`__schema`) to see all available types.

---

## How to add a new query to the API

Create the fetcher in `lib/api/` following the existing pattern:

```typescript
// lib/api/shows.ts
import { protonQuery } from "./protonApi";

export interface ProtonMix {
  id: string;
  title: string;
  date: string;
  youtubeId: string;
  genre: string;
  artist: { id: string; name: string; image: { url: string } | null };
}

const LATEST_MIXES_QUERY = `
  query GetLatestMixes($limit: Int) {
    mixes(limit: $limit) {
      id title date youtubeId genre
      artist { id name image { url } }
    }
  }
`;

export async function fetchLatestMixes(limit = 12): Promise<ProtonMix[]> {
  const data = await protonQuery<{ mixes: ProtonMix[] }>(
    "GetLatestMixes",
    LATEST_MIXES_QUERY,
    { limit }
  );
  return data.mixes;
}
```

In the Server component (RSC), call directly without TanStack Query — the public area uses SSR:

```typescript
// app/(public)/shows/page.tsx
import { fetchLatestMixes } from "@/lib/api/shows";

export default async function ShowsPage() {
  const mixes = await fetchLatestMixes(24);
  // ...
}
```

> The dashboard uses TanStack Query because it's a Client Component with interactivity. Public pages are Server Components → direct `async/await`.

---

## Design System — summary for public area

The design system is already defined in `globals.css`. The public area uses **dark mode by default** (`data-theme="dark"`).

### Colors

| CSS Token | Dark Mode | Usage |
|---|---|---|
| `--color-background` | `#0B0E14` | Main background |
| `--color-surface` | `#181C25` | Cards and panels |
| `--color-accent` | `#E67E22` | Proton Orange — CTAs, active states |
| `--color-text-primary` | `#FFFFFF` | Titles, names |
| `--color-text-secondary` | `#94A3B8` | Metadata, subtitles |
| `--color-border` | `rgba(255,255,255,0.06)` | Subtle borders |

### Section accents (legacy brand colors)

| Color | Hex | Section |
|---|---|---|
| **Orange** | `#E67E22` | Shows, uploads, live |
| **Teal** | `#1ABC9C` | Labels, management |
| **Purple** | `#9B59B6` | DJ Mixes |
| **Green** | `#27AE60` | Royalties, account |

### Typography

```css
font-display: "Plus Jakarta Sans"  /* Titles — Bold Italic for artist names */
font-ui:      "Inter"              /* UI, metadata, tables */
```

### Key Effects

```css
/* Artist border — "studio LED glow" */
background: linear-gradient(#181C25, #181C25) padding-box,
            linear-gradient(135deg, #00FF9D, transparent) border-box;

/* Cards */
background: #181C25;
border: 1px solid rgba(255, 255, 255, 0.05);
```

---

## Pages — detailed plan

### 1. `PublicLayout` — `app/(public)/layout.tsx`

**Priority: FIRST — everything else depends on this.**

Components to create:
- `PublicNavbar` — logo + links + hamburger menu + "For Artists" button
- `GlobalPlayer` — persistent bottom player (Zustand store)
- Wrapper with `data-theme="dark"`

```tsx
// app/(public)/layout.tsx
export default function PublicLayout({ children }) {
  return (
    <div data-theme="dark" className="min-h-screen bg-background">
      <PublicNavbar />
      <main>{children}</main>
      <GlobalPlayer />
    </div>
  );
}
```

---

### 2. `PublicNavbar` — `components/public/PublicNavbar.tsx`

Based on the real menu from protonradio.com (see screenshots):

**Desktop:** logo left | links center | "For Artists" orange button right

**Mobile:** logo center | hamburger right

**Hamburger menu — content:**
```
Radio          →  /
Shows          →  /shows
Charts         →  /charts
Labels         →  /labels
──────────────────────────
For Artists    →  /dashboard    (orange CTA, button)
──────────────────────────
[if logged in]
  Naialmusic
  → Naial (artist)
  → Discovery Mode
  → Track Stack
  → Inbox
  → Account
  → Sign Out
```

Active state: orange highlight on the current route link (`usePathname`).

---

### 3. `GlobalPlayer` — `components/player/GlobalPlayer.tsx`

Player persistente que no se interrumpe al navegar entre páginas.

**Store Zustand a crear** en `lib/store/playerStore.ts`:

```typescript
interface PlayerState {
  currentMix: ProtonMix | null;
  isPlaying: boolean;
  play: (mix: ProtonMix) => void;
  pause: () => void;
  toggle: () => void;
}
```

**UI del player (bottom bar):**
```
[artwork] Artista — Nombre del Show    [⏮] [▶/⏸] [⏭]    [━━━●━━━━━] 32:14
```

- Sticky bottom en mobile y desktop
- Altura: ~64px
- Al hacer click en el nombre → abre detalle del show
- El audio es embed de YouTube (iframe oculto o YouTube IFrame API)

---

### 4. `/` — Home — `app/(public)/page.tsx`

**Sección 1: Hero — Now Playing**
```
┌─────────────────────────────────────────────┐
│  [artwork grande — imagen del show actual]   │
│                                             │
│   Robin Thurston                            │
│   System Showcase                           │
│                                             │
│          [▶  Play Live]                     │
└─────────────────────────────────────────────┘
```
- Datos desde `nowPlaying` query (o mock inicial)
- Fondo: imagen del show con overlay gradiente oscuro
- Botón Play → llama a `playerStore.play(mix)`

**Sección 2: Latest Mixes**
- Título "Latest Mixes" + link "YouTube →"
- Grid 1 col (mobile) / 2 col (tablet) / 3 col (desktop)
- Cada card: `MixCard` (ver componente abajo)
- Datos: `fetchLatestMixes(12)`

**Sección 3: Explore by Genre**
- Título "Explore On Demand"
- Subtítulo "Stream any mix in the Proton library"
- Grid de géneros con imagen de fondo + color overlay:

| Género | Color overlay |
|---|---|
| All Genres | `#E67E22` (orange) |
| Breaks | `#9B59B6` (purple) |
| Downtempo | `#2980B9` (blue) |
| Deep House | `#27AE60` (green) |
| Electro | `#2471A3` (dark blue) |
| Electronica | `#1ABC9C` (teal) |
| Progressive | `#C0392B` (red-orange) |
| Tech House | `#922B21` (dark red) |
| Techno | `#8E44AD` (purple-magenta) |

**Sección 4: Track Stack CTA** (si aplica)
- Banner: "All the music from your Proton labels available for DJ Mixes on Spotify & Apple Music"
- Botón: "Upload Mix →" (link externo a soundsystem)

---

### 5. `/shows` — Shows — `app/(public)/shows/page.tsx`

**Header:**
```
Shows
Episodes from the Proton library, sorted by date.
```

**Filtros (chips horizontales):**
- All · Breaks · Downtempo · Deep House · Electro · Electronica · Progressive · Tech House · Techno

**Grid de cards:**
- `fetchLatestMixes(48, genre?)` con filtrado por género
- Paginación o "Load more" button
- Skeleton loading state

**Interacción:** Click en card → play en Global Player (o abrir YouTube)

---

### 6. `/charts` — Charts — `app/(public)/charts/page.tsx`

**Header:**
```
Charts
Top tracks by genre.
```

**Selector de género** (tabs o dropdown):
- Progressive · Melodic · Deep House · Techno · etc.

**Lista estilo tabla:**
```
#   [artwork]  Title — Artist          Label       Date    Length
1   [img]      Midnight Drive — Naial  Addictive   Apr 22  6:05
```

**Datos:** `fetchCharts(genre)` → si la API no lo expone, usar mock data tipada.

---

### 7. `/labels` — Labels — `app/(public)/labels/page.tsx`

**Header:**
```
Labels
Record labels distributed through Proton Radio.
```

**Grid de cards por label:**
```
┌──────────────┐
│   [logo]     │
│  Label Name  │
│  12 artists  │
└──────────────┘
```

- Color accent del label (del design system, Teal para labels)
- Click → página de label con sus artistas (futuro: `/labels/[slug]`)

---

### 8. `/[artist-name]` — Perfil público — `app/(public)/[artist-name]/page.tsx`

**SSR con metadata dinámica para SEO:**

```typescript
export async function generateMetadata({ params }) {
  const artist = await fetchArtistWithTracks(params["artist-name"]);
  return {
    title: `${artist.name} — Proton Radio`,
    description: artist.bio,
    openGraph: { images: [artist.image?.url] },
  };
}
```

**Layout de la página:**

```
┌─────────────────────────────────────────────┐
│  [foto circular grande — glow border]        │
│  Naial                  Argentina            │
│  Melodic House · Progressive                 │
│  [Spotify] [SoundCloud] [Instagram]          │
└─────────────────────────────────────────────┘

Releases                          [ver todas →]
┌──────┐ ┌──────┐ ┌──────┐
│      │ │      │ │      │
│      │ │      │ │      │
└──────┘ └──────┘ └──────┘
Title     Title     Title
Label     Label     Label
Date      Date      Date

Latest Mixes
[lista de shows del artista]
```

**Datos:** `fetchArtistWithTracks(id)` — ya disponible. Para el ID desde el slug, o se busca por nombre.

---

## Componentes a crear

```
components/public/
├── PublicNavbar.tsx          ← Navbar + hamburger
├── HamburgerMenu.tsx         ← Drawer lateral mobile
├── MixCard.tsx               ← Card de un show/mix
├── GenreGrid.tsx             ← Grid de géneros con colores
├── ArtistHero.tsx            ← Hero para perfil público
├── ArtistCard.tsx            ← Card pequeña de artista
├── LabelCard.tsx             ← Card de label
├── ChartRow.tsx              ← Fila de un chart (# · artwork · info)
└── TrackStackBanner.tsx      ← CTA de Track Stack

components/player/
└── GlobalPlayer.tsx          ← Player persistente bottom bar

lib/api/
├── protonApi.ts              ← ✅ Ya existe
├── artist.ts                 ← ✅ Ya existe
├── tracks.ts                 ← ✅ Ya existe
├── shows.ts                  ← ⬜ Crear
├── charts.ts                 ← ⬜ Crear
└── labels.ts                 ← ⬜ Crear

lib/store/
├── dashboardStore.ts         ← ✅ Ya existe
└── playerStore.ts            ← ⬜ Crear (Zustand para el Global Player)

lib/mock/
├── shows.ts                  ← ⬜ Crear (fallback si API no responde)
├── charts.ts                 ← ⬜ Crear
└── labels.ts                 ← ⬜ Crear
```

---

## `MixCard` — componente más usado

Usado en Home, Shows, y perfil de artista. Diseño:

```
┌─────────────────────────────┐
│  [artwork 16:9]             │
│                    [▶]      │  ← overlay en hover
└─────────────────────────────┘
  Andy Green
  System Showcase (4/22/2026) Part 2
  Progressive · 1h 23m
```

Props:
```typescript
interface MixCardProps {
  mix: ProtonMix;
  onPlay: (mix: ProtonMix) => void;
  size?: "sm" | "md" | "lg";
}
```

Interacción: hover → overlay oscuro con ícono Play naranja. Click → `playerStore.play(mix)`.

---

## Orden de implementación recomendado

| # | Tarea | Archivo | Depende de |
|---|---|---|---|
| 1 | `playerStore` Zustand | `lib/store/playerStore.ts` | — |
| 2 | `PublicLayout` | `app/(public)/layout.tsx` | playerStore |
| 3 | `PublicNavbar` + `HamburgerMenu` | `components/public/` | layout |
| 4 | `GlobalPlayer` | `components/player/` | playerStore |
| 5 | API `shows.ts` + mock | `lib/api/shows.ts` | protonApi |
| 6 | `MixCard` | `components/public/MixCard.tsx` | — |
| 7 | **Home** `/` | `app/(public)/page.tsx` | todo lo anterior |
| 8 | **Shows** `/shows` | `app/(public)/shows/page.tsx` | MixCard, shows API |
| 9 | API `labels.ts` + `LabelCard` | `lib/api/labels.ts` | protonApi |
| 10 | **Labels** `/labels` | `app/(public)/labels/page.tsx` | labels API |
| 11 | API `charts.ts` + `ChartRow` | `lib/api/charts.ts` | protonApi |
| 12 | **Charts** `/charts` | `app/(public)/charts/page.tsx` | charts API |
| 13 | `ArtistHero` + SSR metadata | `components/public/ArtistHero.tsx` | artist API |
| 14 | **Artist Profile** `/[artist-name]` | `app/(public)/[artist-name]/page.tsx` | ArtistHero |

---

## Diferencias técnicas: público vs dashboard

| | Dashboard (B2B) | Public (B2C) |
|---|---|---|
| **Rendering** | Client Components | Server Components (RSC) |
| **Data fetching** | TanStack Query | `async/await` directo en Server Components |
| **Caché** | React Query cache | Next.js fetch cache (`revalidate: 300`) |
| **Auth** | Requiere login | Sin auth (acceso libre) |
| **SEO** | No necesario | Crítico — `generateMetadata` en perfiles |
| **Interactividad** | Alta (dnd, widgets) | Baja — el player es el único estado global |

---

## Notas de la API real — protonradio.com

- La API pública es la misma que usa el sitio oficial: `https://api.protonradio.com/graphql`
- Los shows actuales redirigen a YouTube (la radio en vivo migró ahí)
- El Track Stack usa Spotify y Apple Music — esos datos probablemente vienen de la misma API
- El ID de artista en el dashboard es numérico (`"88457"` = Naial). En la URL pública es el slug (`naial`). Hay que buscar si la API acepta `artist(slug: "naial")` además de `artist(id: "88457")`
- Las imágenes de artwork de shows vienen de URLs de Cloudinary (`res.cloudinary.com`) — ya se usa en el dashboard con `next/image`

---

## Referencia visual — sitio actual protonradio.com

Basado en capturas del sitio en vivo:

- **Fondo:** negro puro (`#000`) con navbar naranja `#E67E22`
- **Nuestro rediseño:** dark mode profundo `#0B0E14` + naranja como acento, no como fondo del navbar
- **Now Playing:** card grande con artwork + nombre artista + nombre show + botón play
- **Latest Mixes:** lista vertical con artwork pequeño, igual que un feed
- **Genres:** grid de cards con imagen de fondo + color overlay semitransparente + nombre del género en blanco
- **Hamburger menu:** drawer desde la derecha, fondo negro, links simples

El rediseño mantiene la misma **información y estructura** pero con el design system oscuro premium, tipografía mejorada y componentes más visuales.
