# Feature: Likes, queue & "Start Mix" radio mode

Working document for the public Proton Radio player (`components/player/global-player/`). Captures a conversation-driven design pass — nothing in this doc is built yet.

---

## 1. The idea in one sentence

Add a **heart/like** on shows, a real **play queue** you can build manually or auto-fill, a **"Start Mix" radio mode** that completes the queue with related content (same artist → same genre → random), and a **full-screen "Now Playing" view** (Spotify-style) so the video/artwork can be left big in the background — all wrapped by a **listener profile page** where you can see what you liked and what's queued up.

---

## 2. Why this fits the app

The player already made the product call to keep playback *inside* the app rather than redirect to YouTube (see [player-global-reasoning.md](player-global-reasoning.md)). Likes + queue + radio mode is the natural next layer on top of that: it turns the player from "plays one thing" into "a session you curate," the same shape SoundCloud/Spotify use.

---

## 3. Scope decision: prototype now, real later

This is **a prototype built to be presented** — not a shipped product. Decision, matching how the rest of the app already works (Discover, Feedback, Connections: fully clickable, real state changes, zero real backend):

- **No login, no Firestore writes for this feature.** Likes and queue state live in **`localStorage`**, scoped to the browser/device.
- Unlike a literal do-nothing button, the like toggle **must visibly change and persist across a reload** in that browser — otherwise a live demo looks broken. `localStorage` is the smallest thing that still feels real.
- This doc is written **as if the feature were real** end-to-end, with an explicit "path to real" section (§9) so a future session can lift this straight into production without re-deciding the shape.

---

## 4. Feature 1 — Like

- A heart icon on show/mix cards and in the player bar for whatever's currently playing.
- Tapping toggles liked state, stored in `localStorage` keyed by `mix.id`.
- Feeds the listener profile page (§8): "My Likes" lists every mix currently liked, sourced from that same `localStorage` set.
- **Where cards actually live, confirmed by reading the code**: there is exactly **one** shared card component, `components/public/MixCard.tsx`, reused by both the homepage (`app/(public)/HomeView.tsx`) and the Shows grid (`app/(public)/shows/ShowsView.tsx`). One file to touch for the like button on cards, not several.
- **Important gotcha found in `MixCard.tsx`**: the entire card is the click target — `<article onClick={() => startPlayback(mix)}>` wraps the whole thing, there's no separate "Play" button element to attach to. Any button added *inside* that article (like button, add-to-queue button) **must call `e.stopPropagation()`** in its own `onClick`, or the click will bubble up to the article and also trigger `startPlayback(mix)` — i.e. tapping "like" would also start playing the mix. Same applies wherever the add-to-queue button lands (§5, §7).
- `NowPlayingHero.tsx` (the homepage "Live Now" hero) is a **different** component with its own separate, real `<button onClick={() => startPlayback(mix)}>` (not a whole-section click zone) — a like button there doesn't need the `stopPropagation` workaround, it's just a sibling button.

---

## 5. Feature 2 — Queue

### What already exists
`lib/store/playerStore.ts` already has a `queue: ProtonMix[]` field and a `setQueue()` action — **but it's dead code today**: nothing calls `setQueue`, there's no UI reading `queue`, and when a YouTube video ends, `useYouTubePlayerEngine.ts`'s `onStateChange` handler just calls `pause()` — it never advances to a next item. This feature is filling in a skeleton that's already half-declared, not starting from zero.

