# Proton Radio — Public Area (B2C) — Guía de implementación

> **Área:** `(public)` — el rediseño de `protonradio.com`
> **Estado:** Archivos scaffoldeados, implementación pendiente.
> Este documento es la hoja de ruta completa para construir el área pública.

---

## Dos áreas, un proyecto

El proyecto unifica dos sitios que hoy existen por separado bajo un único dominio y sistema de diseño:

| Área | Grupo de rutas | URL base | Audiencia | Rendering | Auth |
|---|---|---|---|---|---|
| **Public (B2C)** | `app/(public)/` | `/` | Oyentes y fans | Server Components (SSR) | No requerida |
| **Dashboard (B2B)** | `app/(dashboard)/` | `/dashboard` | Artistas, labels | Client Components | Requerida |

Los grupos de rutas entre paréntesis (`(public)`, `(dashboard)`) son una feature de Next.js App Router: **agrupan archivos sin afectar la URL**. Cada grupo tiene su propio `layout.tsx`, con su propio Navbar, sus propios estilos de contenedor y sus propias dependencias. Nunca se mezclan.

El único punto de conexión entre las dos áreas es el botón **"For Artists"** en el `PublicNavbar` → `/dashboard`.

---

## Arquitectura de archivos — estado actual y completo

```
proton/
│
├── app/
│   ├── layout.tsx                          ← Root layout: fonts, ThemeProvider, QueryProvider
│   ├── globals.css                         ← Design tokens (colores, tipografía) ✅
│   │
│   ├── (public)/                           ← Área pública — SSR — sin auth
│   │   ├── layout.tsx                      ← PublicNavbar + GlobalPlayer ⚠️ vacío
│   │   ├── page.tsx                        ← / — Home ⚠️ vacío
│   │   ├── shows/
│   │   │   └── page.tsx                    ← /shows ⚠️ vacío
│   │   ├── charts/
│   │   │   └── page.tsx                    ← /charts ⚠️ vacío
│   │   ├── labels/
│   │   │   └── page.tsx                    ← /labels ⚠️ vacío
│   │   └── [artist-name]/
│   │       └── page.tsx                    ← /naial, /andy-green ⚠️ vacío
│   │
│   └── (dashboard)/                        ← Área privada — Client — auth
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
│   ├── public/                             ← Exclusivo del área pública
│   │   ├── Navbar.tsx                      ← PublicNavbar ⚠️ vacío (renombrar internamente)
│   │   ├── HamburgerMenu.tsx               ⬜ por crear
│   │   ├── MixCard.tsx                     ⬜ por crear
│   │   ├── GenreGrid.tsx                   ⬜ por crear
│   │   ├── GenreChip.tsx                   ⬜ por crear
│   │   ├── NowPlayingHero.tsx              ⬜ por crear
│   │   ├── ArtistHero.tsx                  ⬜ por crear
│   │   ├── ArtistCard.tsx                  ⬜ por crear
│   │   ├── LabelCard.tsx                   ⬜ por crear
│   │   └── ChartRow.tsx                    ⬜ por crear
│   │
│   ├── dashboard/                          ← Exclusivo del dashboard ✅ completo
│   │   ├── AppSidebar.tsx
│   │   ├── BottomNav.tsx
│   │   ├── DashboardNavbar.tsx
│   │   ├── DashboardContent.tsx
│   │   ├── NotificationsPanel.tsx
│   │   ├── HamburgerMenu.tsx
│   │   ├── StreamsChart.tsx
│   │   ├── GenreDonut.tsx
│   │   ├── ReleasesChart.tsx
│   │   └── RoyaltiesWidget.tsx
│   │
│   ├── player/
│   │   └── GlobalPlayer.tsx                ← Compartido (visible en área pública) ⚠️ vacío
│   │
│   ├── providers/                          ← Globales ✅
│   │   ├── ThemeProvider.tsx
│   │   └── QueryProvider.tsx
│   │
│   └── settings/                           ← Dashboard ✅
│       └── SettingsShared.tsx
│
├── lib/
│   ├── api/
│   │   ├── protonApi.ts                    ← Cliente base GraphQL ✅
│   │   ├── artist.ts                       ← fetchArtistWithTracks(id) ✅
│   │   ├── tracks.ts                       ← fetchTracks() — dashboard mock ✅
│   │   ├── mixes.ts                        ← fetchLatestMixes, fetchMixById ⬜
│   │   ├── labels.ts                       ← fetchLabels, fetchLabelById ⬜
│   │   └── charts.ts                       ← fetchCharts(genre) ⬜
│   │
│   ├── mock/
│   │   ├── tracks.ts                       ← Dashboard ✅
│   │   ├── streams.ts                      ← Dashboard ✅
│   │   ├── contracts.ts                    ← Dashboard ✅
│   │   ├── royalties.ts                    ← Dashboard ✅
│   │   ├── performance.ts                  ← Dashboard ✅
│   │   ├── artist.ts                       ← Dashboard ✅
│   │   ├── account.ts                      ← Dashboard ✅
│   │   ├── mixes.ts                        ← Public — fallback API ⬜
│   │   ├── labels.ts                       ← Public — fallback API ⬜
│   │   └── charts.ts                       ← Public — puede ser permanente ⬜
│   │
│   └── store/
│       ├── dashboardStore.ts               ← Layout de widgets ✅
│       ├── themeStore.ts                   ← Light/dark mode global ✅
│       └── playerStore.ts                  ← Player global ⚠️ refactorizar
│
└── types/
    ├── track.ts                            ← Track del dashboard ✅
    ├── artist.ts                           ← Artist local ✅
    ├── contract.ts                         ✅
    ├── royalty.ts                          ✅
    ├── mix.ts                              ← ProtonMix (área pública) ⬜
    └── label.ts                            ← ProtonLabel (área pública) ⬜
```

