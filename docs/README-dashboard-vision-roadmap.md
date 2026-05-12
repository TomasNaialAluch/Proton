# Vision and roadmap — artist/producer dashboard

This document summarizes **what we agreed in conversation** and **what’s still missing** so we can read it together and verify the vision matches. It does not replace detailed specs (`dashboard-artists.md`, `README-quick-access.md`); it’s a prioritizable **product checklist**.

**Product UI language:** the public site and the dashboard follow the repo convention: copy in **English**. This README used to be in Spanish as an internal note; it’s now translated to keep the docs consistent.

---

## 1. Persona and context

| Topic | Vision |
|------|--------|
| **Current prototype user** | **Artist / producer** persona (e.g. mock account **Naial**). This is who “opens” the dashboard with the current navigation (Artists, Performance, Royalties, Contracts, Settings). |
| **Explicit clarification** | It must be documented in the repo (and, if desired, very subtly in the UI) that **this shell is the producer view**, not a “label manager only” view. |
| **Label manager (future)** | Not modeled yet. The expectation is a heavier focus on label catalog/roster, metadata and per-platform release windows, aggregated label reporting, contracts, and approval workflows — **different from (or an extension of)** the producer’s “my income / my career” focus. |
| **Data** | Today `mockArtist` / `Artist` do not include `role` or `accountType`. When multi-persona is introduced, it’s worth **typing** that in mocks and types. |

**Checklist**

- [x] Add a paragraph in `docs/dashboard-artists.md` (or the main dashboard README) stating the **producer** persona and that **label manager** is out of scope unless explicitly defined.
- [x] (Optional) **Producer view** chip (orange) in the top-right + prototype views modal — see `DashboardPersonaChip`.
- [ ] (Future) Decide whether label manager is a **separate app**, a **separate route under `/dashboard`**, or the **same layout with role-conditioned navigation**.

---

## 2. “Dashboard” block in the sidebar (primary nav)

| Topic | Vision |
|------|--------|
| **Content** | Keep it **as-is**: Artists, Performance, Royalties, Contracts, Settings. It’s the **canonical view** that opens for the producer and already works well as the primary hierarchy. |
| **Changes** | Do **not** restructure this block unless it’s bug fixes or explicitly agreed improvements. |

**Checklist**

- [ ] None required by the current vision — just don’t mix it with the other blocks.

---

## 3. “Quick Access” (old) vs clear sections (producer / platform / public)

**Current problem:** the *Quick Access* title grouped heterogeneous things: the in-app hub (Shows, Labels, DJ Mixes), listener charts, the public radio surface, and internal tools (Release Links).

**Agreed vision**

| New section (concept) | What goes inside | User intent |
|--------------------------|----------------|------------------------|
| **A — Producer tools** | **Release Links** only. | Promo / links **inside** the panel. |
| **B — Platform** | Shows, Labels, DJ Mixes (in-app hub with copy). | SoundSystem / prototype areas **inside** the dashboard. |
| **C — Public site** | Radio, Shows, Charts, Labels (public routes inside the same app). | Listener / exploration; **exits** the artist dashboard. |

**UI names (English) — brainstorming to finalize**

- Section A: *Producer tools* · *Your tools* · *Promo*.
- Section B: *Platform* (in-app hub for Shows / Labels / DJ Mixes).
- Section C: *Public site* (Radio, Shows, public charts, Labels) — listener charts live at `/charts/...`; artist metrics remain in *Dashboard → Performance*.

**Checklist**

- [x] Rename in `AppSidebar` and `HamburgerMenu` the section that currently says *Quick Access* (or split into two `<div>` blocks with two titles).
- [x] Move **Release Links** into block A (producer tools).
- [x] Keep **Shows / Labels / DJ Mixes** in block B with a title that doesn’t sound like “explore as a listener”.
- [x] Put public **Charts** under **Public site** (not under Platform). *Performance* stays in the primary *Dashboard* nav.
- [x] Update `title` / `aria-label` on links that **exit** the dashboard so they remain clear under the new section title.
- [x] Update `docs/README-quick-access.md` to reflect the new IA (optionally rename the file or add a “History / rename” section).

---

## 4. Shows, Labels, DJ Mixes — public vs management (SoundSystem reference)

**What they are in the reference product (screenshots)**

- **Shows:** radio broadcast management (upload, scheduling); often with onboarding if access is invite-only.
- **Labels:** label management and daily reporting; onboarding for new labels (FAQ, contact).
- **DJ Mixes:** DSP distribution flow (Spotify, Apple Music), Track Stack rules, WAV per-cut, checkboxes, “in development” drafts.

**State in this repo**

- Links from **AppSidebar** and **HamburgerMenu** (Platform): `/dashboard/platform?tab=shows|labels|dj-mixes` → `PlatformHubClient` with tiles and placeholder copy (based on SoundSystem screenshots). **Account** inside the hub links to royalties / settings / profile; the canonical settings entry remains **Dashboard → Settings**.
- **Public site** in the sidebar: `/`, `/shows`, `/charts/progressive`, `/labels` with an “exit dashboard” affordance.

