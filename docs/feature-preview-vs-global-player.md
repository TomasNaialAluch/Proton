# Audio preview (Discover / Feedback / Track Detail) vs. global player

Working document. Defines how **preview / feedback** playback (Discover, Feedback, Track Detail, and label track cards) should coexist with the existing **global player** (radio, shows, embedded YouTube), once play actually produces real audio.

Global player context: [player-global-reasoning.md](player-global-reasoning.md).

---

## 1. The problem in one sentence

Today there are **three independent audio sources** that could play at the same time:

1. The **global player** (`GlobalPlayer` in `app/layout.tsx`, engine in [usePlayerAudioEngine.ts](../components/player/global-player/usePlayerAudioEngine.ts), state in [playerStore.ts](../lib/store/playerStore.ts)).
2. The **Discover card preview** (`TrackWaveformPlayer`, used from Discover, Track Detail, and eventually label track cards).
3. The **feedback view player** (`FeedbackTrackPlayer`, wraps the same `TrackWaveformPlayer`).

Each has its own `<audio>` and none of them know about the others by default. While the mocks don't have a real `audioUrl` this goes unnoticed, but the day real audio plays: if a producer was listening to a mix on the global player and hits **play** on a preview card, **both will sound at once**.

The global player already has the concept of "only one source at a time" — `playbackSource: 'audio' | 'youtube' | null` exists for exactly that (see [player-global-reasoning.md](player-global-reasoning.md)). But it only models audio-vs-YouTube **within** the global player. Preview is a **third source**, coordinated separately (see section 3).

---

## 2. The two scenarios

- **Wasn't listening to anything** → enters a preview and hits play. **No conflict**: the preview plays, done.
- **Was listening to something on the global player** (a show, a mix, a YouTube video) → hits play on a preview. **This is where the real design work is** — see section 4.

---

## 3. The core decision: does the preview go through the global store, or is it a separate engine?

### Option A — Play the preview track through the global store

Treat the track as a `ProtonMix` and call `play(track, 'audio')`.

- ❌ **Overwrites `currentMix`**: the show/mix the producer was listening to is lost and they'd have to find it again.
- ❌ **Mixes two different things**: a copyrighted master (no download, signed URL, page-scoped — see [feature-feedback-productores.md](feature-feedback-productores.md) section 6) isn't the same as a radio mix/show. Putting them through the same engine drags those protections to a place that doesn't need them, and vice versa.
- ❌ **Wrong controls**: the global player has next/prev, queue, mix concepts. A single-track preview has none of that — literally not the same buttons.

**Discarded.**

### Option B — Separate preview engine, coordinated with the global one (confirmed)

The preview keeps its own `<audio>` (isolated, with the copyright protections it needs) **and its own dedicated UI** — not a mode of the global player, not the same button set — but **coordinates with the global store** so two things never play, and never visually compete for the same screen space, at once.

---

## 4. How it coordinates — the actual decided flow

### 4.1 Starting a preview: silent pause, no modal

When a preview starts (first one in a session — see 4.4):
1. Read the global state. If it's playing, **pause it** (`usePlayerStore.getState().pause()`) — `currentMix` is preserved, just paused.
2. Start the preview.

No confirmation needed here — starting a preview is a deliberate action already, pausing whatever was playing in the background to make room for it is the expected, unsurprising behavior. This part doesn't need a modal.

### 4.2 Stopping a preview: **not** silent auto-resume — rejected, here's why

The original version of this doc recommended auto-resuming the global player the instant a preview stops. **Rejected** — walk through the actual use case: a producer browsing Discover samples five tracks in a row, closing each one after a few seconds to move to the next. With auto-resume, the paused show/mix would **restart every single time**, five times in a row, each one interrupting the producer mid-thought. That's not "the music comes back nicely" — that's the opposite of pleasant, exactly the thing this whole product direction (see `docs/feature-track-detail.md`, "the pleasantness of navigating and connecting IS the product") is supposed to avoid.

### 4.3 The actual flow: ask, once, on explicit close

The preview player has its **own close control** (an ✕ on the preview bar/card) — this is the deliberate "I'm done sampling" signal, distinct from just pausing playback mid-track.

**When the preview is closed** (✕ pressed) **and** there's a show/mix that got paused to make room for it:

