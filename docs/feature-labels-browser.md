# Labels Browser — Design Document

## The Problem

A producer opens the Labels section looking to connect with a label that fits their sound. Proton distributes to 6,000+ labels — and Beatport alone lists 80,000. The current UI is a paginated grid with a genre filter. That's a flat list of thousands of items with one axis of filtering.

**The gap:** a producer cannot meaningfully discover or evaluate a label from a card with a logo and a name. There's no context, no hierarchy, no signal about which labels are worth their attention. The result is paralysis — or worse, they skip the section entirely.

This is exactly the problem Beatport solved for DJs. A DJ doesn't browse 5 million tracks alphabetically. Beatport built a layered environment: genre worlds → editorial curation → charts → individual track context. The DJ always knows where to start and what's relevant.

We need the same mental model for producers discovering labels.

---

## Core Insight

The unit of discovery isn't a label — it's a **genre + label + moment**.

A producer making Melodic Techno doesn't need to know about 80,000 labels. They need to know about the 40–100 labels in their world, ranked by relevance right now. "Right now" means: who's actively releasing, who's open for demos, who's trending.

The browser should answer three questions a producer has when they open it:

1. **Where do I start?** → Genre-first entry, not a flat list
2. **Who matters right now?** → Editorial curation, activity signals
3. **Is this label right for me?** → Rich label profile with enough context to decide

---

## Proposed Architecture

### Level 1 — Entry: Genre World

Replace the current grid-as-homepage with a genre selector as the first screen.

**Layout:** Visual tiles for each electronic genre (30 from Beatport taxonomy). Each tile shows:
- Genre name
- Count of labels in that genre on Proton
- A muted background gradient or representative artwork

A producer clicks "Melodic House & Techno" and enters that genre's world. This collapses the problem from 6,000 to ~150 labels immediately.

**Additionally, above the genre grid:**
- **Featured this week** — 3–4 editorially highlighted labels (horizontal scroll, large cards with artwork)
- **Open for demos** — labels currently accepting submissions (small horizontal strip)
- **New on Proton** — labels that joined recently (signals freshness, opportunity)

---

### Level 2 — Genre View

Once inside a genre (e.g. Tech House), the producer sees:

