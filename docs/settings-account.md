# Account Settings — `/dashboard/settings/account`

Redesign spec for the full account settings section.
Reference: `protonradio.com/settings/*`

> **Scope:** Private data only — nothing here is public-facing.
> The artist's public identity (photo, bio, connections) lives in `/dashboard/settings/profile`.

---

## Sidebar navigation (legacy: 8 sections)

| Section | Icon (Lucide suggestion) | Route |
|---|---|---|
| Basic Info | `User` | `/dashboard/settings/account` |
| Pro Access | `Star` | `/dashboard/settings/account/pro` |
| Payment Settings | `CreditCard` | `/dashboard/settings/account/payment` |
| Subscriptions | `Zap` | `/dashboard/settings/account/subscriptions` |
| Connections | `Link2` | `/dashboard/settings/account/connections` |
| Downloads | `Download` | `/dashboard/settings/account/downloads` |
| Notifications | `Bell` | `/dashboard/settings/account/notifications` |
| Discovery Mode | `Sparkles` | `/dashboard/settings/account/discovery` |

> **Redesign approach:** On mobile, these 8 sections live as a scrollable list on the `/dashboard/settings/account` index page. Each item is a tappable row that navigates to its own sub-page. On desktop, they appear as a left sidebar (same pattern as the current legacy site).

---

## Section 1 — Basic Info

### General
| Field | Current value (example) | Editable |
|---|---|---|
| Username | artistusername | ✅ |
| Password | •••••••• | ✅ |
| Full Name | Artist Full Name | ✅ |

### Contact Info
> *"For contracts, statements, payments, notifications, and more."*

| Field | Notes | Editable |
|---|---|---|
| Email | Primary email linked to account | ✅ |
| PayPal Email | Currently disabled ("upgrading system") | ❌ |
| Pro Email | Used for contracts, statements, releases | ✅ |
| Phone Number | For notifications | ✅ |
| Mailing Address | For contracts & payments | ✅ |
| Country | Associated with mailing address | ✅ |

### Danger Zone
- **Delete Your Account** — schedules permanent deletion after 14 days. Red destructive button. Needs confirmation modal.

---

## Section 2 — Pro Access

### Contracts & Reports
- CTA button: "Sign In to SoundSystem" — in the redesign this is already unified, so this becomes a link to `/dashboard/contracts` and `/dashboard/royalties`.

### Artists
- Lists artists linked to the account with an `Edit` action each.
- In the redesign: links to `/dashboard/settings/profile`.

### Labels
- Lists labels managed by the user.
- Empty state: "You don't manage any labels on Proton."

### Shows
- Lists shows managed by the user.
- Empty state shown (no shows currently).

---

## Section 3 — Payment Settings

### Payment Method
| Field | Example value | Notes |
|---|---|---|
| Method | Crypto | USDC via Ethereum |
| Wallet address | `0xdB815e2fDcb2f2...` | Truncated |

### Important business rule (must be visible, not buried)
> *"The selected payment method is NOT automatic. When you receive your next royalty statement email, click the confirmation link inside to request payment."*
> *"For automatic payments, switch to PayPal."*

**Redesign:** Show this as a visible info banner, not small-print text. Two options clearly presented:
- **Crypto (manual)** — user must click link in email to trigger payment
- **PayPal (automatic)** — payment sent automatically when threshold reached

---

## Section 4 — Subscriptions

*(Screenshots not available — pending)*

---

## Section 5 — Connections

### Streaming platforms
| Platform | Status | Actions |
|---|---|---|
| Spotify | Connected — "Naial" | Disconnect |
| SoundCloud | Connected — "Naial" | Disconnect / Add another account |

### Cloud Storage for Promo Pool
| Service | Status | Action |
|---|---|---|
| Google Drive | Not connected | Connect |
| Dropbox | Not connected | Connect |

---

## Section 6 — Downloads

| Setting | Current value | Type |
|---|---|---|
| Automatic Downloads | Off | Toggle |
| Preferred Download Format | AIFF | Selector (AIFF / MP3 / WAV / FLAC) |
| Download Location | Direct Download | Selector |

---

## Section 7 — Notifications

### General
| Setting | State |
|---|---|
| Proton Newsletter | ✅ On |

