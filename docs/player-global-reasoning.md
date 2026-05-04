# Reproductor global: decisiones y razonamiento

## Contexto

**Proton Radio (sitio público en producción)**  
Tras el cambio a YouTube, el flujo habitual en protonradio.com es que el *call to action* del show **lleva al vídeo en YouTube** (enlace en el DOM, no un reproductor de audio integrado en la misma página para ese contenido).

**Esta aplicación (rediseño / área pública)**  
El hero `NowPlayingHero` usa un `<button>` que dispara `play(mix)` sobre el **store global** (`playerStore`) y el **`GlobalPlayer`** en el layout. Es un modelo distinto: **reproducción (y futuro audio) dentro de la app**, no redirección al show en YouTube como acción principal del “play” del hero.

No es que uno esté “mal”: son **decisiones de producto** distintas. Este repo prioriza experiencia unificada en la propia web.

---

## Objetivo de UX

Mantener el reproductor como está conceptualmente (estado global, barra inferior), pero:

1. **Minimizable**: poder colapsar la barra ancha cuando molesta al leer o navegar.
2. **Modo FAB** (*floating action button*): en estado minimizado, mostrar un control compacto fijo (esquina inferior, típicamente), con carátula y play/pause (y opcionalmente expandir).
3. **Navegación sin bloqueo**: poder recorrer **toda la página / las rutas del layout** con el reproductor **minimizado**, sin perder el contexto de lo que suena.

---

## Razonamiento técnico (alto nivel)

| Tema | Decisión |
|------|----------|
| **¿Dónde vive el UI?** | `GlobalPlayer` en **`app/layout.tsx`** (raíz) para que **no se desmonte** al ir de `(public)` a `(dashboard)` u otras rutas. |
| **¿Dónde guardar “expandido vs minimizado”?** | Estado en **Zustand** (`playerStore`), p. ej. `playerChrome: 'expanded' \| 'minimized'`, para que el modo **persista al navegar** en toda la app. |
| **Barra expandida** | Comportamiento actual: `fixed` abajo, ancho completo, `z-50`. Botón explícito para **minimizar**. |
| **Modo FAB** | `fixed` en esquina (p. ej. `bottom` + `right`), tamaño táctil adecuado, mismo store de `currentMix` / `isPlaying`. Clic para **expandir** de nuevo. |
| **Espacio del contenido (`main`)** | `PublicMain` y `DashboardMainArea` usan `usePlayerBottomPaddingClass` (`pb-36` / `pb-6`). |
| **Audio real** | Cuando exista `<audio>` u otro motor, debe vivir en el mismo árbol que no se desmonta (layout / `GlobalPlayer`) para que minimizar y navegar **no corten** la reproducción. |

---

## Reproductor actual y audio futuro en Proton

Mantenemos el reproductor **como está** (barra global + FAB, motor con `<audio>` y `ProtonMix.audioUrl` opcional) **a propósito**: el día que Proton exponga **streams HTTP(S) directos** (o `audioUrl` en GraphQL), podremos enchufar ese audio al mismo flujo **sin rehacer** el modelo de estado ni el layout. El `<audio>` de `usePlayerAudioEngine` y el store ya son el sitio natural para “audio de verdad”.

Hasta entonces, muchos mixes solo tienen **`youtubeId`** en la API, no URL de audio; eso es independiente de cómo quede montada la UI.

---

## Contenido solo en YouTube: elección explícita del usuario

En **protonradio.com** el flujo habitual es **abrir el vídeo en YouTube** (misma pestaña o nueva). En esta app no forzamos una sola opción: cuando el “play” implique **solo un enlace a YouTube** (p. ej. mix sin `audioUrl` pero con `youtubeId`), la idea es **preguntar al usuario** qué prefiere:

1. **Abrir YouTube en otra pestaña** — comportamiento cercano al sitio oficial (el usuario sigue en la web en la pestaña actual).
2. **Mini reproductor en la página** — embed minimizado (p. ej. en la zona del FAB o un panel flotante con iframe + **YouTube IFrame API**) para ver el vídeo pequeño y **seguir navegando** en la misma pestaña.