1. A confirmation modal opens: *"You paused [Show/Mix name] to preview tracks. Continue listening?"* — **Yes** / **No**.
2. **Yes** → resume the global player from where it left off. The "paused for preview" flag clears. If the producer opens another preview afterward, the flow starts over from 4.1 (pause silently, ask again on close) — because the show is actively playing again, so pausing it again is a new instance of the same decision.
3. **No** → the global player **stops fully** (not just stays paused) — `currentMix` is cleared, not just silenced. The "paused for preview" flag also clears.

### 4.4 Why "No" naturally prevents repeat-asking (no extra memory needed)

This is the part that makes the producer's five-tracks-in-a-row scenario actually pleasant: once the answer is **No**, the show is genuinely stopped, not paused. The next preview the producer opens has **nothing paused to resume** — so step 4.1's "was it playing?" check is false, nothing gets paused, and closing that next preview has nothing to ask about either. The modal doesn't need a separate "don't ask me again" flag or dismissal memory — it falls out naturally from the state: **the modal only ever appears when there's a specific, real, currently-paused-for-preview session waiting.** Once that's resolved (either way), there's nothing left to ask about until a *new* show starts playing and gets paused for a *new* preview.

**Between previews** (switching from one preview track to another without closing first): no re-pause, no re-ask — the global player is already paused/stopped from the first preview, the flag doesn't move, closing whichever preview is currently open is still the only thing that can trigger the modal.

---

## 5. Single docked slot — the two players never show at once

Beyond audio, the **visual UI** also has to not compete. There's exactly **one bottom-docked media slot** in the layout. It shows, in priority order:

1. **Preview bar** — if a preview is active. Its own look, its own controls (play/pause, scrub, close ✕) — no next/prev/queue/mix, and **no purchase/buy CTA** (see section 5.2), because none of those apply to a single track sample in our product.
2. **Global player bar** — if no preview is active and the global player has something loaded (playing or paused).
3. **Nothing** — if neither.

A small arbiter component (new, doesn't touch what already works) sits next to `GlobalPlayer` in `app/layout.tsx` and decides which of the two to render into that one slot — each player keeps owning its own internals; the arbiter only decides visibility. Swapping between the two should use a short transition (~200ms slide or cross-fade), not an instant cut, so the handoff reads as intentional rather than a UI glitch.

On mobile specifically, this single-slot rule matters even more: `BottomNav` already occupies fixed space at the bottom — stacking a second AND third bar on top of it would be unusable.

### 5.1 Visual reference — the real Proton Radio preview bar

Checked the actual bottom preview bar on `protonradio.com` (real product, verified live) to base ours on it instead of guessing. Anatomy, left to right:

1. **Play/pause button** — circular, filled accent color, leftmost.
2. **Thumbnail** — small square cover art next to the button.
3. **Track identity block** — artist name (bold) + track title, with a small **"PREVIEW"** tag/label directly under it, small caps, muted — this is what tells the listener "this is a clip, not the full track."
4. **Elapsed time** (e.g. `1:19`) — left of the waveform.
5. **Waveform scrubber** — the dominant visual element of the bar, colored (accent) up to the current playhead, muted/gray past it — draggable to seek, same visual language as the bars we already generate deterministically in `TrackWaveformPlayer.tsx`.
6. **Total duration** (e.g. `4:21`) — right of the waveform.
7. **CTA button, far right** — on the real site this is "GET FULL TRACK." **We drop this entirely** — see 5.2 for why. Nothing replaces it; the bar just ends at the duration, or optionally a close ✕ sits where the CTA was (see below).

This is the reference to build `TrackWaveformPlayer`'s docked/bar variant against — same layout, same information density, same "PREVIEW" labeling convention, once real audio exists. Build it now, ready to go live the moment a real `audioUrl` exists; nothing about the UI depends on having real audio today (the deterministic fake waveform already renders fine either way).

### 5.2 Purchase CTA — reversed, here's why

Originally decided against (see the reasoning kept below, still valid on its own terms) — **reversed** after a closer look at the actual copyright constraint. The point isn't "does a producer buy tracks like a DJ" — it's that **whether Proton grants producers access to hear a full copyrighted master at all is a real licensing decision, not something a design pass gets to invent.** Since this prototype can't actually grant that access (and shouldn't pretend to), the honest move is the same hand-off the real product already uses: a **"Get full track" link out to Beatport** (a generic search by artist + title, not a fabricated real product page), so the story stays "go buy/hear it properly, legally, elsewhere" instead of silently implying Proton unlocked something it has no right to.

