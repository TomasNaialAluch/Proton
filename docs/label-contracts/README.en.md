# In-app contract signing — PDF viewer + overlay signature

Design document. Defines what needs to be built before touching code.
Uses as a real case the [`Dear Deer Licensing Agreement Naial 2026.pdf`](./Dear%20Deer%20Licensing%20Agreement%20Naial%202026.pdf)
contract (the one you sent me), already loaded as contract `c7` in `lib/mock/contracts.ts`
(pending signature) and served at `public/contracts/dear-deer-licensing-agreement-naial-2026.pdf`.

## The idea, in one sentence

That opening and signing a contract in Proton feels like Adobe Acrobat Reader:
you open it, read it right there, create your signature (drawn, typed, imported, or
extracted from a photo), drag/rotate/adjust it over the actual PDF, and on
confirming it gets stamped into the document — it's not a separate screen that
"simulates" signing.

## What exists today vs. what's missing

Today (`ContractDetailClient.tsx`, `SignatureCanvas.tsx`):
- The "View contract document" button opens the PDF in a new browser tab — there's
  no viewer inside Proton.
- `SignatureCanvas` generates a signature (drawing/text/uploaded image) as a PNG,
  but that image **never touches the PDF**. Signing today is a symbolic act:
  it changes `contract.status` to `signed` and saves name/date/hash — the
  document itself remains the original, without the signature stamped on it.

Missing:
1. A PDF viewer embedded in the contract page (not an external link).
2. Placing the signature as a manipulable object *over* the PDF page:
   drag, resize, rotate.
3. "Burning" that signature into the actual PDF on confirm (the resulting file
   contains the signature, it's not separate data in the database).
4. (Extra) Extracting a clean signature from a photo of something signed on
   paper.

## Target flow, with the real example

1. On `/dashboard/labels/contracts`, **"JIK / Never Leave — Dear Deer
   Music"** appears with the badge *"Awaiting your signature"* (already exists).
2. I enter the detail view (`/dashboard/labels/contracts/c7`). I see the summary: label,
   release, key dates (signing date, release deadline, term end — already
   exists via `ContractKeyDates`).
3. I tap **"Open document"** → the PDF opens *inside* the page (not a new tab),
   paginated — the real contract has 5 pages, with signature blocks on
   page 1 (summary) and page 5 (Schedule A). I can scroll/zoom to read it
   in full, the same way I'm reading this PDF right now.
4. I tap **"Add signature"**. If I don't have a saved signature, the same
   selector that already exists opens (draw / type / upload image), plus a fourth
   new option: **"Extract from photo"** (see below).
5. The signature appears as a floating PNG image over the current
   page of the PDF, with handles to:
   - **move** (drag),
   - **resize** (corners),
   - **rotate** (top handle).
   I drag it to the "Authorized Signature" line of the ARTIST block.
6. I confirm → the signature is **embedded into the actual PDF** (it's not just a
   visual overlay) → a new PDF is generated that already contains it.
7. The contract moves to `signed`, with the usual audit record
   (name, date, hash — now the hash is of the *already signed* PDF), and the
   "View contract document" link opens that signed version.

## Signature extraction from photo ("Import with AI")

You take a photo of your signature on a blank sheet of paper (like when DocuSign/PayPal
ask you to "sign on a sheet and take a photo of it"). The function:
1. Detects the dark stroke against the light background.
2. Crops to the bounding box of the ink.
3. Makes everything that isn't stroke (the paper) transparent.
4. Returns a clean PNG, the same as if you'd drawn it by hand in the app.

For this prototype, **simple client-side image processing** is enough
(grayscale → luminosity threshold → alpha channel), no backend or real model:
it works well for the typical case (dark ink, white paper, good light) and it
already conveys the idea of "take a photo of it and you're done."
A real segmentation model (for shadowed backgrounds, colored paper, etc.)
is left for a future iteration if this gets taken to production — it's not
necessary to demonstrate the feature.

## Technical pieces

- **PDF rendering**: `pdfjs-dist` (via `react-pdf`, which already wraps it) to
  draw each page as a `<canvas>`. It's client-only, no backend required.
- **Interactive overlay** (drag + resize + rotate): instead of reinventing the
  wheel with hand-rolled pointer events, use an already-proven library for this
  (e.g. `react-moveable`) positioned over the page's `<canvas>`. Store
  the transform (x, y, width, height, rotation) in React state.
- **Real stamping into the PDF**: `pdf-lib` — takes the original PDF, embeds the
  signature PNG into the chosen page and coordinates (with the rotation
  applied), and returns a new PDF as `Uint8Array`/`Blob`. All on the
  client, no backend.
- **Persistence (prototype)**: since there's no backend, the resulting signed PDF
  lives as a `Blob` in memory / `IndexedDB` for this session — it can't
  overwrite the file in `public/`. This is the same "backend-less prototype"
  limitation that already applies to the rest of the project (contracts and
  submissions live in `localStorage` via Zustand).

## Data model — what's being added

```ts
// types/signature.ts — add the placement over the page
interface SignaturePlacement {
  page: number;       // 1-indexed
  x: number;           // % of page width, not pixels — so it survives zoom/resize
  y: number;
  width: number;
  rotation: number;    // degrees
}

// types/contract.ts — the stamping result
interface ContractSignatureRecord {
  signedByName: string;
  signedAt: string;
  documentHash: string;     // hash of the ALREADY signed PDF, not the original
  placement: SignaturePlacement;
}
```

`Contract.documentUrl` can now also be a Blob URL generated on the
client (in addition to the static path under `/public/contracts/...` already used by
the example contract).

## Proposed file structure

```
components/dashboard/producer/labels/
├── PdfContractViewer.tsx     # page rendering (react-pdf) + scroll/zoom
├── SignatureOverlay.tsx      # the signature as a draggable/resizable/rotatable object
├── SignaturePhotoImport.tsx  # camera/upload + crop + threshold → PNG
└── SignatureCanvas.tsx       # already exists — gets the "Extract from photo" tab added

lib/pdf/
├── embedSignature.ts         # pdf-lib: burns the PNG into the PDF, returns Blob
└── extractSignatureFromPhoto.ts  # 2D canvas: threshold + alpha
```

`ContractDetailClient.tsx` stops linking to a new tab and instead
mounts `PdfContractViewer` with `SignatureOverlay` when the contract is
`pending_signature`.

## Out of scope (for now)

- Legally binding signature (certificates, KYC, timestamping).
- Multiple signers / signing order.
- Real AI segmentation for the signature photo (the simple
  threshold approach documented above stays).
- Persisting the signed PDF to a backend — in this prototype it lives in the
  browser's memory, like the rest of the mock data.
