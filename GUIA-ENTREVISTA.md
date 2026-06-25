# Guía de preparación — Entrevista técnica Proton

> **Entrevista:** Mateo (ingeniero) — lunes 13:00 (hora Argentina)  
> **Formato:** preguntas conceptuales, leer y discutir código. **Sin algoritmos ni live coding.**  
> **Proyecto base:** este repositorio (prototipo presentado a Proton Radio).

---

## Cómo usar esta guía

- Cada día tiene **objetivo**, **archivos a leer**, **conceptos** y **ejercicios en voz alta**.
- Marcá las casillas `[ ]` → `[x]` a medida que avances.
- Al final de cada día, grabate 2 minutos explicando lo aprendido (sin mirar notas).
- Tiempo estimado por día: **2–3 horas**.

**Stack a dominar en contexto de este repo:**

| Área | Tecnologías en Proton |
|---|---|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Estado cliente | Zustand 5 (+ persist) |
| Estado servidor | TanStack React Query 5 |
| Otros | Recharts, @dnd-kit, YouTube IFrame API, Firebase (deploy) |

---

## Pitch de 30 segundos (memorizalo)

> Proton unifica **Proton Radio (B2C)** y **SoundSystem (B2B)** en una sola app Next.js. Los oyentes navegan shows, charts y perfiles con un **reproductor global** que no se interrumpe. Los artistas y labels usan `/dashboard` para métricas, royalties, catálogo y pipeline de releases. Es un **prototipo** con datos mock y auth demo, pero la arquitectura está pensada para conectar una API real sin reescribir la UI.

---

## Día 1 — Mapa del proyecto y arquitectura

**Objetivo:** poder dibujar la estructura de carpetas y explicar por qué está organizada así.

### Archivos a leer (en este orden)

1. [`README.md`](README.md) — visión general del portfolio
2. [`ARCHITECTURE.md`](ARCHITECTURE.md) — convenciones, stack, deuda técnica
3. [`app/layout.tsx`](app/layout.tsx) — root layout, providers, GlobalPlayer
4. [`middleware.ts`](middleware.ts) — auth demo y redirects
5. [`app/(dashboard)/layout.tsx`](app/(dashboard)/layout.tsx) vs [`app/(public)/layout.tsx`](app/(public)/layout.tsx)

### Conceptos clave

| Concepto | Qué decir en la entrevista |
|---|---|
| **Route groups** `(public)` / `(dashboard)` | Agrupan layouts sin afectar la URL |
| **Dos audiencias** | B2C sin auth; B2B con gate en middleware |
| **Global Player en root** | Persiste entre rutas porque vive fuera de los layouts hijos |
| **Capas de datos** | `lib/mock/` hoy → `lib/api/` mañana → componentes igual |
| **Design tokens** | Colores en `globals.css`, no hardcodeados en componentes |

### Ejercicio en voz alta

- [ ] Explicá la diferencia entre `(public)` y `(dashboard)` sin abrir el código.
- [ ] Dibujá en papel: `layout root → providers → children + GlobalPlayer`.
- [ ] Describí qué pasa cuando un usuario sin sesión entra a `/dashboard/royalties`.

### Preguntas que te pueden hacer

1. *¿Por qué un solo repo para B2C y B2B?*  
   → Mismo design system, un dominio, menos duplicación; route groups separan concerns.

2. *¿Qué es un route group en Next.js?*  
   → Carpeta con paréntesis que no aparece en la URL pero comparte layout.

3. *¿Dónde pondrías la lógica de negocio vs la UI?*  
   → Transformaciones puras en `lib/` o `_components/`; UI en `components/`.

### Checklist del día

- [ ] Leí ARCHITECTURE.md completo
- [ ] Identifiqué las 5 carpetas principales: `app/`, `components/`, `lib/`, `types/`, `public/`
- [ ] Sé explicar el flujo de auth demo (cookie → middleware → redirect `/login`)
- [ ] Conozco la deuda técnica documentada (nav duplicada, BottomNav, etc.)

---

## Día 2 — Entorno del navegador y JavaScript

**Objetivo:** dominar APIs del browser y patrones JS que aparecen en el código del prototipo.

### Archivos a leer

