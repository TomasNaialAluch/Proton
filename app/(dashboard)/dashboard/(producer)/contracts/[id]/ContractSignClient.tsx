"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { PenLine, ShieldCheck, CheckCircle2, X, Loader2, ChevronLeft, ChevronDown, FileDown, FileText } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import ContractKeyDates from "@/components/dashboard/producer/contracts/ContractKeyDates";
import SignatureCanvas from "@/components/dashboard/producer/contracts/SignatureCanvas";
import type { OverlayFrame } from "@/components/dashboard/producer/contracts/SignatureOverlay";
import { useContractsStore } from "@/lib/store/contractsStore";
import { useSignatureStore } from "@/lib/store/signatureStore";
import { mockArtist } from "@/lib/mock/artist";
import { embedSignatureInPdf } from "@/lib/pdf/embedSignature";
import type { SignaturePlacement } from "@/types/signature";

// pdfjs / react-moveable touch browser-only APIs — never render on the server.
const PdfContractViewer = dynamic(
  () => import("@/components/dashboard/producer/contracts/PdfContractViewer"),
  { ssr: false }
);
const SignatureOverlay = dynamic(
  () => import("@/components/dashboard/producer/contracts/SignatureOverlay"),
  { ssr: false }
);

function contractIdFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/contracts\/([^/]+)\/?$/);
  return m?.[1] ?? "";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const DEFAULT_FRAME: OverlayFrame = { x: 210, y: 380, width: 140, height: 52, rotation: 0 };

