"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, Upload, X, FileAudio } from "lucide-react";
import { useLabelSubmissionsStore } from "@/lib/store/labelSubmissionsStore";

const ACCEPTED_EXTENSIONS = [".wav", ".mp3"];
const MAX_SIZE_MB = 100;

function isAcceptedFile(file: File) {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ACCEPTED_EXTENSIONS.includes(ext);
}

function formatSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Demo submission form, scoped to a single label — file upload restricted to the label's accepted genres. */
export default function SubmitTrackForm({
  labelSlug,
  labelName,
  acceptedGenres,
}: {
  labelSlug: string;
  labelName: string;
  acceptedGenres: string[];
}) {
  const submitTrack = useLabelSubmissionsStore((s) => s.submitTrack);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [genre, setGenre] = useState(acceptedGenres[0] ?? "");
  const [note, setNote] = useState("");
  const [justSent, setJustSent] = useState(false);

  const canSubmit = file !== null && genre !== "";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !canSubmit) return;

    submitTrack({
      labelSlug,
      note,
      genre,
      fileName: file.name,
      fileType: file.type || (file.name.toLowerCase().endsWith(".wav") ? "audio/wav" : "audio/mpeg"),
      fileSize: file.size,
    });

    removeFile();
    setNote("");
    setJustSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-border)] bg-surface p-5 space-y-4">
      <h2 className="text-sm font-semibold text-text-primary">Send a demo to {labelName}</h2>

      {/* File upload */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-secondary">
          Track file <span className="text-text-secondary/60">(.wav or .mp3, max {MAX_SIZE_MB} MB)</span>
        </label>

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
              border-[var(--color-border)] bg-background px-3 py-6 text-text-secondary
              hover:border-accent/50 hover:text-text-primary transition-colors"
          >
            <Upload size={16} />
            <span className="text-xs">Click to upload a WAV or MP3</span>
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
      </div>

      {/* Genre — restricted to what this label accepts */}
      <div>
        <label htmlFor="submit-genre" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Genre
        </label>
        <select
          id="submit-genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          disabled={acceptedGenres.length === 0}
          className="w-full rounded-lg border border-[var(--color-border)] bg-background px-3 py-2.5 text-sm text-text-primary disabled:opacity-50"
        >
          {acceptedGenres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        {acceptedGenres.length > 0 && (
          <p className="mt-1.5 text-xs text-text-secondary">
            {labelName} accepts: {acceptedGenres.join(", ")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="submit-note" className="mb-1.5 block text-xs font-medium text-text-secondary">
          Description (optional)
        </label>
        <textarea
          id="submit-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={`Tell ${labelName} why this track fits their catalog…`}
          className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-background px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60"
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        <Send size={14} /> Send to {labelName}
      </button>

      {justSent && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={13} className="shrink-0" />
          Sent. Track it under{" "}
          <Link href="/dashboard/labels/submissions" className="font-semibold underline underline-offset-2">
            Submissions
          </Link>.
        </div>
      )}
    </form>
  );
}
