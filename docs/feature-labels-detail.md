# Label Detail Page — Design Document

## Overview

The Label Detail page is the profile of a label — accessible to any producer, regardless of whether that label is currently accepting demos. It serves as the primary decision surface where a producer evaluates fit and takes action.

This is distinct from "Browse": Browse is for discovery. Detail is for evaluation and action.

---

## Implementation Status (as of this doc)

| Section | Status | Notes |
|---|---|---|
| Label Header | ✅ Built | `LabelDetailHeader.tsx` |
| Recent Releases | ✅ Built (sample data) | `RecentReleasesStrip.tsx` — reuses the shared prototype catalog, same tracks on every label |
| Artist Roster (display) | ✅ Built (sample data) | `ArtistRoster.tsx` — names only, no per-artist action yet |
| **Request to collaborate with an artist** | ❌ Not built | No CTA exists on roster entries. Nothing to click. |
| Demo Policy | ✅ Built | `DemoPolicyCard.tsx`, visible whether the label is open or closed |
| Submit demo (label open) | ✅ Built, real flow | `SubmitTrackForm.tsx` — writes to `labelSubmissionsStore`, shows up under Submissions |
| **Submit demo (label closed)** | ⚠️ Not possible by design | The submit form is swapped out entirely for `RequestToConnectForm` — there is no path to attach a track when a label isn't open. See note below. |
| Request to Connect | ⚠️ Built, but not wired up | `RequestToConnectForm.tsx` — the textarea submits into local `useState` only. Nothing is sent, saved, or shows up in Messages. No conversation is created. |
| **Active Contests** | ❌ Not built | No mock data, no UI section, no badge anywhere signals a label is running a contest. |
| **Remix Opportunities** | ❌ Not built | Same — no data model, no section, no CTA. |
| Similar Labels | ✅ Built (mock) | `SimilarLabels.tsx` — genre-overlap only |
| Follow label | ❌ Not built | Listed in the roadmap, not started |

**Read this before demoing the page:** the only things that actually go anywhere are the demo submission form when a label is open (it lands in Submissions, same as before) and Browse/genre navigation. Everything else on a closed label's page — the intro form, and everything described below for contests/remix/collab — is either a static mock or literally not present in the UI yet.

---

## The Problem

The current label profile shows: logo, name, genres, and a submit form. A producer has no way to:

- Understand the label's sound and identity before submitting
- Know what kind of artists are on the roster
- See if there are alternative ways to connect (contest, remix, direct introduction)
- Evaluate submission chances based on recent activity
- Act on a label that isn't currently open for unsolicited demos

The result: producers either submit blindly, or skip entirely.

---

## What the Detail Page Does

A producer lands on a label's profile from Browse (genre view or search). The page must answer:

1. **Is this label right for my sound?** — Recent releases, roster, genre description
2. **How can I connect?** — Multiple action paths, not just "submit demo"
3. **What's the label's current state?** — Activity, demo policy, contests, remix opportunities

---

## Sections

