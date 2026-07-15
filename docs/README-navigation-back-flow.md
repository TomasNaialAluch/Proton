# Back navigation across Label → Track → Artist → Track → ...

## The report

"If you drill in — a label, then a track, then an artist, etc. —
sometimes Back dumps you at the start. At the very least, if going a level
deeper turns out to be the wrong call, Back from wherever the rabbit hole
ends should still get you back to the label you started at."

Checked it. The report is accurate — here's why.

## How Back currently works

`BackButton` (`components/dashboard/_shared/BackButton.tsx`) takes an
optional `href`. When a page passes one, Back is a deterministic
`router.push(href)`. When it doesn't, Back falls through to
`router.back()` (real browser history), and only as a last resort to a
hardcoded `fallbackHref`.

Track Detail and Artist Detail always pass `href`, sourced from a `?from=`
(or `?via=`) query param set by whoever linked to them:

- Label Detail → Track (`RecentReleasesStrip.tsx`, `RemixOpportunities.tsx`,
  `releases/page.tsx`): `from=/dashboard/labels/{slug}` (or the releases
  page's own path)
- Label Detail → Artist (`roster/page.tsx`, `RosterArtistRow.tsx`):
  `via={slug}` → Artist Detail derives `from` from it
- Artist Detail → Track (`ArtistTrackList.tsx`): `from={artist page path}`
- Track Detail → Artist (`TrackDetailHeader.tsx:44`): `from={track page path}`

Each of these is correct **in isolation** — one hop back always lands
somewhere real, not the generic `/dashboard/labels` list.

## Where it breaks

Every one of those links builds its `from` from **the current page's bare
`pathname`** — never from the full URL it was itself entered with (i.e.
never forwarding its own incoming `?from=`/`?via=`). Concretely,
`TrackDetailHeader.tsx:44`:

```tsx
href={`/dashboard/artists/${a.id}?from=${encodeURIComponent(`/dashboard/tracks/${track.id}`)}`}
```

builds `from` from `track.id` alone — whatever `?from=` got the user to
*this* track page is silently dropped. Same pattern in `ArtistTrackList.tsx`,
`RecentReleasesStrip.tsx`, `RemixOpportunities.tsx`, `releases/page.tsx`.

So the "memory" of where you came from is capped at exactly one hop, no
matter how deep you actually are. Trace a real session:

1. Label (`/dashboard/labels/sudbeat`)
2. → Track1 (`?from=/dashboard/labels/sudbeat`) — Back here works, returns to the label. ✅
3. → Artist (`?from=/dashboard/tracks/track1`, **no `?from=` on that target** — the label leg of the trail is gone)
4. → Back from Artist: pushes `/dashboard/tracks/track1` fresh, with no query string
5. → Back from Track1 now: no `from` param this time, so it falls to `router.back()` — which pops the *actual* browser history entry, landing back on Artist (step 3's page), not the Label. From here it's a two-page ping-pong, not a path back to the label.

And any entry point that skips `from`/`via` entirely (e.g. `TrackDetailHeader.tsx:87`'s label link, `NotificationsPanel.tsx`, Discover's label-name click) breaks the chain outright the moment it's used mid-flow, dropping Back onto the nearest hardcoded `fallbackHref` (`/dashboard/labels`) — which reads to the user as "back to the dashboard," having lost the specific label/track/artist trail entirely.

**Root cause, one line:** the app has a correct *one-hop* back mechanism, applied at every hop, but nothing carries the trail forward past hop one. It's not stateful (`from` is just a query param, deliberately, per `BackButton.tsx`'s own comment about not trusting `router.back()`/history alone) — but it also isn't cumulative.

## The fix

Same mechanism, just made cumulative: instead of each link encoding *only
its own current pathname* into the next `from`, it should encode **the
full current URL, including whatever `from`/`via` it already carries** —
`pathname + search`, not just `pathname`. Then `from` naturally becomes a
chain, url-encoded once per hop:

```
/dashboard/artists/a1
  ?from=%2Fdashboard%2Ftracks%2Ftrack1%3Ffrom%3D%252Fdashboard%252Flabels%252Fsudbeat
```

Each Back click pops exactly one layer of encoding and lands on the exact
previous page, `from` and all — no matter how many entities deep the user
went, unwinding all the way back to the originating label.

Concretely: everywhere a child link is built (the four files above), swap
`pathname` for `pathname + currentSearchString` (already have `useSearchParams()`
in scope on Track/Artist Detail; the label-side link-builders need it added).
`BackButton` and its `href`/`fallbackHref` contract don't need to change at
all — this is purely a "what do we hand it" fix, not a new navigation
primitive.

**Not recommending** a separate client-side nav-stack store (Zustand +
sessionStorage) as an alternative: it would solve the same problem but adds
new state to keep in sync with real URLs, breaks on a hard refresh/deep
link mid-chain, and contradicts the existing `BackButton` design rationale
(deterministic over history-dependent). Chained `from` is strictly more of
the same pattern already in use, not a new one.

## Status — implemented

`lib/utils/navigation.ts` exports `backChainForward(pathname, searchParams)`
— `pathname + '?' + searchParams.toString()` when there's a query string,
just `pathname` otherwise. Every entity/list page now:

1. Reads its own `from` and uses it as `BackButton`'s `href` (falling back
   to the same hardcoded route as before when there's no `from`).
2. Computes `backChainForward(pathname, searchParams)` and hands it to
   every outgoing Track/Artist/Label/releases/roster link as the next
   hop's `from`, instead of building that link from its own bare
   `pathname`.

Touched: `TrackDetailClient.tsx` → `TrackDetailHeader.tsx` (artist + label
links), `ArtistDetailClient.tsx` → `ArtistTrackList.tsx` (track links),
`LabelProfileClient.tsx` → `RecentReleasesStrip.tsx`, `RemixOpportunities.tsx`,
`ArtistRoster.tsx` → `RosterArtistRow.tsx` (track/artist links + the "View
all releases"/"View all roster" links), and `releases/page.tsx` /
`roster/page.tsx` (both ends: read incoming `from`, forward their own
chain to their track/artist links).

Verified in-browser: Label (Sudbeat) → Track (Midnight Run) → Artist
(Naial) → a second Track (Sides) → Back ×3 lands exactly back on Sudbeat,
not on the generic Labels list — the exact case that was broken before.

## Follow-up: the breadcrumb had the same class of bug

After the Back-button fix landed, the report came back with a screenshot:
Label Detail's breadcrumb correctly showed `Dashboard > Labels > Proton
Music`, but Track Detail's breadcrumb collapsed to just `Dashboard >
Midnight Run` — the label was missing.

Different symptom, related but distinct cause. Track/Artist Detail's
breadcrumb was hardcoded to `[Dashboard, {title}]` — it never showed a
label at all, regardless of the fix above (that fix only touched *Back*,
not the breadcrumb). The natural first fix — show the label whenever
`track.labelSlug` resolves to a real label — is *correct but insufficient*:
most tracks in `lib/mock/labelSampleCatalog.ts` don't carry a `labelSlug`
at all (it's one shared sample catalog rendered on every label's page,
documented in that file — only 2 of 5 tracks are tagged, for the remix-
approval demo specifically). "Midnight Run" is one of the untagged ones,
so `track.labelSlug` fixes nothing for the exact case in the screenshot.

**The actual fix:** the breadcrumb doesn't need the track's *intrinsic*
label — it needs *a* label to show, and "the label page you actually
browsed here from" is a perfectly legitimate breadcrumb parent even when
the entity has no fixed owner. `labelSlugFromReferrer` in
`lib/utils/navigation.ts` pulls a label slug out of the `from` chain,
recursively — the immediate referrer isn't always a label page directly
(Track reached via Artist reached via Label, for instance), so it walks
the whole nested `from` chain (the same one `backChainForward` builds),
decoding one hop at a time, until it finds a `/dashboard/labels/{slug}`
segment anywhere in it.

Both `TrackDetailClient.tsx` and `ArtistDetailClient.tsx` now compute
`breadcrumbLabel = <real label> ?? labelSlugFromReferrer(from)` — the real
label always wins when it exists (Label Detail, the Building2 link, remix
gating all still use the track's actual `label`, untouched); the referrer
fallback only fills in the breadcrumb when there's no real label to show.

Verified in-browser at both depths: Label → Track (breadcrumb: `Dashboard
> Labels > Sudbeat > Midnight Run`) and Label → Track → Artist
(breadcrumb: `Dashboard > Labels > Sudbeat > Naial`) — the second one only
works because of the recursive walk, not just the direct-referrer check.

## Second follow-up: Back itself could loop

Reported as "I'm stuck in a loop, look at what I left open and hit Back
repeatedly." Reproduced exactly: Sudbeat → Weightless (track) → Back →
Sudbeat → Back → **bounced forward to Weightless again** → Back → Sudbeat
→ ... an actual infinite 2-page ping-pong, not just a bad destination.

**Root cause:** `BackButton` mixed two incompatible navigation strategies
depending on whether `href` (the `from`-derived deterministic target) was
present:

- `href` present → `router.push(href)`
- `href` absent → `router.back()` (real browser history), falling back to
  `router.push(fallbackHref)` only if history was too short

The push path **adds a new entry** to the real browser history every time
Back is clicked with a known destination — it never removes anything. So
after a few `from`-driven Back clicks, the real history stack has
duplicate entries stacked on top of each other (e.g. `[…, Sudbeat, Track,
Sudbeat]` — the last one pushed by Back itself, not real forward
navigation). The moment the user lands on a page with no `from` of its own
(a root-level Label Detail, most often) and clicks Back there, it falls
through to `router.back()` — which pops the *real* history stack and lands
on whatever's on top of it. Because of the extra pushes, that's usually
the page the user just came from a moment ago, not the page truly before
it. Click Back again and the cycle repeats forever.

**Fix:** one-word change in `BackButton.tsx` — `router.replace(href)`
instead of `router.push(href)` on the deterministic path.
`replace` swaps the current history entry instead of stacking a new one,
so a `from`-driven Back click no longer leaves a duplicate behind for a
later `router.back()` to trip over. The `href`-target logic (still sourced
from each page's own `from` chain) is completely unchanged — only how it
lands in *real* browser history changed.

Verified in-browser: Labels list → Bedrock → track → Back → Bedrock → Back
→ Bedrock again (correct — that genuinely was the previous real page,
same as it displays) → Back → Labels list. No bounce back into the track.
Also re-verified the 4-hop deep chain from the fix above still resolves
identically after this change (Track → Artist → Track → Back ×3 → lands
on Sudbeat) — `replace` only touches how history is recorded, not the
`from`-chain destination logic itself, so nothing regressed.
