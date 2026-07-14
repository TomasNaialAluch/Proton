# Efficiency Considerations — Where to Be Careful as Data Grows

This prototype's mock datasets are small (a handful of contracts, tracks, labels), so almost anything performs fine today. The patterns below are the ones that will actually matter once those numbers are real (hundreds of contracts, thousands of tracks) — captured here so they get built right the first time instead of retrofitted under pressure later.

---

## 1. Pagination today solves rendering, not fetching

`lib/hooks/usePaginatedList.ts`, used across Contracts, Royalties, Performance, Labels Browse, and Discover, only limits how many *already-loaded* items get rendered into the DOM (`.slice(0, visibleCount)`). The full list still has to exist in memory before that hook even runs.

That's the right first fix for the prototype (300 rendered `<li>` elements vs. 300 fetched objects is a real, measurable rendering-cost difference), but once there's a real API behind this, "load more" needs to become a real paginated request — only fetch the next page from the server — not fetch-everything-then-slice-client-side. Otherwise the network/memory cost still scales with the total item count regardless of how many are shown.

## 2. `usePaginatedList`'s reset key is a footgun if copied carelessly

`lib/hooks/usePaginatedList.ts` deliberately takes a `resetKey` (a primitive like `` `${search}-${sortDir}` ``) instead of resetting off the `items` array reference, because callers typically rebuild that array fresh every render (`.filter().sort()`), which would silently reset "load more" back to page 1 right after the button is clicked. This is documented in the hook's own comment — flagged here too since it's an easy mistake to reintroduce if the hook is ever copied or reimplemented elsewhere without reading why it's built that way.

## 3. Field-scoping data by viewer is also an efficiency lever, not just a security one

See `docs/README-security.md`, item 1 (streams/sales access control). The same mechanism that keeps sensitive data away from unauthorized viewers also means it never gets fetched or serialized for viewers who don't need it. A Track Detail page reached from Discover has no use for sales figures — scoping fields by viewer role means less data moved over the wire, independent of who's allowed to see it.

## 4. Client-side search/filter/sort doesn't scale past a small dataset

Contracts, Royalties, Performance, Discover, and Labels Browse all filter/sort the full in-memory array on every keystroke or click — no debounce, no server involvement. Fine for the current mock data sizes (dozens of items at most), but once catalogs are large (a label with hundreds of tracks, a producer with hundreds of contracts), this needs to move to server-side or indexed search rather than re-filtering the whole array client-side on every render.

## 5. `localStorage` has a real size ceiling — don't let it become the drop point for heavy data

Zustand `persist` stores (`labelInboxStore`, `contractsStore`, etc.) write to `localStorage`, which has a small hard limit per origin (typically ~5–10MB in most browsers). Signature images (data URLs) and any future stored blobs/PDFs pushed into a persisted store risk hitting that ceiling as usage grows — a scaling concern independent of, but related to, the security concern already noted in `docs/README-security.md` items 4–5 about the same data. Heavy binary data (signed PDFs, signature images) shouldn't be persisted through this mechanism at all once there's a real backend to store it in instead.

## 6. Derived/computed lists recomputed on every render — fine now, watch as data grows

Patterns like `NotificationsPanel` filtering `contracts` for `pending_signature` on every render, or `labels/submissions/page.tsx` computing `chatIdFor(s)` per row by scanning `mockConversations` each time — cheap today because the arrays involved are tiny. Worth a memoization pass (`useMemo`, or moving the derivation into the store itself) once these arrays are realistically sized, so a re-render doesn't mean re-scanning hundreds of items every time.

---

## The pattern connecting all of this

Almost everything above is the same shape: correct-but-unoptimized when N is small, and a real cost once N is realistically large. None of it needs fixing today — it needs to stay visible so nobody's surprised when "it was fine in the demo" stops being true at real data volume.
