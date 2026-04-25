# Proton Radio — Registro de trabajo y guía de implementación

---

## ✅ Dashboard (B2B) — Lo que ya se construyó en esta sesión

Todo lo de abajo fue implementado y está en el área `/dashboard`. El proyecto corre con Next.js 15, TypeScript, Tailwind CSS v4 y TanStack Query.

---

### 1. Página de Contratos — `/dashboard/contracts`

**Archivo:** `app/(dashboard)/dashboard/contracts/page.tsx`
**Mock data:** `lib/mock/contracts.ts`
**Tipos:** `types/contract.ts`

Página completa de contratos del artista con:

- **3 cards de resumen:** Total de contratos · Firmados · Cantidad de labels
- **Alerta de contratos pendientes** (banner amber, condicional)
- **Lista de contratos** con layout dual:
  - Mobile: layout compacto con ícono de color por label, nombre del release, label y fecha
  - Desktop: tabla con columnas Fecha · Release · Label · Estado · Contrato (link PDF)
- **Desglose por label** al final de la página: nombre, releases contados, colores únicos por label
- **Colores por label** definidos en `CONTRACT_LABEL_COLORS`: `outer-space-oasis` → violeta `#A78BFA`, `toxic-astronaut` → verde `#34D399`
- **Estados de contrato:** `signed` (verde), `pending` (amber), `expired` (rojo) — con íconos Lucide

**Releases mock actuales:**
| Release | Label | Estado |
|---|---|---|
| Tied Inside | Outer Space Oasis | Signed |
| Mind Altered | Outer Space Oasis | Signed |
| Balance | Outer Space Oasis | Signed |
| Beyond Living | Toxic Astronaut | Signed |

---

### 2. Página de Royalties — `/dashboard/royalties`

**Archivo:** `app/(dashboard)/dashboard/royalties/page.tsx`
**Mock data:** `lib/mock/royalties.ts`

Página principal de royalties con:

- **Card de acumulado total** con barra de progreso hacia el umbral de pago (`$50 USD`)
- **Card de próximo statement** (fecha + período)
- **Card de método de pago** (USDC en Base via Coinbase Commerce)
- **Historial de statements** — lista de períodos trimestrales con:
  - Período (ej. "Q1 2026"), rango de fechas, monto, estado (withheld/paid)
  - Botón CSV → link directo a `soundsystem.protonradio.com` con `id` y `qid` reales
  - Flecha para ir al detalle de cada statement

---

### 3. Detalle de Statement — `/dashboard/royalties/[qid]`

**Archivo:** `app/(dashboard)/dashboard/royalties/[qid]/page.tsx`

Página de detalle por quarter con 4 tablas:

1. **Release Summary** — releases del período, ventas y streams (este quarter vs. acumulado)
2. **Track Sales & Streams** — por track: vendidos, streams, store, porcentaje de royalty, monto
3. **Stores & Services** — breakdown por plataforma (Spotify, Beatport, etc.)
4. **Advance & Expense Debits** — descuentos de mastering, diseño, etc. en amber (con nota explicativa)

- Header con botón de descarga CSV directo a la URL real de Proton SoundSystem
- Cuando no hay detalle disponible: estado vacío con botón de descarga
- Breadcrumb: Dashboard → Royalties → Período
- `PRO_USER_ID = 67325` hardcodeado para los links de descarga

---

### 4. Página de Performance — `/dashboard/performance`

**Archivo:** `app/(dashboard)/dashboard/performance/page.tsx`

La página más compleja del dashboard. Usa **TanStack Query** para traer tracks reales de la API de Proton:

- **4 KPI cards:** Total Streams · Total Sales · Tracks · Top Track
- **Gráfico de streams** (`StreamsChart` con Recharts) — filtrable por rango: 30D / 3M / 6M / 1Y / All
- **Donut de géneros** (`GenreDonut` con Recharts) — distribución de streams por género
- **Tabla de tracks** con:
  - Filtros por categoría: Tracks · Releases · Labels · Genres
  - Buscador en tiempo real (filtra por título o label)
  - Ordenamiento por Streams / Sales / Date (toggle asc/desc)
  - Skeleton loading state durante la carga de la API
- Datos mock en `lib/mock/performance.ts` (streams y ventas por `trackId`)
- Géneros en `TRACK_GENRES` — diccionario `trackId → genre`

---

### 5. Panel de Notificaciones — `NotificationsPanel`

**Archivo:** `components/dashboard/NotificationsPanel.tsx`

Drawer lateral que se desliza desde la derecha (`translate-x-full` → `translate-x-0`):

- Backdrop con blur que cierra el panel al hacer click
- Cierra con `Escape`
- 5 notificaciones mock: new release approved, royalties available, streams spike, pending contract, release rejected
- Puntos de lectura naranja en las no leídas
- Badge con contador de no leídas en el header
- Botón "Clear all" en el footer
- Estado vacío con ícono `CheckCheck` cuando no quedan notificaciones