**Top section — Featured in Tech House**
3 large cards (like Beatport's featured releases section). Each shows:
- Label logo + name
- 1–2 recent release titles
- "Open for demos" badge if applicable
- Quick-submit button

**Middle — Label List**
Sorted by relevance (activity score, not alphabetical). Filters available:
- Demo status: Open / Closed / Unknown
- Activity: Released in last 30 / 90 / 180 days
- Size: Boutique (< 50 releases) / Mid / Established (500+)
- Sub-genre tags within the genre

Each row/card in the list shows more than just a logo:
- Last release date
- Number of releases on Proton
- Demo acceptance status
- 1 recent track title (gives immediate genre/vibe signal)

**Bottom — Labels you've submitted to**
If the producer has submission history, show those labels inline with their status.

---

### Level 3 — Label Profile (enhanced)

The current profile has: logo, name, genres, submit form. That's a starting point. It needs:

**What the label sounds like**
- 3–5 recent releases with playable previews (using the existing audio preview system)
- Top tracks on Proton (by plays or downloads)
- Genre tags + sub-genre description

**Who releases on this label**
- Artist roster (names, links to their profiles)
- "Artists like the producer's style" match indicator (future)

**Demo policy**
- Accepting demos: Yes / No / By referral
- Preferred formats: WAV / MP3
- Response time estimate (if known)
- Genres they prioritize

**Label vitals**
- Founded year
- Total releases on Proton
- Last release date
- Beatport ranking in genre (if available)

**Action**
- Submit demo (existing form, already built)
- Follow label (future — get notified of new releases)
- Similar labels (3 recommendations)

---

## Filtering Strategy

Current: one dropdown for genre.

Proposed filter set (progressive disclosure — simple by default, expandable):

| Filter | Options | Why it matters |
|---|---|---|
| Genre | All 30 Beatport electronic genres | Primary axis of relevance |
| Demo status | Open / Closed / Unknown | Avoids wasted submissions |
| Activity | Last 30d / 90d / 180d / 1yr | Dead labels waste attention |
| Label size | Boutique / Mid / Established | Affects response likelihood |
| Sub-genre | Depends on parent genre | Precision within genre |
| Sort | Trending / Newest release / A-Z / Most releases | Different use cases |

Filters are additive (AND logic). Show active filter count as a badge.

---

## Discovery Mechanics (what replaces "scroll through 6000")

### Trending
An activity score per label: weighted sum of recent releases + Beatport chart positions + demo acceptance rate. Updated weekly. Shows which labels are hot right now, not just historically big.

### Open for Demos
A dedicated fast-path. Producer clicks "Open for demos" → sees only labels currently accepting. This is the highest-intent action in the whole section and should be one click from anywhere.

### Similar Labels
On each label profile: 3 recommendations based on genre overlap + roster similarity + size. Enables the "if you like X, check Y" discovery loop that keeps producers engaged.

### Producer's Radar
A personalized strip on the entry page: labels in the producer's primary genre(s), that are open for demos, that they haven't submitted to yet. Pulls from their submission history and profile genre tags. This is the highest-value surface in the browser.

---

## What We're NOT Doing

- **Not replicating Beatport charts** — Beatport ranks tracks. We rank labels by submission-relevance, not sales.
- **Not building a streaming catalog** — Previews are for context, not a music player. The global player handles full mixes.
- **Not scraping Beatport data** — Label info comes from Proton's own distribution data + what labels self-report.
- **Not infinite scroll on the flat list** — Infinite scroll on 6,000 undifferentiated items is the problem we're solving, not a solution.

---

## Implementation Roadmap

### Phase 1 — Structural (this sprint / connections branch)
- [ ] Genre-first entry page (genre tiles grid replacing the current label grid as homepage)
- [ ] Genre view page (`/dashboard/labels/genre/[slug]`) with label list filtered to that genre
- [ ] Enhanced label cards: add last release date, demo status badge, release count
- [ ] "Open for demos" filter as a prominent toggle (not buried in a dropdown)
- [ ] Sort options: Trending / Newest release / A-Z

### Phase 2 — Discovery layer
- [ ] Featured labels strip on entry (editorially curated or algorithmic)
- [ ] "Open for demos" fast-path strip on entry
- [ ] Activity score per label (last release date as proxy until real data)
- [ ] Similar labels section on label profile

### Phase 3 — Label profile enrichment
- [ ] Recent releases with audio previews
- [ ] Demo policy section (structured fields, label self-reported)
- [ ] Artist roster display
- [ ] "Producer's Radar" personalized strip

### Phase 4 — Real data
- [ ] Replace mock labels with real Proton API data
- [ ] Real demo acceptance status from label settings
- [ ] Real release history from distribution data
- [ ] Beatport chart position integration (if API available)

---

## Mock Data Implications

For Phase 1, mock labels need additional fields:

```ts
interface ProtonLabel {
  // existing
  id: string;
  name: string;
  slug: string;
  genres: string[];
  image?: { url: string };
  artistCount?: number;
  description?: string;

  // new for browser
  releaseCount?: number;          // total releases on Proton
  lastReleaseDate?: string;       // ISO date — drives activity filter
  demoStatus?: "open" | "closed" | "unknown";
  demoGenres?: string[];          // genres the label prioritizes for demos
  featured?: boolean;             // editorial flag for homepage strip
  foundedYear?: number;
  beatportUrl?: string;
}
```

Activity score (computed, not stored):
```ts
function activityScore(label: ProtonLabel): number {
  const daysSinceLast = label.lastReleaseDate
    ? (Date.now() - new Date(label.lastReleaseDate).getTime()) / 86_400_000
    : 999;
  const recency = Math.max(0, 1 - daysSinceLast / 365);
  const size = Math.log10(Math.max(1, label.releaseCount ?? 1)) / 4;
  return recency * 0.7 + size * 0.3;
}
```

---

## Design Principles

**Genre-first, always.** Never present a flat list of all labels. Every entry point should be scoped to a genre or a curated set.

**Signal over noise.** Every label card should give the producer enough context to decide "worth clicking or not" without opening the profile. Last release date + demo status + 1 recent track title is enough.

**Action-oriented.** The goal is a demo submission or a follow. Every page should have a clear next action. Don't let the producer get lost in reading.

**Respect producer time.** A producer who opens Labels has maybe 10 minutes. The UI should surface the 5 most relevant labels for them immediately, not make them scroll through 6,000.
