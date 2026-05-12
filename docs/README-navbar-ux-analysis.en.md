# Public navbar — exhaustive UX/UI analysis

Working document for the public-area redesign. It describes **the current header state**, the **perceived visual saturation**, the solution in **§8.7** (a single **Sign in** entry → `/login` with tabs, no API), and **how not to repeat** the “two buttons in the top strip” experiment.

**Scope:** `PublicNavbar`, drawer (`HamburgerMenu`), `NavbarSearch`, `PublicThemeToggle`. Does not include footer or the global player.

---

## 0. Honest synthesis (what’s wrong at a glance)

In **a single 64px-high strip**, desktop users see: **brand** + **four section links**, and on the right, in sequence, **search** (even if collapsed to an icon), **theme controls**, a **Sign in** entry, and a full **orange CTA** (“For Artists”). That’s **a lot of competing signals** in limited width, especially in the **right cluster**: people don’t do taxonomy analysis in headers, they do **visual counting**, and the result is “too many things in the bar.”

This isn’t solved by saying the center is empty: the **right block** remains dense with different meanings (search, appearance, account entry, and creator CTA).

**Evidence in the prototype:** in one iteration the header also included **Sign in** and **Create account** side-by-side. That **increased perceived load** and reinforced the “too much” impression; the experiment was removed. The issue isn’t the README — it’s the **physics** of a single-line header.

The rest of this document explains *why* it feels that way and *how* to integrate auth later without repeating that failed iteration.

---

## 1. Goal of this analysis

- Establish **product criteria** before touching the header again: **perceived saturation** is a real risk.
- Connect **technical inventory** with **visual load** (few component types ≠ low cognitive load).
- Propose **how** to integrate Sign in / Create account **without** pushing the bar past its limit (single entry, account menu, etc.).

---

## 2. Methods and criteria

- **Heuristic inspection** (Nielsen, condensed): visibility, consistency, error prevention, flexibility, minimalist aesthetics, recognition, help/documentation (affordance here).
- **Hick–Hyman**: more independent choices in one UI segment increases decision time.
- **Cognitive load** (Sweller applied to UI): intrinsic (“what do I want?”) vs extraneous (“how hard is the UI to operate right now?”).
- **Fitts’ law**: target size and distance inside the dense right cluster.
- **Scanning patterns**: top headers often follow an **F-like** scan plus a jump to content.

None of these set a hard item count; they warn when **distinct intentions** compete in **too little linear space**.

---

## 3. Detailed inventory of the current state

### 3.1 Desktop (`lg` and up, ~1024px+)

**Apparent fixed height:** `h-16` (64px) — single strip; everything competes at the same height.

| Visual order (left → right) | Element | Control type | Semantic intent |
|---|---|---|---|
| 1 | Proton icon + “Proton” text | `Link` | Brand, home anchor |
| 2–5 | Radio, Shows, Charts, Labels | `Link` ×4 | Primary content navigation |
| 6 | Magnifier (collapsed) / input when expanded | `button` + `input` | Discovery (global search) |
| 7 | Sun — switch — Moon | `button` (switch) | Appearance preference |
| 8 | **Sign in** + icon | `Link` → `/login` | Single account entry (§8.7) |
| 9 | “For Artists” + dashboard icon | `Link` | Creator CTA → `/dashboard` |

**Count:** the right strip includes **search**, **theme**, **Sign in**, and **For Artists**, in addition to the four primary links.

### 3.2 Mobile (below `lg`)

In the visible 64px bar:

| Element | Function |
|---|---|
| Hamburger | Open drawer |
| Centered brand | Home / identity |

Search and theme are **moved into the drawer** to avoid icon overload in a tight top row.

In the drawer: Search, the four primary links, **Sign in** (same `/login`), theme toggle, and the “For Artists” CTA.

### 3.3 Deferred (vs a real auth product)

- **Create account** as a second top-bar button: **no** (it lives as a tab inside `/login`, §8.7).
- Signed-in session UI (avatar, “My account”, sign out): not yet.
- Backend/API for login/registration: prototype only.

---

## 4. Scanning pattern and visual hierarchy

Desktop reading typically goes:

1. Logo (brand anchor)
2. Primary links (“where do I go?”)
3. Jump to the right edge (global utilities + CTA)

The right edge concentrates **dense decision-making** in a few centimeters: different decision categories (search, appearance, account, creator CTA).

---

## 8.7 Recommended strategy: one entry → dedicated login page

The prototype’s current direction is: a single **Sign in** entry in the header/drawer that goes to **`/login`**, where the user can choose **Sign in** vs **Create account** via tabs. This reduces top-level header choices and keeps the strip within its physical limits.

Relevant UX discussions (navigation overload patterns) exist on UX Stack Exchange:

- `https://ux.stackexchange.com/questions/107069/ux-alternative-for-too-many-navigation-items`
- `https://ux.stackexchange.com/questions/107133/navigation-too-long-any-real-case-solves-this-issue`
- `https://ux.stackexchange.com/questions/55196/large-number-of-menu-items-and-ux`
- `https://ux.stackexchange.com/questions/135434/what-are-the-pros-and-cons-with-an-overflowing-horizontal-scrollable-nav-bar`

---

## Conclusion

1. The right side remains visually dense (search + theme + one Sign in + orange CTA). Center whitespace doesn’t change the “count” impression.
2. Adding **two** auth CTAs in the same strip already made the bar feel overloaded; it should not be repeated without regrouping.
3. A single visible entry (Sign in) → `/login` with tabs is the best fit for the current header constraints.

