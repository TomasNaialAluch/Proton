# Proton — Arquitectura y guía de desarrollo

> **Estado actual:** primera iteración del dashboard (página principal + performance + settings). El proyecto está en crecimiento activo. Este documento establece las convenciones y decisiones de arquitectura para mantener el código prolijo a medida que se agregan más páginas.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 (con design tokens CSS nativos) |
| Estado del servidor | TanStack React Query 5 |
| Estado del cliente | Zustand 5 |
| Íconos | Lucide React |
| Gráficos | Recharts |
| Fuentes | Inter (UI) + Plus Jakarta Sans (display/headings) |

---

## Estructura de carpetas

```
proton/
│
├── app/                              # Rutas de Next.js App Router
│   ├── layout.tsx                    # Root layout: fuentes, providers, anti-FOUC de tema
│   ├── globals.css                   # Design tokens + dark mode overrides
│   │
│   ├── (dashboard)/                  # Route group — comparte DashboardLayout
│   │   ├── layout.tsx                # AppSidebar + DashboardNavbar + BottomNav
│   │   └── dashboard/
│   │       ├── page.tsx              # Home del dashboard → renderiza DashboardContent
│   │       ├── performance/
│   │       │   └── page.tsx
│   │       ├── royalties/
│   │       │   └── page.tsx
│   │       ├── contracts/
│   │       │   └── page.tsx
│   │       └── settings/
│   │           ├── page.tsx          # Redirect → /dashboard/settings/account
│   │           ├── profile/
│   │           │   └── page.tsx
│   │           └── account/
│   │               ├── page.tsx      # Índice de secciones de cuenta
│   │               ├── basic/
│   │               ├── payment/
│   │               ├── subscriptions/
│   │               ├── connections/
│   │               ├── downloads/
│   │               ├── notifications/
│   │               ├── discovery/
│   │               └── pro/
│   │
│   └── (public)/                     # Route group — layout público
│       ├── layout.tsx
│       ├── page.tsx
│       ├── [artist-name]/
│       ├── charts/
│       ├── labels/
│       └── shows/
│
├── components/
│   ├── dashboard/                    # Componentes del área autenticada
│   │   ├── AppSidebar.tsx            # Sidebar desktop (colapsable, sticky)
│   │   ├── BottomNav.tsx             # Nav móvil fija en la parte inferior
│   │   ├── DashboardNavbar.tsx       # Header móvil (hamburger + bell)
│   │   ├── HamburgerMenu.tsx         # Drawer de navegación en móvil
│   │   ├── DashboardBreadcrumb.tsx   # Breadcrumb genérico reutilizable
│   │   ├── DashboardContent.tsx      # Contenido de la página home del dashboard
│   │   ├── StreamsChart.tsx          # Gráfico de área — streams mensuales
│   │   ├── ReleasesChart.tsx         # Gráfico — streams por release
│   │   ├── GenreDonut.tsx            # Gráfico de dona — streams por género
│   │   └── RoyaltiesWidget.tsx       # Widget de saldo y progreso de regalías
│   │
│   ├── settings/
│   │   └── SettingsShared.tsx        # Componentes reutilizables de settings:
│   │                                 #   SettingsHeader, SettingsSection,
│   │                                 #   Field, ToggleField, InfoBanner, EmptyState
│   │
│   ├── public/
│   │   └── Navbar.tsx                # Navbar del sitio público
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx         # TanStack Query client
│   │   └── ThemeProvider.tsx         # Sincroniza Zustand ↔ data-theme attr
│   │
│   └── player/
│       └── GlobalPlayer.tsx          # Player de audio global (persistente)
│
├── lib/
│   ├── api/
│   │   ├── protonApi.ts              # Cliente HTTP base hacia la API de Proton
│   │   ├── artist.ts                 # fetchArtist, fetchArtistWithTracks
│   │   └── tracks.ts                 # Helpers de tracks
│   │
│   ├── mock/                         # Datos de desarrollo (reemplazar con API real)
│   │   ├── artist.ts
│   │   ├── streams.ts
│   │   ├── royalties.ts
│   │   ├── performance.ts
│   │   ├── tracks.ts
│   │   └── account.ts
│   │
│   └── store/
│       ├── themeStore.ts             # Zustand: tema light/dark (persiste en localStorage)
│       └── playerStore.ts            # Zustand: estado del reproductor global
│
└── types/
    ├── artist.ts
    ├── track.ts
    ├── royalty.ts
    └── contract.ts
```

