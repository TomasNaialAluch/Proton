"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Search, X, BadgeCheck, Clock, Upload, FileAudio } from "lucide-react";
import { mockArtist } from "@/lib/mock/artist";
import { mockTracks } from "@/lib/mock/tracks";
import { PEER_TRACKS } from "@/lib/mock/peerTracks";
import { LABEL_SAMPLE_TRACKS } from "@/lib/mock/labelSampleCatalog";
import { useDjMixesStore } from "@/lib/store/djMixesStore";
import { useShowSubmissionsStore } from "@/lib/store/showSubmissionsStore";
import type { DjMixTracklistEntry } from "@/types/djMix";

/** Everything "known" in Proton's own catalog, in this prototype — used to
 *  match a typed track name against a real track. Proton only distributes
 *  ~1500 labels, a small slice of all electronic music, so most tracks a
 *  DJ actually plays in a mix won't match anything here — that's expected,
 *  not a bug, and the tracklist row is kept as free text in that case. */
const KNOWN_TRACKS = [...mockTracks, ...PEER_TRACKS, ...LABEL_SAMPLE_TRACKS];

const GENRES = ["Breaks", "Downtempo", "Deep House", "Electro", "Electronica", "Progressive", "Tech House", "Techno"];

const ACCEPTED_AUDIO_EXTENSIONS = [".mp3", ".wav", ".flac", ".aiff", ".aif"];
const MAX_AUDIO_SIZE_MB = 300;