1. [`lib/auth/demoSession.ts`](lib/auth/demoSession.ts) — cookies y validación de URLs
2. [`components/player/global-player/usePlayerAudioEngine.ts`](components/player/global-player/usePlayerAudioEngine.ts) — `<audio>`, eventos, localStorage
3. [`lib/hooks/useMediaQuery.ts`](lib/hooks/useMediaQuery.ts) — `matchMedia` + `useSyncExternalStore`
4. [`app/layout.tsx`](app/layout.tsx) (líneas 36–50) — script anti-FOUC
5. [`components/dashboard/label-manager/LabelReleasesPipeline.tsx`](components/dashboard/label-manager/LabelReleasesPipeline.tsx) — `useMemo`, `Map`, transformación de datos

### Conceptos clave

| API / patrón | Uso en Proton |
|---|---|
| **Cookies** | Sesión demo; `SameSite=Lax`; leídas en middleware (servidor) |
| **localStorage** | Tema, volumen, layout widgets, scope de label |
| **HTML5 Audio** | `timeupdate`, `loadedmetadata`, `ended`, `play()` async |
| **Autoplay policy** | `play()` puede fallar → `try/catch` + `pause()` en store |
| **matchMedia** | Breakpoint responsive sin hydration mismatch |
| **useMemo** | Filtrar/agrupar releases solo cuando cambia el scope |
| **Closures + cleanup** | `removeEventListener` en el return del `useEffect` |

### Ejercicio en voz alta

- [ ] Explicá por qué el script de tema va en `<head>` y no solo en React.
- [ ] Describí qué pasa si `el.play()` lanza error (usuario no interactuó, política del browser).
- [ ] Recorré `LabelReleasesPipeline`: filtro → agrupación por status → render.

### Preguntas que te pueden hacer

1. *¿Cookie vs localStorage?*  
   → Cookie viaja al servidor (middleware); localStorage solo en cliente, más capacidad, no se envía automáticamente.

2. *¿Qué es un open redirect y cómo lo evitás?*  
   → `safeDashboardCallbackUrl`: solo paths que empiezan con `/dashboard`, sin `..` ni `//`.

3. *¿Para qué sirve el cleanup en useEffect?*  
   → Evitar memory leaks y listeners duplicados al desmontar o cambiar deps.

4. *¿Qué hace useMemo aquí y cuándo NO lo usarías?*  
   → Evita recalcular filtros/grupos; innecesario si el cálculo es trivial y la lista es chica.

### Checklist del día

- [ ] Entiendo el ciclo de vida del elemento `<audio>` en el player
- [ ] Puedo explicar `useSyncExternalStore` en una frase
- [ ] Sé qué es FOUC y cómo lo resolviste
- [ ] Practiqué explicar `safeDashboardCallbackUrl` sin leer el archivo

---

## Día 3 — React y Next.js App Router

**Objetivo:** Server vs Client Components, hooks, estado global, data fetching.

### Archivos a leer

1. [`lib/store/playerStore.ts`](lib/store/playerStore.ts) — Zustand, acciones, selectores
2. [`lib/store/dashboardStore.ts`](lib/store/dashboardStore.ts) — widgets, persist, merge de orden
3. [`lib/store/label-manager/labelScopeStore.ts`](lib/store/label-manager/labelScopeStore.ts) — scope label/artista
4. [`components/dashboard/PrototypePersistGate.tsx`](components/dashboard/PrototypePersistGate.tsx) — race de hydration
5. [`components/providers/QueryProvider.tsx`](components/providers/QueryProvider.tsx) — React Query
6. [`components/providers/ThemeProvider.tsx`](components/providers/ThemeProvider.tsx) — sync tema
7. [`lib/store/prototypeViewStore.ts`](lib/store/prototypeViewStore.ts) — producer vs label_manager

### Conceptos clave

| Patrón | Ejemplo |
|---|---|
| **"use client"** | Todo lo que usa hooks, browser APIs o Zustand |
| **Selectores Zustand** | `usePlayerStore((s) => s.isPlaying)` — menos re-renders |
| **persist middleware** | Guarda en localStorage; rehydration async |
| **PrototypePersistGate** | No renderizar UI hasta que persist terminó |
| **React Query** | `staleTime: 5min`, `retry: 1` para datos de dashboard |
| **Composición de providers** | Query → Theme → children |

### Ejercicio en voz alta