---

## Design system

Los colores, tipografía y espaciado se definen como **CSS custom properties** en `app/globals.css` usando `@theme` de Tailwind 4. No hay valores de color hardcodeados en los componentes.

```css
/* Uso en Tailwind */
bg-surface                  → var(--color-surface)
text-text-primary           → var(--color-text-primary)
border-[var(--color-border)]
```

### Tokens disponibles

| Token | Light | Dark |
|---|---|---|
| `--color-background` | `#F0F4F8` | `#0B0E14` |
| `--color-surface` | `#FFFFFF` | `#181C25` |
| `--color-accent` | `#E67E22` | `#E67E22` |
| `--color-text-primary` | `#0F172A` | `#FFFFFF` |
| `--color-text-secondary` | `#5A6B80` | `#94A3B8` |
| `--color-border` | `rgba(0,0,0,0.07)` | `rgba(255,255,255,0.06)` |

### Colores de marca fijos (no cambian con el tema)

```
--color-proton-orange: #E67E22   (accent principal)
--color-proton-teal:   #1ABC9C   (Labels)
--color-proton-purple: #9B59B6   (DJ Mixes)
--color-proton-green:  #27AE60   (Shows / Account)
```

### Fuentes

- **`font-ui` (Inter)** — texto de interfaz, labels, párrafos
- **`font-display` (Plus Jakarta Sans)** — headings, nombre del artista, logotipo

---

## Convenciones de routing

Se usan **route groups** de Next.js para compartir layouts sin afectar las URLs:

| Route group | URL resultante | Layout |
|---|---|---|
| `(dashboard)` | `/dashboard/...` | Sidebar + Navbar + BottomNav |
| `(public)` | `/`, `/[artist-name]`, etc. | Navbar pública |

### Settings: redirect automático

`/dashboard/settings` redirige a `/dashboard/settings/account` via `redirect()` de Next.js. No existe página vacía en esa ruta.

---

## Componentes de settings reutilizables

Todos los sub-páginas de settings usan los componentes de `components/settings/SettingsShared.tsx`:

```tsx
// Estructura típica de una página de settings
<div className="min-h-screen bg-background">
  <SettingsHeader title="Nombre de la sección" subtitle="Descripción" backHref="/dashboard/settings/account" />

  <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 space-y-3">
    <SettingsSection title="General">
      <Field label="Campo" value="Valor" />
      <ToggleField label="Opción" enabled={true} />
    </SettingsSection>

    <InfoBanner variant="warning">Texto de advertencia</InfoBanner>
  </main>
</div>
```

| Componente | Uso |
|---|---|
| `SettingsHeader` | Header sticky con botón back y título/subtítulo |
| `SettingsSection` | Card contenedor con título de sección |
| `Field` | Fila tappable con label, valor, hint opcional |
| `ToggleField` | Fila con toggle visual (on/off) |
| `InfoBanner` | Banner informativo con variante `warning` o `info` |
| `EmptyState` | Mensaje centrado cuando no hay datos |

---

## Estado global

### Tema (`themeStore`)

```ts
const { theme, toggle } = useThemeStore();
// theme: "light" | "dark"
// toggle(): alterna y persiste en localStorage
```

El tema se aplica como atributo `data-theme` en `<html>`. Un script bloqueante en `app/layout.tsx` lo lee de localStorage **antes del primer render** para evitar el flash de tema incorrecto.

### Player (`playerStore`)

Estado del reproductor de audio global. El componente `GlobalPlayer` vive fuera del layout del dashboard para persistir entre navegaciones.

---

## Data fetching

Se usa **TanStack React Query** para todas las llamadas a la API. Los query keys siguen la convención `["recurso", "id"]`:

```ts
useQuery({
  queryKey: ["artist", "88457"],
  queryFn: () => fetchArtistWithTracks("88457"),
});
```

### Datos mock

Mientras la API no esté completamente disponible, los datos viven en `lib/mock/`. Cuando se conecte la API real, se reemplaza únicamente la capa `lib/api/` sin tocar los componentes.

---

## Problemas conocidos y deuda técnica

### 1. `dashboardLinks` y `quickLinks` duplicados (DRY)

Los links de navegación están definidos **por separado** en `AppSidebar.tsx`, `HamburgerMenu.tsx` y `BottomNav.tsx`. Si se agrega o renombra una sección, hay que actualizarlo en tres lugares.

**Solución pendiente:** extraer a `lib/constants/nav.ts` y que los tres componentes lo importen.

```ts
// lib/constants/nav.ts  (pendiente de crear)
export const dashboardLinks = [ ... ];
export const quickLinks = [ ... ];
export function linkIsActive(pathname, href, activePrefix?) { ... }
```

### 2. `BottomNav` no navega y tiene el estado activo hardcodeado (bug)

Los ítems del `BottomNav` son `<button>` sin `href`, por lo que no navegan. Además, `active: true` está fijo en "Artists" y no reacciona a la ruta actual.

**Solución pendiente:** usar `usePathname()` + `linkIsActive()` (igual que `AppSidebar`) y cambiar los botones por `<Link>`.

### 3. `StatCard` y `KpiCard` son el mismo componente (DRY)

`DashboardContent.tsx` tiene `StatCard` y `performance/page.tsx` tiene `KpiCard`. Son virtualmente idénticos salvo por el prop `small`.

**Solución pendiente:** unificar en `components/ui/KpiCard.tsx`.

### 4. Header inline en `account/page.tsx` no usa `SettingsHeader` (DRY)

La página `/dashboard/settings/account` duplica manualmente el markup del header en lugar de usar el componente `SettingsHeader` que ya existe en `SettingsShared.tsx`.

### 5. `Sidebar.tsx` vacío (YAGNI)

`components/dashboard/Sidebar.tsx` es un archivo placeholder vacío. `AppSidebar.tsx` es la implementación real. El archivo vacío debe eliminarse.

---

## Cómo agregar una nueva página al dashboard

### Página simple (sin componentes propios complejos)

```
app/(dashboard)/dashboard/[nueva-ruta]/
└── page.tsx
```

```tsx
// page.tsx
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb";

export default function NuevaPagina() {
  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-4xl lg:px-10">
      <DashboardBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Nueva Página" },
        ]}
      />
      {/* contenido */}
    </main>
  );
}
```

### Página compleja (con lógica y sub-componentes propios)

Usar la carpeta `_components/` dentro de la ruta. Next.js ignora las carpetas con prefijo `_` para el routing, por lo que no crean URLs.

```
app/(dashboard)/dashboard/releases/
├── page.tsx                    ← thin: solo imports + layout
└── _components/
    ├── ReleasesTable.tsx        ← tabla de releases
    ├── ReleaseCard.tsx          ← card individual
    └── buildReleasesRows.ts     ← lógica pura de transformación de datos
```

**Regla:** si un componente lo usan 2+ páginas → `components/dashboard/`. Si solo lo usa una página → `_components/` dentro de esa ruta.

---

## Estructura objetivo (próximos pasos)

Cuando `components/dashboard/` empiece a crecer, separar en subcarpetas:

```
components/dashboard/
├── nav/          ← AppSidebar, BottomNav, DashboardNavbar, HamburgerMenu
├── charts/       ← StreamsChart, ReleasesChart, GenreDonut
└── widgets/      ← RoyaltiesWidget, y los que vengan
```

Y crear `components/ui/` para primitivos sin lógica de negocio (KpiCard, SectionCard, Breadcrumb, etc.) que puedan usarse tanto en el dashboard como en el área pública.

---

## Comandos

```bash
npm run dev      # servidor de desarrollo en localhost:3000
npm run build    # build de producción
npm run lint     # ESLint
```