### Promo Pool
| Setting | State |
|---|---|
| Promo Pool Email | `artist@email.com (Pro Email)` — editable |
| Label Invites | ❌ Off |
| New Promos | ❌ Off |

### Discovery Mode
| Setting | State |
|---|---|
| Discovery Mode Invites | ✅ On |
| Discovery Mode Monthly Report | ✅ On |

### Artist Release Links
| Field | Value |
|---|---|
| Artist | Naial |
| Notify me? | ✅ Yes |
| Sent to | `artist@email.com` — editable |

---

## Section 8 — Discovery Mode

### Artist Opt Ins
| Artist | Status | Toggle |
|---|---|---|
| Naial | OPTED IN | ✅ On |

> *"Tracks featuring this artist can be opted into Discovery Mode."*

Link: "Manage Discovery Mode Notifications" → goes to Notifications section.

---

## Redesign — Index page (`/dashboard/settings/account`)

On mobile, the index page shows all 8 sections as a list (instead of a sidebar):

```
┌─────────────────────────────────────────┐
│ ← Account Settings                      │
│   Private — only visible to you         │
├─────────────────────────────────────────┤
│  👤  Basic Info               →         │
│      Username, password, contact        │
├─────────────────────────────────────────┤
│  ⭐  Pro Access               →         │
│      Artists, labels, shows             │
├─────────────────────────────────────────┤
│  💳  Payment Settings         →         │
│      Crypto · USDC                      │
├─────────────────────────────────────────┤
│  ⚡  Subscriptions            →         │
├─────────────────────────────────────────┤
│  🔗  Connections              →         │
│      Spotify · SoundCloud               │
├─────────────────────────────────────────┤
│  ⬇  Downloads                →         │
│      AIFF · Direct Download             │
├─────────────────────────────────────────┤
│  🔔  Notifications            →         │
│      Newsletter on · Promos off         │
├─────────────────────────────────────────┤
│  ✨  Discovery Mode           →         │
│      Naial · Opted in                   │
└─────────────────────────────────────────┘
```

Each row shows:
- Icon + section title
- One-line summary of current state (so user sees status without tapping)
- Chevron `>`

---

## Components to build

| Component | File | Status |
|---|---|---|
| `AccountSettingsIndex` | `app/(dashboard)/dashboard/settings/account/page.tsx` | 🟡 Partial |
| `BasicInfoPage` | `app/(dashboard)/dashboard/settings/account/basic/page.tsx` | ⬜ Pending |
| `ProAccessPage` | `app/(dashboard)/dashboard/settings/account/pro/page.tsx` | ⬜ Pending |
| `PaymentSettingsPage` | `app/(dashboard)/dashboard/settings/account/payment/page.tsx` | ⬜ Pending |
| `SubscriptionsPage` | `app/(dashboard)/dashboard/settings/account/subscriptions/page.tsx` | ⬜ Pending |
| `ConnectionsPage` | `app/(dashboard)/dashboard/settings/account/connections/page.tsx` | ⬜ Pending |
| `DownloadsPage` | `app/(dashboard)/dashboard/settings/account/downloads/page.tsx` | ⬜ Pending |
| `NotificationsPage` | `app/(dashboard)/dashboard/settings/account/notifications/page.tsx` | ⬜ Pending |
| `DiscoveryModePage` | `app/(dashboard)/dashboard/settings/account/discovery/page.tsx` | ⬜ Pending |

---

## Key redesign decisions

> **Index as list (not sidebar) on mobile**
> The legacy site uses a persistent left sidebar — fine on desktop, terrible on mobile. The redesign uses a list-based index that's thumb-friendly and familiar (iOS Settings pattern).

> **Payment method warning as a banner, not fine print**
> The "NOT automatic" notice is critical information buried in small text. It needs to be an amber warning card at the top of the Payment section.

> **Connections includes cloud storage**
> Google Drive and Dropbox for Promo Pool are not obvious from the section title. The redesign labels this subsection clearly: "Cloud Storage for Promo Pool".

> **Discovery Mode as a first-class section**
> Currently buried at the bottom of the legacy sidebar. In the redesign it gets its own row on the index with the opt-in status visible at a glance.

---

## Status

| Task | Status |
|---|---|
| Full legacy analysis (all 8 sections) | ✅ Done |
| Index page wireframe | ✅ Done |
| Component list defined | ✅ Done |
| Implementation | ⬜ Pending |