function isAcceptedAudioFile(file: File) {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ACCEPTED_AUDIO_EXTENSIONS.includes(ext);
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Shared track-search input — type a name, autocomplete against
 * `KNOWN_TRACKS`, add as a linked or free-text tracklist row. Used by
 * both DJ Mixes and Shows, since a tracklist is the same concept in both.
 */
function TracklistInput({
  tracklist,
  setTracklist,
}: {
  tracklist: DjMixTracklistEntry[];
  setTracklist: (updater: (prev: DjMixTracklistEntry[]) => DjMixTracklistEntry[]) => void;
}) {
  const [trackInput, setTrackInput] = useState("");

  const suggestions = useMemo(() => {
    const q = trackInput.trim().toLowerCase();
    if (q.length < 2) return [];
    const alreadyAdded = new Set(tracklist.map((t) => t.trackId).filter(Boolean));
    return KNOWN_TRACKS.filter((t) => !alreadyAdded.has(t.id) && t.title.toLowerCase().includes(q)).slice(0, 6);
  }, [trackInput, tracklist]);

  const addFreeText = () => {
    const name = trackInput.trim();
    if (!name) return;
    setTracklist((prev) => [...prev, { name }]);
    setTrackInput("");
  };

  const addMatched = (track: (typeof KNOWN_TRACKS)[number]) => {
    setTracklist((prev) => [...prev, { name: track.title, trackId: track.id }]);
    setTrackInput("");
  };

  const removeTrack = (index: number) => {
    setTracklist((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFreeText();
                }
              }}
              placeholder="Type a track name…"
              className="w-full rounded-md border border-[var(--color-border)] bg-surface py-2 pl-8 pr-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="button"
            onClick={addFreeText}
            disabled={!trackInput.trim()}
            className="shrink-0 rounded-md border border-[var(--color-border)] px-2.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary disabled:opacity-40"
          >
            Add
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border border-[var(--color-border)] bg-surface shadow-lg overflow-hidden">
            {suggestions.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => addMatched(t)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-primary hover:bg-[var(--color-border)] transition-colors"
                >
                  <BadgeCheck size={12} className="shrink-0 text-accent" />
                  <span className="min-w-0 flex-1 truncate">{t.title}</span>
                  <span className="shrink-0 text-text-secondary">on Proton</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs leading-relaxed text-text-secondary">
        Most tracks won&apos;t match anything — Proton only distributes ~1,500 labels, a small
        slice of all electronic music. Pick a suggestion to link a real track, or just add the
        name as typed.
      </p>

      {tracklist.length > 0 && (
        <ol className="space-y-1">
          {tracklist.map((entry, i) => (
            <li
              key={`${entry.name}-${i}`}
              className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-surface px-2.5 py-1.5 text-xs"
            >
              <span className="shrink-0 text-text-secondary">{i + 1}.</span>
              <span className="min-w-0 flex-1 truncate text-text-primary">{entry.name}</span>
              {entry.trackId && (
                <span className="flex shrink-0 items-center gap-1 text-[10px] text-accent">
                  <BadgeCheck size={11} /> on Proton
                </span>
              )}
              <button
                type="button"
                onClick={() => removeTrack(i)}
                aria-label={`Remove ${entry.name}`}
                className="shrink-0 text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export type PlatformTabId = "shows" | "labels" | "dj-mixes";

const VALID: PlatformTabId[] = ["shows", "labels", "dj-mixes"];

function parseTab(raw: string | null): PlatformTabId {
  if (raw && VALID.includes(raw as PlatformTabId)) return raw as PlatformTabId;
  return "shows";
}

const HEADERS: Record<PlatformTabId, { title: string; subtitle: string }> = {
  shows: { title: "Shows", subtitle: "Upload & schedule broadcasts on Proton Radio" },
  labels: { title: "Labels", subtitle: "Apply to launch & manage your music label" },
  "dj-mixes": { title: "DJ Mixes", subtitle: "Upload mixes to Spotify & Apple Music (New!)" },
};

/**
 * No longer a hub with its own tile-switcher — each area (Shows, Labels,
 * DJ Mixes) is now reached directly from its own sidebar link (Shows/DJ
 * Mixes under Producer tools, Labels under Extras — see
 * docs/analisis-platform-integracion.md), not by browsing tiles inside a
 * shared "Platform" page. This component just renders whichever panel the
 * `tab` query param points at.
 */
export default function PlatformHubClient() {
  const searchParams = useSearchParams();
  const tab = useMemo(
    () => parseTab(searchParams.get("tab")),
    [searchParams]
  );
  const { title, subtitle } = HEADERS[tab];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6 lg:px-8 lg:pb-10 lg:pt-8">
      <header className="mb-6">
        <h1
          className="font-display text-xl font-bold italic text-text-primary md:text-2xl"
        >
          {title}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        <p className="mt-2 text-xs text-text-secondary">
          Prototype only: read-only copy of how this area works on the real product (SoundSystem).
        </p>
      </header>

      <section
        className="rounded-2xl border border-[var(--color-border)] bg-surface p-5 shadow-sm sm:p-6"
        aria-live="polite"
      >
        {tab === "shows" && <ShowsPanel />}
        {tab === "labels" && <LabelsPanel />}
        {tab === "dj-mixes" && <DjMixesPanel />}
      </section>
    </div>
  );
}

/**
 * A show submission is its own upload — genre, description, tracklist,
 * same shape as a DJ mix, plus an actual audio file (mp3/wav/flac/aiff).
 * Turning an accepted submission into a broadcast/video is Proton's job,
 * not something this form simulates. Saved as a `ShowSubmission` in
 * `useShowSubmissionsStore`. Mailto to Bonnie kept alongside — that's
 * still how it really works, invitation-only, reviewed by a human. See
 * docs/analisis-platform-integracion.md.
 */
function ShowsPanel() {
  const submissions = useShowSubmissionsStore((s) => s.submissions);
  const submitDemo = useShowSubmissionsStore((s) => s.submitDemo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [description, setDescription] = useState("");
  const [tracklist, setTracklist] = useState<DjMixTracklistEntry[]>([]);

  const mySubmissions = submissions
    .filter((s) => s.artistId === mockArtist.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const latest = mySubmissions[0] ?? null;

  const canSubmit = file !== null && title.trim().length > 0 && tracklist.length > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!isAcceptedAudioFile(f)) {
      setFileError("Only .mp3, .wav, .flac, or .aiff files are accepted.");
      setFile(null);
      e.target.value = "";
      return;
    }
    if (f.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
      setFileError(`File is too large — max ${MAX_AUDIO_SIZE_MB} MB.`);
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
    if (!file || !canSubmit) return;
    submitDemo({
      artistId: mockArtist.id,
      title: title.trim(),
      genre,
      description: description.trim() || undefined,
      fileName: file.name,
      fileType: file.type || "audio/mpeg",
      fileSize: file.size,
      tracklist,
    });
    removeFile();
    setTitle("");
    setDescription("");
    setTracklist([]);
  };

  return (
    <div className="space-y-4 text-sm leading-relaxed text-text-primary">
      <p>Radio shows on Proton Radio are by invitation only.</p>
      <p>
        Get started by submitting a demo mix to{" "}
        <a
          href="mailto:bonnie@protonradio.com"
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          Bonnie
        </a>
        {" "}— or upload one here instead.
      </p>

      {latest && (
        <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-xs text-text-secondary">
          <Clock size={12} className="shrink-0 text-amber-500" />
          <span>
            &ldquo;{latest.title}&rdquo; ({formatDate(latest.createdAt)}) is{" "}
            <strong className="text-text-primary">pending review</strong>.
          </span>
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-background/60 p-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">
            Set file <span className="text-text-secondary/60">(.mp3, .wav, .flac, or .aiff, max {MAX_AUDIO_SIZE_MB} MB)</span>
          </label>
          {file ? (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-surface px-3 py-2.5">
              <FileAudio size={16} className="text-accent shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-text-primary">{file.name}</p>
                <p className="text-xs text-text-secondary">{formatFileSize(file.size)}</p>
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
                border-[var(--color-border)] bg-surface px-3 py-6 text-text-secondary
                hover:border-accent/50 hover:text-text-primary transition-colors"
            >
              <Upload size={16} />
              <span className="text-xs">Click to upload your recorded set</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.flac,.aiff,.aif,audio/mpeg,audio/wav,audio/flac,audio/aiff"
            onChange={handleFileChange}
            className="hidden"
          />
          {fileError && <p className="mt-1.5 text-xs text-red-500">{fileError}</p>}
        </div>

        <div>
          <label htmlFor="show-title" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Title
          </label>
          <input
            id="show-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Set title"
            className="w-full rounded-md border border-[var(--color-border)] bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="show-genre" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Genre
          </label>
          <select
            id="show-genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="show-description" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Description
          </label>
          <textarea
            id="show-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="What's this set about — mood, occasion, story behind it…"
            className="w-full resize-none rounded-md border border-[var(--color-border)] bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-text-secondary">Tracklist</span>
          <TracklistInput tracklist={tracklist} setTracklist={setTracklist} />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="rounded-md bg-[#E67E22] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit for review
        </button>
        <p className="text-xs text-text-secondary">
          Turning an accepted set into an official broadcast (and its video) is handled by Proton
          — not part of this form.
        </p>
      </div>

      <Link
        href="/shows"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)]
          bg-background px-3 py-2 text-xs font-semibold text-text-primary transition-colors
          hover:bg-[var(--color-border)]"
      >
        See published shows on Proton Radio
        <ArrowRight size={12} className="shrink-0" />
      </Link>
      <p className="text-xs text-text-secondary">
        Leaves the dashboard — that&apos;s where a show would show up once you&apos;re invited.
      </p>
    </div>
  );
}

function LabelsPanel() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-text-primary">
      <p>
        Over <strong>1500</strong> labels are <strong>managed and distributed</strong> on
        SoundSystem.
      </p>
      <p>
        Want to learn more? Check out:{" "}
        <a
          href="https://www.protonradio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#1ABC9C] underline-offset-2 hover:underline"
        >
          Read our FAQ for new labels!
        </a>
      </p>
      <p>
        Want to join? <strong>New and existing labels are welcome.</strong>
      </p>
      <p>
        To get started, email:{" "}
        <a
          href="mailto:launch@protonradio.com"
          className="font-semibold text-[#1ABC9C] underline-offset-2 hover:underline"
        >
          launch@protonradio.com
        </a>
      </p>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Real (prototype-real, not distributed-to-DSPs-real) "Create New Mix"
 * flow — title + a tracklist built by typing track names. Typing
 * autocompletes against `KNOWN_TRACKS` (anything in Proton's own mock
 * catalog); picking a suggestion links that row to a real track, just
 * pressing enter/Add keeps it as free text — most tracks in a real DJ mix
 * aren't on Proton at all, so free text has to be the default, not the
 * exception. Same two agreement checkboxes the real form has. Creates a
 * `DjMix` in `useDjMixesStore`, listed below by status. See
 * docs/analisis-platform-integracion.md.
 */
function DjMixesPanel() {
  const mixes = useDjMixesStore((s) => s.mixes);
  const createMix = useDjMixesStore((s) => s.createMix);
  const publishMix = useDjMixesStore((s) => s.publishMix);

  const [title, setTitle] = useState("");
  const [tracklist, setTracklist] = useState<DjMixTracklistEntry[]>([]);
  const [readGuide, setReadGuide] = useState(false);
  const [agreedTrackStack, setAgreedTrackStack] = useState(false);

  const myMixes = mixes.filter((m) => m.artistId === mockArtist.id);
  const inDevelopment = myMixes.filter((m) => m.status === "in_development");
  const published = myMixes.filter((m) => m.status === "published");

  const canSubmit = title.trim().length > 0 && tracklist.length > 0 && readGuide && agreedTrackStack;

  const submit = () => {
    if (!canSubmit) return;
    createMix({ artistId: mockArtist.id, title: title.trim(), tracklist });
    setTitle("");
    setTracklist([]);
    setReadGuide(false);
    setAgreedTrackStack(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 text-text-primary">
      <p className="text-xs text-text-secondary">
        Layout mirrors the real SoundSystem DJ Mixes screen. Creating a mix here is real within the
        prototype (saved locally) — it&apos;s not connected to Spotify/Apple Music distribution.
      </p>

      <section className="space-y-4" aria-labelledby="dj-create-heading">
        <h2 id="dj-create-heading" className="text-base font-bold text-text-primary md:text-lg">
          Create New Mix
        </h2>
        <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-background/60 p-4 sm:p-5">
          <div className="grid gap-1.5 sm:grid-cols-[6rem_1fr] sm:items-center">
            <label htmlFor="dj-mix-dj" className="text-sm font-medium text-text-secondary">
              DJ
            </label>
            <select
              id="dj-mix-dj"
              disabled
              className="w-full max-w-md rounded-md border-0 bg-[#1ABC9C] px-3 py-2 text-sm font-medium text-white opacity-90"
              defaultValue={mockArtist.id}
            >
              <option value={mockArtist.id}>{mockArtist.name}</option>
            </select>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-[6rem_1fr] sm:items-start">
            <label htmlFor="dj-mix-title" className="text-sm font-medium text-text-secondary sm:pt-2">
              Title
            </label>
            <div className="min-w-0 max-w-md space-y-2">
              <input
                id="dj-mix-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mix title"
                className="w-full rounded-md border border-[var(--color-border)] bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <p className="text-xs leading-relaxed text-text-secondary">
                Don&apos;t repeat your Artist name in the title of the DJ Mix, please. Also,
                please don&apos;t include &apos;DJ Mix&apos; in the title. That gets added
                automatically!
              </p>
            </div>
          </div>

          <div className="grid gap-1.5 sm:grid-cols-[6rem_1fr] sm:items-start">
            <span className="text-sm font-medium text-text-secondary sm:pt-2">Tracklist</span>
            <div className="min-w-0 max-w-md">
              <TracklistInput tracklist={tracklist} setTracklist={setTracklist} />
            </div>
          </div>

          <ul className="space-y-3 text-sm leading-snug">
            <li className="flex gap-2">
              <input
                type="checkbox"
                checked={readGuide}
                onChange={(e) => setReadGuide(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-[var(--color-border)]"
              />
              <span>
                I&apos;ve read{" "}
                <span className="font-semibold text-[#1ABC9C]">the guide</span> and understand how
                this works!
              </span>
            </li>
            <li className="flex gap-2">
              <input
                type="checkbox"
                checked={agreedTrackStack}
                onChange={(e) => setAgreedTrackStack(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-[var(--color-border)]"
              />
              <span>
                I agree to tracklist my mixes correctly and only play tracks from my{" "}
                <span className="font-semibold text-[#1ABC9C]">Track Stack</span>.
              </span>
            </li>
          </ul>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="rounded-md bg-[#9B59B6] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create New DJ Mix
          </button>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="dj-dev-heading">
        <h2 id="dj-dev-heading" className="text-base font-bold text-text-primary md:text-lg">
          Mixes in Development
        </h2>
        {inDevelopment.length === 0 ? (
          <p className="text-xs text-text-secondary">No mixes in development.</p>
        ) : (
          <ul className="space-y-2">
            {inDevelopment.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-surface px-3 py-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">{m.title}</p>
                  <p className="text-xs text-text-secondary">
                    {m.tracklist.length} track{m.tracklist.length === 1 ? "" : "s"} · {formatDate(m.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => publishMix(m.id)}
                  className="shrink-0 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
                >
                  Mark as published
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="dj-published-heading">
        <h2 id="dj-published-heading" className="text-base font-bold text-text-primary md:text-lg">
          Published Mixes
        </h2>
        {published.length === 0 ? (
          <p className="text-xs text-text-secondary">No published mixes yet.</p>
        ) : (
          <ul className="space-y-2">
            {published.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-surface px-3 py-2 text-sm"
              >
                <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">{m.title}</p>
                  <p className="text-xs text-text-secondary">
                    {m.tracklist.length} track{m.tracklist.length === 1 ? "" : "s"} · {formatDate(m.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
