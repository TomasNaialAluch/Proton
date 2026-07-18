"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Upload, X, FileAudio, Send, CheckCircle2 } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import type { ProtonLabel } from "@/types/label";

const ACCEPTED_EXTENSIONS = [".wav", ".mp3"];
const MAX_SIZE_MB = 100;

function isAcceptedFile(file: File) {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ACCEPTED_EXTENSIONS.includes(ext);
}

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Submit-your-remix uploader for a contest — same file validation as
 * SubmitTrackForm's demo uploader, but scoped to a single contest instead
 * of a label's general demo intake, and sends a `contest_entry` attachment
 * instead of free text. One entry per producer, no replacing it once sent
 * — see docs/feature-contest-flow.md.
 */
export default function ContestSubmitCard({
  label,
  contestId,
  contestTitle,
  trackId,
}: {
  label: ProtonLabel;
  contestId: string;
  contestTitle: string;
  trackId: string;
}) {
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;

    if (!isAcceptedFile(f)) {
      setFileError("Only .wav or .mp3 files are accepted.");
      setFile(null);
      e.target.value = "";
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large — max ${MAX_SIZE_MB} MB.`);
      setFile(null);
      e.target.value = "";
      return;
    }
    setFileError(null);
    setFile(f);
  };

  const removeFile = () => {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = () => {
    if (!file) return;
    const id = sendLabelRequest({
      label,
      kind: "contest",
      text: `I'd like to submit a remix for "${contestTitle}".`,
      attachment: {
        type: "contest_entry",
        contestId,
        trackId,
        fileName: file.name,
        fileType: file.type || (file.name.toLowerCase().endsWith(".wav") ? "audio/wav" : "audio/mpeg"),
        fileSize: file.size,
      },
    });
    setConversationId(id);
    setEntered(true);
  };

  if (entered) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={16} className="shrink-0" />
          Remix sent.
          {conversationId && (
            <Link href={`/dashboard/labels/chat/${conversationId}`} className="font-semibold underline underline-offset-2">
              View conversation
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-3">Submit your remix</h2>

      {file ? (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-background px-3 py-2.5">
          <FileAudio size={16} className="text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary truncate">{file.name}</p>
            <p className="text-xs text-text-secondary">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            aria-label="Remove file"
            className="shrink-0 rounded-md p-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed
            border-[var(--color-border)] bg-background px-3 py-8 text-text-secondary
            hover:border-accent/50 hover:text-text-primary transition-colors"
        >
          <Upload size={18} />
          <span className="text-xs">Drop your remix, or click to upload — .wav or .mp3</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".wav,.mp3,audio/wav,audio/mpeg"
        onChange={handleFileChange}
        className="hidden"
      />

      {fileError && <p className="mt-1.5 text-xs text-red-500">{fileError}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={!file}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5
          text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <Send size={14} /> Submit to {label.name}
      </button>
    </div>
  );
}