- [ ] Explicá por qué Zustand para el player y no solo `useState` en un componente.
- [ ] Describí el bug que resuelve `PrototypePersistGate` (flash de vista incorrecta).
- [ ] Decí cuándo usarías React Query vs Zustand en este proyecto.

### Preguntas que te pueden hacer

1. *¿Zustand vs Context?*  
   → Player actualiza seguido; selectores evitan re-renderizar todo el árbol. Context mejor para APIs estables inyectadas.

2. *¿Qué es hydration mismatch?*  
   → HTML del servidor ≠ primer render del cliente; `useSyncExternalStore` y gates lo mitigan.

3. *¿Cómo agregarías un widget nuevo al dashboard?*  
   → Componente en `widgets/`, entrada en `registry.tsx`, id en `dashboardStore` y `meta.ts`.

4. *Server Component vs Client Component — criterio?*  
   → Server: fetch, SEO, sin interactividad. Client: estado, eventos, browser APIs.

### Checklist del día

- [ ] Diferencio estado de servidor (Query) vs estado de UI (Zustand)
- [ ] Sé explicar `persist` + `hasHydrated` + `onFinishHydration`
- [ ] Conozco las dos personas del prototipo: `producer` y `label_manager`
- [ ] Leí [`components/dashboard/widgets/registry.tsx`](components/dashboard/widgets/registry.tsx)

---

## Día 4 — Módulos estrella del prototipo

**Objetivo:** profundizar en las 3 features más impresionantes para showcasear con Mateo.

### Bloque A — Global Player (≈ 1 h)

**Archivos:**

- [`components/player/GlobalPlayer.tsx`](components/player/GlobalPlayer.tsx) o [`components/player/global-player/GlobalPlayer.tsx`](components/player/global-player/GlobalPlayer.tsx)
- [`components/player/global-player/useYouTubePlayerEngine.ts`](components/player/global-player/useYouTubePlayerEngine.ts)
- [`components/player/global-player/PlayerAudioContext.tsx`](components/player/global-player/PlayerAudioContext.tsx)
- [`app/api/youtube/video/route.ts`](app/api/youtube/video/route.ts)
- [`lib/youtube/fetchYoutubeVideoHintsClient.ts`](lib/youtube/fetchYoutubeVideoHintsClient.ts)

**Narrativa:**

1. Usuario hace play en un mix → `playerStore.play(mix, source)`
2. Motor **audio** (`<audio>`) o **YouTube** (IFrame API)
3. Ambos exponen la misma interfaz `PlayerAudioApi` (patrón Strategy)
4. API key de YouTube solo en el servidor (Route Handler)
5. Edge cases: video privado, stall, modal de elección pestaña vs mini player

- [ ] Trazé el flujo play → pause → cambio de ruta → player sigue visible
- [ ] Explicá por qué la API key no va al cliente

### Bloque B — Dashboard configurable (≈ 45 min)

**Archivos:**

- [`components/dashboard/DashboardContent.tsx`](components/dashboard/DashboardContent.tsx)
- [`components/dashboard/widgets/registry.tsx`](components/dashboard/widgets/registry.tsx)
- [`components/dashboard/widgets/meta.ts`](components/dashboard/widgets/meta.ts)
- Un widget ejemplo: [`components/dashboard/widgets/StreamsWidget.tsx`](components/dashboard/widgets/StreamsWidget.tsx)

**Narrativa:**

- Registry pattern: `WidgetId` → componente
- Orden y visibilidad persistidos en `dashboardStore`
- Drag & drop con `@dnd-kit` (mencionar accesibilidad)

- [ ] Explicá cómo escalarías de 4 widgets visibles a 18 sin tocar el layout principal

### Bloque C — Label Manager (≈ 45 min)

**Archivos:**

- [`components/dashboard/label-manager/LabelReleasesPipeline.tsx`](components/dashboard/label-manager/LabelReleasesPipeline.tsx)
- [`components/dashboard/label-manager/LabelScopeSwitcher.tsx`](components/dashboard/label-manager/LabelScopeSwitcher.tsx)
- [`lib/mock/label-manager/labelCatalog.ts`](lib/mock/label-manager/labelCatalog.ts)
- [`app/(dashboard)/dashboard/(label-manager)/catalog/page.tsx`](app/(dashboard)/dashboard/(label-manager)/catalog/page.tsx)

**Narrativa:**

