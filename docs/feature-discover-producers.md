# Feature: Discover producers (open feedback, cross-label)

Working document. Complements [feature-feedback-productores.md](feature-feedback-productores.md): that doc defines **what happens** once feedback exists (how it looks, how it's notified, how it's returned). This doc defines **how you get there**: discovery.

> Replaces the earlier approach in this same doc (a directory scoped to a single label's roster, with directed requests). Discarded — see section 8.

---

## 1. The idea: "a Spotify" for feedback between producers

In one word: **Spotify**. A discovery surface **crossing labels** — not scoped to one label's roster — where a producer browses artists/producers from any label and listens to tracks.

The key difference from exposing the entire catalog: **only tracks each producer explicitly marked as public for feedback are visible**. It's not "the whole label is visible to everyone"; it's opt-in **per track**, decided by the producer who owns/is credited on that track. That solves the exposure problem for copyrighted masters without needing a label boundary — the limit isn't organizational (same label), it's about **consent** (this track yes, this track no).

---

## 2. What changes compared to the previous model

| | Previous version (discarded) | New version |
|---|---|---|
| Scope | Same-label roster | Cross-label, platform-wide |
| What's visible | The producer's full catalog (within the label) | Only tracks marked "open for feedback" by their owner |
| Flow direction | Directed request: A picks B and asks them to review A's track | Spontaneous: anyone browsing can leave feedback on an open track, without the owner asking that specific person |
| Who controls exposure | The label boundary (structural) | The producer, track by track (explicit opt-in) |

This resolves, in favor of the **free/spontaneous** model, the open question left pending in [feature-feedback-productores.md](feature-feedback-productores.md) (section 9): explicit request or free? Here the answer is free, but mediated by the track owner's opt-in (it's not "feedback whatever you want from anyone without permission").

---

## 3. Where it lives in the UI

**Its own item in the sidebar, above Feedback.** It's not a tab inside `/dashboard/feedback` (that was the initial idea back when this was still thought of as a directory of people scoped to a label) — being a cross-label, "browse music" type feed, it deserves its own place, and it comes first because it's the natural entry point: you discover a track → you leave feedback → that feeds `/dashboard/feedback`.

- Menu item: **Discover** (the same term Spotify uses for this kind of surface — clear and consistent with the metaphor).
- Route: `/dashboard/discover`
- Sidebar position: right above **Feedback**, inside the primary section (`Artists, Performance, Royalties, Contracts, Discover, Feedback, Settings`).

---

## 4. Who marks a track as "open for feedback"

- The **producer credited on that track** marks it (not the label manager) — it's their decision to expose that specific track to the cross-label community.
- It's a per-track flag, e.g. `openForFeedback: boolean`, not something at the producer or whole-label level.
- Lives as a toggle in the producer's view over **their own tracks** (their catalog, or a new section like "Tracks open for feedback" where they manage which ones are open). To be defined whether this lives inside `/dashboard/feedback` or in the producer's existing catalog view.
- Default: **closed** (`false`). Nothing gets exposed unless the producer actively decides to.

---

## 5. Flow

1. Producer A marks one or more of their tracks as **open for feedback**.
2. Producer B (from any label, not necessarily the same one as A) enters **Discover** (`/dashboard/discover`).
3. B browses — by producer, or directly through a grid/feed of open tracks (more "Spotify": browsing music, not a directory of people). See section 6.
4. B listens to one of A's tracks (with the same no-download player already built) and leaves feedback.
5. A gets notified that they received feedback from B (same mechanism already built in `NotificationsPanel`).
6. A can return feedback to B on one of B's tracks, as long as **B also has it marked as open** (if B has nothing open, there's no way to return feedback yet — this naturally pushes returning feedback to incentivize opening up your own tracks).

---

## 6. Discovery UI (draft)

Closer to a music grid/feed than a directory of people — the metaphor is "Spotify", not "LinkedIn":

- **Feed/grid of open tracks**: cover art, title, producer, genre, maybe BPM. Click → enters that track's feedback view (the same one that already exists).
- **Filters**: by genre (makes sense in electronic music — progressive, melodic house, etc.), maybe by BPM/key if there's enough volume.
- **Producer view** (optional, when browsing from the feed): a simple profile with only their open tracks — never their full catalog.
- No "request feedback from someone specific" in this flow — that's resolved differently (see open question).

---

## 7. Open questions

- **Do both models coexist?** Directed feedback (asking a specific person) and spontaneous feedback (anyone feedbacks what's open) aren't mutually exclusive. The spontaneous feed could be the main mode, with an additional, more private 1:1 way to request feedback from a specific person on a track that isn't open to the public yet. To decide whether it's worth it for v1 or whether to ship only the open mode.
- **Exposure cap**: how many tracks can a producer have open at once? Or no limit?
- **Exposure window**: does a track stay open indefinitely, or does it have a window (e.g. "open for 2 weeks while finishing production")?
- **Quality/spam of spontaneous feedback**: since it's open to anyone (not a chosen peer), is some filter needed on who can leave feedback (e.g. only producers with a certain activity level on the platform) to avoid bad-faith feedback?
- **Volume for the feed to make sense**: a Spotify-style feed needs enough open catalog to not feel empty — how do you incentivize producers to open up tracks (gamification, a requirement to be able to request feedback, etc.)?

---

## 8. Why the previous approach (same-label roster) was discarded

The first version of this doc proposed scoping the directory to the same label's roster, mirroring the organizational boundary that already exists for the label manager (see [README-dashboard-label-manager.md](README-dashboard-label-manager.md)). It was replaced because:

- It heavily limited the universe of producers you can interact with (only your own label).
- Per-track opt-in exposure achieves the same security goal (not exposing copyrighted masters without permission) without needing the label boundary — in fact it's more precise, because it protects track by track instead of "all or nothing" at the label level.