**Mid-term vision**

- Where the product allows it, create true **B2B** routes like `/dashboard/shows`, `/dashboard/labels`, `/dashboard/dj-mixes` (or integrate / SSO into a legacy tool), with **role/permission-conditioned content** (producer invited to a show vs no access, etc.).

**Checklist**

- [ ] Define the final destination for **DJ Mixes** once product/backend exists (B2B route or dedicated public route).
- [x] Phased approach: (1) IA and sidebar naming; **(2) in-dashboard hub** with per-tab explanation (`/dashboard/platform`); (3) real integration or mocked flows.
- [x] Hub copy in English with a clear “prototype / coming soon” tone where applicable; don’t promise a backend that doesn’t exist.

---

## 5. Sign In and Create account (access flow, like public site / SoundSystem)

**Vision**

- Somewhere accessible (public navbar, footer, or `/login`), **Sign In** and **Create account** should live **together**, like the real product: users recognize the same pair as in [soundsystem.protonradio.com](https://soundsystem.protonradio.com/).
- **Sign In:** in the prototype, simulate the flow into the panel (screen + mocked transition to `/dashboard`, no real backend).
- **Create account:** in the real site this is **not** a SoundSystem-only registration; it links to Proton Radio signup. In the prototype, **replicate that behavior**: a clear link to the real signup URL (e.g. `https://www.protonradio.com/create-account`) with copy/tooltip stating it **leaves the prototype** to the official site. No need to implement a registration engine or API in this repo unless the product requires it later.

**Reference — Proton SoundSystem (May 2026 review)**

On [soundsystem.protonradio.com](https://soundsystem.protonradio.com/) the account entry points are:

| Link | Observed destination |
|--------|-------------------|
| **Sign In** | `https://auth.protonradio.com/sign_in?redirect=…` (central Proton auth, redirects back to SoundSystem). |
| **Create Account** | `https://www.protonradio.com/create-account` (signup on Proton Radio main site, not an isolated form inside SoundSystem). |
| Forgot password / username | Pages on `protonradio.com`. |

**Conclusion for our roadmap**

- **Sign In** + **Create account** appear in the same auth area (navbar and/or `/login`), aligned with SoundSystem.
- **Create account** = external link to Proton’s real flow (or the product-defined URL), not necessarily a second “fake registration form” inside the prototype.

**Checklist**

- [x] **Sign In** visible to `/login` (public navbar and drawer).
- [ ] **Create account** in the same strip as Sign in in the public navbar/drawer — **not applicable** in this build (public surface is intentionally minimal; SoundSystem shows both).
- [x] `/login` page: tabs **Sign in** / **Create account**; Sign in sets a demo cookie and enters `/dashboard` (or a safe `callbackUrl`).
- [ ] **Create account** link → `protonradio.com/create-account` from the public UI — pending if we choose an entry point (e.g. docs-only, or a different flow).

**Implementation note:** the public header (`Navbar`, `HamburgerMenu` in `(public)`) only exposes **Sign in** → `/login`. The SoundSystem-like “Sign in / Create account” pair in the bar is a **product goal** in this doc, not the current code state.

**Dashboard gate (prototype):** `middleware.ts` requires the `proton_demo_session` cookie (`lib/auth/demoSession.ts`). Without it, **For Artists** and any route under `/dashboard` redirects to `/login?callbackUrl=…`. After **Continue (prototype)** in the Sign in tab, the cookie is written and navigation proceeds to the destination (only paths under `/dashboard`). **Sign out (demo)** lives at the bottom of **Account Settings** (`/dashboard/settings/account`) and **Artist Profile** (`/dashboard/settings/profile`), not in the primary sidebar.

---

## 6. Consistency with existing documentation

| Document | Action when implementing the above |
|-------------|----------------------------------------|
| `docs/README-quick-access.md` | Rewrite tables and checklist to the new two-section model. *(Done.)* |
| `docs/dashboard-artists.md` | Align “What works (keep)” if it no longer mentions “Quick access with Account”; add producer persona. *(Done.)* |
| `READMEMAIN.md` / `README.md` | Add a line linking to this roadmap if you want visibility from the main index. *(Links added in `README.md` and the Dashboard block in `READMEMAIN.md`.)* |

---

## 7. Executive summary (single read)

1. **Dashboard** (primary nav): **no vision changes** — it’s the **producer** panel.  
2. **Document** that Naial / current mock = **producer persona**; **label manager** view = future / TBD.  
3. **Sidebar:** **Producer tools** (Release Links), **Platform** (hub `/dashboard/platform`), **Public site** (Radio, Shows, public charts, Labels). **Performance** stays under *Dashboard*.  
4. **Long term:** real **management** views for Shows / Labels / DJ Mixes; the current hub is a placeholder until integration or SSO.  
5. **Public auth:** **Sign in** → `/login`; demo gate via cookie + middleware to `/dashboard`; **Sign out (demo)** at the bottom of Account Settings and Artist Profile. See §5.

---

If any part of this list **doesn’t** match your vision, mark the lines to change and we’ll adjust this same file in the next iteration.
