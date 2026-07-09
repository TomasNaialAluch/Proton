"use client";

import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useSignatureStore } from "@/lib/store/signatureStore";
import SignatureCanvas from "@/components/dashboard/producer/contracts/SignatureCanvas";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SignatureSettingsPage() {
  const signature = useSignatureStore((s) => s.signature);
  const setSignature = useSignatureStore((s) => s.setSignature);
  const clearSignature = useSignatureStore((s) => s.clearSignature);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-4
        border-b border-[var(--color-border)] bg-background/80 backdrop-blur-md">
        <Link
          href="/dashboard/settings/account"
          className="size-8 rounded-full flex items-center justify-center
            bg-[var(--color-border)] hover:opacity-80 transition-opacity shrink-0"
        >
          <ChevronLeft size={16} className="text-text-primary" />
        </Link>
        <div>
          <h1 className="text-base font-semibold text-text-primary">Signature</h1>
          <p className="text-xs text-text-secondary">Used to sign contracts sent by labels</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10">
        {signature ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
            <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-white p-3 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={signature.imageDataUrl} alt="Your saved signature" className="h-16 object-contain mx-auto" />
            </div>
            <p className="text-xs text-text-secondary mb-4">
              Saved {formatDate(signature.createdAt)} · {signature.method}
            </p>
            <button
              type="button"
              onClick={clearSignature}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:opacity-80"
            >
              <Trash2 size={12} /> Remove signature
            </button>
          </div>
        ) : (
          <SignatureCanvas
            onSave={(sig) => setSignature({ ...sig, createdAt: new Date().toISOString() })}
          />
        )}

        <p className="mt-6 text-center text-[11px] text-text-secondary">
          Prototype session only — not connected to a real account.
        </p>
      </main>
    </div>
  );
}