---

## Rutas URL — mapa completo del proyecto

### Área pública — `(public)`

| URL | Archivo | Descripción | Estado |
|---|---|---|---|
| `/` | `app/(public)/page.tsx` | Home: now playing + latest shows + géneros + top 100 | ⚠️ vacío |
| `/shows` | `app/(public)/shows/page.tsx` | Todos los mixes con filtro por género | ⚠️ vacío |
| `/charts` | `app/(public)/charts/page.tsx` | Top tracks por género | ⚠️ vacío |
| `/labels` | `app/(public)/labels/page.tsx` | Directorio de labels | ⚠️ vacío |
| `/[artist-name]` | `app/(public)/[artist-name]/page.tsx` | Perfil público del artista (SSR + SEO) | ⚠️ vacío |

> **Nota:** Las rutas del sitio original usan IDs numéricos (`/artists/88457/naial/mixes`).
> Nuestro rediseño usa solo el slug (`/naial`) — más limpio y SEO-friendly.
> Internamente, se mapea el slug al ID de la API.

### Área privada — `(dashboard)`

| URL | Archivo | Estado |
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

## Diferencias técnicas clave entre las dos áreas

| | Dashboard (B2B) | Public (B2C) |
|---|---|---|
| **Rendering** | Client Components (`"use client"`) | Server Components (RSC) — `async/await` directo |
| **Data fetching** | TanStack Query (cache, refetch, loading states) | `async/await` en el Server Component |
| **Caché** | React Query cache en cliente | Next.js fetch cache (`next: { revalidate: 300 }`) |
| **Auth** | Requiere login (mock por ahora) | Sin auth — acceso libre |
| **SEO** | No necesario | Crítico — `generateMetadata()` en perfiles de artista |
| **Interactividad** | Alta (drag & drop, filtros, gráficos) | Baja — el player es el único estado global |
| **Estado global** | `dashboardStore` (widgets), `themeStore` | `playerStore` (play/pause), `themeStore` |

---

## Problemas a resolver antes de empezar

### 1. Refactorizar `playerStore.ts`

El store actual usa el tipo `Track` del dashboard (`status: draft/pending/published`, `audioUrl`). El player público necesita `ProtonMix` (con `youtubeId`).

**Solución:** refactorizar el store para usar el nuevo tipo `ProtonMix` definido en `types/mix.ts`.

