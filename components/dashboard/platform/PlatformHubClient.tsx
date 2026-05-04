"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { mockArtist } from "@/lib/mock/artist";

export type PlatformTabId = "shows" | "labels" | "dj-mixes" | "account";

const VALID: PlatformTabId[] = ["shows", "labels", "dj-mixes", "account"];

function parseTab(raw: string | null): PlatformTabId {
  if (raw && VALID.includes(raw as PlatformTabId)) return raw as PlatformTabId;
  return "shows";
}

const TILES: {
  id: PlatformTabId;
  title: string;
  subtitle: string;
  bg: string;
}[] = [
  {
    id: "shows",
    title: "Shows",
    subtitle: "Upload & schedule broadcasts on Proton Radio",
    bg: "#E67E22",
  },
  {
    id: "labels",
    title: "Labels",
    subtitle: "Manage your music label & view daily reports",
    bg: "#1ABC9C",
  },
  {
    id: "dj-mixes",
    title: "DJ Mixes",
    subtitle: "Upload mixes to Spotify & Apple Music (New!)",
    bg: "#9B59B6",
  },
  {
    id: "account",
    title: "Account",
    subtitle: "View your royalty statements & update your info",
    bg: "#27AE60",
  },
];

export default function PlatformHubClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = useMemo(
    () => parseTab(searchParams.get("tab")),
    [searchParams]
  );

  const setTab = useCallback(
    (id: PlatformTabId) => {
      router.replace(`/dashboard/platform?tab=${id}`, { scroll: false });
    },
    [router]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-6 lg:px-8 lg:pb-10 lg:pt-8">
      <header className="mb-6">
        <h1
          className="font-display text-xl font-bold italic text-text-primary md:text-2xl"
        >
          SoundSystem — platform areas
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Prototype only: tap a tile to read how each area works on the real product. No
          management tools are wired here yet.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {TILES.map(({ id, title, subtitle, bg }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-pressed={active}
              className={`flex min-h-[5.5rem] flex-col justify-end rounded-lg p-3 text-left text-white shadow-md transition
                sm:min-h-[6.25rem] sm:p-4
                ${active ? "ring-2 ring-white ring-offset-2 ring-offset-background" : "opacity-95 hover:opacity-100"}`}
              style={{ backgroundColor: bg }}
            >
              <span className="font-display text-base font-bold italic leading-tight sm:text-lg">
                {title}
              </span>
              <span className="mt-1 text-[10px] font-medium leading-snug text-white/95 sm:text-[11px]">
                {subtitle}
              </span>
            </button>
          );
        })}
      </div>

      <section
        className="mt-4 rounded-2xl border border-[var(--color-border)] bg-surface p-5 shadow-sm sm:mt-6 sm:p-6"
        aria-live="polite"
      >
        {tab === "shows" && <ShowsPanel />}
        {tab === "labels" && <LabelsPanel />}
        {tab === "dj-mixes" && <DjMixesPanel />}
        {tab === "account" && <AccountPanel />}
      </section>
    </div>
  );
}

function ShowsPanel() {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-text-primary">
      <p>Radio shows on Proton Radio are by invitation only.</p>
      <p>
        Get started by submitting a demo mix to{" "}
        <a
          href="mailto:bonnie@protonradio.com"
          className="font-semibold text-accent underline-offset-2 hover:underline"
        >
          Bonnie
        </a>
        .
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

function DjMixesPanel() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 text-text-primary">
      <p className="text-xs text-text-secondary">
        Layout mirrors the real SoundSystem DJ Mixes screen. This prototype is not connected to
        uploads or DSPs — controls below are disabled.
      </p>

      {/* Create New Mix — same blocks as production */}
      <section className="space-y-4" aria-labelledby="dj-create-heading">
        <h2
          id="dj-create-heading"
          className="text-base font-bold text-text-primary md:text-lg"
        >
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
                disabled
                placeholder="Mix title"
                className="w-full rounded-md border border-[var(--color-border)] bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60"
              />
              <p className="text-xs leading-relaxed text-text-secondary">
                Don&apos;t repeat your Artist name in the title of the DJ Mix, please. Also,
                please don&apos;t include &apos;DJ Mix&apos; in the title. That gets added
                automatically!
              </p>
            </div>
          </div>
          <ul className="space-y-3 text-sm leading-snug">
            <li className="flex gap-2">
              <input type="checkbox" disabled className="mt-0.5 size-4 shrink-0 rounded border-[var(--color-border)]" />
              <span>
                I&apos;ve read{" "}
                <span className="font-semibold text-[#1ABC9C]">the guide</span> and understand how
                this works!
              </span>
            </li>
            <li className="flex gap-2">
              <input type="checkbox" disabled className="mt-0.5 size-4 shrink-0 rounded border-[var(--color-border)]" />
              <span>
                I agree to tracklist my mixes correctly and only play tracks from my{" "}
                <span className="font-semibold text-[#1ABC9C]">Track Stack</span>.
              </span>
            </li>
          </ul>
          <button
            type="button"
            disabled
            className="rounded-md bg-text-secondary/30 px-4 py-2.5 text-sm font-semibold text-text-primary/80"
          >
            Create New DJ Mix
          </button>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="dj-dev-heading">
        <h2 id="dj-dev-heading" className="text-base font-bold text-text-primary md:text-lg">
          Mixes in Development
        </h2>
        <ul className="space-y-2.5" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="h-9 w-full rounded-md bg-[var(--color-border)]/70"
            />
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="dj-published-heading">
        <div
          className="mb-1 h-10 w-full max-w-full rounded-md bg-[var(--color-border)]/80 sm:max-w-xl"
          aria-hidden
        />
        <h2 id="dj-published-heading" className="text-base font-bold text-text-primary md:text-lg">
          Published Mixes
        </h2>
        <ul className="space-y-2.5" aria-hidden>
          {Array.from({ length: 11 }).map((_, i) => (
            <li
              key={i}
              className="h-9 w-full rounded-md bg-[var(--color-border)]/70"
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

function AccountPanel() {
  return (
    <div className="space-y-4 text-sm leading-relaxed text-text-primary">
      <p>
        Royalties, statements, payment methods, and profile data live under the main dashboard
        navigation (Royalties, Settings, Artist profile).
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/royalties"
          className="inline-flex rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          Open Royalties
        </Link>
        <Link
          href="/dashboard/settings/account"
          className="inline-flex rounded-lg border border-[var(--color-border)] bg-surface px-4 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-[var(--color-border)]"
        >
          Account settings
        </Link>
        <Link
          href="/dashboard/settings/profile"
          className="inline-flex rounded-lg border border-[var(--color-border)] bg-surface px-4 py-2 text-xs font-semibold text-text-primary transition-colors hover:bg-[var(--color-border)]"
        >
          Edit profile
        </Link>
      </div>
    </div>
  );
}
