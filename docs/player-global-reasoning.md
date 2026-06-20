# Global player: decisions and reasoning

## Context

**Proton Radio (the public production site)**
Since the move to YouTube, the usual flow on protonradio.com is that the show's *call to action* **leads to the YouTube video** (a link in the DOM, not an audio player embedded in that same page for that content).

**This app (redesign / public area)**
The `NowPlayingHero` hero uses a `<button>` that triggers `play(mix)` on the **global store** (`playerStore`) and the **`GlobalPlayer`** in the layout. It's a different model: **playback (and future audio) inside the app**, not redirecting to the YouTube show as the hero's main "play" action.

Neither is "wrong": these are different **product decisions**. This repo prioritizes a unified experience on the site itself.

---

## UX goal

Keep the player conceptually as it is (global state, bottom bar), but:

1. **Minimizable**: be able to collapse the wide bar when it gets in the way of reading or navigating.
2. **FAB mode** (*floating action button*): in minimized state, show a compact fixed control (typically in a corner), with artwork and play/pause (and optionally expand).
3. **Unblocked navigation**: be able to browse **the whole page / the layout's routes** with the player **minimized**, without losing the context of what's playing.

---

## Technical reasoning (high level)

| Topic | Decision |
|------|----------|
| **Where does the UI live?** | `GlobalPlayer` in **`app/layout.tsx`** (root) so it **never unmounts** when moving between `(public)` and `(dashboard)` or other routes. |
| **Where to store "expanded vs. minimized"?** | State in **Zustand** (`playerStore`), e.g. `playerChrome: 'expanded' \| 'minimized'`, so the mode **persists across navigation** throughout the app. |
| **Expanded bar** | Current behavior: `fixed` at the bottom, full width, `z-50`. Explicit button to **minimize**. |
| **FAB mode** | `fixed` in a corner (e.g. `bottom` + `right`), appropriate touch target size, same `currentMix` / `isPlaying` store. Click to **expand** again. |
| **Content space (`main`)** | `PublicMain` and `DashboardMainArea` use `usePlayerBottomPaddingClass` (`pb-36` / `pb-6`). |
| **Real audio** | Once an `<audio>` element or other engine exists, it must live in the same tree that never unmounts (layout / `GlobalPlayer`) so minimizing and navigating **never cut off** playback. |

---

## Current player and future audio in Proton

We keep the player **as it is** (global bar + FAB, engine with `<audio>` and an optional `ProtonMix.audioUrl`) **on purpose**: the day Proton exposes **direct HTTP(S) streams** (or `audioUrl` in GraphQL), we'll be able to plug that audio into the same flow **without rebuilding** the state model or the layout. The `<audio>` element in `usePlayerAudioEngine` and the store are already the natural place for "real audio".

Until then, many mixes only have a **`youtubeId`** in the API, not an audio URL; that's independent of how the UI ends up assembled.

---

## Content that's only on YouTube: an explicit user choice

On **protonradio.com** the usual flow is to **open the video on YouTube** (same tab or a new one). In this app we don't force a single option: when "play" would mean **only a YouTube link** (e.g. a mix without `audioUrl` but with `youtubeId`), the idea is to **ask the user** what they'd prefer:

1. **Open YouTube in another tab** — close to the official site's behavior (the user stays on the web app in the current tab).
2. **Mini player on the page** — a minimized embed (e.g. in the FAB area or a floating panel with an iframe + the **YouTube IFrame API**) to watch the small video and **keep browsing** in the same tab.

This respects the parallel with protonradio (option A) and offers the "within the redesign" experience (option B), without fully replacing the model until direct audio exists.

---

## How to implement it (technical draft)

| Piece | Role |
|-------|------|
| **Detection** | In the play handler (e.g. `NowPlayingHero` / whoever calls `play(mix)`): if `mix.audioUrl` exists → the current `<audio>` flow. If there's no `audioUrl` but there is a `youtubeId` → don't play yet; trigger the choice flow. |
| **Choice UI** | An accessible **modal** or **popover** ("Open on YouTube or play here, minimized?") with two clear actions + cancel. Optional: remember the preference in `localStorage` (`youtubePlaybackPreference: 'tab' \| 'mini'`). |
| **Tab option** | `window.open` with the YouTube URL and `target` `_blank`, with `noopener,noreferrer` flags. No iframe needed. |
| **Mini option** | Mount a hidden or small iframe controlled by the [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference): sync play/pause (and optionally time) with `playerStore` / `usePlayerAudioEngine` or a **second "engine"** just for YouTube when there's no `<audio>`. The FAB can show the video thumbnail or the artwork + controls that talk to the API. |
| **State** | Extend the store if needed: e.g. `playbackSource: 'audio' \| 'youtube' \| null` to know which component is active and avoid two sources playing at once. |
| **Accessibility / mobile** | Autoplay with sound usually requires a user gesture (the modal satisfies that gesture). Test minimum embed sizes and browser policies. |

The concrete implementation will live in `components/player/global-player/` and possibly a hook like `useYouTubePlayer`; this section only sets **intent** and a **work map**.

---

## Summary

- **Proton in production** = a link to the show on YouTube as the main flow for live/archive content on that site.
- **This app** = its own global player; the natural UX evolution is **minimize → FAB** so it doesn't compete with reading and navigation, without changing the "play inside the app" model.
- **Future** = the same player + `audioUrl` once Proton offers it; **YouTube** = a user dialog of **new tab vs. mini player**, not yet replacing the audio stack with an iframe for every case.

This document fixes the **why** and the **what**; the implementation lives in `components/player/global-player/` (see the `README` in that folder).

---

## Code structure

| Path | Role |
|------|------|
| `components/player/global-player/GlobalPlayer.tsx` | Orchestrates the expanded bar vs. FAB depending on `playerChrome` |
| `components/player/global-player/PlayerExpandedBar.tsx` | Wide bottom bar + minimize button |
| `components/player/global-player/PlayerFab.tsx` | Bottom-right corner FAB + expand |
| `components/player/global-player/PlayerArtwork.tsx` | Reusable artwork (DRY) |
| `components/player/global-player/PlayerSeekBar.tsx` | Minimal top strip (~3px) + invisible seek |
| `components/player/global-player/PlayerVolumeControl.tsx` | Volume + mute |
| `components/player/global-player/usePlayerAudioEngine.ts` | `<audio>` and sync with Zustand |
| `components/player/global-player/PublicMain.tsx` | Public `<main>`; padding via `usePlayerBottomPaddingClass` |
| `components/player/global-player/usePlayerBottomPaddingClass.ts` | `pb-36` / `pb-6` depending on the player |
| `components/dashboard/DashboardMainArea.tsx` | Dashboard column with the same bottom padding |
| `components/player/global-player/index.ts` | Module exports |
| `components/player/GlobalPlayer.tsx` | Re-export for compatibility with older imports |