```typescript
// types/mix.ts — nuevo archivo
export interface ProtonMix {
  id: string;
  title: string;
  date: string;
  youtubeId: string;
  genre: string;
  duration?: string;
  artist: {
    id: string;
    name: string;
    image: { url: string } | null;
  };
}

// lib/store/playerStore.ts — refactorizado
interface PlayerState {
  currentMix: ProtonMix | null;
  isPlaying: boolean;
  queue: ProtonMix[];
  play: (mix: ProtonMix) => void;
  pause: () => void;
  resume: () => void;
  toggle: () => void;
  setQueue: (mixes: ProtonMix[]) => void;
}
```

### 2. Agregar Cloudinary a `next.config.ts`

Las imágenes de los shows vienen de Cloudinary. Sin esto, `next/image` bloquea las URLs.

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "proton-profile-images.storage.googleapis.com" },
    { protocol: "https", hostname: "res.cloudinary.com" },   // ← agregar
  ],
},
```

### 3. `types/label.ts` — nuevo archivo

```typescript
export interface ProtonLabel {
  id: string;
  name: string;
  slug: string;
  image: { url: string } | null;
  artistCount?: number;
  genres?: string[];
}
```

---

## API GraphQL — configuración y queries

### Cliente base — ya existe

```
Endpoint: https://api.protonradio.com/graphql
Headers:
  Content-Type: application/json
  origin: https://www.protonradio.com
  referer: https://www.protonradio.com/
Cache: next: { revalidate: 300 } — 5 minutos
```

### Queries confirmadas (usadas en dashboard)

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

### Queries a explorar para el área pública

Testear en [Altair GraphQL](https://altairgraphql.dev/) con los headers de arriba antes de implementar.

```graphql
# Mixes recientes (la más importante — Home + Shows)
query GetLatestMixes($limit: Int, $genre: String) {
  mixes(limit: $limit, genre: $genre) {
    id title date youtubeId genre
    artist { id name image { url } }
  }
}

# Mix individual (futuro: página de detalle)
query GetMix($id: ID!) {
  mix(id: $id) {
    id title date youtubeId
    tracklist { position title artist duration }
    artist { id name image { url } }
  }
}

# Lista de labels
query GetLabels {
  labels {
    id name slug artistCount
    image { url }
  }
}

# Artistas de un label
query GetLabelArtists($id: ID!) {
  label(id: $id) {
    id name
    artists { id name slug image { url } }
  }
}

# Charts por género
query GetCharts($genre: String!) {
  charts(genre: $genre) {
    position
    track {
      id title
      artist { name }
      label { name }
      release { date }
    }
  }
}

# Live stream / now playing
query GetNowPlaying {
  nowPlaying {
    artist { name }
    showName
    youtubeStreamId
    startTime
  }
}
```

> Si una query no existe en la API, usar mock data tipada en `lib/mock/`. Las de charts probablemente sean mock permanente.

---

## Páginas — plan detallado

---

### `app/(public)/layout.tsx` — PublicLayout

**Primera en construir. Todo lo demás depende de esto.**

```tsx
import PublicNavbar from "@/components/public/Navbar";
import GlobalPlayer from "@/components/player/GlobalPlayer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar />
      <main className="pb-20">{children}</main>
      <GlobalPlayer />
    </div>
  );
}
```

- `pb-20` — padding bottom para que el contenido no quede debajo del player (64px)
- NO lleva `data-theme` hardcodeado — el `ThemeProvider` del root layout lo maneja

---

### `components/public/Navbar.tsx` — PublicNavbar

**Desktop:**
```
[Logo]     Radio  Shows  Charts  Labels  Explore            [For Artists →]
```

**Mobile:**
```
[≡]                [Logo]
```

**Hamburger (drawer lateral desde la izquierda):**
```
Radio          →  /
Shows          →  /shows
Charts         →  /charts
Labels         →  /labels
Explore        →  /explore   (futuro)
──────────────────────────────────
[ For Artists → /dashboard ]      ← botón naranja full-width
```

- `usePathname()` para highlight naranja en el link activo
- "For Artists": `bg-accent text-white` — el CTA principal del navbar

---

### `components/player/GlobalPlayer.tsx` — GlobalPlayer

Player persistente. `position: fixed; bottom: 0`. Altura 64px.

```
[artwork 48x48]  Andy Green — System Showcase (4/22/2026)   [⏮] [▶/⏸] [⏭]   [━━━●━━━] 32:14
```

- Background: `bg-surface` con `border-t border-border` y `backdrop-blur`
- Audio: YouTube IFrame API (el `youtubeId` del mix)
- Estado: `usePlayerStore()` — `currentMix`, `isPlaying`, `play`, `pause`, `toggle`
- Si no hay nada en reproducción: `"Proton Radio — Tune In"` + botón Play

---

### `app/(public)/page.tsx` — Home `/`

**4 secciones.**

**1. NowPlayingHero** — ocupa el ancho completo, ~70vh en desktop
```
[imagen del show — overlay gradiente oscuro abajo]
  LIVE NOW
  Robin Thurston
  System Showcase
  [ ▶ Play Live Stream ]