**Not on the preview player at all, in either skin — on Track Detail instead.** First tried `PreviewInlinePanel` (the feedback-scoring panel), then caught the real problem: tracks going through Discover/Feedback are, almost by definition, **unreleased demos being evaluated** — there is no commercial "full track" to send anyone to buy yet, so a Beatport link there would itself be a copyright-irresponsible claim (implying a release that doesn't exist). Track Detail is the right place because it's gated on `track.status === "published"` *and* a resolved `label` — i.e. only for a track that's a real, already-released catalog entry. Implemented in `TrackDetailHeader.tsx`, next to the label link: a "Get full track" link to a generic Beatport search (artist + title, not a fabricated product page). Neither preview skin (`PreviewDockedBar` nor `PreviewInlinePanel`) carries this CTA — both still mask the waveform to show only the **middle clip** as audible (dimmed start/end + boundary markers), matching Beatport's own preview convention, purely visual.

**Original reasoning, kept for context (no longer the operative decision):** "Proton Radio itself doesn't sell the file... Our users are producers/label managers evaluating tracks (feedback, remix requests, A&R), not DJs buying music. So the bar's right-most slot in our version isn't 'no CTA yet, pending Beatport integration' — it's permanently not a thing we build." This framing undersold the actual constraint (copyright/licensing, not user role) — a producer wanting to hear a track's full master still can't get that from Proton without Proton actually licensing it, regardless of whether they're "a DJ" or not.

---

## 6. State model

Extends the already-built `lib/store/previewStore.ts` rather than replacing it. Real action names, checked against `lib/store/playerStore.ts` (`pause()`, `resume()`, `clearPlayer()` — there's no separate `stop()`, `clearPlayer()` is the "fully stop" action):

```ts
interface PreviewState {
  activePreviewId: string | null;
  /** Full track, not just the id — so the docked bar and the inline panel
   *  can render title/cover/duration without re-deriving it from whichever
   *  mock array it came from. */
  activePreviewTrack: Track | null;
  /** Track.artistId has no display name on its own — carried alongside. */
  activePreviewArtistName: string | null;
  /** True only while a global-player source is paused *specifically*
   *  because a preview started — the thing the confirmation modal asks
   *  about. Not the same as "was playing at some point." */
  pausedForPreview: boolean;
  startPreview: (track: Track, artistName: string) => void;
  /** Closing the preview (✕) — the action that can trigger the modal.
   *  Distinct from the preview simply finishing/pausing mid-track, which
   *  should NOT by itself pop the modal — only an explicit close does. */
  closePreview: () => void;
}
```

`closePreview()` itself just clears the preview state — it does **not** decide whether to show the modal. That decision (check `pausedForPreview`, and if true, show `ResumeShowModal` instead of calling `closePreview()` immediately) belongs in the UI layer (`PreviewDockedBar`'s ✕ handler), not the store — "ask the user something" isn't a state-store concern. The modal's own Yes/No handlers are what call `usePlayerStore.getState().resume()` (Yes) or `usePlayerStore.getState().clearPlayer()` (No), then `closePreview()` either way.

---

## 7. Summary

- Preview and global player are **two separate engines with two separate, purpose-built UIs** — not one player with modes, not shared buttons. Confirmed, not just recommended.
- Starting a preview **silently pauses** whatever was playing (unsurprising, no modal needed).
- Stopping a preview does **not** silently auto-resume — that breaks the moment a producer previews more than one track in a row. Instead: closing the preview (✕) **asks once**, only when there's a real paused-for-preview session to resolve.
- "No" fully stops the show rather than leaving it paused — which is *why* the modal never needs to nag twice in the same browsing session, without any extra dismissal-memory state.
- Visually, only **one** bottom-docked bar ever shows — preview takes priority when active, global player otherwise, arbitrated by a small new component that doesn't touch either player's internals.
- **Pausing or letting a track finish does NOT close the preview or trigger the modal** — only the explicit ✕ does. You can pause mid-sample without being asked anything.

---

## 8. Implementation plan — code structure (map for whoever builds/extends this)

### 8.1 The one decision that shapes everything else

Today `TrackWaveformPlayer.tsx` owns its **own local `<audio>`**, re-instantiated in every card/page that uses it. If the new docked bar got its *own separate* `<audio>` on top of that, we'd have **two independent preview engines that don't know about each other** — the exact bug this whole doc exists to prevent, just moved one level down.

**Decision: one shared preview engine, two visual skins.** Whether you're looking at the small docked bar or the larger inline panel (used while actively scoring feedback), it's the same underlying `<audio>`, same state, same track. Mirrors how the global player already separates its engine (`usePlayerAudioEngine.ts`) from its skins (`PlayerExpandedBar` / `PlayerFab`) — same mental model for both players, so working on one transfers to the other.

### 8.2 File map

| File | Status | Responsibility |
|---|---|---|
| `lib/store/previewStore.ts` | Extend | Section 6's shape. **Only** what's playing + coordination flags — no UI decisions, no audio element. |
| `components/player/preview/usePreviewAudioEngine.ts` | New | The actual `<audio>` element + play/pause/seek/progress. One instance, mounted once at the root (inside `PreviewDockedBar`, see 8.3). Same shape/spirit as `components/player/global-player/usePlayerAudioEngine.ts` — read that one first if extending this. |
| `components/player/preview/PreviewDockedBar.tsx` | New | The bottom bar from section 5.1 (waveform, PREVIEW label, ✕). Owns mounting `usePreviewAudioEngine`. Renders only when `activePreviewTrack` is set. |
| `components/player/preview/PreviewInlinePanel.tsx` | Rename + refactor of `TrackWaveformPlayer.tsx` | The larger inline waveform block `FeedbackScoreForm` uses. Stops owning its own `<audio>` — reads the same shared engine/store instead, so scoring a track and seeing it in the docked bar is one consistent state, not two. |
| `components/player/preview/ResumeShowModal.tsx` | New | The Yes/No confirmation from section 4.3. Calls `usePlayerStore`'s `resume()` / `clearPlayer()`, then `closePreview()`. |
| `components/player/PlayerSlot.tsx` | New (the "arbiter") | Replaces the direct `<GlobalPlayer />` mount in `app/layout.tsx`. `activePreviewTrack ? <PreviewDockedBar /> : <GlobalPlayer />`. Doesn't touch `GlobalPlayer`'s internals — pure visibility arbitration. |
| `app/layout.tsx` | One-line swap | `<GlobalPlayer />` → `<PlayerSlot />`. |

### 8.3 Decisions locked in while planning this (so they don't drift during implementation)

- **The docked bar persists across navigation.** Since it's now root-mounted (like the global player always has been), the old "preview stops if you navigate away" behavior (from the original version of this doc, when preview was still page-scoped) no longer applies — corrected here.
- **Pausing or a track finishing does not remove the bar or ask anything.** Only the ✕ does. The bar can sit there paused indefinitely; that's fine, matches how the global player bar itself already behaves when paused.
- **Every place that wants to trigger a preview only ever calls `startPreview(track, artistName)`.** Callers don't need to know about the engine, the docked bar, or the modal — that's the whole point of centralizing this. Today's callers (Discover cards, `FeedbackScoreForm`) already call the older one-argument version and need the small signature update; anything built later just calls the same function.

### 8.4 Not in this pass — fast-follow, explicitly not blocking

- **Track Detail has no play trigger today** (removed in an earlier pass — see `TrackFeedbackCard.tsx`'s `showPlayer={false}`). Needs a small play button added to `TrackDetailHeader.tsx` (cover art or a dedicated control) calling `startPreview`. Same shared engine, so this is additive once 8.1–8.3 exist — not a redesign.
- **Label track cards** (mentioned in this doc's intro, not built anywhere yet) — same story: once `startPreview(track, artistName)` exists as the one entry point, adding a play button to a label's release row is a small, independent addition.
- **Real audio.** Everything above is built and testable today against the deterministic fake waveform — none of it is blocked on real `audioUrl` values existing. When they do, nothing about this architecture needs to change, only `usePreviewAudioEngine`'s `<audio src>` starts resolving to something real instead of empty.
