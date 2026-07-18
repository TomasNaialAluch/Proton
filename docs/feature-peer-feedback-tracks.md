# Peer feedback tracks — fixing "review your own track" and API-readiness

## The bug

Feedback's "Pending to review" showed **your own track** as something
another producer (Vesna) supposedly wanted you to review. Confirmed in
`lib/mock/feedback.ts`: `mockPendingToReview`'s single entry pointed
`trackId` at `"2"` — "Living (Original Mix)," credited to `naial`
(the logged-in producer) in `lib/mock/tracks.ts` — with a comment
admitting it: `// Living (standing in for a peer's track in this
prototype catalog)`. There was no real Vesna track anywhere in the mock
data, so the placeholder reused your own track id rather than leaving it
broken outright.

Root cause: `mockTracks` (`lib/mock/tracks.ts`) is explicitly and only
"the logged-in producer's own catalog" — used everywhere in the app on
that assumption (Performance, Royalties, Track Detail's self-check via
`mockArtist.id`, etc.). Peer-to-peer feedback fundamentally needs the
opposite: a track that belongs to *someone else*. No such pool existed.

## The fix

**New data**: `lib/mock/peerTracks.ts` — `PEER_TRACKS: Track[]`, real
tracks credited to the Feedback peers already named elsewhere in the app
(`lib/mock/feedback.ts`'s `peers` — Lume, Darko, Vesna, the same
identities Connections also references). `mockPendingToReview`'s entry
now points at `"peer-vesna-1"` ("Afterglow," Vesna's own track, real BPM/
key/genre) instead of your own catalog.

**Also checked whether the rest of the code is actually ready for a real
API here** (the second half of the ask) — it wasn't, for a related
reason: `feedback/page.tsx` and `feedback/[id]/page.tsx` imported
`mockTracks`/`mockReceivedFeedback`/`mockPendingToReview` **directly**,
bypassing the `lib/api/` abstraction layer this app already uses
elsewhere (`lib/api/tracks.ts`'s `fetchTracks()`, called via
`useQuery` in `DashboardContent.tsx` — the documented pattern in
`ARCHITECTURE.md`: "cuando se conecte la API real, se reemplaza
únicamente la capa `lib/api/` sin tocar los componentes"). Feedback's
pages didn't follow that pattern at all — swapping in a real backend
would have meant rewriting the page components themselves, not just one
central file.

**Fixed to match the established pattern**:
- `lib/api/feedback.ts` (new) — `fetchReceivedFeedback()` /
  `fetchPendingToReview()`, same simulated-delay-then-mock shape as
  `fetchTracks()`.
- `lib/api/tracks.ts` — added `fetchTrackById(id)`, checking both
  `mockTracks` and `PEER_TRACKS`. A real `GET /tracks/:id` wouldn't care
  which "pool" a track came from; resolving by id alone (not "my tracks
  only") is the correct shape for a request that's specifically about
  someone else's track.
- Both Feedback pages rewritten to call these through `useQuery`
  (matching `DashboardContent.tsx`'s exact pattern:
  `useQuery({queryKey, queryFn})`), with `Skeleton` loading states
  instead of assuming the data is already there synchronously.

## Verified in-browser

"Pending to review" now shows "Afterglow — Requested by Vesna," and
opening it shows Vesna's real track info (123 BPM, A min, Melodic House
& Techno) — not a repeat of anything in your own catalog. "Received"
(feedback from Lume/Darko on your own tracks, e.g. "Emotional Damage")
still resolves correctly — that side was never broken, it already
pointed at your own catalog correctly.

## Status

Implemented and verified.