```
- Datos: query `GetNowPlaying` o mock
- El botón llama a `playerStore.play(mix)`

**2. Latest Shows**
- Título: `"Latest Shows"` + `"View all →"` → `/shows`
- Grid: 1 col / 2 col (sm) / 3 col (lg) / 4 col (xl)
- Componente: `MixCard`
- Datos: `fetchLatestMixes(12)`

**3. Explore by Genre**
- Título: `"Explore On Demand"`
- Grid de cards/chips con imagen de fondo + color overlay semitransparente:

| Género | Color overlay | Ruta |
|---|---|---|
| All | `#E67E22` | `/shows` |
| Breaks | `#9B59B6` | `/shows?genre=breaks` |
| Downtempo | `#2980B9` | `/shows?genre=downtempo` |
| Deep House | `#27AE60` | `/shows?genre=deep-house` |
| Electro | `#2471A3` | `/shows?genre=electro` |
| Electronica | `#1ABC9C` | `/shows?genre=electronica` |
| Progressive | `#C0392B` | `/shows?genre=progressive` |
| Tech House | `#922B21` | `/shows?genre=tech-house` |
| Techno | `#8E44AD` | `/shows?genre=techno` |

**4. Top 100 Preview**
- Título: `"Top 100 This Month"` + `"Full chart →"` → `/charts`
- Lista de 5 tracks: posición + artwork + título + artista + label
- Datos: `fetchCharts("progressive")` o mock

---

### `app/(public)/shows/page.tsx` — Shows `/shows`

```
Shows
Episodes from the Proton library, sorted by date.
```

- Chips de géneros scrolleables (`GenreChip`) — filtra la grilla en cliente o vía `searchParams`
- Grid de `MixCard`
- Datos: `fetchLatestMixes(48, genre?)`
- Botón "Load more" (paginación simple)
- Skeleton loading si se decide hacer client-side con TanStack Query

---

### `app/(public)/charts/page.tsx` — Charts `/charts`

```
Charts
Top tracks by genre this month.
```

- Tabs de género (Progressive · Deep House · Techno · Electronica · ...)
- Lista tipo tabla con `ChartRow`:

```
#    [art]  Title — Artist              Label          Date     Length
1    [img]  Midnight Drive — Naial      Addictive     Apr 22   6:05
```

- Columnas: posición, artwork 40×40, título + artista, label, fecha, duración
- Hover: fondo `rgba(255,255,255,0.03)` + ícono Play
- Datos: `fetchCharts(genre)`. Si no existe en API → `lib/mock/charts.ts`

---

### `app/(public)/labels/page.tsx` — Labels `/labels`

```
Labels
Record labels distributed through Proton Radio.
```

- Grid de `LabelCard`: logo 80×80 + nombre + "N artists"
- Grid: 2 col / 3 col (md) / 4 col (lg) / 6 col (xl)
- Acento: `#1ABC9C` (teal — color de marca para labels)
- Datos: `fetchLabels()`. Si no existe → `lib/mock/labels.ts`
- En MVP: sin link a detalle de label. Futuro: `/labels/[slug]`

---

### `app/(public)/[artist-name]/page.tsx` — Perfil de artista `/naial`

**Server Component con SSR y SEO.**