Se conecta tanto desde **DashboardNavbar** (mobile) como desde **AppSidebar** (desktop).

---

### 6. Sidebar colapsable — `AppSidebar`

**Archivo:** `components/dashboard/AppSidebar.tsx`

Sidebar desktop (`lg:flex`) con:

- **Toggle collapse** — se guarda en `localStorage` (`proton-sidebar-collapsed`). Expandido: 256px, colapsado: 64px, con transición CSS de 300ms
- **Ancho colapsado:** solo íconos centrados con `title` tooltip
- **Logo** (imagen `logo txt.png`) visible solo cuando está expandido
- **Campana de notificaciones** (abre `NotificationsPanel`) con badge naranja
- **Links de navegación:** Artists · Performance · Royalties · Contracts · Settings — con highlight naranja en la ruta activa
- **Quick Access:** Shows · Labels · DJ Mixes · Release Links — con dot de color por sección
- **Footer:** avatar del artista + link a settings/profile + botón collapse/expand

---

### 7. Navbar mobile — `DashboardNavbar`

**Archivo:** `components/dashboard/DashboardNavbar.tsx`

Navbar sticky mobile-only (`lg:hidden`) con:

- Botón hamburger (izquierda) → abre `HamburgerMenu`
- Logo "Proton" centrado
- Botón campana (derecha) → abre `NotificationsPanel` (con badge naranja)

---

### 8. Dashboard Store — Zustand

**Archivo:** `lib/store/dashboardStore.ts`

Store Zustand con `persist` middleware para el layout de widgets del dashboard:

```typescript
interface DashboardState {
  widgetOrder: WidgetId[];      // orden arrastrable de widgets
  hiddenWidgets: WidgetId[];    // widgets ocultados por el usuario
  setWidgetOrder, hideWidget, showWidget, resetLayout
}
```

Widgets: `streams` · `latest-tracks` · `streams-by-release` · `royalties`
Persistido en `localStorage` bajo la key `proton-dashboard-layout`.

---

### Resumen de archivos creados/modificados en esta sesión

| Archivo | Estado | Qué hace |
|---|---|---|
| `app/(dashboard)/dashboard/contracts/page.tsx` | ✅ Nuevo | Página completa de contratos |
| `app/(dashboard)/dashboard/royalties/page.tsx` | ✅ Mejorado | Historial + progress bar + payout config |
| `app/(dashboard)/dashboard/royalties/[qid]/page.tsx` | ✅ Nuevo | Detalle de statement con 4 tablas |
| `app/(dashboard)/dashboard/performance/page.tsx` | ✅ Mejorado | KPIs + gráficos + tabla de tracks con search/sort |
| `components/dashboard/NotificationsPanel.tsx` | ✅ Nuevo | Drawer de notificaciones |
| `components/dashboard/DashboardNavbar.tsx` | ✅ Actualizado | Conecta campana → NotificationsPanel |
| `components/dashboard/AppSidebar.tsx` | ✅ Actualizado | Sidebar colapsable + campana + notificaciones |
| `components/dashboard/DashboardContent.tsx` | ✅ Actualizado | Layout principal del dashboard |
| `components/dashboard/BottomNav.tsx` | ✅ Actualizado | Nav inferior mobile |
| `lib/mock/contracts.ts` | ✅ Nuevo | 4 contratos mock con colores por label |
| `lib/mock/royalties.ts` | ✅ Actualizado | Statements trimestrales + payout config |
| `lib/store/dashboardStore.ts` | ✅ Nuevo | Zustand store para layout de widgets |
| `types/contract.ts` | ✅ Actualizado | Tipos de Contract |
| `types/royalty.ts` | ✅ Actualizado | Tipos de Royalty y Statement |

---

## 🗺️ Public Area Guide — Próximos pasos (B2C)

> Guía de implementación para el área pública (`(public)`) — la parte B2C de la plataforma.
> El dashboard (`(dashboard)`) ya tiene su base construida. Este documento es la hoja de ruta para construir lo que sería **protonradio.com**: radio en vivo, shows, charts, labels y perfiles de artistas.

---

## Contexto rápido

| Área | Ruta base | Audiencia | Estado |
|---|---|---|---|
| **Dashboard (B2B)** | `/dashboard` | Artistas, productores, labels | ✅ En construcción |
| **Public (B2C)** | `/` | Oyentes, fans | ⬜ Todo por hacer |

El área pública **unifica** lo que hoy son dos sitios separados: `protonradio.com` (radio) y `soundsystem.protonradio.com` (dashboard). El acceso al dashboard se hace desde el navbar público con un botón **"For Artists"** → `/dashboard`.

---

