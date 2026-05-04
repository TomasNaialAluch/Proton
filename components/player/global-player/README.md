# Global player (`global-player`)

Reproductor global (barra inferior **o** FAB). Se monta en **`app/layout.tsx`** para que siga al navegar al dashboard. Estado en `lib/store/playerStore.ts` (`playerChrome`, `currentMix`, `isPlaying`). El audio real va en un `<audio>` con lógica en `usePlayerAudioEngine` (seek, volumen, sincronía con play/pause).

## Archivos

| Archivo | Responsabilidad |
|---------|-----------------|
| `GlobalPlayer.tsx` | `<audio>` + provider; en dashboard móvil `PlayerDashboardMobile`; si no barra o FAB |
| `PlayerDashboardMobile.tsx` | Dashboard &lt; lg: strip en `bottom-16`, expandir controles |
| `lib/hooks/useMediaQuery.ts` | `useIsMaxLg` para bifurcar reproductor |
| `usePlayerAudioEngine.ts` | Carga de `src`, `currentTime` / `duration`, seek, volumen, mute |
| `PlayerAudioContext.tsx` | Contexto `usePlayerAudio()` para la UI |
| `PlayerExpandedBar.tsx` | Barra: **línea de progreso** arriba, transporte, volumen, minimizar |
| `PlayerSeekBar.tsx` | Línea ~3px (única altura en layout); el range se superpone hacia abajo para el arrastre |
| `PlayerVolumeControl.tsx` | Orquesta `PlayerVolumeMobile` + `PlayerVolumeDesktop` |
| `PlayerVolumeMobile.tsx` | Tap → panel encima de la barra (`md:hidden`) |
| `PlayerVolumeDesktop.tsx` | Hover → slider en la fila (`hidden md:flex`); clic icono = mute |
| `PlayerFab.tsx` | FAB + franja de progreso |
| `PlayerArtwork.tsx` | Miniatura del mix (`sm` / `md` / `lg`) |
| `PublicMain.tsx` | `<main>` público; padding con `usePlayerBottomPaddingClass` |
| `usePlayerBottomPaddingClass.ts` | Clases `pb-*` según reproductor (compartido con dashboard) |
| `index.ts` | `GlobalPlayer`, `PublicMain` |

**YouTube (solo `youtubeId`):** `startPlayback` en `lib/player/startPlayback.ts` abre el modal o aplica la preferencia en `localStorage` (`lib/player/youtubePreference.ts`). Mini reproductor = `playbackSource: 'youtube'` + `useYouTubePlayerEngine` (IFrame API). Modal: `YouTubeChoiceModal.tsx`.


Import recomendado del layout público:

```ts
import GlobalPlayer from "@/components/player/GlobalPlayer";
import { PublicMain } from "@/components/player/global-player";
```

## Principios

- **YAGNI**: sin dock ni gestos; solo expandido / minimizado + controles estándar HTML (`input range`).
- **KISS**: un `<audio>` por sesión de mix; estado de volumen persistido en `localStorage` (`proton-player-volume`).
- **DRY**: artwork compartido; tiempos con `formatPlaybackTime`; fallback de stream centralizado.

## Audio directo vs YouTube (decisión de producto)

Ver **`docs/player-global-reasoning.md`** en profundidad. Resumen:

- **Seguimos con el reproductor actual** (`<audio>` + `ProtonMix.audioUrl`) para cuando Proton publique streams HTTP(S): mismo layout y store.
- Si solo hay **`youtubeId`** (sin `audioUrl`), la dirección acordada es **preguntar al usuario**: abrir **YouTube en otra pestaña** (como protonradio.com) **o** usar un **mini reproductor** embebido (FAB / iframe + YouTube IFrame API) para seguir usando la página.
- Tabla de implementación sugerida (detección, modal, `window.open`, API de YouTube, estado en store) está en ese doc bajo *“Cómo implementarlo (borrador técnico)”*.
