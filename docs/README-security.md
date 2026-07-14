# Security Considerations — Before This Goes Real

This prototype has no backend: everything lives in client-side mock arrays and `localStorage`. That's fine for a demo, but before any of this handles real user data, the items below need a deliberate, designed answer — not "we'll fix it when we get there." None of these are bugs in a client-only mock prototype; they're the checklist for the moment there's a real server, real accounts, and real other people's data in the same database.

---

## 1. Sensitive performance data (streams/sales) needs server-side field scoping

See `docs/feature-track-detail.md` for the full discussion. Short version:

- Catalog fields (title, genre, bpm, artist, release date) are fine for anyone to see once Track Detail exists — Discover, Label Detail, and Artist Detail all reading the same `Track`.
- Streams, sales, and any future revenue field should be visible **only** to the track's own artist and the label holding distribution rights over it — not to another producer browsing that track from Discover or a label's roster.
- The split has to happen **server-side**: the API decides which fields to return based on who's asking. A frontend that fetches the full object (streams included) and simply doesn't render a `<div>` for it leaks the data to anyone who opens the network tab — that's a curtain, not a lock.
- Today: `TRACK_STREAMS` / `TRACK_SALES` (`lib/mock/performance.ts`) are already separate lookups, which is the right shape — but the base `Track` type (`types/track.ts`) still carries a `streams: number` field directly on the shared object, which is the inconsistency to fix.

## 2. Hardcoded user id in CSV download links (IDOR-shaped pattern)

`app/(dashboard)/dashboard/(producer)/royalties/page.tsx:14` hardcodes `PRO_USER_ID = 67325` and uses it directly in the CSV download URL:

```
https://soundsystem.protonradio.com/statementCSVDownload.php?id=${PRO_USER_ID}&qid=${r.qid}&type=rev_report
```

This is fine today — it's genuinely the user's own real Proton account id, and publishing it was explicitly and repeatedly authorized earlier in this project's history (it's public API data, not a credential). But the **pattern** — trusting an id embedded in a URL rather than deriving the authorized user from a session/token — is exactly the shape of an IDOR (Insecure Direct Object Reference) vulnerability if copied into a real multi-user backend. Once there's real auth, any "fetch my data" request must derive the id from the authenticated session, never from a client-suppliable parameter.

## 3. Conversations/messages have no access control model

`lib/store/labelInboxStore.ts`, `lib/mock/messages.ts` — conversations and messages are plain arrays in a Zustand store, readable/writable by anyone who has that store loaded. Fine for a single-user prototype (there's only ever "me" using it), but once there are real accounts on both sides (producer + label manager), a real backend must enforce that only the two participants of a given `conversationId` can read or write its messages.

## 4. Signatures and signed contracts are sensitive personal/legal data, currently browser-only

`lib/pdf/embedSignature.ts`, `ContractSignClient.tsx` — a person's actual signature (drawn/typed/uploaded image) and the signed PDF it produces are currently:
- generated entirely client-side,
- exposed only as a `blob:` URL that exists only in that browser tab/session,
- never sent to or stored by any server.

This is a known, already-documented prototype limitation (see `docs/label-contracts/contracts-rebuild-plan.md`) — fine for a demo, but a real e-signature flow needs the signed document (and the raw signature image) stored server-side with real access control (only the signer and the counter-signing label should ever be able to retrieve it), plus a real audit trail (who signed, when, from where) that can't just live in `localStorage`.

## 5. Zustand `persist` puts everything in `localStorage`, unencrypted, with no per-user scoping

Every store in this app (`labelInboxStore`, `labelSubmissionsStore`, `labelFollowsStore`, `contractsStore`, etc.) persists to `localStorage` under a fixed key (e.g. `"proton-label-inbox"`). That means: shared by whoever uses that browser (not scoped to a logged-in user), unencrypted, no expiry.

Fine for a single-producer prototype. Before this is multi-user, anything containing real personal/legal data (signatures, contracts, messages) needs to move to real per-user server-side storage. `localStorage` should, at most, cache non-sensitive UI state (sidebar collapsed/expanded, theme) — never be the source of truth for the things listed above.

## 6. Public repo, real credentials — explicitly authorized once, worth re-confirming later

`lib/mock/contracts.ts` contains real access tokens (`cid`/`p` query params) for the user's actual signed Proton contracts, committed to a public GitHub repo. The user explicitly and repeatedly authorized this ("no son credenciales, son de la API pública, subí TODO"). Not flagged here as wrong — just noted so it stays a deliberate, revisit-able decision rather than something that quietly stays public forever without anyone re-checking whether it should, especially if the repo's visibility or the account behind those tokens ever changes.

---

## Rule of thumb

Everything above stops being "fine" the moment there's a real server, real accounts, and other people's real data sharing the same database. Treat this file as that transition's checklist.