```typescript
export async function generateMetadata({ params }) {
  const artist = await fetchArtistBySlug(params["artist-name"]);
  return {
    title: `${artist.name} — Proton Radio`,
    description: `Stream mixes and explore releases by ${artist.name} on Proton Radio.`,
    openGraph: { images: [artist.image?.url] },
  };
}
```

**Layout:**
```
[foto circular 128px — glow border verde]
Naial                        Argentina
Melodic House · Progressive
[ ▶ Play latest mix ]  [Spotify ↗]  [SoundCloud ↗]

RELEASES
[ReleaseCard] [ReleaseCard] [ReleaseCard] [ReleaseCard]

LATEST MIXES
[MixCard] [MixCard] [MixCard]
```

- **Glow border:**
  ```css
  border: 3px solid transparent;
  background: linear-gradient(#181C25, #181C25) padding-box,
              linear-gradient(135deg, #00FF9D, transparent) border-box;
  ```
- **Slug → ID:** La API recibe ID numérico (`"88457"`). Para el MVP, mapeo hardcodeado en `lib/api/artist.ts`. Explorar si la API acepta `artist(slug: "naial")`.
- **Datos:** `fetchArtistWithTracks(id)` — ya disponible

---

## Componentes — descripción y props

### `MixCard` — el más reutilizado

Usado en Home, /shows y perfil de artista.

```
┌─────────────────────────────────┐
│  [artwork 16:9 — next/image]    │
│                        [▶]      │  ← overlay en hover
└─────────────────────────────────┘
  Andy Green
  System Showcase (4/22/2026)
  Progressive · 1h 23m
```

```typescript
interface MixCardProps {
  mix: ProtonMix;
  onPlay?: (mix: ProtonMix) => void;
  size?: "sm" | "md" | "lg";
}
```

### `GenreChip` — filtro de género

```typescript
interface GenreChipProps {
  label: string;
  active?: boolean;
  href?: string;       // para chips de navegación
  onClick?: () => void; // para filtrado client-side
}
```

### `ChartRow` — fila de chart

```typescript
interface ChartRowProps {
  position: number;
  track: {
    id: string;
    title: string;
    artist: { name: string };
    label: { name: string };
    release: { date: string };
    duration?: string;
    artwork?: string;
  };
}
```

### `LabelCard`

```typescript
interface LabelCardProps {
  label: ProtonLabel;
  href?: string;
}
```

### `ArtistHero`

```typescript
interface ArtistHeroProps {
  artist: Artist & {
    image?: { url: string } | null;
    genres?: string[];
    country?: string;
  };
  onPlayLatest?: () => void;
}
```

---

## Roadmap — orden de implementación

El orden está dado por dependencias: no se puede construir la Home sin el Layout, ni el Layout sin el Navbar y el Player.

| # | Tarea | Archivo | Depende de | Estado |
|---|---|---|---|---|
| 1 | Tipo `ProtonMix` | `types/mix.ts` | — | ⬜ |
| 2 | Tipo `ProtonLabel` | `types/label.ts` | — | ⬜ |
| 3 | Fix `next.config.ts` (Cloudinary) | `next.config.ts` | — | ⚠️ |
| 4 | Refactor `playerStore` | `lib/store/playerStore.ts` | `types/mix.ts` | ⚠️ |
| 5 | API `mixes.ts` + mock | `lib/api/mixes.ts` + `lib/mock/mixes.ts` | `protonApi.ts` | ⬜ |
| 6 | `GlobalPlayer` | `components/player/GlobalPlayer.tsx` | `playerStore` | ⚠️ |
| 7 | `PublicNavbar` | `components/public/Navbar.tsx` | — | ⚠️ |
| 8 | `HamburgerMenu` | `components/public/HamburgerMenu.tsx` | — | ⬜ |
| 9 | `PublicLayout` | `app/(public)/layout.tsx` | Navbar, GlobalPlayer | ⚠️ |
| 10 | `MixCard` | `components/public/MixCard.tsx` | `ProtonMix` | ⬜ |
| 11 | `NowPlayingHero` | `components/public/NowPlayingHero.tsx` | `playerStore` | ⬜ |
| 12 | **Home** `/` | `app/(public)/page.tsx` | todo lo anterior | ⚠️ |
| 13 | `GenreChip` | `components/public/GenreChip.tsx` | — | ⬜ |
| 14 | **Shows** `/shows` | `app/(public)/shows/page.tsx` | `MixCard`, `GenreChip` | ⚠️ |
| 15 | API `charts.ts` + mock | `lib/api/charts.ts` + `lib/mock/charts.ts` | `protonApi.ts` | ⬜ |
| 16 | `ChartRow` | `components/public/ChartRow.tsx` | — | ⬜ |
| 17 | **Charts** `/charts` | `app/(public)/charts/page.tsx` | `ChartRow` | ⚠️ |
| 18 | API `labels.ts` + mock | `lib/api/labels.ts` + `lib/mock/labels.ts` | `protonApi.ts` | ⬜ |
| 19 | `LabelCard` | `components/public/LabelCard.tsx` | `ProtonLabel` | ⬜ |
| 20 | **Labels** `/labels` | `app/(public)/labels/page.tsx` | `LabelCard` | ⚠️ |
| 21 | `ArtistHero` | `components/public/ArtistHero.tsx` | `Artist` | ⬜ |
| 22 | **Artist Profile** `/[artist-name]` | `app/(public)/[artist-name]/page.tsx` | `ArtistHero`, `MixCard` | ⚠️ |

