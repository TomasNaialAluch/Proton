# Proton — SoundSystem Redesign

> **Portfolio project** — Frontend redesign of [Proton Radio](https://www.protonradio.com/) and [SoundSystem](https://soundsystem.protonradio.com/), built as a demonstration piece for a **Junior Frontend Developer** position.

**Author:** Tomás Naial Aluch — Electronic music producer on Proton Radio. The redesign is based on first-hand experience using the platform as an artist, which provides real insight into the pain points and UX opportunities that a regular developer wouldn't have.

This project combines a **B2B admin dashboard** (artist management, contracts, royalties) with a **B2C streaming platform** (radio, shows, charts). Built with a modern stack focused on performance, code quality, and scalability.

**Product / dashboard vision:** [`docs/README-dashboard-vision-roadmap.md`](docs/README-dashboard-vision-roadmap.md) — producer persona, sidebar *Producer tools* / *Platform*; public auth: Sign in → `/login` (prototype tabs).

---

## What this project demonstrates

| Skill | How it's shown |
|---|---|
| **Next.js App Router** | Route groups `(public)` and `(dashboard)`, SSR for artist profiles |
| **TypeScript** | Typed data models for tracks, royalties, contracts |
| **Component architecture** | Reusable UI components with clear separation of concerns |
| **Design system** | Custom token-based palette and typography applied consistently |
| **State management** | Zustand for the global audio player |
| **Data fetching** | TanStack Query for dashboard metrics and tables |
| **Real-world context** | Redesign based on actual usage as a Proton Radio artist |

---

## Technology stack

### Core

| Technology | Role | Why |
|---|---|---|
| **Next.js** (App Router) | Main framework | Native SSR, SEO for public artist profiles, efficient routing |
| **TypeScript** | Language | Type safety is critical when modeling royalties and contracts |
| **Tailwind CSS** | Styling | Consistent design system, dark mode, responsive mobile-first development |

### Data & State

| Technology | Role | Why |
|---|---|---|
| **TanStack Query** | Server state | Automatic caching for contracts and metrics; avoids unnecessary refetches |
| **Zustand** | Client state | Global audio player state; lightweight, uninterrupted across navigation |

### UI & Visualización

| Technology | Role | Why |
|---|---|---|
| **Lucide React** | Icons | Minimal, lightweight, dark-mode friendly |
| **Recharts / Tremor** | Charts | “Spotify for Artists”-style performance metrics, easy to customize |

---

## Reference sites

| Site | URL | Description |
|---|---|---|
| **Proton Radio** (current) | [protonradio.com](https://www.protonradio.com/) | Public area — live radio, shows, charts |
| **SoundSystem** (current) | [soundsystem.protonradio.com](https://soundsystem.protonradio.com/) | Private artist dashboard — track uploads, contracts, royalties |

> The redesign **unifies both sites** under a single domain and a shared authentication system.

---

## Page structure

> **Language:** the platform is 100% **English** — Proton Radio is an international electronic music community.

### Public Area — `proton.radio` (Radio B2C)
Accessible to listeners and fans without an account. SSR-optimized for SEO.

| Route | Page | Status | Description |
|---|---|---|---|
| `/` | Home | ⬜ Blank | Live player + latest news and recent episodes |
| `/shows` | Shows | ⬜ Blank | Schedule grid and episode archive |
| `/charts` | Charts | ⬜ Blank | Top 100 tracks by genre (Melodic, Progressive, etc.) |
| `/labels` | Labels | ⬜ Blank | Directory of labels associated with Proton |
| `/[artist-name]` | Artist Profile | ⬜ Blank | Public bio + discography (e.g. `/naial`) |

---

### Private Area — `/dashboard` (SoundSystem B2B)
Requires authentication. Management panel for artists and producers.

| Route | Page | Status | Description |
|---|---|---|---|
| `/dashboard` | Home | ⬜ Blank | Artist profile, circular photo, quick access (Upload, Mixes) |
| `/dashboard/performance` | Performance | ⬜ Blank | Stream graphs, sales and listener heatmap |
| `/dashboard/releases` | Releases | ⬜ Blank | Uploaded tracks list with publication status |
| `/dashboard/contracts` | Contracts | ⬜ Blank | Signing timeline and pending contracts |
| `/dashboard/royalties` | Royalties | ⬜ Blank | Accumulated balance, payment history and payout settings |
| `/dashboard/settings` | Settings | ⬜ Blank | Personal details, contact info and account preferences |

---

### Global Components (Site-wide)

| Component | Description | Applies to |
|---|---|---|
| **Navbar** | Adapts based on context: public radio or private dashboard. Includes a **"For Artists"** button that links to `/login` → `/dashboard` | Entire site |
| **Global Player** | Persistent player — never interrupted while navigating | Entire site |
| **Auth Module** | Single login for listeners and artists | `/login`, `/register` |

---

## Project architecture (Next.js App Router)

```
proton/
├── app/
│   ├── (public)/                   # Group: public radio area
│   │   ├── page.tsx                # / — Home with live player
│   │   ├── shows/
│   │   │   └── page.tsx            # /shows
│   │   ├── charts/
│   │   │   └── page.tsx            # /charts
│   │   ├── labels/
│   │   │   └── page.tsx            # /labels
│   │   └── [artist-name]/
│   │       └── page.tsx            # /naial — Public artist profile
│   │
│   ├── (dashboard)/                # Group: private panel (requires auth)
│   │   ├── layout.tsx              # Layout with dashboard sidebar
│   │   ├── dashboard/
│   │   │   ├── page.tsx            # /dashboard — Inicio y perfil
│   │   │   ├── performance/
│   │   │   │   └── page.tsx        # /dashboard/performance
│   │   │   ├── releases/
│   │   │   │   └── page.tsx        # /dashboard/releases
│   │   │   ├── contracts/
│   │   │   │   └── page.tsx        # /dashboard/contracts
│   │   │   ├── royalties/
│   │   │   │   └── page.tsx        # /dashboard/royalties
│   │   │   └── settings/
│   │   │       └── page.tsx        # /dashboard/settings
│   │
│   ├── layout.tsx                  # Root layout (Global Player + Auth)
│   └── globals.css
│
├── components/
│   ├── ui/                         # Design system primitives
│   ├── public/                     # Public navbar, show cards, etc.
│   ├── dashboard/                  # Sidebar, metrics, releases tables
│   └── player/                     # Global Player (Zustand)
│
├── lib/
│   ├── api/                        # Fetchers (TanStack Query + server fetch)
│   └── store/                      # Zustand stores (player, auth)
│
├── types/                          # Global TypeScript types
│   ├── artist.ts
│   ├── track.ts
│   ├── contract.ts
│   └── royalty.ts
│
└── public/
```

---

## Main modules

### B2C — Public radio
- [ ] Home with live player (`/`)
- [ ] Shows archive and schedule grid (`/shows`)
- [ ] Genre charts (`/charts`)
- [ ] Labels directory (`/labels`)
- [ ] Public artist profile with SSR/SEO (`/[artist-name]`)

### B2B — SoundSystem dashboard
- [ ] Home page with artist profile (`/dashboard`)
- [ ] Performance metrics and heatmaps (`/dashboard/performance`)
- [ ] Releases management and track status (`/dashboard/releases`)
- [ ] Contracts timeline (`/dashboard/contracts`)
- [ ] Royalties system and payout settings (`/dashboard/royalties`)
- [ ] Account settings (`/dashboard/settings`)

### Cross-cutting components
- [ ] Adaptive navbar (public / private)
- [ ] Persistent Global Player (Zustand)
- [ ] Unified authentication module (`/login`, `/register`)

---

## Design System

- **Mode:** dark mode as the default — “High Contrast Dark Mode” to reduce visual fatigue for producers working long sessions
- **Visual reference:** Figma design *(link pending)*

### Paleta de Colores

#### Deep Studio (main palette)
Inspired by a DAW interface (Ableton) and the atmosphere of a dark club.

| Token | Hex | Usage |
|---|---|---|
| `background` | `#0B0E14` | Main background — deep blue-black (not pure black) |
| `surface` | `#181C25` | Cards and panels — creates a “floating” effect on the background |
| `accent` | `#E67E22` | Proton Orange — buttons, active states, highlights (primary brand color) |
| `text-primary` | `#FFFFFF` | Titles and artist names |
| `text-secondary` | `#94A3B8` | Metadata, descriptions — high-legibility blue-gray |

#### Legacy colors (brand accents)
Inherited from the previous version. Kept as subtle accents to preserve Proton’s visual DNA.

| Element | Hex | Module |
|---|---|---|
| **Orange** | `#E67E22` | Shows / Uploads |
| **Teal** | `#1ABC9C` | Labels / Management |
| **Purple** | `#9B59B6` | DJ Mixes |
| **Green** | `#27AE60` | Account / Royalties |

---

### Tipografía

#### Display & headings — Plus Jakarta Sans
Geometric, modern, clean finish. Reference: industrial design language of audio hardware (Teenage Engineering).

| Style | Spec | Usage |
|---|---|---|
| **H1 - Artist Name** | Bold Italic / 32px | Artist name — the angle adds dynamism without feeling dated |
| **H2 - Section Title** | SemiBold / 18px / Uppercase / letter-spacing 5% | Section titles — premium feel |

#### UI & data — Inter
Industry standard for dashboards. Excellent legibility at small sizes (12–14px) on mobile.

| Style | Spec | Usage |
|---|---|---|
| **Metric Value** | Medium / 24px | Metric numbers (12 tracks, 0 mixes) |
| **Label / Metadata** | Regular / 12px | Sidebar text and labels |

---

### Effects and visual components

**Profile border (artist photo)**
```css
/* “Studio LED glow” effect */
border: 3px solid transparent;
background: linear-gradient(#181C25, #181C25) padding-box,
            linear-gradient(135deg, #00FF9D, transparent) border-box;
```

**Cards / surfaces**
```css
/* “Glass” border — no heavy black shadows */
border: 1px solid rgba(255, 255, 255, 0.05);
background: #181C25;
```

> Configure these as **Text Styles** and **Color Styles** in Figma for a clean handoff to development.

---

## Key technical decisions

> **Why Next.js instead of plain Vite/React?**
> Audio streaming and track lists load significantly faster with SSR. Also, if artist profiles need to be indexed by Google in the future, Next.js handles it natively without extra configuration.

> **Why TypeScript?**
> In a platform that handles money (royalties) and legal contracts, type errors like treating `null` as a `number` can have real consequences. TypeScript is the first line of defense.

> **Why Zustand instead of Redux?**
> The audio player needs lightweight global state. Redux adds unnecessary overhead for this use case; Zustand solves the same problem with much less boilerplate.

---

## Roadmap

- [ ] Initial project setup (Next.js + TypeScript + Tailwind)
- [ ] TanStack Query + Zustand setup
- [ ] Base Design System implementation
- [ ] Artist management module
- [ ] Contracts and royalties module
- [ ] Global audio player
- [ ] Public artist profiles
- [ ] Performance metrics and charts
- [ ] Deploy

---

## Project status

| Area | Status |
|---|---|
| Documentation / README | 🟡 In progress |
| Design System (Figma) | 🟡 In progress |
| Project setup | ⬜ Pending |
| Blank pages (scaffolding) | ⬜ Pending |
| Base UI components | ⬜ Pending |
| Real data integration | ⬜ Pending |

> **Next step:** create the Next.js project and generate all blank pages with the route structure, so the full scaffolding is ready to design and implement module by module.
