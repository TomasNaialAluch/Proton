# Label-manager section: catalog feedback + artist matching (working name)

## Method

Same as the other two docs in this series
(`docs/label-contracts/label-manager-contracts.md`,
`docs/feature-label-manager-remix-contests.md`) — mirroring a
producer-side page, capturing the spec, not building yet.

## The producer-side feature being mirrored

`docs/feature-feedback-productores.md` (Discover + Feedback): producers
spontaneously leave structured feedback on each other's tracks — 6 bars,
0–10 each (Groove/rhythm, Percussion, Main melody/hook, Synth design, Mix,
Arrangement/structure), plus an optional comment. A track only receives
feedback if its producer opted it in (`openForFeedback`). Feedback is
stored per track, with scores per category.

## What the label side needs — two things named explicitly, plus open invitation for more

### 1. See how the label's own catalog scores

A view where the label can see the feedback their own tracks have
received — presumably aggregated (average per category across the
catalog, or per track), not just a raw feed. This is the label's read
access into data that today only the producer who received it can see
(`(producer)/feedback/page.tsx`'s "Received" list, scoped to `mockArtist`,
the logged-in producer — there's no label-facing view of this at all
right now).

**Gap to resolve:** feedback in the current model is producer-to-producer
and doesn't carry a label reference anywhere (`lib/mock/feedback.ts`'s
shape ties a feedback entry to a track and two producers, not a label).
For a label to "see how their catalog's songs score," feedback records
need to be traceable back to which label the track belongs to — likely
already derivable via the track's existing `labelSlug`, but confirm that
field is populated consistently across both `mockTracks` and `PEER_TRACKS`
before assuming this is a free join.

### 2. Match artists to the label's catalog/average

A way for the label to see which artists (on the platform generally, not
just their own roster) fit their label's typical sound — using either the
feedback score profile of the label's catalog (e.g. "our tracks average
high on Synth design and Mix, low on hooks — who else scores like that")
or the genre/style of what they release, to surface candidates.

**This significantly overlaps with the already-built Scouting page**
(`(label-manager)/scouting`, `docs/feature-label-manager-toolkit.md` item
1) — which already does artist-matching, but purely on genre tags
(`"GENRE FIT"` / `"CATALOG GAP"` badges, static mock reasoning strings).
What's being asked here sounds like a **smarter matching signal** for that
same feature — using real feedback score data instead of/in addition to
genre tags — rather than a second, separate matching feature. Flagging
this the same way as the Contests/Requests overlap in the previous doc:
worth deciding whether this extends Scouting's matching logic or is
meant to be its own distinct view before treating it as new work.

### 3. "Lo que se te ocurra" — additional ideas, not requested but worth having on the table

- **Underperforming-track flagging**: surface which of the label's own
  tracks are scoring low on a specific category (e.g. consistently weak
  Arrangement/structure) — useful for the label to know where an artist
  might need development, or which unreleased tracks in the catalog need
  more work before going out.
- **Score trend over time**: is the label's average catalog score
  improving/declining release over release — a rough proxy for "is our
  roster's craft getting better."
- **Feedback-quality signal for matching, not just score similarity**:
  producers who consistently leave thoughtful, specific feedback on
  tracks in the label's genre might themselves be good scouting
  candidates — the *feedback itself* is a data point about someone's ear
  for the genre, separate from their own tracks' scores.
- **Per-artist rollup inside the roster**: since `(label-manager)/roster`
  already shows KPIs per artist (streams, releases, issues), a feedback-
  score column/rollup there would put "how is this artist's work being
  received by peers" next to the other roster health signals, instead of
  living in a totally separate place.

## Explicitly not decided yet

- Whether this is its own new page/section, or an enhancement to
  Scouting + Roster (the two most likely existing homes).
- Whether feedback needs a label reference added to its data model, or
  whether deriving it via track → `labelSlug` is sufficient.
- Naming — no name proposed yet by either side for this piece.