- Scope: todos los labels / un label / zoom por artista
- Pipeline kanban: draft → qa → scheduled → delivered → live
- Dominio musical: UPC, ISRC, issues/blockers, DSP delivery

- [ ] Explicá el filtro por `labelScopeStore` y el drawer de detalle

### Checklist del día

- [ ] Elegí **un** módulo para mostrar en pantalla si me lo piden
- [ ] Sé nombrar 2 edge cases del player (autoplay, video privado)
- [ ] Puedo explicar el pipeline de releases sin abrir el código

---

## Día 5 — Ensayo final y entrevista

**Objetivo:** consolidar, practicar STAR, preparar preguntas.

### Mañana (≈ 1.5 h)

- [ ] Corré `npm run dev` y navegá: Home → play mix → charts → dashboard → catalog (label manager)
- [ ] Ensayá el pitch de 30 s + pitch de 2 min (experiencia como artista en Proton Radio)
- [ ] Repasá la deuda técnica de [`ARCHITECTURE.md`](ARCHITECTURE.md) — mostrá autocrítica
- [ ] Prepará respuesta: *“¿Qué harías distinto en producción?”*
  - Auth real (Firebase/Auth0) en lugar de cookie demo
  - Extraer `lib/constants/nav.ts` (DRY)
  - Tests en hooks críticos (`usePlayerAudioEngine`, `safeDashboardCallbackUrl`)
  - Conectar `lib/api/` y eliminar mocks gradualmente

### Estructura STAR con Proton

| | |
|---|---|
| **S**ituación | Dos productos separados (radio pública + panel de artistas) |
| **T**area | Prototipo unificado que demuestre UX B2C + flujos B2B |
| **A**cción | App Router, player persistente, mock layer, dos personas, design tokens |
| **R**esultado | Demo navegable deployable; arquitectura lista para API real |

### Preguntas para hacerle a Mateo

1. ¿Cómo está organizado hoy el frontend en producción (monorepo, equipos, B2C vs B2B)?
2. ¿Qué parte del stack usan más en el día a día?
3. ¿Cuál es el mayor desafío técnico actual del producto?

### Qué NO estudiar

- LeetCode, estructuras de datos, complejidad algorítmica
- Frameworks que no usaste en el prototipo (salvo que pregunten “qué usarías”)

### Checklist pre-entrevista (1 h antes)

- [ ] Proyecto corre local sin errores
- [ ] Pestaña con el repo abierto (por si comparten pantalla)
- [ ] Agua, conexión estable, lugar tranquilo
- [ ] Recordá: **discutir código, no escribirlo**

---

## Apéndice — Archivos “si te muestran esto, sabés responder”

| Archivo | Pregunta probable |
|---|---|
| `middleware.ts` | Auth, redirects, route protection |
| `usePlayerAudioEngine.ts` | useEffect, event listeners, audio API |
| `playerStore.ts` | Estado global, acciones, inmutabilidad |
| `LabelReleasesPipeline.tsx` | useMemo, transformación de datos, UI de lista |
| `PrototypePersistGate.tsx` | SSR + persist + race conditions |
| `useMediaQuery.ts` | useSyncExternalStore, responsive SSR |
| `app/api/youtube/video/route.ts` | Route Handlers, env vars, degradación graceful |
| `demoSession.ts` | Seguridad básica (open redirects) |

---

## Apéndice — Glosario rápido

| Término | Significado breve |
|---|---|
| **App Router** | Sistema de rutas de Next.js basado en carpetas `app/` |
| **SSR** | HTML generado en servidor |
| **Hydration** | React “activa” el HTML estático en el cliente |
| **FOUC** | Flash of Unstyled/Wrong Content — contenido incorrecto un instante |
| **Stale time** | Cuánto React Query considera los datos frescos sin refetch |
| **Route Handler** | API endpoint en `app/api/.../route.ts` |
| **Selector** | Función que extrae un slice del store Zustand |
| **Strategy pattern** | Misma interfaz (`PlayerAudioApi`), distintas implementaciones (audio/YouTube) |

---

## Después de la entrevista

Anotá preguntas que no supiste responder y actualizá esta guía. Si querés profundizar un módulo con ejemplos línea por línea, usá el chat de Cursor en modo Agent sobre los archivos concretos.

**¡Mucha suerte, Tomás!**
