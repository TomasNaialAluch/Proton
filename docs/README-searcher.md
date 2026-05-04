# Buscador global (área pública) — propuesta de rediseño

Este documento propone **qué** construir y **cómo** acercarse al buscador de [protonradio.com](https://www.protonradio.com) en nuestra app Next.js pública, sin asumir que la API pública expone hoy un endpoint idéntico.

---

## 1. Referencia (protonradio.com)

Comportamiento observado en el sitio oficial (header naranja, búsqueda global):

| Momento | Comportamiento |
|--------|----------------|
| **Input en el header** | Campo con icono de lupa, placeholder “Search”, estilo “ghost” sobre la barra de marca. |
| **Focus / apertura** | Panel grande (overlay o dropdown) con foco en la tarea: ilustración/marca, copy tipo *“What are you looking for?”*, fondo claro, mucho aire. |
| **Mientras se escribe** | Resultados **agrupados por tipo**: Artists, Labels, Shows, Tracklists, etc., con contadores (badges) y filas con avatar / logo / metadatos (*“0 Mixes \| 11 Tracks”*). |
| **Más resultados** | Enlaces *“More Artists”*, *“More Labels”*, y acción global *“See all results”*. |
| **Página de resultados** | Vista **Search Results** con título, filtro lateral (géneros, artistas, labels, shows, tracklists) y listas con **highlight** del término en naranja. |
| **Errores** | Aviso si la API no responde (el producto real depende de conectividad al backend). |

**Para nuestro rediseño:** replicamos la **jerarquía mental** (un solo lugar para buscar → tipos de entidad → detalle / ver todo), adaptando layout y tokens a `--color-accent`, `--color-surface`, `data-theme` (claro / oscuro) ya usados en el repo.

---

## 2. Objetivos de producto

1. **Un solo punto de entrada** en la zona pública: encontrar artistas, labels, shows/episodios y — cuando existan datos — tracks / tracklists.
2. **Consistencia visual** con `PublicNavbar`, `HamburgerMenu` y tema **light/dark** (`useThemeStore` / `PublicThemeToggle`).
3. **Mobile-first respetando decisiones previas:** en móvil, el buscador **no** tiene que vivir en la barra fija si preferís ahorrar altura; puede abrirse desde el **menú hamburguesa** o desde un **icono de lupa** que abre overlay/página dedicada (ver §5).
4. **URLs compartibles:** ` /search?q=... ` (y opcionalmente `&type=artists`) para alinear con mental model de “página de resultados”.

---

## 3. Arquitectura de información

### 3.1 Entidades (orden sugerido en resultados)

1. **Artists** — avatar, nombre, *mixes / tracks* si tenemos números.  
2. **Labels** — logo cuadrado, nombre.  
3. **Shows** (o “Episodes” / “Mixes” según copy) — carátula, título, fecha.  
4. **Tracklists** (opcional, fase 2) — requiere API o índice de tracks.

Alineación con datos **ya usados** en el repo: `fetchLatestMixes` / `ProtonMix`, artistas de GraphQL, labels vía `lib/api/labels.ts`, etc. Lo que **no** exista en API pública se documenta como *gap* (§7).

### 3.2 Flujos

- **Ruta A — Command-palette ligera (dropdown):** al escribir en el input del header, se abre un panel bajo el input con secciones y “Ver todos los resultados” que navega a `/search?q=…`.  
- **Ruta B — Página completa:** `/search` con sidebar de filtros (como Proton) para refinamiento cuando hay muchos resultados.

Se pueden implementar **primero B** (más simple) y luego añadir dropdown predictivo.

---

## 4. Propuesta de UI (componentes)

Colocación sugerida en código (nombres tentativos):

| Pieza | Responsabilidad |
|--------|------------------|
| `PublicSearchTrigger` | Botón lupa (mobile opcional) o `input` compacto en desktop. |
| `SearchOverlay` o `SearchModal` | Capa a pantalla completa o anclada bajo el header: input grande, estados vacío / cargando / resultados agrupados. |
| `SearchResultGroup` | Título de categoría + badge con contador + lista. |
| `SearchResultRow` | Variantes: `artist`, `label`, `show` (imagen + título + meta). |
| `SearchPage` | `app/(public)/search/page.tsx` — resultados con layout de dos columnas en `lg+` (filtros + lista). |
| `lib/search/*` | Capa de datos: `searchPublic(q, filters)` que hoy puede ser **mock** o agregación de llamadas existentes. |

**Estilos:** reutilizar `text-text-primary`, `bg-surface`, bordes `var(--color-border)`, acento en matches; en dark mode, overlay con `bg-surface` y sombra, no blanco puro forzado si el tema es oscuro.

---

## 5. Desktop vs mobile (recomendación)

| Plataforma | Propuesta |
|------------|-----------|
| **Desktop (lg+)** | Input de búsqueda en `PublicNavbar` (a la derecha del bloque de links o integrado al centro-derecha), o icono lupa que abre overlay. Coherente con Proton: barra siempre visible. |
| **Mobile** | **Opción 1 (mínima fricción):** entrada “Search” en `HamburgerMenu` que navega a `/search` o abre overlay a pantalla completa. **Opción 2:** icono lupa en header (como Proton) si aceptás una fila más densa. **Opción 3:** solo `/search` enlazado desde menú y footer (sin icono en header). |

Documentar en implementación la opción elegida para no duplicar puntos de entrada.

---

## 6. Comportamiento técnico

- **Debounce** del input (150–300 ms) antes de llamar a red / filtrar.  
- **Cancelación** de requests anteriores (`AbortController`) al cambiar `q`.  
- **Estados:** vacío (copy + ilustración opcional), cargando, resultados, vacío real (“Sin resultados”), error de red.  
- **Accesibilidad:** `role="combobox"` / `aria-expanded` en dropdown, foco atrapado en modal, **Escape** cierra overlay.  
- **SEO:** página `/search` con `metadata` dinámica opcional; resultados principalmente cliente si la búsqueda es dinámica.

---

## 7. Datos y API (honestidad técnica)

El sitio oficial tiene un **backend de búsqueda unificado**. En nuestro repo, hoy **no** hay un único endpoint documentado tipo `search(query)` en `lib/api/`.

**Estrategia por fases:**

| Fase | Fuente | Alcance |
|------|--------|---------|
| **MVP** | Agregar llamadas existentes (`radioMixes`, `labels`, etc.) y **filtrar en cliente** por substring sobre conjuntos acotados (últimos N mixes, lista de labels cargada). | Bueno para demo; no escala. |
| **MVP+** | Endpoint dedicado en backend Proton (si se expone) o **Route Handler** Next (`app/api/search`) que proxy + cache. | Necesita contrato real. |
| **Objetivo** | Índice de búsqueda (Algolia, Meilisearch, o API GraphQL `search`) | Paridad con protonradio.com. |

Registrar en implementación qué fase está activa para no prometer paridad sin backend.

---

## 8. Seguridad y límites

- Sanitizar `q` en logs y evitar inyectar HTML en highlights (usar texto escapado o fragmentos controlados).  
- Rate limit en route handler si exponemos proxy público.

---

## 9. Checklist de implementación (orden sugerido)

1. [ ] Ruta `app/(public)/search/page.tsx` + lectura de `searchParams.q`.  
2. [ ] Barra de búsqueda reutilizable + estado vacío inspirado en referencia (*What are you looking for?* — copy propio).  
3. [ ] Integración datos MVP (mock o filtros sobre datos ya cargados).  
4. [ ] Entrada desde `Navbar` (desktop) y desde `HamburgerMenu` (mobile).  
5. [ ] Dropdown predictivo (opcional).  
6. [ ] Sidebar de filtros en página de resultados (opcional, fase 2).  
7. [ ] Sustituir MVP por API real cuando exista contrato.

---

## 10. Referencias en el repo

- Layout público: `app/(public)/layout.tsx`, `components/public/Navbar.tsx`, `components/public/HamburgerMenu.tsx`.  
- Tema: `lib/store/themeStore.ts`, `components/public/PublicThemeToggle.tsx`.  
- Datos relacionados: `lib/api/mixes.ts`, `lib/api/labels.ts`, `lib/api/protonApi.ts`.  

---

## 11. Resumen ejecutivo

**Propuesta:** buscador público con **URL `/search?q=`**, resultados **agrupados por tipo** como en Proton Radio, **overlay o página completa** según viewport, integración **desktop en navbar** y **mobile vía menú (y opcionalmente icono lupa)**. La **paridad total** depende de un **endpoint de búsqueda** o de un índice externo; hasta entonces, un **MVP** con datos agregados/filtrados documenta el UX y deja listo el cableado para API real.
