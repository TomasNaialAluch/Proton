# Public navbar — exhaustive UX/UI analysis

Working document for the public-area redesign: describes **the current header state**, the **saturation the eye perceives**, the **§8.7** solution (a single **Sign in** link → `/login` with tabs, no API), and **how not to repeat** the two-buttons-in-the-strip experiment.

**Scope:** `PublicNavbar`, drawer (`HamburgerMenu`), `NavbarSearch`, `PublicThemeToggle`. Does not include the footer or the global player.

---

## 0. Honest synthesis (what happens to the bar at a glance)

In **a single 64px-tall strip** the desktop user sees: **brand** + **four section links** + on the right, in sequence, **search** (even if it starts as an icon), **three theme pictograms/switch**, and a **full orange button** (“For Artists”). That’s **a lot of competing signal** in limited width, especially in the **right cluster**: the eye doesn’t do “taxonomy analysis”, it does **visual counting**, and ends up with the impression of **too many things in the bar**.

That is **not** solved by saying the center is empty: emptiness doesn’t change the fact that the **right block** is crowded with different meanings (search, paint the site, go to the artist panel).

**Evidence in the redesign itself:** in one iteration **Sign in** and **Create account** (placeholder) were **added** to that same row. It **loaded the bar more** and reinforced exactly the feeling of excess; that’s why **those controls were removed from the code**, and the analysis does **not** propose “bolting on” two more buttons without regrouping. The failure of that test isn’t the README — it’s the **physics** of a single-line header.

The rest of this document breaks down *why* it feels that way and *what* can be done once real auth exists, without assuming the repo currently has account entries.

---

## 1. Goal of this analysis

- Set **product criteria** before touching the header again: **perceived saturation** is a real risk, not a detail.
- Connect **technical inventory** with **visual load** (don’t confuse “few component types” with “low load on the eye”).
- Propose **how** to integrate Sign in / Create account **without** repeating the iteration that squeezed the bar (single menu, “Sign in” only, etc.).

---

## 2. Methods and criteria used

- **Heuristic inspection** (Nielsen, condensed version): visibility of system status, consistency, error prevention, flexibility, minimalist aesthetics, recognition, documentation (in this case, control affordance).
- **Response-time laws** (Hick–Hyman): more **independent** alternatives in the same UI stretch increase decision time.
- **Cognitive load** (Sweller, applied to UI): distinguishing **intrinsic** load (the task — “what do I want to do”) from **extraneous** load (how hard the interface is to operate in that stretch).
- **Fitts’s law**: distance and target size in the right-hand cluster.
- **Scanning patterns** (Nielsen Norman, summary): on web headers, a frequent **F-pattern** or horizontal top bar followed by a jump to content.

None of these methods “forbids” a fixed item count; they do warn when **several distinct intentions** compete in **too little linear space**.

---

## 3. Detailed inventory of the current state

### 3.1 Desktop (`lg` and up, ~1024px+)

**Apparent fixed height:** `h-16` (64px) — a single strip; everything competes at similar height.

| Visual order (left → right) | Element | Control type | Semantic function |
|---|---|---|---|
| 1 | Proton icon + “Proton” text | `Link` | Brand, return to home |
| 2–5 | Radio, Shows, Charts, Labels | `Link` ×4 | **Primary content** navigation |
| 6 | Magnifier (collapsed) / field when expanded | `button` + `input` | **Discovery** (global search MVP) |
| 7 | Sun — switch — Moon | `button` (switch) | **Appearance preference** |
| 8 | **Sign in** + icon | `Link` → `/login` | **Single entry** to account (§8.7); sign-up lives on the page |
| 9 | “For Artists” + dashboard icon | `Link` | **CTA** for creators → `/dashboard` |

**Count:** the right strip holds **search**, **theme**, **Sign in** (one target), and **For Artists**; the four content links remain on the left.

### 3.2 Mobile (below the `lg` breakpoint)

In the **visible bar** (64px):

| Element | Function |
|---|---|
| Hamburger | Open drawer |
| Centered brand | Home / identity |

