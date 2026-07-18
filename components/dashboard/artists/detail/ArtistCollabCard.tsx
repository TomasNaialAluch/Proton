"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { useLabelInboxStore } from "@/lib/store/labelInboxStore";
import { mockArtist } from "@/lib/mock/artist";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import type { Artist } from "@/types/artist";
import type { ProtonLabel } from "@/types/label";

/**
 * Gated on the artist's own opt-in AND a known label to route the message
 * through — see docs/feature-artist-detail.md for why a collab request
 * always needs a mediating label (`viaLabel`), and why there's no stored
 * artist↔label relationship to fall back on when it's missing.
 *
 * Hidden entirely for label-manager view — "request to collaborate" is a
 * producer action, a label doesn't collaborate with an artist the way a
 * producer does (see docs/README-routing-architecture.md) — and for a
 * producer viewing their own artist profile (can't request to
 * collaborate with yourself).
 */
export default function ArtistCollabCard({ artist, viaLabel }: { artist: Artist; viaLabel?: ProtonLabel }) {
  const view = usePrototypeViewStore((s) => s.view);
  const sendLabelRequest = useLabelInboxStore((s) => s.sendLabelRequest);
  const [pitch, setPitch] = useState("");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  if (!artist.openToCollab || !viaLabel) return null;
  if (view === "label_manager") return null;
  if (artist.id === mockArtist.id) return null;

  const submit = () => {
    if (!pitch.trim()) return;
    const convoId = sendLabelRequest({
      label: viaLabel,
      kind: "collab",
      text: `Collab request re: ${artist.name} — ${pitch.trim()}`,
      artistId: artist.id,
    });
    setConversationId(convoId);
    setSent(true);
    setPitch("");
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="flex items-center gap-2 mb-1">
        <UserPlus size={14} className="text-accent" />
        <h2 className="text-sm font-semibold text-text-primary">Request to collaborate</h2>
      </div>

      {sent ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-600 dark:text-emerald-400 mt-3">
          <CheckCircle2 size={13} className="shrink-0" />
          Sent via {viaLabel.name}
          {conversationId && (
            <>
              {" — "}
              <Link href={`/dashboard/labels/chat/${conversationId}`} className="font-semibold underline underline-offset-2">
                view conversation
              </Link>
            </>
          )}
        </div>
      ) : open ? (
        <div className="flex flex-col gap-2 mt-3">
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            rows={3}
            autoFocus
            placeholder={`What kind of collaboration with ${artist.name}? (co-production, remix trade, guest vocal…)`}
            className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-background px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary/60"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={!pitch.trim()}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40 transition-opacity"
            >
              Send via {viaLabel.name}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 rounded-lg border border-accent/40 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 transition-colors"
        >
          Request to collaborate
        </button>
      )}

      <p className="text-[11px] text-text-secondary/70 mt-3">
        Sent to {viaLabel.name}, not directly to {artist.name} — the label decides whether to loop them in.
      </p>
    </div>
  );
}
