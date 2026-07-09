"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";

/**
 * Viewer shell for a contract that already lives on Proton's real records —
 * same card/header chrome as `PdfContractViewer`, so `ContractRecordClient`
 * reads as "the same kind of screen" as `ContractSignClient`, not a dead end.
 *
 * Doesn't embed the real page yet (soundsystem.protonradio.com likely blocks
 * framing behind its own auth) — that's the planned next step once there's a
 * sanctioned way to embed it. For now this is the honest placeholder: a
 * clearly-labeled card that opens the real record in a new tab.
 */
export default function RealContractViewer({ realContractUrl }: { realContractUrl: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)]">
        <span className="text-xs text-text-secondary">Proton contract record</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-emerald-500/10">
          <ShieldCheck size={20} className="text-emerald-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">This contract is on file with Proton</p>
          <p className="mt-1 text-xs text-text-secondary max-w-xs">
            It was signed directly on soundsystem.protonradio.com — open the record there to view it.
          </p>
        </div>
        <a
          href={realContractUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Open contract record <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