### 1. Label Header
- Logo, name, founded year
- Genre tags + short bio (what the label sounds like, who it's for)
- Activity indicator (last release date, total releases on Proton)
- Demo status badge: Open / Closed / By referral

### 2. Recent Releases
3–5 most recent releases on Proton, shown as a horizontal strip:
- Track title
- Artist name
- Release date
- Play preview (uses global player, single track context)

Gives an immediate sonic identity without the producer having to leave the page.

### 3. Artist Roster
List of artists who have released on the label.
- Avatar (initials), name, link to their public producer profile (future)
- Shows breadth and tier of the roster
- Helps a producer self-evaluate fit: "Do I sound like these artists?"
- **Request to collaborate** — each roster entry gets a small CTA (icon button is enough, not a full button) that opens a short form: what kind of collaboration (co-production, remix trade, guest vocal, etc.) + a one-line pitch. This goes to the label as a message tagged with which artist it's about, same inbox as "Request to connect" — the label decides whether to loop the artist in. Producers never message artists directly through this surface; the label mediates, same as every other action on this page.

### 4. Demo Policy
Structured block, label-reported:
- **Accepting demos:** Yes / No / By referral only
- **Preferred genres:** chip list
- **Preferred format:** WAV / MP3 / Either
- **Estimated response time:** if known (e.g. "4–6 weeks", "Responds to all")
- **Notes:** free text from the label (e.g. "No ghost-produced tracks", "Only original work")

Even if the label is currently closed, the policy block stays visible — a producer can read it now and submit later.

### 5. Active Contests
If the label has an active beat/track contest:
- Contest name + description
- Deadline
- Prize or outcome (e.g. "winner gets signed to the label")
- Entry action button

Contests are a lower-barrier entry point than demo submission — great for producers who don't yet have a relationship with the label.

**Where this becomes visible, once built:**
- A small "Contest" badge/pill next to the demo-status badge in `LabelDetailHeader` — this is the only place a producer would currently learn a contest exists, since Browse has no contest surface.
- Optionally, a `FeaturedCard` in Browse could show the same badge so contests are discoverable without opening every label profile — not in the current design, would need a pass on Browse before building.
- A dedicated section on the detail page (below Demo Policy, above the submit/connect form) listing each active contest with its own entry CTA.

### 6. Remix Opportunities
If the label has tracks available for official remix:
- Track title + original artist
- Deadline (if any)
- "Request to remix" CTA → sends a structured request to the label

This creates a second connection path for producers who don't have original material ready but want to build a relationship.

**Where this becomes visible, once built:** a section on the detail page, likely folded into or placed right after Recent Releases (same visual language — track title + artist), each row getting a "Request to remix" button instead of a play button.

### 7. Request to Connect
Available when the label is closed for unsolicited demos but the producer still wants to introduce themselves.
- Producer writes a short intro (why they're relevant, what genre they work in)
- The label receives it as a message, not a demo submission
- Sets expectations: this is not a demo review request, just an introduction

**By design, there is no way to attach a track here.** If a producer on a closed label wants the label to actually hear something, that's a deliberate gap right now — Request to Connect is intro-only. Whether to allow an optional track attachment on the intro (blurring the line with a demo submission) is an open product question, not an oversight; flagging it so it doesn't get "fixed" without a decision first.

### 8. Similar Labels
3 recommendations based on genre overlap, roster size, and activity pattern.
Uses the same discovery loop from Browse: "if you like X, check Y."

---

## Action Hierarchy

From most to least common, in order of UI prominence:

| Action | When available | Entry point |
|---|---|---|
| Submit demo | demoStatus = "open" | Primary CTA, top of page |
| Enter contest | Label has active contest | Highlighted section |
| Request remix slot | Label has open remix tracks | Section with track list |
| Request to connect | demoStatus = "closed" or "unknown" | Secondary CTA below policy |
| Follow label | Always (future feature) | Icon button in header |

---

## Demo Submission Flow (existing, enhanced)

The current submit form stays, but gains:
- **Track selection** from the producer's Proton library (existing)
- **Genre selector** (so the label knows which genre the demo is aimed at)
- **Personalized note** field (free text, optional)
- **File upload** for demos not yet on Proton (existing)

After submission: producer is redirected to Submissions tab with the new entry visible. If the label accepts, a conversation thread opens automatically.

---

## Interface Notes

**Not a streaming page.** The previews are short (30s) — enough to convey identity, not a music player session. The global player handles the rest.

**Accessible when closed.** A closed label profile is fully visible. Producers can read the demo policy, see the roster, and prepare for when it reopens. Only the "Submit demo" button is replaced by "Request to connect."

**Mobile first.** Producers browse labels during free time, often on mobile. The sections should stack cleanly and the action buttons must be thumb-accessible.

---

## Data Model (additions to existing ProtonLabel)

```ts
interface ProtonLabel {
  // existing fields...

  // profile enrichment
  foundedYear?: number;
  releaseCount?: number;
  lastReleaseDate?: string;           // ISO date
  demoStatus?: "open" | "closed" | "unknown";
  demoGenres?: string[];              // genres the label prioritizes for demos
  demoPolicy?: {
    preferredFormat?: "wav" | "mp3" | "either";
    estimatedResponseTime?: string;
    notes?: string;
  };

  // artists
  rosterArtistIds?: string[];         // links to producer profiles

  // discovery
  featured?: boolean;
  beatportUrl?: string;

  // action surfaces
  activeContests?: {
    id: string;
    title: string;
    description: string;
    deadline?: string;
    prize?: string;
  }[];

  remixOpportunities?: {
    id: string;
    trackTitle: string;
    originalArtist: string;
    deadline?: string;
  }[];
}
```

---

## Implementation Roadmap

### Phase 1 — Static enrichment
- [x] Add `foundedYear`, `releaseCount`, `lastReleaseDate`, `demoStatus`, `demoGenres` to mock data and UI
- [x] Demo policy section (structured display, label-reported mock data)
- [x] "Request to connect" as a static form when label is closed — **UI only, submits to nothing.** No store, no conversation created, no message shows up anywhere. Needs its own store (or reuse `labelSubmissionsStore`'s pattern) before it's a real flow.

### Phase 2 — Content
- [x] Recent releases strip (mock track data per label) — same sample catalog on every label, not label-specific yet
- [x] Artist roster section — display only. **Missing:** link to producer profiles (public profiles don't exist yet either), and the "Request to collaborate" CTA described in Section 3 above
- [x] Similar labels (3 recommendations based on genre)

### Phase 3 — Action surfaces (not started)
- [ ] Active contests (mock first, then label-managed) — needs `activeContests` on `ProtonLabel`, a header badge, and a detail-page section
- [ ] Remix opportunity requests (mock first, then label-managed) — needs `remixOpportunities` on `ProtonLabel` and a detail-page section
- [ ] Request to collaborate with a specific artist — needs a CTA per roster entry + a way to tag the resulting message with which artist it's about
- [ ] Follow label (notification when status changes or new release)

### Phase 4 — Make Request to Connect real (new, blocking before any demo)
- [ ] Give `RequestToConnectForm` an actual submit action — either a new lightweight store, or extending `labelSubmissionsStore`/`mockConversations` so an intro creates a conversation the label can see in their inbox
- [ ] Decide whether intro messages can carry an optional track attachment (see note in Section 7)

### Phase 5 — Real data
- [ ] Pull release history from Proton distribution data
- [ ] Label self-manages demo policy, contest, remix slots via label dashboard
- [ ] "Follow" notifications via push or email
