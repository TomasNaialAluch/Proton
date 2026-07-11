# Feature: Producer Matching (human connection from feedback data)

Working document. It builds on data that already exists or is planned in [feature-feedback-productores.md](feature-feedback-productores.md) (the 0-10 score bars) and in [feature-discover-producers.md](feature-discover-producers.md) (the cross-label feed of open tracks). It does not replace either of them: it uses them as a source of signal.

---

## 1. The idea

Thanks to Feedback and Discover, the platform will already have two signals per producer:

- **Scores**: how they scored others and how they were scored, in each category (groove, percussion, melody/hook, synth, mix, arrangement) across their own tracks and others'.
- **Genre/metadata**: which genre the tracks they upload and give feedback on belong to.

If two producers show **sustained affinity** in those signals — similar scores between them (not necessarily high, but *consistent*, e.g. both strong in synth design and weak in arrangement) and presence in the same genre — the platform can infer they'd make a good pairing and **proactively suggest it**, instead of waiting for them to discover each other by browsing Discover on their own.

This is not romantic matchmaking or a public "best producers" ranking: it's a one-off, private collaboration suggestion, based on patterns the producer can't necessarily see for themselves (cross-referencing their own data against thousands of other users' data).

---

## 2. Guiding principle: don't be intrusive

This is what needs the most care in the design, because it's easy for it to feel like "the app is stalking me" or like notification spam.

Hard rules:

- **Mandatory double opt-in.** The platform suggests → each producer accepts or declines individually → the chat only opens if **both** said yes. Neither of them knows whether the other has already answered until both have responded (like a match, not a direct request).
- **Declining is free and silent.** If A declines, B never finds out a proposal existed. There's no "so-and-so declined you."
- **Limited frequency.** This isn't a continuous feed of suggestions. Start with a low cap (e.g. 1 active suggestion at a time, a new one only once the previous one is resolved or expires) so it doesn't compete with Feedback notifications or get perceived as noise.
- **Explainable, not a black box.** The proposal always shows *why* it's being suggested ("you both scored strongly on synth design and both work in progressive house"), not just "you have a match." This lowers the sense of intrusion: the producer understands what data was used.
- **Reversible.** There has to be a "I don't want to receive this kind of suggestion" option in Settings, without having to disable Feedback or Discover (these are signals that get used, but the feature itself is independently opt-out).

---

## 3. Where the signal comes from (relationship to Feedback and Discover)

```
Discover (cross-label feed)
   → exposes which tracks are open and what genre they're in
Feedback (0-10 bars + comment)
   → generates, for each pair (A gives feedback to B), a score vector
        ↓
   Match Engine (this feature)
   → cross-references score vectors + track genre/metadata
   → looks for pairs of producers with sustained affinity (not a single
     data point, but a pattern across several tracks/exchanges)
   → generates a "Connection proposal"
        ↓
   Notification to both (same mechanism as NotificationsPanel)
   → if both accept → a 1:1 chat opens
```

Key points in this chain:

- The match **is not computed from a single, one-off feedback**, but over a window of several exchanges — a single data point (one song scored similarly) is noise, not signal. A minimum number of tracks/exchanges needs to be defined before considering a pair "matchable" (to be defined, see section 6).
- It's **agnostic of who gave feedback to whom**: A and B don't need to have given each other feedback to match. It can arise from both having (separately) given feedback on similar third-party tracks, or from their own tracks having received similar scoring patterns.
- It works **cross-label**, just like Discover — the boundary isn't organizational, it's about signal/data.

---

## 4. Where it lives in the UI

- **It's not a new sidebar section.** Unlike Discover and Feedback, this isn't something the producer "goes looking for" — it's something that comes to them. It lives as a **notification** inside the existing `NotificationsPanel.tsx`, with a new type: `connection_suggested`.
- Clicking the notification → opens a **modal or dedicated view** (`/dashboard/connections/[id]` or a modal over the current screen) with:
  - Why it's being suggested (short explanation, see section 2).
  - Minimal data about the other producer (name, genres, label — not their full catalog, same privacy criteria as Discover).
  - Two buttons: **Connect** / **No, thanks**.
- If they accept, it stays in a "waiting for the other to respond" state (without indicating how much is left or who the bottleneck is).
- When both accept, the **chat** opens — a new, minimal section: `/dashboard/messages` or similar, a simple list of 1:1 conversations. (If a messaging system already exists or is planned elsewhere in the dashboard, this feature should reuse it instead of creating a parallel one — to be confirmed against the rest of the product.)
- If one declines, the proposal silently disappears for both (see section 2).

---

## 5. Data model (draft)

Continuing the pattern from [feature-feedback-productores.md](feature-feedback-productores.md) section 8:

- `connectionSuggestions`: id, producerAId, producerBId, reason (text or a structure like `{ sharedGenres: [...], scoreAffinity: {...} }`), status (`pending` | `accepted_by_a` | `accepted_by_b` | `matched` | `rejected` | `expired`), createdAt.
- `notifications`: reuses the existing entity, new `type: 'connection_suggested'`, `refId` pointing to `connectionSuggestions`.
- `conversations` / `messages`: if these don't already exist in the dashboard, a new minimal entity: `conversations` (id, participantIds, createdAt) + `messages` (id, conversationId, fromUserId, text, createdAt).
- The **Match Engine** doesn't need to persist anything new from Feedback/Discover — it reads `feedbacks` (scores) and `tracks` (genre, `openForFeedback`), which are already defined in those features, and runs as a separate process (batch/cron, not real-time) that writes to `connectionSuggestions` when it finds a pair.

---

## 6. Open questions

- **"Sustained affinity" threshold**: how many tracks/exchanges minimum before suggesting a match? Does affinity mean *similar* scores (same profile of strengths/weaknesses) or *complementary* ones (one strong where the other is weak, e.g. one good at synth design and the other at arrangement)? It's probably worth supporting both match types with distinct labels ("similar" vs "complementary").
- **How matching is actually calculated**: score-vector similarity (cosine, Euclidean distance) + genre overlap as a pre-filter? Defining this is product/data work, not just UI — this doc doesn't solve the algorithm, only the data contract and the experience.
- **Frequency and expiration**: how often does the Match Engine run? Do pending proposals expire if nobody responds (e.g. 2 weeks)?
- **Minimum platform volume**: with few users/tracks, matching will be poor or repetitive — does it make sense to only activate this feature past a certain data threshold (amount of feedback exchanged on the platform)?
- **Messaging**: does a dashboard chat already exist or is one planned for another purpose (label manager ↔ producer, for example)? If so, it's better to unify rather than create a parallel messaging system just for this feature.
- **Success metrics**: how do we measure whether this "works" without being intrusive? (e.g. mutual acceptance rate, rate of "I don't want this" being enabled, messages sent post-match) — to know whether to adjust the threshold/frequency.
