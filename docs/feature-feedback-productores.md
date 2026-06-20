# Feature: Feedback between producers

Working document for a new dashboard feature: producers giving each other structured feedback on their tracks, with notifications and replies.

---

## 1. Core idea

A producer can request/receive **feedback** on one of their tracks from another producer. Whoever receives the feedback gets notified. Feedback can, in turn, be returned alongside the receiver's own track (producer ↔ producer exchange).

If a producer has received feedback from several people and hasn't returned any of it, they can still see all of it — viewing received feedback doesn't depend on having returned anything.

---

## 2. Where the tracks come from

**Producers don't upload the tracks that get feedbacked.** These are tracks already loaded into the system by **label managers** — real copyrighted material (the same tracks managed elsewhere in the dashboard: releases, royalties, etc.), not demos or informal material a producer uploads to ask for an opinion.

This has implications:

- The producer picks, from the label's existing catalog, which other producer's track to give feedback on (or is assigned one) — there's no file upload in this flow.
- Anti-download security (section 6) isn't a "nice to have": these are masters with real copyright, not disposable content. It needs the same care as the rest of the catalog's protected assets.
- BPM/key (section 5) most likely already exists as track metadata in the label manager's catalog, rather than something to detect/fill in again in this specific feedback flow — to confirm against the current track data model.

## 3. Flow

**Resolved**: feedback is **spontaneous, not requested**, and crosses labels — see [feature-discover-producers.md](feature-discover-producers.md) for the full discovery design. Flow summary:

1. Producer A marks one or more of their tracks as **open for feedback** (explicit opt-in, per track).
2. Producer B (from any label) browses the discovery feed, finds an open track from A, listens to it, and fills out the feedback form (bars + optional comment) — without A having requested anything from B specifically.
3. Producer A receives a **notification** ("B left feedback on *Track name*").
4. Producer A opens the feedback. They can:
   - Leave it as is.
   - Return feedback to B on one of B's tracks, as long as B also has it marked as open (if B hasn't opened anything, there's no way to return feedback yet).
5. If A has feedback from several people and hasn't returned any of it, they can still see all of it without restriction — "viewing" isn't gated by "returning".

---

## 4. Feedback view (UI)

- **Top**: the full track, with its waveform (the whole "wave").
  - Plays in the browser (in-page player).
  - **Cannot be downloaded** — see the security section.
  - Visible metadata: **key** and **BPM**.
- **Bottom**: horizontal bars from **0 to 10**, one per category. Designed specifically for **electronic music**, blending genre and the track's concept. Defined categories (6):
  1. **Groove / rhythm** — how it feels to move to, the swing/feel.
  2. **Percussion** — drum design and mix.
  3. **Main melody / hook** — how memorable the central idea is.
  4. **Synth design** — sound selection, textures, sound design.
  5. **Mix** — balance, clarity, space between elements.
  6. **Arrangement / structure** — tension, builds, drops, how the track evolves.

  "Originality" is left out of the bars (in electronic music, groove and synth design carry more weight) — if it needs to be captured, it goes in the free-text comment, not as a bar.
- Space for a free-text comment, optional or required — to be decided.

---

## 5. Track metadata (BPM / key)

Since the tracks come from the label manager's catalog (not producer uploads, see section 2), BPM and key most likely already exist, or should exist, as catalog-level track metadata — not something to detect/fill in within this specific feedback flow. Two approaches, not mutually exclusive, but to be resolved on the label manager's side:

- **Auto-detection** when the track is loaded (audio analysis, BPM/key detection libraries). Cleaner but not always accurate, especially on tracks with tempo/key changes.
- **Manual**: whoever loads the track (the label manager) fills in BPM and key.

Suggestion: auto-detect as an editable default — show the detected value but allow correcting it by hand. The feedback view simply **reads** that data, it doesn't manage it.

---

## 6. Security / no-download

There's no such thing as "impossible to download" that's 100% true on the web (if audio plays, it can be recorded outside the browser), but casual downloading can be made harder:

- Stream the audio (don't serve the full file in a single request) using range requests.
- Short-lived signed URLs instead of a direct public URL to the file.
- Don't expose a native `<audio>` element with the browser's own download controls — build a custom player UI.
- Consider an audio watermark or inaudible watermark if leak traceability matters (might be overkill for v1).

**Set expectations with the user**: this reduces download friction, it doesn't eliminate it. Since these are real copyrighted masters (not demos), this section should be treated as a requirement, not an optional v2 improvement.

---

## 7. Access from the producer's UI

**Notifications**: there's already a bell with a dropdown panel (`components/dashboard/NotificationsPanel.tsx`) with mock notifications (release approved, royalties available, streams trending up, pending contract, release rejected). A new `feedback_received` type is added to that same panel ("B left feedback on *Track name*"), which navigates straight to that track's feedback view on click. No new notifications page is needed, it plugs into the existing pattern.

**Menu**: the sidebar (`components/dashboard/AppSidebar.tsx`) has a primary section with Artists, Performance, Royalties, Contracts (routes under `app/(dashboard)/dashboard/(producer)/`). **Feedback** goes there, as a sibling of those items — it's a core producer activity, not a secondary tool or an account preference (it doesn't belong under "Producer Tools" or Settings).

- Menu item: **Feedback**
- Route: `/dashboard/feedback`
- Folder: `app/(dashboard)/dashboard/(producer)/feedback/`

---

## 8. Data model (draft)

To be defined alongside the Firestore architecture already used in the dashboard ([dashboard-artists.md](dashboard-artists.md), [player-global-reasoning.md](player-global-reasoning.md)). Likely entities:

- `feedbacks`: id, trackId, fromProducerId, toProducerId, scores (category → 0-10 map), comment, createdAt, returnedFeedbackId (optional, if this is a reply to another feedback).
- `notifications`: id, userId, type (`feedback_received`), refId (feedbackId), read, createdAt.
- `trackId` references an existing track from the label manager's catalog (no new track is created in this flow) — confirm whether it already has `bpm`/`key` fields or whether they need to be added to the track model.
- The track model also needs an `openForFeedback: boolean` flag (default `false`), controlled by the credited producer — see [feature-discover-producers.md](feature-discover-producers.md) section 3.

---

## 9. Open questions

- Do the spontaneous mode (section 3) and a 1:1 directed-request mode coexist for tracks that aren't open to the public yet? See [feature-discover-producers.md](feature-discover-producers.md) section 6.
- Bar categories: fixed across all genres, or configurable?
- Free-text comment: required or optional?
- Can the same track be feedbacked more than once by the same producer?
- Is moderation/reporting needed for offensive feedback?
- Does the producer who receives feedback see who left it, or is it anonymous?
