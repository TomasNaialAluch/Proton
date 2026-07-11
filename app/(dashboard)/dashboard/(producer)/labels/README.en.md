# "Labels" section — proposal

Design document. There's no code yet; this defines the name, route structure,
data model, and why it's organized this way, before implementing.

## Why this section

Today the producer already has `/dashboard/contracts`, but it's **read-only**: it
lists contracts that arrived by email, and that page's footer says so literally
("Contracts are sent by email from Proton SoundSystem"). That's exactly the
weak point that needs solving: the artist receives a PDF by email and has to
print/sign/scan it or use an external tool. None of this happens inside
the platform, so Proton isn't perceived as the "serious" place where the
deal gets closed — it's just a messenger.

The new section brings together two things that don't exist today: (1) active
discovery — sending your music to a label directly, not just waiting to be found
(`/discover` is the reverse: you browse other people's tracks) — and (2) closing the
legal loop without leaving the app.

## External research (summary)

- **Sending demos to labels/curators** (SubmitHub, Groover, MusoSoup): the common
  pattern is choosing the track + release date, filtering recipients by
  genre/label, adding a personal note, and then tracking the submission's status
  (seen / under review / responded). Groover in particular lets you choose the
  desired outcome (label, playlist, press) — we only need "label"
  because we already have real labels on the platform (`lib/mock/labels.ts`).
- **Embedded electronic signature** (DocuSign eSignature API, UX guides): the
  standard practice is a focused signing view (one document at a time, fields
  already placed, no distractions), a reusable signature (created once and
  reused), and above all an **audit trail**: who signed, when, from which IP/device,
  with a hash of the signed document — that's what gives it perceived legal validity,
  not the stroke itself.
- **Record label contracts** (Juro, Contractbook, Jotform Sign): they all
  converge on the same thing — a central contract repository with status
  (draft → sent → signed → active), and visibility of key dates
  (release date, master delivery, exclusivity window) directly
  tied to the contract, not in a separate email.

Conclusion: what makes the section "serious" isn't the signature drawing itself, it's the
verifiable history + having release dates live attached to the contract,
not floating separately.

## Section name

**"Labels"** in the producer nav (icon `Building2`, consistent with how it's
already used in `/contracts`). It conceptually replaces `/dashboard/contracts`, which becomes
an internal tab instead of a standalone page — today it lives alone and has
no way to act on anything, only look.

Inside, 3 tabs (same tab pattern already used by other dashboard sections):

```
/dashboard/labels                 → "Submit"       (send tracks to labels)
/dashboard/labels/submissions     → "Submissions"  (status of what you sent)
/dashboard/labels/contracts       → "Contracts"    (ex /dashboard/contracts, now with signing)
/dashboard/labels/contracts/[id]  → detail of a contract + signing flow
```

The user's saved signature isn't a tab — it's part of Settings
(`/dashboard/settings/account/signature`), because it's account-level data, not
tied to a specific label. It's created once and reused for any future contract,
just like `/settings/account/payment` already exists as reusable data.

## Folder structure

```
app/(dashboard)/dashboard/(producer)/labels/
├── page.tsx                    # Submit: choose track + label(s) from the platform + note
├── submissions/page.tsx        # status: sent / listening / accepted / passed
├── contracts/page.tsx          # list (evolution of the current /contracts)
└── contracts/[id]/page.tsx     # detail: terms, dates, PDF, "Sign" button

components/dashboard/producer/labels/
├── SubmitTrackForm.tsx
├── SubmissionStatusBadge.tsx
├── ContractTimeline.tsx        # key contract dates (release, delivery, exclusivity)
└── SignatureCanvas.tsx         # draw/type/upload signature — reused in settings and in the signing flow

app/(dashboard)/dashboard/(producer)/settings/account/signature/page.tsx
```

## Data model (mock, following the existing pattern)

```ts
// types/submission.ts
interface LabelSubmission {
  id: string;
  trackId: string;
  labelSlug: string;
  note: string;
  proposedReleaseDate: string | null;
  status: "sent" | "listening" | "accepted" | "passed";
  sentAt: string;
  respondedAt: string | null;
}

// types/signature.ts
interface SavedSignature {
  id: string;
  method: "drawn" | "typed" | "uploaded";
  imageDataUrl: string;
  createdAt: string;
}

// types/contract.ts — extend the existing one
interface Contract {
  // ...current fields (id, release, label, labelSlug, signedAt, status, documentUrl)
  keyDates: { label: string; date: string }[];   // release, master delivery, exclusivity window
  signature: {
    signedByName: string;
    signedAt: string;
    ipAddress: string;
    documentHash: string;   // hash of the PDF at the moment of signing
  } | null;
  status: "draft" | "pending_signature" | "signed" | "expired"; // adds draft/pending_signature
}
```

## Signing flow (inside `contracts/[id]`)

1. The label uploads/generates the contract → status `pending_signature`.
2. The artist enters the detail view, sees the PDF inline (no download), with the
   key dates highlighted at the top (not buried in the legal text).
3. If they don't have a saved signature, they're prompted to create one once
   (draw with mouse/finger, type with a signature-style font,
   or upload an image) — it's saved to the account for future contracts.
4. Confirm → the audit record is generated (name, date, document
   hash) → status moves to `signed` → it appears in `contracts/page.tsx` just
   like today, but now with the "View" link pointing to the already-signed PDF.
5. Notification to the label manager (reuses the `mockPendingToReview` pattern
   from feedback, or the notification system from `settings/account/notifications`).

## What gets reused from what already exists

- `DashboardBreadcrumb`, summary cards, and the `contracts/page.tsx` table as-is
  — only the sign CTA and the keyDates get added.
- `mockLabels` (`lib/mock/labels.ts`) for the label selector in "Submit" — it already
  has slug, genre, name.
- `usePrototypeViewStore` so the label manager can see, on their side, incoming
  submissions and generate the contract (out of scope for this
  document, but the symmetry with `(label-manager)/roster` is direct).

## Out of scope (intentionally)

- Legally binding signature (certificates, KYC) — this is a basic
  electronic signature, DocuSign-basic style, not a digital notarization.
- Payments/advances tied to the contract — that already lives in `royalties`.
