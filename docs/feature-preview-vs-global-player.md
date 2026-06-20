# Audio preview (Discover / Feedback) vs. global player

Working document. Defines how **preview / feedback** playback (the new pages from [feature-discover-producers.md](feature-discover-producers.md) and [feature-feedback-productores.md](feature-feedback-productores.md)) should coexist with the existing **global player**, once play actually produces real audio.

Global player context: [player-global-reasoning.md](player-global-reasoning.md).

---

## 1. The problem in one sentence

Today there are **three independent audio sources** that could play at the same time:

1. The **global player** (`GlobalPlayer` in `app/layout.tsx`, engine in [usePlayerAudioEngine.ts](../components/player/global-player/usePlayerAudioEngine.ts), state in [playerStore.ts](../lib/store/playerStore.ts)).
2. The **Discover card preview** (a local `<audio>` in [discover/page.tsx](<../app/(dashboard)/dashboard/(producer)/discover/page.tsx>)).
3. The **feedback view player** (a local `<audio>` in [FeedbackTrackPlayer.tsx](../components/dashboard/feedback/FeedbackTrackPlayer.tsx)).

Each has its own `<audio>` and none of them know about the others. While the mocks don't have a real `audioUrl` this goes unnoticed, but the day real audio plays: if a producer was listening to a mix on the global player and hits **play** on a Discover card, **both will sound at once**.

The global player already has the concept of "only one source at a time" — `playbackSource: 'audio' | 'youtube' | null` exists for exactly that (see [player-global-reasoning.md](player-global-reasoning.md), the "How to implement it" table). But it only models audio-vs-YouTube **within** the global player. The Discover/Feedback preview is a **third source that isn't modeled today**.

---

## 2. The two scenarios

- **Wasn't listening to anything** → enters Discover/Feedback and hits play. **No conflict**: the preview plays, done.
- **Was listening to something on the global player** → hits play on a preview. **This is where it gets messy**: a decision is needed about what happens to what was playing.

---

## 3. The core decision: does the preview go through the global store, or is it a separate engine?

### Option A — Play the preview track through the global store

Treat the track as a `ProtonMix` and call `play(track, 'audio')`.

- ✅ A single source, automatic mutual exclusion, the global bar reflects what's playing.
- ❌ **Overwrites `currentMix`**: the radio mix the producer was listening to is lost and they'd have to find it again.
- ❌ **Mixes two different things**: a copyrighted master (no download, signed URL, page-scoped — see [feature-feedback-productores.md](feature-feedback-productores.md) section 6) isn't the same as a radio mix. Putting them through the same engine drags those protections to a place that doesn't need them, and vice versa.

**Discarded** for those two reasons.

### Option B — Separate preview engine, coordinated with the global one (recommended)

The preview keeps its own `<audio>` (isolated, with the copyright protections it needs) **but coordinates with the global store** so two things never play at once.

- ✅ Doesn't overwrite `currentMix`: the radio mix stays intact, it just gets **paused**.
- ✅ The master's protections (no-download, signed streaming) stay isolated from the radio player.
- ✅ Reuses the principle that already exists ("only one source playing").

---

## 4. How it coordinates (Option B in detail)

### When a preview **starts**
1. Read the global state: `const { isPlaying } = usePlayerStore.getState()`.
2. If the global player was playing, **pause it**: `usePlayerStore.getState().pause()`. This leaves `currentMix` intact — the global bar still shows the mix, just paused.
3. Remember that something **was** playing (for the resume policy in the next step).
4. Start the preview.

### When a preview **stops** (manual pause, track ends, or leaving the page)
- **Resume policy — to decide**:
  - **Auto-resume (recommended)**: if the global player was playing, resume it (`resume()`). The producer's "background music" comes back on its own once they're done sampling. This is what you'd expect from a SoundCloud/Spotify-style preview.
  - **No resume**: leave the global player paused; the producer decides when to go back. More conservative, less "magic".
- **Navigation**: the preview is **page-scoped** (Discover and Feedback). If the producer navigates away while a preview is playing, the preview **stops** (its `<audio>` unmounts with the route) and the resume policy applies to the global player. The global player never unmounts (it lives in the root layout), so resuming it is safe.

### Between previews
- Discover and Feedback need to **share a single preview controller** (a small Zustand-style store, e.g. `previewStore`, or a context), so they don't duplicate **between each other** either (hitting play on one card while another is playing should stop the first one). Discover already does this internally with a single shared `<audio>`; it still needs to be unified with the Feedback player under one common controller.

---

## 5. Suggested state model

Two valid paths:

- **Minimal (imperative)**: a `previewStore` with `previewingId` and `startPreview(track)` / `stopPreview()` actions. `startPreview` takes care of pausing the global player and storing the resume flag. It doesn't touch `playerStore` except via the `pause()`/`resume()` calls. This is the fastest to build on top of what already exists.
- **Integrated (reactive)**: extend `PlaybackSource` to `'audio' | 'youtube' | 'preview'` in [playerStore.ts](../lib/store/playerStore.ts), so the global player "knows" a preview is active and reactively goes silent. Conceptually cleaner, but couples the preview (with its copyright concerns) to the radio store — it would lose part of Option B's isolation advantage.

**Recommendation**: start with the minimal (isolated) `previewStore`, and only migrate to the integrated model if there's a need for the global player to react to the preview on its own.

---

## 6. Summary

- The day real audio exists, **preview and global player can't play together**.
- Recommended: a **separate preview engine** (isolates the master's protections) that **pauses the global player when it starts** and, depending on the chosen policy, **resumes it when it stops** — never overwriting `currentMix`.
- Unify Discover + Feedback under **a single preview controller** so they don't duplicate between each other either.
- Pending product decision: **auto-resume or not** when the preview stops.