There’s no search or theme control in the fixed bar: they’re **offloaded** to the drawer to **avoid** multiplying icons in a row already occupied by the centered brand and the menu.

**In the drawer:** Search, the four content links, **Sign in** (same `/login` route), theme toggle, “For Artists” CTA.

### 3.3 What’s missing or deferred (relative to a product with real auth)

- **Create account** as a **second button** in the bar: **no** (it’s a tab inside `/login`, §8.7).
- **Signed-in session** (avatar, “My account”, sign out): not yet.
- **Backend / API** for login and registration: prototype, no integration.

A **single** “Sign in” in the header meets the minimum “entry point” expectation without repeating the test of **two** account CTAs in the same row.

---

## 4. Scanning pattern and visual hierarchy

### 4.1 Typical reading (LTR, desktop)

1. **Logo** → brand anchor.
2. **Primary links** (Radio… Labels) → “where do I go within the site?”
3. **Eye jumps to the right margin** → zone of **global utilities** and **CTA**.

The right margin concentrates **high decision density** in a few centimeters: **different kinds of decisions** (search, theme, **account**, artist panel).

### 4.2 Visual weight contrast

- **For Artists** is the only block with a **solid accent background** in that cluster: the **primary** CTA of the right block, for creators.
- **Sign in** (a bordered link, with hover/focus and an active state on `/login`) is **secondary** next to the orange button: it doesn’t compete with solid fill.
- A **minimized search** reduces weight until the user **chooses** to expand it: a good mechanism to **avoid** competing with the orange CTA at rest.
- **Theme** occupies a fixed width (sun + switch + moon): clear to read but **always visible**: it consumes linear width steadily.

---

## 5. Taxonomy of intentions vs. controls

| User intention | Current control | Is it in the desktop bar? |
|---|---|---|
| Explore site sections | Radio, Shows, Charts, Labels | Yes |
| Find something specific | Search | Yes (minimized) |
| Adjust reading mode (light/dark) | Theme toggle | Yes |
| Sign in (listener) | Sign in → `/login` | Yes (one link) |
| Create an account / sign up | Tab inside `/login` | **No** in the bar (§8.7) |
| Access the B2B product as an artist | For Artists | Yes |

**Signed-in session** (avatar, “My account” menu): not yet.

**Sign in** marks the “listener account” pole against **For Artists**, without putting **two** auth CTAs in the same row.

---

## 6. Why the bar feels “full” — and why adding auth made what was already visible worse

### 6.1 The baseline was already heavy on the eye

The right margin holds **several kinds of action** that are all highly visible at once (search, a three-piece theme switch, **Sign in**, a solid CTA). Even though search starts minimized, expanding it **takes up more** room and makes the right side **even denser**. The “too many things” read **already existed** before testing two account buttons in a row again; **Sign in** as the **only** link to `/login` tries to **limit** that growth compared with the failed two-CTA test.

### 6.2 Heterogeneity = more mental effort per centimeter

Three families in the right cluster:

1. **Exploration** (search)
2. **Interface preference** (theme)
3. **Conversion / segment** (For Artists)

Every category jump forces a **micro-rethink**. That adds **extraneous** load: it’s not just “many icons”, it’s **changing the question** (am I searching? changing theme? am I an artist?) within the same stretch.

### 6.3 Test in the redesign: adding Sign in + Create account in the same row

The prototype implemented **placing two account actions** next to search, theme, and For Artists. **Result:** the bar looked **more loaded**; looking at it, it **does** feel like “too much” — because it **is**, in terms of **competition for space and attention**. That’s why that UI **wasn’t kept**: the exercise itself served to **confirm** the current header’s limit, not to disprove it.

### 6.4 Linear width and Fitts’s law

At intermediate widths (`lg` just above the breakpoint), the right cluster groups **several targets** in a row. Every extra control **without** grouping or separation worsens click errors and the feeling of crowding.

### 6.5 The center gap doesn’t “balance” the right side

The space between “Labels” and the right cluster does **not** visually compensate for the density of the right margin: the user doesn’t **look at the center** when scanning “what can I do right now”; they look at the **logo, links, and corner**. The gap helps the layout but does **not** lower the count of elements competing in the corner.

