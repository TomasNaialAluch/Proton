# Global player (`global-player`)

Global player (bottom bar **or** FAB). It’s mounted in **`app/layout.tsx`** so it persists when navigating into the dashboard. State lives in `lib/store/playerStore.ts` (`playerChrome`, `currentMix`, `isPlaying`). Real audio plays through an `<audio>` element driven by `usePlayerAudioEngine` (seek, volume, play/pause sync).

## Files

| Archivo | Responsabilidad |
|---------|-----------------|
| `GlobalPlayer.tsx` | `<audio>` + provider; uses `PlayerDashboardMobile` on mobile dashboard; renders bar or FAB |
| `PlayerDashboardMobile.tsx` | Dashboard < `lg`: strip at `bottom-16`, expands controls |
| `lib/hooks/useMediaQuery.ts` | `useIsMaxLg` to branch player UI |
| `usePlayerAudioEngine.ts` | Loads `src`, manages `currentTime` / `duration`, seek, volume, mute |
| `PlayerAudioContext.tsx` | `usePlayerAudio()` context for UI |
| `PlayerExpandedBar.tsx` | Bar: **progress line** on top, transport, volume, minimize |
| `PlayerSeekBar.tsx` | ~3px line (the only “height” in layout); the range overlays downward for dragging |
| `PlayerVolumeControl.tsx` | Orchestrates `PlayerVolumeMobile` + `PlayerVolumeDesktop` |
| `PlayerVolumeMobile.tsx` | Tap → panel above the bar (`md:hidden`) |
| `PlayerVolumeDesktop.tsx` | Hover → slider in-row (`hidden md:flex`); icon click = mute |
| `PlayerFab.tsx` | FAB + progress strip |
| `PlayerArtwork.tsx` | Mix thumbnail (`sm` / `md` / `lg`) |
| `PublicMain.tsx` | Public `<main>`; padding via `usePlayerBottomPaddingClass` |
| `usePlayerBottomPaddingClass.ts` | `pb-*` classes based on player chrome (shared with dashboard) |
| `index.ts` | `GlobalPlayer`, `PublicMain` |

**YouTube (youtubeId-only):** `startPlayback` in `lib/player/startPlayback.ts` opens the modal or applies the preference stored in `localStorage` (`lib/player/youtubePreference.ts`). Mini player = `playbackSource: 'youtube'` + `useYouTubePlayerEngine` (IFrame API). Modal: `YouTubeChoiceModal.tsx`.


Recommended import from the public layout:

```ts
import GlobalPlayer from "@/components/player/GlobalPlayer";
import { PublicMain } from "@/components/player/global-player";
```

## Principios

- **YAGNI**: no docking or gestures; only expanded/minimized + standard HTML controls (`input range`).
- **KISS**: one `<audio>` per mix session; volume state persisted in `localStorage` (`proton-player-volume`).
- **DRY**: shared artwork; time formatting via `formatPlaybackTime`; centralized stream fallback.

## Direct audio vs YouTube (product decision)

See **`docs/player-global-reasoning.md`** for the full reasoning. Summary:

- **We keep the current player** (`<audio>` + `ProtonMix.audioUrl`) for when Proton publishes HTTP(S) streams: same layout and store.
- If we only have a **`youtubeId`** (no `audioUrl`), the agreed direction is to **ask the user**: open **YouTube in a new tab** (like protonradio.com) **or** use an embedded **mini player** (FAB / iframe + YouTube IFrame API) to keep using the page.
- A suggested implementation table (detection, modal, `window.open`, YouTube API, store state) lives in that doc under *“How to implement it (technical draft)”*.
