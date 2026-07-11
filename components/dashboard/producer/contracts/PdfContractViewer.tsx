"use client";

import { useState, type ReactNode } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PAGE_WIDTH = 520;

/**
 * In-app PDF reader for a contract document — paginated, no external tab.
 * `children` renders absolutely-positioned inside the page surface, exactly over
 * the rendered page (full height, scrolls with it) — used for the signature
 * placement overlay and the click-to-sign affordance, so both cover the whole
 * document and the coordinate math stays aligned with the page.
 */
export default function PdfContractViewer({
  fileUrl,
  page,
  onPageChange,
  onLoadSuccess,
  onPageSurfaceRef,
  children,
}: {
  fileUrl: string;
  page: number;
  onPageChange: (page: number) => void;
  onLoadSuccess?: (numPages: number) => void;
  onPageSurfaceRef?: (el: HTMLDivElement | null) => void;
  children?: ReactNode;
}) {
  const [numPages, setNumPages] = useState(0);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md p-1.5 text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-xs text-text-secondary">
          Page {page} of {numPages || "…"}
        </span>
        <button
          type="button"
          disabled={numPages === 0 || page >= numPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md p-1.5 text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* items-start: without it, flexbox stretches the page surface to the
          container height instead of the real PDF height — which both clips the
          click overlay and throws off the signature-placement math. */}
      <div className="flex items-start justify-center overflow-auto bg-[var(--color-border)]/20 p-4 max-h-[70vh]">
        <div ref={onPageSurfaceRef} className="relative inline-block">
          <Document
            key={fileUrl}
            file={fileUrl}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
              onLoadSuccess?.(n);
            }}
            loading={
              <div className="flex h-96 w-[520px] items-center justify-center gap-2 text-xs text-text-secondary">
                <Loader2 size={14} className="animate-spin" /> Loading document…
              </div>
            }
          >
            <Page pageNumber={page} width={PAGE_WIDTH} renderTextLayer={false} renderAnnotationLayer={false} />
          </Document>
          {children}
        </div>
      </div>
    </div>
  );
}