### What needs to be built
- **Auto-advance**: when the current mix ends, pop the next item off `queue` and `play()` it, instead of just pausing.
- **A free win discovered while reading the code**: `PlayerExpandedBar.tsx` and `PlayerDashboardMobile.tsx` **already render a "Next" (`SkipForward`) button** in the transport row — but it has no `onClick` at all today, it's a dead/decorative button sitting there. Once `advanceQueue()` exists (step 1), wiring it to this already-visible button is nearly free — no new UI needed for manual skip-forward, only the handler. The matching "Previous" (`SkipBack`) button is also dead, but there's no "history" concept discussed anywhere in this doc — leave it dead for this feature, flagged here only so it isn't confused with something this feature is expected to fix.
- **Queue button on the player bar**: a *new* button (expanded bar and FAB both) that opens a queue list/drawer when tapped — **concept and visual language should match SoundCloud/Spotify's "up next" queue panel**, not something novel. Unlike the Next button above, there is no existing element for this — it's new UI.
- **Add-to-queue affordance on cards**, resolved as follows (this replaces an earlier idea of a blocking "play now vs. queue" modal — decided against, see §10 for why):
  - **Desktop**: only relevant once something is already playing. On hover over a card, show a **second, small icon next to Play** for "add to queue." `MixCard.tsx` doesn't currently have a hover-only Play icon that's separate from the rest of the card (see §4's gotcha — the whole card is one big button with a centered Play icon overlay that fades in on hover); the add-to-queue icon needs to be its own element positioned over that same hover-reveal layer, with its own `stopPropagation`'d click handler, not reusing whatever's already there as-is.
  - **Mobile**: no hover exists, so the "add to queue" icon is **always visible** (small, in a corner of the card, separate tap target from the main play area) rather than hidden behind a gesture.
  - **Rejected alternative**: long-press the card, then drag your finger toward "Play" or "Add to queue" (Instagram-style radial choice). Evaluated and set aside — it introduces a touch gesture that exists nowhere else in this app, needs custom drag-position tracking + a separate accessible fallback anyway, and is real demo risk (any jank reads as "broken" live) for a purely cosmetic upgrade over a plain visible button.

---

## 6. Feature 3 — "Start Mix" (radio mode)

- **Explicit button**, not automatic — the listener presses "Start Mix" from a specific mix. Radio mode never turns itself on.
- **Pressing it does not interrupt what's currently playing.** The mix already playing keeps playing; "Start Mix" only **fills/completes the queue** behind it.
- **Queue-building priority**, in order, until the target queue length is reached:
  1. **Same artist** as the seed mix (highest relevance — you already like this DJ, more of them is the most obviously "related" thing).
  2. **Same genre** as the seed mix. Reuses infrastructure that already exists: the Shows page already filters by genre via routes like `/shows/[genre]` and `fetchLatestMixes(48, genreArg)` (see `app/(public)/shows/ShowsView.tsx`) — no new fetching logic needed, just the same filter applied for queue-building.
  3. **Random fill** from whatever's left, to reach the target count. No duplicates; **excludes the mix currently playing**.
- **Correction after reading `lib/api/mixes.ts`**: `fetchLatestMixes(limit, genre)` is **not mock-only** — it queries the real Proton GraphQL API (`radioMixes`) first, and only falls back to `mockMixes` **inside a `catch`**, i.e. when the real API call throws (offline dev, API down, etc.). This changes the picture from what was assumed earlier in this doc:
  - In a live demo with the real API reachable, "same artist"/"same genre" pools are whatever the real catalog actually contains — likely much richer than the 12-item mock, so the scarcity problem below may not show up at all during a real demo.
  - The scarcity problem is real **only for the offline/fallback path** (local dev without network, or if the API is down) — worth fixing for reliable local development, but not the demo-blocking issue this doc originally treated it as.
  - `resolveGenreFilter()` maps URL genre slugs (`"deep-house"`, `"tech-house"`, etc.) to the exact `Title Case` strings the API expects (`GENRE_SLUG_TO_API_NAME`). The mock catalog's `genre` field already matches that same Title Case convention (`"Progressive"`, `"Deep House"` etc.) — **except** mock mix `id: "3"` uses `genre: "Melodic House"`, which isn't in `GENRE_SLUG_TO_API_NAME`'s list at all (Breaks, Downtempo, Deep House, Electro, Electronica, Progressive, Tech House, Techno). Not a blocker for `buildRadioQueue`'s plain string-equality genre match, but worth knowing if the mock catalog gets expanded (§4 of the task map) — stick to the eight genres the real filter chips already support, or that mix will never surface via any genre-chip-driven flow.
  - The mock catalog is still worth growing a little (more mixes per artist) purely so **offline/fallback development** has something to test "same artist" against — just not with the urgency originally implied here.
- Real API objects, mapped by `mapRadioMixToProtonMix()`, **never set `duration`** (only the mock objects have it hardcoded) — unrelated to this feature, but means `MixCard.tsx`'s duration badge silently won't show for any real-API-sourced mix during a live demo, only for the mock fallback. Noted here since it'll be visible during testing and might otherwise look like a new bug this feature introduced.
- **Open question, not yet resolved**: does "Start Mix" only ever start from one specific seed mix (its card/detail view), or can it also be triggered from an already genre-filtered Shows page (e.g. a general "Start Mix" button on `/shows/techno` that seeds the queue with techno, with no single mix as the anchor)? Needs a decision before building the entry points.

---

## 7. Feature 4 — Full-screen "Now Playing"

Like Spotify's full-screen player: a way to leave the current show playing big/centered — video or artwork as the hero, all transport controls below it — instead of the slim bottom bar. Useful for "I'm done browsing, I just want to watch/listen with this taking the screen."

### Desktop
- An explicit button on `PlayerExpandedBar.tsx` (an expand/maximize icon) toggles into full-screen mode. A visible close/minimize control inside the full-screen view returns to the normal expanded bar.
- Model it as a third value on the existing `PlayerChrome` state rather than a separate flag: `type PlayerChrome = "expanded" | "minimized" | "fullscreen"` (`lib/store/playerStore.ts`). It's the same underlying concept (how much of the screen the player occupies), just one more state.
- **Two hero cases, same shell**:
  - `playbackSource === 'youtube'` → the YouTube iframe is the large, centered hero.
  - `playbackSource === 'audio'` (once real `audioUrl` streams exist, no video) → a hero-sized artwork view instead. **Correction after reading `PlayerArtwork.tsx`**: its existing `sm`/`md`/`lg` sizes are `size-8`/`size-10`/`size-12` — 32px/40px/48px, i.e. small inline thumbnails, not anything close to hero scale. "Add a bigger variant" (as originally noted here) undersold how different this is: a full-screen hero (think 300–500px+) is a materially different visual treatment, likely its own bit of markup rather than a new `PlayerArtwork` size token, even if it reuses the same `mix.artist.image?.url` source.
- Full-screen is a **focus mode you explicitly enter and exit** — it's not something you browse the rest of the site behind (that's what minimized/FAB and the expanded bar already cover). This keeps the "unblocked navigation" principle from [player-global-reasoning.md](player-global-reasoning.md) intact: full-screen is an opt-in overlay, not a new default state.

