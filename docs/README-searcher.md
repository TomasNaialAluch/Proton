# Global search (public area) — redesign proposal

This document proposes **what** to build and **how** to approach the search experience from [protonradio.com](https://www.protonradio.com) in our public Next.js app, without assuming the public API exposes an identical endpoint today.

---

## 1. Reference (protonradio.com)

Observed behavior on the official site (orange header, global search):

| Moment | Behavior |
|--------|----------------|
| **Header input** | Field with magnifier icon, “Search” placeholder, ghost style over the brand bar. |
| **Focus / open** | Large panel (overlay or dropdown) focused on the task: illustration/brand, copy like *“What are you looking for?”*, light background, lots of breathing room. |
| **While typing** | Results **grouped by type**: Artists, Labels, Shows, Tracklists, etc., with counters (badges) and rows with avatar / logo / metadata (*“0 Mixes \| 11 Tracks”*). |
| **More results** | Links like *“More Artists”*, *“More Labels”*, plus a global action *“See all results”*. |
| **Results page** | **Search Results** view with title, side filters (genres, artists, labels, shows, tracklists) and lists with orange **highlight** for the matched term. |
| **Errors** | A notice when the API fails (the real product depends on backend connectivity). |

**For our redesign:** we replicate the **mental hierarchy** (one place to search → entity types → detail / see all), adapting layout and tokens to `--color-accent`, `--color-surface`, and `data-theme` (light / dark) already used in the repo.

---

## 2. Product goals

1. **Single entry point** in the public area: find artists, labels, shows/episodes and — when data exists — tracks / tracklists.
2. **Visual consistency** with `PublicNavbar`, `HamburgerMenu`, and the **light/dark** theme (`useThemeStore` / `PublicThemeToggle`).
3. **Mobile-first while respecting prior decisions:** on mobile, search doesn’t have to live in the fixed bar if you want to save height; it can open from the **hamburger menu** or via a **magnifier icon** that opens an overlay/dedicated page (see §5).
4. **Shareable URLs:** `/search?q=...` (and optionally `&type=artists`) to match the “results page” mental model.

---

## 3. Information architecture

### 3.1 Entities (suggested ordering in results)

1. **Artists** — avatar, name, *mixes / tracks* if we have counts.  
2. **Labels** — square logo, name.  
3. **Shows** (or “Episodes” / “Mixes” depending on copy) — cover, title, date.  
4. **Tracklists** (optional, phase 2) — requires an API or a tracks index.

Alignment with data **already used** in the repo: `fetchLatestMixes` / `ProtonMix`, artists from GraphQL, labels via `lib/api/labels.ts`, etc. Anything that **doesn’t** exist in the public API should be documented as a *gap* (§7).

### 3.2 Flows

- **Route A — Lightweight command palette (dropdown):** when typing in the header input, open a panel under the input with sections and a “See all results” link that navigates to `/search?q=…`.  
- **Route B — Full page:** `/search` with a filters sidebar (like Proton) for refinement when there are many results.

You can implement **B first** (simpler) and then add the predictive dropdown.

---

## 4. UI proposal (components)

Suggested placement in code (tentative names):

| Piece | Responsibility |
|--------|------------------|
| `PublicSearchTrigger` | Magnifier button (optional on mobile) or compact `input` on desktop. |
| `SearchOverlay` / `SearchModal` | Full-screen layer or anchored under the header: large input, empty/loading/grouped-results states. |
| `SearchResultGroup` | Category title + count badge + list. |
| `SearchResultRow` | Variants: `artist`, `label`, `show` (image + title + meta). |
| `SearchPage` | `app/(public)/search/page.tsx` — results with a two-column layout on `lg+` (filters + list). |
| `lib/search/*` | Data layer: `searchPublic(q, filters)` which can be **mock** today or an aggregation of existing calls. |

**Styles:** reuse `text-text-primary`, `bg-surface`, borders via `var(--color-border)`, and accent highlights; in dark mode, use a `bg-surface` overlay and shadow (avoid forcing pure white if the theme is dark).

---

## 5. Desktop vs mobile (recommendation)

| Platform | Proposal |
|------------|-----------|
| **Desktop (lg+)** | Search input in `PublicNavbar` (to the right of the links block or integrated in the center-right), or a magnifier icon that opens an overlay. Consistent with Proton: always-visible bar. |
| **Mobile** | **Option 1 (lowest friction):** a “Search” entry in `HamburgerMenu` that navigates to `/search` or opens a full-screen overlay. **Option 2:** a magnifier icon in the header (like Proton) if you accept a denser top row. **Option 3:** only `/search` linked from menu and footer (no header icon). |

Document the chosen option in implementation so you don’t duplicate entry points.

---

## 6. Technical behavior

- **Debounce** the input (150–300 ms) before calling the network / filtering.  
- **Cancel** previous requests (`AbortController`) when `q` changes.  
- **States:** empty (copy + optional illustration), loading, results, true empty (“No results”), network error.  
- **Accessibility:** `role="combobox"` / `aria-expanded` for dropdowns, focus-trap in modal, **Escape** closes the overlay.  
- **SEO:** `/search` page with optional dynamic `metadata`; results are mostly client-side if search is interactive.

---

## 7. Data and API (technical honesty)

The official site has a **unified search backend**. In this repo, today there is **no** single documented endpoint like `search(query)` under `lib/api/`.

**Phased strategy:**

| Phase | Source | Scope |
|------|--------|---------|
| **MVP** | Aggregate existing calls (`radioMixes`, `labels`, etc.) and **filter client-side** via substring over bounded sets (latest N mixes, loaded labels list). | Good for a demo; doesn’t scale. |
| **MVP+** | Dedicated endpoint in Proton’s backend (if exposed) or a Next **Route Handler** (`app/api/search`) that proxies + caches. | Requires a real contract. |
| **Target** | Search index (Algolia, Meilisearch, or a GraphQL `search` API) | Parity with protonradio.com. |

Record in implementation which phase is active so we don’t promise parity without a backend.

---

## 8. Security and limits

- Sanitize `q` in logs and avoid injecting HTML for highlights (use escaped text or controlled fragments).  
- Rate limit the route handler if you expose a public proxy.

---

## 9. Implementation checklist (suggested order)

1. [ ] Route `app/(public)/search/page.tsx` + read `searchParams.q`.  
2. [ ] Reusable search bar + empty state inspired by the reference (*What are you looking for?* — custom copy).  
3. [ ] MVP data integration (mock or filters over already-loaded data).  
4. [ ] Entry points from `Navbar` (desktop) and `HamburgerMenu` (mobile).  
5. [ ] Predictive dropdown (optional).  
6. [ ] Filters sidebar on the results page (optional, phase 2).  
7. [ ] Replace MVP with a real API once a contract exists.

---

## 10. References in the repo

- Public layout: `app/(public)/layout.tsx`, `components/public/Navbar.tsx`, `components/public/HamburgerMenu.tsx`.  
- Theme: `lib/store/themeStore.ts`, `components/public/PublicThemeToggle.tsx`.  
- Related data: `lib/api/mixes.ts`, `lib/api/labels.ts`, `lib/api/protonApi.ts`.  

---

## 11. Executive summary

**Proposal:** a public search with **URL `/search?q=`**, results **grouped by type** like Proton Radio, **overlay or full page** depending on viewport, **desktop navbar** integration and **mobile via menu (and optionally a magnifier icon)**. Full parity depends on a dedicated **search endpoint** or an external index; until then, an **MVP** with aggregated/filtered data documents the UX and keeps the wiring ready for a real API.