## Estructura de archivos — ya existe (en blanco)

```
app/(public)/
├── layout.tsx                ← Layout vacío — aquí van Navbar + Global Player
├── page.tsx                  ← / — Home
├── shows/page.tsx            ← /shows
├── charts/page.tsx           ← /charts
├── labels/page.tsx           ← /labels
└── [artist-name]/page.tsx    ← /naial, /andy-green, etc.
```

**Todos los archivos existen pero están vacíos.** El trabajo es construirlos uno por uno siguiendo esta guía.

---

## API — GraphQL real disponible

Ya configurada y funcionando en `lib/api/protonApi.ts`:

```
Endpoint: https://api.protonradio.com/graphql
Headers:
  Content-Type: application/json
  origin: https://www.protonradio.com
  referer: https://www.protonradio.com/
Cache: revalidate cada 300s (5 min) — Next.js fetch cache
```

### Queries ya probadas (usadas en el dashboard)

```graphql
# Artista con tracks
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

### Queries a explorar para el área pública

Estas queries **probablemente existen** — hay que testearlas contra la API:

```graphql
# Shows / Mixes recientes
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

# Show específico (para página de detalle)
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

# Charts por género
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

# Lista de labels
query GetLabels {
  labels {
    id
    name
    slug
    image { url }
    artistCount
  }
}

# Artistas de un label
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

> **Cómo testear:** Usar una herramienta como [Altair GraphQL](https://altairgraphql.dev/) o simplemente `fetch` desde la consola del browser apuntando al endpoint con los headers correctos. También se puede hacer introspección (`__schema`) para ver todos los tipos disponibles.

---

## Cómo agregar una nueva query a la API

Crear el fetcher en `lib/api/` siguiendo el patrón existente:

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

En el componente Server (RSC), llamar directamente sin TanStack Query — el área pública usa SSR:

```typescript
// app/(public)/shows/page.tsx
import { fetchLatestMixes } from "@/lib/api/shows";

export default async function ShowsPage() {
  const mixes = await fetchLatestMixes(24);
  // ...
}
```

> El dashboard usa TanStack Query porque es Client Component con interactividad. Las páginas públicas son Server Components → `async/await` directo.

---

## Design System — resumen para el área pública

El design system ya está definido en `globals.css`. El área pública usa **dark mode por defecto** (`data-theme="dark"`).

### Colores

| Token CSS | Dark Mode | Uso |
|---|---|---|
| `--color-background` | `#0B0E14` | Fondo principal |
| `--color-surface` | `#181C25` | Cards y paneles |
| `--color-accent` | `#E67E22` | Proton Orange — CTAs, activos |
| `--color-text-primary` | `#FFFFFF` | Títulos, nombres |
| `--color-text-secondary` | `#94A3B8` | Metadata, subtítulos |
| `--color-border` | `rgba(255,255,255,0.06)` | Bordes sutiles |

### Acentos por sección (brand colors heredados)

| Color | Hex | Sección |
|---|---|---|
| **Orange** | `#E67E22` | Shows, uploads, live |
| **Teal** | `#1ABC9C` | Labels, management |
| **Purple** | `#9B59B6` | DJ Mixes |
| **Green** | `#27AE60` | Royalties, account |

### Tipografía

```css
font-display: "Plus Jakarta Sans"  /* Títulos — Bold Italic para nombres de artista */
font-ui:      "Inter"              /* UI, metadata, tablas */
```

### Efectos clave

```css
/* Borde de artista — "glow LED de estudio" */
background: linear-gradient(#181C25, #181C25) padding-box,
            linear-gradient(135deg, #00FF9D, transparent) border-box;

/* Cards */
background: #181C25;
border: 1px solid rgba(255, 255, 255, 0.05);
```

---

## Páginas — plan detallado

### 1. `PublicLayout` — `app/(public)/layout.tsx`

**Prioridad: PRIMERA — todo lo demás depende de esto.**

Componentes a crear:
- `PublicNavbar` — logo + links + hamburger menu + botón "For Artists"
- `GlobalPlayer` — player persistente en el bottom (Zustand store)
- Wrapper con `data-theme="dark"`

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

Basado en el menú real de protonradio.com (ver capturas):

**Desktop:** logo izquierda | links centro | "For Artists" botón naranja derecha

**Mobile:** logo centro | hamburger derecha

**Hamburger menu — contenido:**
```
Radio          →  /
Shows          →  /shows
Charts         →  /charts
Labels         →  /labels
──────────────────────────
For Artists    →  /dashboard    (CTA naranja, botón)
──────────────────────────
[si logueado]
  Naialmusic
  → Naial (artista)
  → Discovery Mode
  → Track Stack
  → Inbox
  → Account
  → Sign Out
```

Estado activo: highlight naranja en el link de la ruta actual (`usePathname`).

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