### Mobile
No separate full-screen button — the standard mobile pattern (Spotify, Apple Music, YouTube Music) is that **tapping the mini-bar/FAB itself opens the same full-screen Now Playing view directly**, swiping down (or a close/chevron-down button) to collapse back to the mini-bar/FAB. On a phone-sized screen there's not enough room for a meaningful in-between "expanded but not full-screen" state the way there is on desktop, so the mobile FAB's "expand" and desktop's separate "full-screen button" converge into the same one destination on mobile.

### Two real problems found while reading `GlobalPlayer.tsx` — both must be handled, not optional polish

`GlobalPlayer.tsx`'s `GlobalPlayerLoaded` currently decides what to render with a plain binary:
```tsx
{dashboardMobileUi ? (
  <PlayerDashboardMobile />
) : playerChrome === "expanded" ? (
  <PlayerExpandedBar />
) : (
  <PlayerFab />
)}
```
1. **Missing third branch.** Extending the `PlayerChrome` type to include `"fullscreen"` (as planned above) does nothing on its own — this ternary has no branch for it. Setting `playerChrome` to `"fullscreen"` today would silently fall into the `else` and render `<PlayerFab />` instead of any full-screen view. This ternary **must** gain an explicit `playerChrome === "fullscreen" ? <PlayerFullscreen /> : ...` branch as part of step 11, or the feature quietly does nothing.
2. **Remount risk that would restart the video — the more important one.** The same component computes:
   ```tsx
   const surfaceKey = dashboardMobileUi ? "dm" : playerChrome === "minimized" ? "fab" : "bar";
   // ...
   <GlobalPlayerLoaded key={`${currentMix.id}-${playbackSource ?? "none"}-${surfaceKey}`} mix={currentMix} />
   ```
   `key` changing forces React to unmount and remount `GlobalPlayerLoaded` — which re-runs `useYouTubePlayerEngine`/`usePlayerAudioEngine` from scratch, destroying and recreating the YouTube `YT.Player` instance. **Confirmed by reading `useYouTubePlayerEngine.ts`: a fresh `YT.Player` always starts unstarted, there is no seek-to-last-position logic anywhere** — so today, toggling expanded ↔ minimized *already* restarts YouTube playback from 0 every time (a pre-existing behavior, not introduced by this feature — flagged here only so it isn't mistaken for a new regression once discovered during testing). If `"fullscreen"` is bucketed as its own distinct `surfaceKey` value, entering/exiting full-screen would carry the exact same problem — restarting the video every time — which directly defeats the point of this feature ("leave the video playing, big, in the background").
   - **Required fix, part of step 11**: bucket `"expanded"` and `"fullscreen"` under the *same* `surfaceKey` value (both are "not minimized, not dashboard-mobile"), e.g. `playerChrome === "minimized" ? "fab" : "bar"` unchanged in meaning, just confirming `"fullscreen"` falls into the `"bar"` bucket too rather than getting its own. That keeps the `key` stable across expanded ↔ full-screen transitions, so no remount, so playback continues uninterrupted — the entire reason this feature is worth building.
   - The pre-existing expanded ↔ minimized remount/restart behavior is a separate, already-existing issue — worth a mental note, not something this feature needs to fix, since nothing here asked for that.
3. **Scope note on `PlayerDashboardMobile.tsx`**: this is a *third*, separate mini-player surface used specifically when browsing `/dashboard` on a small screen (`dashboardMobileUi = pathname.startsWith("/dashboard") && isMaxLg`) — it has its own dead `SkipBack`/`SkipForward` buttons too, mirroring `PlayerExpandedBar.tsx`. Everything in this doc is scoped to the **public radio site** (§2) — worth an explicit decision before step 11 whether full-screen (and likes/queue/Start Mix in general) should also reach a listener browsing the producer dashboard on mobile, or stays public-site-only. Defaulting to public-site-only unless told otherwise, since the producer dashboard is a different persona/context than "a listener enjoying a session."

---

## 8. Listener profile page (new — doesn't exist today)

There is currently **no listener-facing profile page** on the public site. (`[artist-name]/ArtistProfileView.tsx` is the public profile of an *artist*, a completely different thing — viewing an artist's page, not "my account as a listener".) There is already a "signed in on the public site" demo-session cookie (`PUBLIC_DEMO_SESSION_COOKIE`, `lib/auth/demoSession.ts`) with nothing behind it yet — this feature is the first thing that would actually use that session concept for something.

The new page needs:
- **My Likes** — every mix currently liked (read from the `localStorage` like set).
- **Queue** — the current play queue (could live here, and/or as the player-bar drawer from §5 — same underlying `queue` state either way).

---

## 9. Path to real (for whenever this leaves prototype stage)

Kept here so a future session doesn't have to re-derive the shape from scratch.

- **Auth**: replace `PUBLIC_DEMO_SESSION_COOKIE` with real listener accounts (this app already has Firebase wired for the dashboard side — same project could back public listener auth).
- **Data model** (Firestore, sketch):
  - `likes`: `{ userId, mixId, createdAt }` — one doc per like, or a `likedMixIds: string[]` array on a `users/{userId}` doc if the like list stays small.
  - `queues`: `{ userId, items: mixId[], updatedAt }` — one doc per user, current queue snapshot.
  - `plays` (optional, only if "same artist / same genre" radio logic should evolve into real recommendations later): a play-history log to eventually train or weight a real recommender, instead of the rule-based artist→genre→random order this prototype uses.
- **Recommendation engine**: the rule-based order in §6 is intentionally not machine learning — it's a sequence of filters. That's fine indefinitely; only worth revisiting if/when there's enough real listening data to make a learned recommender meaningfully better than the simple rules.

---

## 10. Design decisions already made in conversation (for reference)

- **Persistence**: `localStorage`, not Firestore, for the prototype (§3).
- **Radio mode activation**: explicit button, not automatic-when-queue-empties.
- **Queue-vs-play-now interaction**: resolved via **direct buttons** (hover icon on desktop, always-visible icon on mobile) — **not** a blocking modal. A modal was the first idea discussed and discarded once the hover-icon pattern (already used in Discover) turned out to cover the same need without interrupting casual browsing.
- **Start Mix selection**: artist → genre → random, not pure shuffle, so relevance is visible sooner (§6).
- **Full-screen player**: modeled as a third `PlayerChrome` value (`"fullscreen"`), entered via an explicit button on desktop and via tapping the mini-bar/FAB on mobile (§7).

---

## 11. Task map — what needs to be built, file by file

Checklist form. Do the queue plumbing first (step 1) since likes and radio mode both build on the same "state that persists in localStorage" pattern it establishes.

### `lib/store/playerStore.ts`
- [ ] Extend `PlayerChrome` to `"expanded" | "minimized" | "fullscreen"`.
- [ ] Add `addToQueue(mix)`, `removeFromQueue(mixId)` actions.
- [ ] Add `advanceQueue(): ProtonMix | null` — shifts and returns the next mix, or sets `isPlaying: false` and returns `null` if empty. **Does not call `play()`/`startPlayback()` itself** — see the circular-import note in step 1 of §12. The caller (in `useYouTubePlayerEngine.ts`) decides how to start it.

### `lib/player/startPlayback.ts`
- [ ] Add an optional `{ auto?: boolean }` param to `startPlaybackAsync`/`startPlayback`. When there's no stored YouTube playback preference *and* `auto` is true, default to the `"mini"` branch instead of calling `setYoutubeChoiceMix` (no user gesture to anchor a choice modal to during an automatic advance).

### `components/player/global-player/useYouTubePlayerEngine.ts`
- [ ] In `onStateChange`, when `e.data === 0` (ended): call `advanceQueue()`; if it returns a mix, call `startPlayback(next, { auto: true })` to actually start it.

### `components/player/global-player/PlayerExpandedBar.tsx` + `PlayerDashboardMobile.tsx`
- [ ] Wire the existing, already-rendered "Next" (`SkipForward`) button's `onClick` to `advanceQueue()` (+ `startPlayback` per above if it returns something) — it's currently a dead button with no handler at all, this is a small addition once step 1 lands, not new UI. Leave "Previous" (`SkipBack`) dead — no history-stack concept exists in this doc.

### `lib/player/likes.ts` — new file
- [ ] `localStorage`-backed helpers: `isLiked(mixId)`, `toggleLike(mixId)`, `getLikedMixIds()`. Mirror the pattern already used in `lib/player/youtubePreference.ts` (small read/write helpers around one storage key).

### `lib/player/queueStorage.ts` — new file, or fold into `playerStore.ts`
- [ ] Persist `queue` to `localStorage` so it survives a reload. Store **mix ids**, not full `ProtonMix` objects (avoids staleness if the real API's data for that mix changes) — rehydrate against `fetchMixById`/the mock catalog on load.

### `lib/player/startMix.ts` — new file
- [ ] `buildRadioQueue(seedMix, allMixes, targetCount)`: returns an ordered list per the artist → genre → random priority in §6, excluding the seed mix and without duplicates. `allMixes` should be sourced from `fetchLatestMixes` (the real API path) at call time, not only `lib/mock/mixes.ts` — see the correction in §6 about the real API already being the primary data source.

### `components/public/MixCard.tsx`
- [ ] Add `LikeButton` and `AddToQueueButton` inside the card, **each with `e.stopPropagation()` in its own `onClick`** — the whole `<article>` already has `onClick={() => startPlayback(mix)}`, so without stopping propagation, tapping either new button would also start playback (see §4/§5's gotcha). This one file covers both the homepage and Shows grid, since both already reuse it.
- [ ] Add a "Start Mix" action (button or menu item, same stopPropagation requirement) that calls `buildRadioQueue` then `addToQueue()` for each result, without touching current playback.

### `components/public/NowPlayingHero.tsx`
- [ ] Add `LikeButton` next to its existing real `<button>` (this one doesn't need the stopPropagation workaround — Play here is already its own sibling button, not a whole-section click zone).

### `components/player/global-player/` — new components
- [ ] `PlayerQueueButton.tsx` — *new* button (no existing element to repurpose, unlike Next/Previous above) on `PlayerExpandedBar.tsx` and `PlayerFab.tsx` that opens the queue drawer.
- [ ] `PlayerQueueDrawer.tsx` (or modal/panel) — lists `queue`, SoundCloud/Spotify-style. Remove-from-queue per item.
- [ ] `LikeButton.tsx` — heart icon, reusable on cards and in the player bar; uses `lib/player/likes.ts`.
- [ ] `AddToQueueButton.tsx` — the small secondary icon described in §5 (hover-gated on desktop, always-visible on mobile).

### New route: listener profile page
- [ ] Create the public listener profile page (§7) — "My Likes" (reads `lib/player/likes.ts`) and current queue (reads `playerStore`).
- [ ] Decide navigation entry point: likely gated behind `PUBLIC_DEMO_SESSION_COOKIE` (only shown/reachable once "signed in" on the public site), consistent with how the dashboard gates on its own demo session.

### `lib/mock/mixes.ts`
- [ ] Grow the catalog somewhat (§6) — mainly benefits the **offline/fallback path** (`fetchLatestMixes`'s `catch` branch), since the real API is the primary data source during a live demo. Keep any new `genre` values within the eight the real genre-filter chips already support (`Breaks`, `Downtempo`, `Deep House`, `Electro`, `Electronica`, `Progressive`, `Tech House`, `Techno`) — mock mix `id: "3"`'s `"Melodic House"` is already an outlier not in that list, don't add more like it.

### `components/player/global-player/GlobalPlayer.tsx` — critical, full-screen won't work without these two changes
- [ ] Add an explicit third branch to `GlobalPlayerLoaded`'s render ternary: `playerChrome === "fullscreen" ? <PlayerFullscreen /> : ...`. Without this, setting `playerChrome` to `"fullscreen"` silently falls into the existing `else` and renders `<PlayerFab />` instead — the type extension alone (above) does nothing on its own.
- [ ] **Do not** let `"fullscreen"` become its own bucket in the `surfaceKey` computation (`dashboardMobileUi ? "dm" : playerChrome === "minimized" ? "fab" : "bar"`). `surfaceKey` feeds `GlobalPlayerLoaded`'s `key` prop — a changed `key` remounts the component and destroys/recreates the YouTube `IFrame` player from scratch (confirmed: a fresh `YT.Player` always starts unstarted, there's no seek-to-last-position logic). `"fullscreen"` must fall into the same `"bar"` bucket as `"expanded"` so toggling between them never changes `key`, never remounts, never restarts the video — otherwise entering full-screen would restart whatever's playing, defeating the feature's whole point. (Separately, and not something this feature needs to fix: expanded ↔ minimized already has this remount/restart behavior today — pre-existing, unrelated to this change.)
- [ ] `PlayerFullscreen.tsx` — new component rendered when `playerChrome === "fullscreen"`: large centered hero (YouTube iframe or a new hero-sized artwork treatment depending on `playbackSource` — `PlayerArtwork.tsx`'s existing sizes top out at 48px, too small to reuse as-is, see §7) + transport/seek/volume/quality/queue controls below, mirroring `PlayerExpandedBar.tsx`'s controls at larger scale.
- [ ] Add the expand/full-screen toggle button to `PlayerExpandedBar.tsx` (desktop).
- [ ] On mobile, wire tapping `PlayerFab.tsx` (both the artwork tap and the `ChevronUp` button, which today both call `setPlayerChrome("expanded")`) to call `setPlayerChrome("fullscreen")` instead, gated on `useIsMaxLg()` so desktop FAB clicks keep going to the normal expanded bar.
- [ ] Close/collapse control inside `PlayerFullscreen.tsx` (desktop: back to expanded bar; mobile: swipe-down or a chevron-down back to FAB).
- [ ] **Scope decision needed before this step**: `PlayerDashboardMobile.tsx` (the separate mini-player used specifically on `/dashboard` mobile) is not touched by any of the above — confirm whether full-screen (and the feature generally) is meant to reach a listener browsing the producer dashboard too, or stays public-site-only (default assumption in this doc, see §7).

---

## 12. Build order — step by step

The task map in §11 is organized by file; this section is the same work organized as **one sequence**, with concrete implementation detail per step, so nothing gets built out of order, reinvented differently from what already exists, or forgotten.

### Step 1 — Extend `playerStore.ts`

**File:** `lib/store/playerStore.ts`. Nothing else in this feature can be wired up until this lands — every later step calls into these actions.

- Extend the type: `export type PlayerChrome = "expanded" | "minimized" | "fullscreen";` (was `"expanded" | "minimized"`). No new action needed to *enter* fullscreen — the existing `setPlayerChrome(chrome)` already accepts any `PlayerChrome` value, so `setPlayerChrome("fullscreen")` just works once the type includes it.
- Add three actions to the `PlayerState` interface and its implementation:
  ```ts
  addToQueue: (mix: ProtonMix) => void;
  removeFromQueue: (mixId: string) => void;
  /** Shifts the next mix off the queue and returns it (or null if empty) — does
   *  NOT start playback itself, see the circular-import note below. */
  advanceQueue: () => ProtonMix | null;
  ```
  ```ts
  addToQueue: (mix) => set((s) => ({ queue: [...s.queue, mix] })),
  removeFromQueue: (mixId) =>
    set((s) => ({ queue: s.queue.filter((m) => m.id !== mixId) })),
  advanceQueue: () => {
    const { queue } = get();
    if (queue.length === 0) {
      set({ isPlaying: false });
      return null;
    }
    const [next, ...rest] = queue;
    set({ queue: rest });
    return next;
  },
  ```
- **Circular-import constraint, found while implementing**: playback source (`audio` vs `youtube`, tab vs. mini, the choice modal) is *not* decided inline where `play()` is called today — it's centralized in `lib/player/startPlayback.ts`'s `startPlaybackAsync(mix)`. That module already imports `usePlayerStore` from `playerStore.ts`, so `playerStore.ts` **cannot** import `startPlayback.ts` back without creating an import cycle. Resolution: `advanceQueue()` stays a pure store action (shift the array, return the next mix or `null`) — the *caller* decides how to start it. That caller is step 2's `useYouTubePlayerEngine.ts`, which already sits outside the store and can freely import both modules.
- Separately, `startPlaybackAsync`/`startPlayback` (`lib/player/startPlayback.ts`) need a small addition: an optional `{ auto?: boolean }` param. Without a stored YouTube playback preference, a *manual* click correctly opens the tab-vs-mini choice modal — but an *automatic* advance has no click to anchor a modal to, so with no stored preference and `auto: true`, default straight to the `"mini"` branch instead of calling `setYoutubeChoiceMix`. Implemented as `const effectivePref = pref ?? (opts?.auto ? "mini" : null);` in place of the old direct `pref` checks.
- `clearPlayer()` already resets `queue: []` — no change needed there.

**✅ Implemented** (`lib/store/playerStore.ts`, `lib/player/startPlayback.ts`).

### Step 2 — Auto-advance on track end

**File:** `components/player/global-player/useYouTubePlayerEngine.ts`, inside `onStateChange`. Was: `onStateChange: (e) => { if (e.data === 0) usePlayerStore.getState().pause(); }`. Now: on `e.data === 0` (YouTube "ended" state), call `advanceQueue()`; if it returns a mix (queue wasn't empty), call `startPlayback(next, { auto: true })` (imported from `lib/player/startPlayback.ts`) to actually start it, respecting the `auto` behavior from step 1. If the queue was empty, `advanceQueue()` already set `isPlaying: false` — same end state as the old `.pause()` call, so behavior is unchanged when nothing's queued.

**Bonus found in the same pass, cheap to include here**: `PlayerExpandedBar.tsx` and `PlayerDashboardMobile.tsx` both already render a "Next" (`SkipForward`) transport button with **no `onClick` at all** — a dead button. Wiring it to `advanceQueue()` + `startPlayback(next, { auto: true })` (same call as above, just user-triggered instead of triggered by the video ending) is a couple of lines once this step lands, not new UI. "Previous" (`SkipBack`) stays dead — no history-stack concept exists anywhere in this doc.

**✅ Implemented** (`components/player/global-player/useYouTubePlayerEngine.ts`).

### Step 3 — Persist the queue to `localStorage`

**File:** new `lib/player/queueStorage.ts`, same shape as `lib/player/youtubePreference.ts` (a `STORAGE_KEY`, a `readXxx()`, a `writeXxx()`). Store an array of **mix ids**, not full `ProtonMix` objects (avoids stale cached titles/artwork if mock/API data changes later) — on load, re-hydrate ids against whatever mix list is available (mock array today, a real fetch later). Wire reads/writes into `addToQueue` / `removeFromQueue` / `advanceQueue` in step 1 so persistence isn't bolted on after the fact.

### Step 4 — Grow `lib/mock/mixes.ts` (lower urgency than originally thought)

**Correction after reading `lib/api/mixes.ts`**: `fetchLatestMixes` hits the **real Proton GraphQL API first** and only falls back to `mockMixes` inside a `catch` (API unreachable). During an actual live demo with network access, `buildRadioQueue`'s artist/genre pools come from the real catalog, not this 12-item file — so this step mainly matters for **offline local development**, not for making the live demo look convincing.

Still worth doing, just lower priority than earlier drafts of this doc implied: add enough mixes that (a) at least 3–4 artists have 2+ shows each (today only Andy Green does, everyone else has exactly one), and (b) genre variety is wide enough that "same genre" filtering returns a handful of results. **Keep new `genre` values inside the eight the real genre-filter chips already support** (`Breaks`, `Downtempo`, `Deep House`, `Electro`, `Electronica`, `Progressive`, `Tech House`, `Techno` — see `GENRE_SLUG_TO_API_NAME` in `lib/api/mixes.ts`); mock mix `id: "3"`'s `"Melodic House"` is already an outlier not in that list, don't add more like it.

### Step 5 — Likes storage

**File:** new `lib/player/likes.ts`, mirroring `youtubePreference.ts`'s read/write-around-one-key pattern:
```ts
const STORAGE_KEY = "proton-liked-mixes";
export function getLikedMixIds(): string[] { /* read + JSON.parse, [] on failure */ }
export function isLiked(mixId: string): boolean { /* getLikedMixIds().includes(mixId) */ }
export function toggleLike(mixId: string): boolean { /* add/remove + write; returns new liked state */ }
```
Independent of the queue work in steps 1–4 — can be built in parallel.

### Step 6 — `LikeButton.tsx`

**File:** new `components/public/LikeButton.tsx` — confirmed by reading the code that `components/public/MixCard.tsx` is the one shared card (used by both the homepage and Shows grid), so this belongs alongside it rather than inside the player folder. Reads `isLiked(mix.id)` for initial state, calls `toggleLike(mix.id)` on tap, heart fills/outlines accordingly. Wire onto: `MixCard.tsx` (**with `e.stopPropagation()`** — the whole card is already one big `onClick={() => startPlayback(mix)}`, see §4), `NowPlayingHero.tsx` (no stopPropagation needed there, Play is already its own separate button), and the player bar for `currentMix`. This is the first visibly demoable piece of the whole feature.

### Step 7 — `AddToQueueButton.tsx`

**File:** new `components/player/global-player/AddToQueueButton.tsx`. Needs step 1's `addToQueue` to exist. `MixCard.tsx` doesn't have a separate hover-only Play element to piggyback on — the whole card fades in one centered Play icon on hover (see §4's gotcha) — so this button needs to be its own absolutely-positioned element inside that same hover layer, with its own `stopPropagation`'d `onClick`, only rendered on desktop when `usePlayerStore.getState().currentMix` is non-null. Mobile: always rendered, small, in a card corner, separate tap target from the main play area (per §5).

### Step 8 — `PlayerQueueButton.tsx` + `PlayerQueueDrawer.tsx`

**Files:** new components in `components/player/global-player/`. Button goes on both `PlayerExpandedBar.tsx` and `PlayerFab.tsx`; opens a drawer/panel listing `queue` (from the store, now persisted per step 3) — title, artist, artwork thumbnail per row, a remove (✕) action calling `removeFromQueue(mixId)`, SoundCloud/Spotify visual language (not a bare unstyled list).

### Step 9 — `lib/player/startMix.ts` (`buildRadioQueue`)

```ts
export function buildRadioQueue(
  seedMix: ProtonMix,
  allMixes: ProtonMix[],
  targetCount: number
): ProtonMix[] {
  const pool = allMixes.filter((m) => m.id !== seedMix.id);
  const sameArtist = pool.filter((m) => m.artist.id === seedMix.artist.id);
  const sameGenre = pool.filter(
    (m) => m.genre === seedMix.genre && !sameArtist.includes(m)
  );
  const rest = pool.filter(
    (m) => !sameArtist.includes(m) && !sameGenre.includes(m)
  );
  const shuffledRest = [...rest].sort(() => Math.random() - 0.5);
  return [...sameArtist, ...sameGenre, ...shuffledRest].slice(0, targetCount);
}
```
`allMixes` should be sourced from `fetchLatestMixes` at call time (the real, larger catalog), not only `lib/mock/mixes.ts` directly — per the §6 correction, the mock file is a fallback the fetcher already handles internally, `buildRadioQueue` doesn't need its own separate mock/real branching. Against the raw 12-mix mock (only relevant if the real API is unreachable), this degrades to "mostly random," which step 4 addresses for that fallback path specifically.

### Step 10 — Wire "Start Mix" onto cards/detail views

Calls `buildRadioQueue(seedMix, allMixes, targetCount)` then `addToQueue()` for each result, in order — **does not** call `play()` or touch `isPlaying`/`currentMix`, per §6 ("pressing it does not interrupt what's currently playing"). Lands on `MixCard.tsx` alongside steps 6–7, same `stopPropagation` requirement. Before or during this step: resolve the open question from §6 — does "Start Mix" only ever anchor to one specific seed mix, or can it also fire from an already genre-filtered Shows page with no single seed (in which case `buildRadioQueue` would need a genre-only mode, skipping the "same artist" tier entirely since there'd be no seed artist).

### Step 11 — Full-screen player

The step with the most real risk in this whole plan — two changes in `GlobalPlayer.tsx` are **not optional polish**, skipping either one breaks the feature outright (see §7 for the full explanation):

1. `GlobalPlayerLoaded`'s render logic needs a third branch for `playerChrome === "fullscreen"` — today it's a binary `expanded ? <PlayerExpandedBar /> : <PlayerFab />`, so `"fullscreen"` would silently render the FAB instead of doing anything.
2. The `surfaceKey` that feeds `GlobalPlayerLoaded`'s `key` prop **must** bucket `"fullscreen"` together with `"expanded"` (not as its own value), or entering full-screen remounts the whole player subtree and restarts the YouTube video from zero — confirmed by reading `useYouTubePlayerEngine.ts` (a fresh `YT.Player` always starts unstarted, nothing seeks back to the prior position). This is the single most important correctness detail in this entire doc: get it wrong and the headline feature ("leave the video playing, big, in the background") does the opposite of what it's for.

Once those two are safe: build `PlayerFullscreen.tsx` (hero is the YouTube iframe or a new hero-scale artwork treatment — `PlayerArtwork.tsx`'s existing sizes cap at 48px, not reusable as-is for a hero), add the toggle button to `PlayerExpandedBar.tsx` (desktop), and change `PlayerFab.tsx`'s two `setPlayerChrome("expanded")` call sites to `setPlayerChrome("fullscreen")` when `useIsMaxLg()` is true (mobile only — desktop FAB clicks should keep going to the normal expanded bar). Independent of steps 5–10; can be built in parallel any time after step 1's `PlayerChrome` extension lands. Before starting: decide whether `PlayerDashboardMobile.tsx` (the separate `/dashboard`-mobile mini player) is in scope too, or this stays public-site-only (default assumption).

### Step 12 — Listener profile page

New route + page. "My Likes" section reads `getLikedMixIds()` (step 5) and resolves them against the mix catalog for display; "Queue" section reads `queue` from the store (steps 1 + 3). Naturally last among the data-producing steps since it's a read-only surface over everything above. Decide the `PUBLIC_DEMO_SESSION_COOKIE`-gated entry point (§8) as part of this step.

### Step 13 — End-to-end pass

Walk the full flow once on desktop and once on mobile: like a mix → Start Mix → check the queue drawer → let a track auto-advance → open full-screen and **confirm playback did not restart** (the step 11 risk, worth a dedicated explicit check, not just an incidental observation) → open the profile page and confirm likes/queue match what was done. This is where step 1's `startPlayback` vs. raw `play()` decision, and step 9's genre/artist-pool sizing from step 4, actually get proven out together rather than in isolation.