---

## 7. The Sign in / Create account gap: implications

### 7.1 User expectation

On radio/streaming sites, the top-right corner usually holds **account** or **sign-in**. Its absence can be read as:

- A **read-only** product (acceptable for a prototype).
- Or an **unintentional omission** (a trust risk if the site promises future account-linked features).

### 7.2 What happens if two **literal** buttons are added in the same row

Without a regrouping redesign, **two more decisions** are added in the same linear stretch:

- It raises the **Hick count** in the right cluster.
- They compete for hierarchy with **For Artists** if given too much contrast.
- At widths **between `lg` and `xl`**, **overflow**, truncation, or line wrapping can appear (an anti-pattern in a single-height header).

That’s why the analysis does **not** recommend repeating “bolt Sign in and Create account together” in the same row **without** reducing weight elsewhere or **regrouping** — the prototype test already showed the effect on the bar.

---

## 8. Possible strategies for adding auth (once the product exists)

These are **design alternatives**; none is implemented in the current code.

### 8.1 A single “Account” entry (dropdown or sheet)

- **Advantage:** one target in the bar; inside it, Sign in, Create account, legal help.
- **Cost:** building an accessible menu (`aria-expanded`, focus, Escape).

### 8.2 Only “Sign in” in the bar

- **Create account** as a secondary link **on the login screen** (a very common pattern).
- **Advantage:** less width; clear hierarchy (most returning users go to login).

### 8.3 Sign in as text; Create account only in the footer or a modal from login

- **Advantage:** minimizes competition with For Artists.
- **Risk:** sign-up is less visible (only acceptable if metrics allow it).

### 8.4 Account only on mobile, inside the drawer (not in the fixed bar)

- **Advantage:** the mobile bar stays hamburger + brand.
- **Disadvantage:** on desktop, the entry is still missing if nothing is added at `lg+`.

### 8.5 Visual separator between blocks

- Between “listener utilities” (search + future account) and “For Artists”, a **larger margin** or a subtle vertical line can **reduce click errors** and reinforce semantics, without adding new text.

### 8.6 A second header row, home-only (promo / subnav pattern)

- Only if the business requires it; it increases height and operational complexity (sticky, shadows, accessibility).

### 8.7 Forums, brief literature, and proposal: one button → login/sign-up page

**Where “too many nav items” gets discussed (a real UX community, not a “random forum”):** **UX Stack Exchange** (a voted Q&A site, a standard industry reference) has directly useful threads:

- *UX alternative for too many navigation items* — alternatives when there are many top-level items. [https://ux.stackexchange.com/questions/107069/ux-alternative-for-too-many-navigation-items](https://ux.stackexchange.com/questions/107069/ux-alternative-for-too-many-navigation-items)
- *Navigation too long, any real case solves this issue?* — real cases, trimming / regrouping. [https://ux.stackexchange.com/questions/107133/navigation-too-long-any-real-case-solves-this-issue](https://ux.stackexchange.com/questions/107133/navigation-too-long-any-real-case-solves-this-issue)
- *Large Number of Menu Items and UX* — many items and trade-offs. [https://ux.stackexchange.com/questions/55196/large-number-of-menu-items-and-ux](https://ux.stackexchange.com/questions/55196/large-number-of-menu-items-and-ux)
- *Pros and cons of an overflowing horizontal scrollable nav bar* — why horizontal scroll in the bar is usually a bad idea; reinforces **not** stacking without a limit. [https://ux.stackexchange.com/questions/135434/what-are-the-pros-and-cons-with-an-overflowing-horizontal-scrollable-nav-bar](https://ux.stackexchange.com/questions/135434/what-are-the-pros-and-cons-with-an-overflowing-horizontal-scrollable-nav-bar)

**Synthesis of what’s usually recommended (and matches broad good practice):** **reorganize the IA**, **group**, or **push down to a second level** (submenu, “More”, hamburger on mobile), **prioritize** what’s visible, and avoid endless rows; for a horizontal bar, the common suggestion is to **reduce the number of first-glance destinations** rather than add lateral scroll to the menu.

**Possible solution (annotated): a single control in the bar with clear feedback → a page to sign in or create an account**

- **Idea:** in the header, **a single button or link** (e.g. “Sign in” / “Account”) with an **evident hover/focus state** that **navigates** to a **dedicated route** (`/login`, `/account`, etc.) where the user chooses to **sign in** or **sign up** (tabs, two blocks, or a single form with a “Create account” link).
- **Fit with theory / common practice:** reduces **top-level items** in the bar (less competition with search, theme, and “For Artists”), aligns with **one clear entry** to the account space — same spirit as **§8.2** (“only Sign in in the bar” + sign-up on the next screen). It’s consistent with **simplifying choices in the header** and moving detail to the next step (NN/g and homepage studies usually stress **clarity of critical paths** and **avoiding duplicate destinations** unnecessarily in the same zone).
- **Baymard** and other research groups publish guidance on **simplifying sign-in** (less friction on the path to login); having **one single door** from the bar and **deciding login vs. sign-up on the page** is usually **better** than two big buttons in an already-saturated strip.
- **Nuance:** the button needs an **unambiguous label** (“Sign in”, “Log in”, “Account”) and the destination page must meet **expectations** (not an empty landing page); on **mobile** the same idea can repeat or live in the drawer if the bar stays minimal.

---

## 9. Accessibility and density

- Every new control in the same row must keep a reasonable **minimum area** (~44×44 CSS px on touch; on desktop the standard is usually a bit smaller but consistent).
- **Focus order** (keyboard): logo → primary links → search → theme → [future account] → For Artists. Abrupt jumps occur if visual order doesn’t match DOM order.
- **Labels**: “For Artists” already distinguishes the audience; future “Sign in” entries must avoid ambiguity with the artist dashboard.

---

## 10. Summary table: the “add account” vs. “don’t overload” tension

| Approach | Reduces perceived density | Risk |
|---|---|---|
| One button in the bar → login/sign-up page (§8.7) | High (a single target) | Destination page must meet expectations; sign-up can be a secondary tab |
| “Account” dropdown | High | More development and A11Y patterns |
| Only Sign in in the bar | Medium–high | Sign-up is less visible |
| Account only in the mobile drawer | Medium on mobile | Desktop/mobile inconsistency if not compensated |
| Two explicit buttons in the bar (as tested) | Very low | Visible **saturation**; collides with theme, search, and CTA; confirms the current header’s limit |

---

## 11. References in the repo (state at time of writing)

| Piece | File |
|---|---|
| Public bar | `components/public/Navbar.tsx` |
| Mobile drawer | `components/public/HamburgerMenu.tsx` |
| Minimized search | `components/public/NavbarSearch.tsx` |
| Light/dark theme | `components/public/PublicThemeToggle.tsx` |
| Public-area layout | `app/(public)/layout.tsx` |
| `/login` page (sign-in / sign-up tabs, no-API prototype) | `app/(public)/login/page.tsx`, `app/(public)/login/layout.tsx`, `components/public/LoginSignUpView.tsx` |

**§8.7 pattern in code:** a single **Sign in** control (desktop + drawer block) links to **`/login`**; account creation lives on the **second tab** of that page, not as a second button in the top strip.

---

## 12. Conclusion

1. To the **user’s eye**, the bar is still **dense** on the right (search + a three-piece theme control + **a single** Sign in + the orange CTA). The center gap does **not** dilute that impression.
2. **Adding two buttons** (Sign in + Create account) **in the same row** of the header **overloaded** the bar in the earlier test; that’s why that layout was dropped.
3. The current implementation follows **§8.7**: **one link** to **`/login`** with **sign-up on the page** (a tab), in line with **§8.2** and the table in **section 10**.
4. The forms are a **prototype** until a backend exists; the focus of the redesign is **density** and **a single visible door** in the bar.

---

*Last updated: §8.7 implemented (`/login` + Sign in in navbar/drawer); no auth API.*