Así se respeta el paralelo con protonradio (opción A) y se ofrece la experiencia “dentro del rediseño” (opción B) sin sustituir por completo el modelo hasta que exista audio directo.

---

## Cómo implementarlo (borrador técnico)

| Pieza | Rol |
|-------|-----|
| **Detección** | En el handler de play (p. ej. `NowPlayingHero` / quien llame a `play(mix)`): si `mix.audioUrl` existe → flujo actual con `<audio>`. Si no hay `audioUrl` pero sí `youtubeId` → no reproducir aún; disparar el flujo de elección. |
| **UI de elección** | Un **modal** o **popover** accesible (“¿Abrir en YouTube o reproducir aquí minimizado?”) con dos acciones claras + cancelar. Opcional: recordar preferencia en `localStorage` (`youtubePlaybackPreference: 'tab' \| 'mini'`). |
| **Opción pestaña** | `window.open` con la URL de YouTube y `target` `_blank`, flags `noopener,noreferrer`. No hace falta iframe. |
| **Opción mini** | Montar un iframe oculto o pequeño controlado por [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference): sincronizar play/pause (y opcionalmente tiempo) con `playerStore` / `usePlayerAudioEngine` o un **segundo “motor”** solo para YouTube cuando no hay `<audio>`. El FAB puede mostrar el vídeo en miniatura o la carátula + controles que mandan al API. |
| **Estado** | Extender el store si hace falta: p. ej. `playbackSource: 'audio' \| 'youtube' \| null` para saber qué componente está activo y evitar dos fuentes sonando a la vez. |
| **Accesibilidad / móvil** | Autoplay con sonido suele requerir gesto del usuario (el modal cumple ese gesto). Probar tamaños mínimos del embed y políticas del navegador. |

La implementación concreta vivirá en `components/player/global-player/` y posiblemente un hook tipo `useYouTubePlayer`; este apartado solo fija **intención** y **mapa de trabajo**.

---

## Resumen

- **Proton en producción** = enlace al show en YouTube como flujo principal del contenido en vivo/archivo en ese sitio.
- **Esta app** = reproductor global propio; la evolución natural de UX es **minimizar → FAB** para no competir con la lectura y la navegación, sin cambiar el modelo de “reproducir en la app”.
- **Futuro** = mismo reproductor + `audioUrl` cuando Proton lo ofrezca; **YouTube** = diálogo usuario **pestaña nueva vs mini reproductor**, no sustituir aún el stack de audio por iframe para todos los casos.

Este documento fija el **por qué** y el **qué**; la implementación vive en `components/player/global-player/` (ver `README` en esa carpeta).

---

## Estructura de código

| Ruta | Rol |
|------|-----|
| `components/player/global-player/GlobalPlayer.tsx` | Orquesta barra expandida vs FAB según `playerChrome` |
| `components/player/global-player/PlayerExpandedBar.tsx` | Barra inferior ancha + botón minimizar |
| `components/player/global-player/PlayerFab.tsx` | FAB esquina inferior derecha + expandir |
| `components/player/global-player/PlayerArtwork.tsx` | Carátula reutilizable (DRY) |
| `components/player/global-player/PlayerSeekBar.tsx` | Franja superior minimal (~3px) + seek invisible |
| `components/player/global-player/PlayerVolumeControl.tsx` | Volumen + mute |
| `components/player/global-player/usePlayerAudioEngine.ts` | `<audio>` y sincronía con Zustand |
| `components/player/global-player/PublicMain.tsx` | `<main>` público; padding vía `usePlayerBottomPaddingClass` |
| `components/player/global-player/usePlayerBottomPaddingClass.ts` | `pb-36` / `pb-6` según reproductor |
| `components/dashboard/DashboardMainArea.tsx` | Columna dashboard con el mismo padding inferior |
| `components/player/global-player/index.ts` | Exports del módulo |
| `components/player/GlobalPlayer.tsx` | Re-export por compatibilidad con imports antiguos |