export default function ContractSignClient() {
  const pathname = usePathname();
  const id = contractIdFromPath(pathname);
  const contract = useContractsStore((s) => s.contracts.find((c) => c.id === id));
  const signContract = useContractsStore((s) => s.signContract);
  const savedSignature = useSignatureStore((s) => s.signature);
  const setSavedSignature = useSignatureStore((s) => s.setSignature);

  const [page, setPage] = useState(1);
  const [pdfExpanded, setPdfExpanded] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [frame, setFrame] = useState<OverlayFrame>(DEFAULT_FRAME);
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);
  const [justSigned, setJustSigned] = useState(false);
  const pageSurfaceRef = useRef<HTMLDivElement | null>(null);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);
  /** Shows a brief, subtle glow on Download + a one-line note right after
   *  signing, then collapses both away on its own — a hint, not a fixture. */
  const [showDownloadHint, setShowDownloadHint] = useState(false);
  /** Where on the page the user tapped with the pencil cursor to start signing —
   *  used so the signature shows up where they meant to put it instead of a
   *  generic default spot they then have to drag into place. */
  const clickPointRef = useRef<{ x: number; y: number } | null>(null);
  /** Sequential attention cue: the placement instructions glow first (read
   *  this), then after a read-window the Confirm & sign button glows green
   *  instead (now confirm) — see `.animate-glow-accent`/`.animate-glow-confirm`
   *  in globals.css. Purely a visual sequence, never blocks the click. */
  const [readyToConfirm, setReadyToConfirm] = useState(false);

  useEffect(() => {
    if (!placing) {
      setReadyToConfirm(false);
      return;
    }
    setReadyToConfirm(false);
    const t = window.setTimeout(() => setReadyToConfirm(true), 2800);
    return () => window.clearTimeout(t);
  }, [placing]);

  if (!id) notFound();
  if (!contract) notFound();

  const hasDocument = Boolean(contract.documentUrl);

  /** Modal's job ends here — it only gets us a signature image, placing it on the PDF is separate.
   *  Centers the signature on wherever the user tapped with the pencil cursor to get here, instead
   *  of always dropping it at a generic default spot — clamped to stay inside the page surface. */
  const startPlacing = () => {
    const point = clickPointRef.current;
    const surface = pageSurfaceRef.current;
    if (point && surface) {
      const { width: surfaceWidth, height: surfaceHeight } = surface.getBoundingClientRect();
      const { width, height } = DEFAULT_FRAME;
      const x = Math.min(Math.max(0, point.x - width / 2), Math.max(0, surfaceWidth - width));
      const y = Math.min(Math.max(0, point.y - height / 2), Math.max(0, surfaceHeight - height));
      setFrame({ ...DEFAULT_FRAME, x, y });
    } else {
      setFrame(DEFAULT_FRAME);
    }
    setPlacing(true);
    setSignatureModalOpen(false);
  };

  const handleSignWithoutDocument = () => {
    if (!savedSignature) return;
    signContract(contract.id, {
      signedByName: mockArtist.name,
      placement: { page: 1, xPct: 0, yPct: 0, widthPct: 0, rotation: 0 },
    });
    setJustSigned(true);
  };

  const handleConfirmSignature = async () => {
    if (!savedSignature || !contract.documentUrl) return;
    const surface = pageSurfaceRef.current;
    if (!surface) return;

    setSigning(true);
    setSignError(null);
    try {
      const { width: surfaceWidth, height: surfaceHeight } = surface.getBoundingClientRect();
      const placement: SignaturePlacement = {
        page,
        xPct: (frame.x / surfaceWidth) * 100,
        yPct: (frame.y / surfaceHeight) * 100,
        widthPct: (frame.width / surfaceWidth) * 100,
        rotation: frame.rotation,
      };

      const res = await fetch(contract.documentUrl);
      const originalBytes = await res.arrayBuffer();
      const signedBytes = await embedSignatureInPdf(originalBytes, savedSignature.imageDataUrl, placement);

      signContract(contract.id, {
        signedByName: mockArtist.name,
        placement,
        signedDocumentBytes: signedBytes,
      });
      setPlacing(false);
      setJustSigned(true);
      // Once signed, the full PDF viewer isn't needed anymore — collapse it
      // back so the page settles on the compact, "done" view.
      setPdfExpanded(false);
      /** Ease up to the Download button — that's the point of this whole flow:
       *  you now have a real signed PDF, worth keeping your own copy of regardless
       *  of anything happening to Proton's side. `block: "center"` lands softer
       *  than "start" (less of a hard snap to the very top). */
      setShowDownloadHint(true);
      requestAnimationFrame(() => {
        downloadRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      window.setTimeout(() => setShowDownloadHint(false), 3200);
    } catch (err) {
      setSignError(err instanceof Error ? err.message : "Couldn't sign this document — try again.");
    } finally {
      setSigning(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10">
      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Contracts", href: "/dashboard/contracts" },
        { label: contract.release },
      ]} />

      <Link
        href="/dashboard/contracts"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
      >
        <ChevronLeft size={16} />
        Back to contracts
      </Link>

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-0.5">{contract.release}</h1>
          <p className="text-sm text-text-secondary">{contract.label}</p>
        </div>
        {hasDocument && (
          <a
            ref={downloadRef}
            href={contract.documentUrl!}
            download={`${contract.release}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary ${
              showDownloadHint ? "animate-glow-confirm" : ""
            }`}
          >
            <FileDown size={13} /> Download
          </a>
        )}
      </div>

      {hasDocument && (
        <div
          className={`overflow-hidden transition-all duration-700 ease-in-out ${
            showDownloadHint ? "mb-6 max-h-16 opacity-100" : "mb-0 max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-start gap-2 rounded-xl border border-accent/25 bg-accent/5 px-3 py-2.5 text-xs text-text-secondary">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-accent" />
            <span>
              Signed — your copy is ready above. Worth downloading it for your own records,
              independent of Proton.
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <ContractKeyDates dates={contract.keyDates} />

        {hasDocument && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
            <button
              type="button"
              onClick={() => setPdfExpanded((v) => !v)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[var(--color-border)]/20"
              aria-expanded={pdfExpanded}
            >
              <FileText size={16} className="text-text-secondary shrink-0" />
              <span className="flex-1 min-w-0 truncate text-sm font-medium text-text-primary">
                {contract.release}.pdf
              </span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-text-secondary transition-transform ${pdfExpanded ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                pdfExpanded ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-[var(--color-border)] p-4">
                <PdfContractViewer
                  fileUrl={contract.documentUrl!}
                  page={page}
                  onPageChange={setPage}
                  onPageSurfaceRef={(el) => { pageSurfaceRef.current = el; }}
                >
                  {placing ? (
                    <SignatureOverlay imageUrl={savedSignature!.imageDataUrl} frame={frame} onChange={setFrame} />
                  ) : contract.status === "pending_signature" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        const rect = pageSurfaceRef.current?.getBoundingClientRect();
                        clickPointRef.current = rect
                          ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
                          : null;
                        setSignatureModalOpen(true);
                      }}
                      aria-label="Sign this document"
                      title="Click to sign"
                      className="absolute inset-0"
                      style={{
                        cursor:
                          'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 2 4 4"/><path d="m2 22 1-5 12.5-12.5a2.121 2.121 0 0 1 3 3L6 20l-5 1"/></svg>\') 2 22, pointer',
                      }}
                    />
                  ) : null}
                </PdfContractViewer>
              </div>
            </div>

            {placing && (
              <div className="border-t border-[var(--color-border)] p-4">
                <div className="rounded-xl border border-accent/30 bg-accent/5 p-3">
                  <p
                    className={`mb-2 inline-block rounded-md px-1.5 py-1 text-xs text-text-secondary ${
                      !readyToConfirm ? "animate-glow-accent" : ""
                    }`}
                  >
                    Drag, resize, or rotate your signature onto the document above, then confirm.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmSignature}
                      disabled={signing}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${
                        readyToConfirm && !signing ? "animate-glow-confirm" : ""
                      }`}
                    >
                      {signing ? <Loader2 size={14} className="animate-spin" /> : <PenLine size={14} />}
                      {signing ? "Signing…" : "Confirm & sign"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlacing(false)}
                      disabled={signing}
                      className="rounded-lg border border-[var(--color-border)] bg-surface px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                      aria-label="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  {signError && <p className="mt-2 text-xs text-red-500">{signError}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {contract.status === "signed" && contract.signature && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <h2 className="text-sm font-semibold text-text-primary">Signed &amp; verified</h2>
            </div>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li>Signed by <span className="font-medium text-text-primary">{contract.signature.signedByName}</span></li>
              <li>Date: <span className="font-medium text-text-primary">{formatDate(contract.signature.signedAt)}</span></li>
              <li>Document hash: <span className="font-mono text-text-primary">{contract.signature.documentHash}</span></li>
            </ul>
          </div>
        )}

        {contract.status === "pending_signature" && !placing && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
            <h2 className="mb-1 text-sm font-semibold text-text-primary">Sign this contract</h2>

            {hasDocument ? (
              <div className="space-y-2">
                <p className="mb-3 text-xs text-text-secondary">
                  Open the document above and click it to place your signature — it gets embedded in
                  the PDF itself, with a verifiable record of who signed and when.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Opened from this button, not a tap on the PDF itself — no click
                    // position to honor, fall back to the default placement spot.
                    clickPointRef.current = null;
                    if (!pdfExpanded) setPdfExpanded(true);
                    setSignatureModalOpen(true);
                  }}
                  className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Sign this contract
                </button>
              </div>
            ) : savedSignature ? (
              <div className="space-y-4">
                <p className="mb-1 text-xs text-text-secondary">
                  Signing here creates a verifiable record — your name, the date, and a hash of this
                  document — right in your Proton account. No printing, no email.
                </p>
                <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={savedSignature.imageDataUrl} alt="Your saved signature" className="h-16 object-contain mx-auto" />
                </div>
                <button
                  type="button"
                  onClick={handleSignWithoutDocument}
                  className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Sign contract as {mockArtist.name}
                </button>
                <Link
                  href="/dashboard/settings/account/signature"
                  className="block text-center text-xs text-text-secondary hover:text-text-primary"
                >
                  Use a different signature
                </Link>
              </div>
            ) : (
              <SignatureCanvas
                onSave={(sig) => {
                  setSavedSignature({ ...sig, createdAt: new Date().toISOString() });
                }}
              />
            )}

            {justSigned && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} className="shrink-0" />
                Signed. This contract is now active.
              </div>
            )}
          </div>
        )}
      </div>

      {signatureModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSignatureModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary">Sign this contract</h2>
              <button
                type="button"
                onClick={() => setSignatureModalOpen(false)}
                className="text-text-secondary transition-colors hover:text-text-primary"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {savedSignature ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={savedSignature.imageDataUrl} alt="Your saved signature" className="h-16 object-contain mx-auto" />
                </div>
                <button
                  type="button"
                  onClick={startPlacing}
                  className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Use this signature
                </button>
                <Link
                  href="/dashboard/settings/account/signature"
                  className="block text-center text-xs text-text-secondary hover:text-text-primary"
                >
                  Use a different signature
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-4 text-xs text-text-secondary">
                  You don&apos;t have a signature saved yet — create one below to place on the document.
                </p>
                <SignatureCanvas
                  onSave={(sig) => {
                    setSavedSignature({ ...sig, createdAt: new Date().toISOString() });
                    startPlacing();
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