> **Leyenda:** ✅ Completo · ⚠️ Existe pero vacío o requiere cambios · ⬜ Por crear desde cero

---

## Design System — resumen para el área pública

El design system ya está en `globals.css` y funciona tanto en light como dark mode.

### Tokens de color

| Token CSS | Light | Dark | Uso |
|---|---|---|---|
| `--color-background` | `#F0F4F8` | `#0B0E14` | Fondo principal |
| `--color-surface` | `#FFFFFF` | `#181C25` | Cards, paneles, player |
| `--color-accent` | `#E67E22` | `#E67E22` | Orange — CTAs, activos |
| `--color-text-primary` | `#0F172A` | `#FFFFFF` | Títulos, nombres |
| `--color-text-secondary` | `#5A6B80` | `#94A3B8` | Metadata, fechas |
| `--color-border` | `rgba(0,0,0,0.07)` | `rgba(255,255,255,0.06)` | Bordes sutiles |

### Acentos de marca por sección

| Color | Hex | Sección |
|---|---|---|
| **Proton Orange** | `#E67E22` | CTA, shows, live, activos |
| **Teal** | `#1ABC9C` | Labels, management |
| **Purple** | `#9B59B6` | DJ Mixes, géneros |
| **Green** | `#27AE60` | Royalties, account |

### Tipografía

```
--font-display:  "Plus Jakarta Sans"  → Títulos, nombres de artista (Bold Italic)
--font-ui:       "Inter"              → UI, metadata, tablas, labels
```

Ambas fuentes ya están cargadas en `app/layout.tsx` vía `next/font/google`.

### Efectos clave

```css
/* Foto de artista — "glow LED de estudio" */
border: 3px solid transparent;
background: linear-gradient(var(--color-surface), var(--color-surface)) padding-box,
            linear-gradient(135deg, #00FF9D, transparent) border-box;

/* Cards y paneles */
background: var(--color-surface);
border: 1px solid var(--color-border);

/* Global Player */
background: var(--color-surface);
border-top: 1px solid var(--color-border);
backdrop-filter: blur(12px);
```

---

## Notas de la API real

- **Endpoint:** `https://api.protonradio.com/graphql` — la misma API que usa el sitio oficial
- **Auth de API:** No requiere token. Solo los headers `origin` y `referer` con valor `https://www.protonradio.com`
- **Imágenes:** Cloudinary (`res.cloudinary.com`) — agregar a `next.config.ts`
- **Shows/audio:** Los mixes reproducen en YouTube. El player usa YouTube IFrame API
- **IDs de artista:** Numéricos (`"88457"` = Naial). Testear si la API acepta `artist(slug: "naial")`
- **Auth del sitio:** El sitio original usa `auth.protonradio.com` como dominio separado. En nuestro MVP: sin auth real, el botón "For Artists" va directo a `/dashboard`
