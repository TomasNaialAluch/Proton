"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  X,
  Send,
  Search,
  ChevronRight,
  Home,
  MessageCircle,
  CircleHelp,
} from "lucide-react";
import { mockArtist } from "@/lib/mock/artist";
import { useHelpAssistantStore } from "@/lib/store/helpAssistantStore";

type AssistantTab = "home" | "messages" | "help";

const FAQ_LINKS = [
  "Instant Access to Spotify for Artists (for Artists, not Label Managers)",
  "When are statements and payments sent?",
  "Proton SoundSystem FAQ",
  "Release Links by Proton",
] as const;

/**
 * Prototype help hub (no backend). Opened from header / sidebar / drawers — not a FAB.
 */
export default function SupportAssistantPanel() {
  const pathname = usePathname() || "";
  const open = useHelpAssistantStore((s) => s.open);
  const closeAssistant = useHelpAssistantStore((s) => s.closeAssistant);
  const [tab, setTab] = useState<AssistantTab>("home");
  const [query, setQuery] = useState("");

  const displayName = pathname.startsWith("/dashboard")
    ? mockArtist.name.split(/\s+/)[0] ?? mockArtist.name
    : "there";

  const filteredFaq = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...FAQ_LINKS];
    return FAQ_LINKS.filter((t) => t.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAssistant();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAssistant]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) setTab("home");
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        role="presentation"
        className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm"
        onClick={closeAssistant}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-assistant-title"
        className="fixed z-[100] flex max-h-[min(560px,85vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-2xl
          left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          sm:left-auto sm:top-auto sm:translate-x-0 sm:translate-y-0 sm:bottom-24 sm:right-5 md:bottom-6 md:right-6"
        style={{
          background: "linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent) 22%, var(--color-surface) 22%, var(--color-surface) 100%)",
        }}
      >
        <div className="relative shrink-0 px-4 pb-3 pt-4 text-white">
          <button
            type="button"
            onClick={closeAssistant}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-white/90 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Close help"
          >
            <X size={18} strokeWidth={2} />
          </button>

          <div className="mb-3 flex -space-x-2 pl-0.5">
            {["P", "R", "S"].map((initial, i) => (
              <div
                key={i}
                className="flex size-9 items-center justify-center rounded-full border-2 border-[var(--color-accent)] bg-white text-xs font-bold text-accent shadow-sm"
              >
                {initial}
              </div>
            ))}
          </div>

          <h2 id="support-assistant-title" className="pr-10 text-lg font-bold leading-snug">
            Hi {displayName} 👋 How can we help?
          </h2>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden bg-[var(--color-surface)] px-3 pb-2 pt-1">
          {tab === "home" && (
            <>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-background px-3 py-3 text-left shadow-sm transition-colors hover:bg-[var(--color-border)]/30"
                onClick={() => setTab("messages")}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">Send us a message</p>
                  <p className="text-xs text-text-secondary">We typically reply within a day.</p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Send size={18} />
                </span>
              </button>

              <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[var(--color-border)] bg-background shadow-sm">
                <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
                  <Search size={16} className="shrink-0 text-accent" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for help"
                    className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/70"
                    aria-label="Search for help"
                  />
                </div>
                <ul className="max-h-[200px] overflow-y-auto py-1">
                  {filteredFaq.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs font-medium leading-snug text-text-primary transition-colors hover:bg-[var(--color-border)]/40"
                        onClick={() => setTab("help")}
                      >
                        <span className="min-w-0 flex-1">{item}</span>
                        <ChevronRight size={14} className="shrink-0 text-accent" aria-hidden />
                      </button>
                    </li>
                  ))}
                  {filteredFaq.length === 0 && (
                    <li className="px-3 py-6 text-center text-xs text-text-secondary">No matches</li>
                  )}
                </ul>
              </div>
            </>
          )}

          {tab === "messages" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-background/50 px-4 py-10 text-center">
              <MessageCircle size={32} className="text-text-secondary/50" />
              <p className="text-sm font-medium text-text-primary">Messages</p>
              <p className="text-xs text-text-secondary">
                Prototype — no inbox yet. Use Send us a message from Home when wired to support.
              </p>
              <button
                type="button"
                onClick={() => setTab("home")}
                className="mt-2 text-xs font-semibold text-accent underline-offset-2 hover:underline"
              >
                Back to Home
              </button>
            </div>
          )}

          {tab === "help" && (
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-background/50 px-3 py-4">
              <p className="text-sm font-semibold text-text-primary">Help</p>
              <p className="text-xs leading-relaxed text-text-secondary">
                Articles and FAQs will open here. This is a static preview matching the Proton /
                SoundSystem help hub pattern.
              </p>
              <button
                type="button"
                onClick={() => setTab("home")}
                className="mt-1 w-fit text-xs font-semibold text-accent underline-offset-2 hover:underline"
              >
                ← Home
              </button>
            </div>
          )}
        </div>

        <nav
          className="flex shrink-0 items-stretch border-t border-[var(--color-border)] bg-background px-1 py-1"
          aria-label="Help assistant sections"
        >
          {(
            [
              { id: "home" as const, label: "Home", Icon: Home },
              { id: "messages" as const, label: "Messages", Icon: MessageCircle },
              { id: "help" as const, label: "Help", Icon: CircleHelp },
            ] as const
          ).map(({ id, label, Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-medium transition-colors ${
                  active ? "text-accent" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
