"use client";

import Image from "next/image";
import { Users, Calendar, Bell, BellRing } from "lucide-react";
import ContestBadge from "@/components/dashboard/producer/labels/detail/ContestBadge";
import AvatarGradient from "@/components/dashboard/_shared/AvatarGradient";
import { useLabelFollowsStore } from "@/lib/store/labelFollowsStore";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import type { ProtonLabel } from "@/types/label";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function DemoStatusBadge({ status }: { status: ProtonLabel["demoStatus"] }) {
  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-400 inline-block" />
        Open for demos
      </span>
    );
  }
  if (status === "closed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[var(--color-border)] text-text-secondary">
        Closed for demos
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold bg-[var(--color-border)] text-text-secondary">
      Demo status unknown
    </span>
  );
}

export default function LabelDetailHeader({ label }: { label: ProtonLabel }) {
  const isFollowing = useLabelFollowsStore((s) => s.isFollowing(label.slug));
  const toggleFollow = useLabelFollowsStore((s) => s.toggleFollow);
  // Follow doesn't apply to the label-manager role — this product connects
  // labels with artists, not labels with other labels. See
  // docs/README-routing-architecture.md.
  const view = usePrototypeViewStore((s) => s.view);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="flex items-start gap-4">
        {label.image?.url ? (
          <div className="size-14 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-accent/10 border border-accent/20">
            <Image src={label.image.url} alt={label.name} width={56} height={56} className="object-contain" />
          </div>
        ) : (
          // No real logo in the mock data — a deterministic gradient per
          // label id, same idea as Track/Artist Detail. See
          // docs/feature-labels-detail.md.
          <AvatarGradient
            seed={label.slug}
            initials={label.name.slice(0, 2).toUpperCase()}
            shapeClassName="rounded-xl"
            className="size-14 text-lg"
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-text-primary">{label.name}</h1>
            {view === "producer" && (
              <button
                type="button"
                onClick={() => toggleFollow(label.slug)}
                aria-pressed={isFollowing}
                title={isFollowing ? "Stop following — no more updates from this label" : "Follow — get notified on new releases or a demo status change"}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors
                  ${isFollowing
                    ? "bg-accent/15 text-accent"
                    : "bg-[var(--color-border)] text-text-secondary hover:text-text-primary"
                  }`}
              >
                {isFollowing ? <BellRing size={12} /> : <Bell size={12} />}
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-text-secondary">
            {label.artistCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users size={11} /> {label.artistCount} artists
              </span>
            )}
            {label.foundedYear !== undefined && (
              <span className="flex items-center gap-1">
                <Calendar size={11} /> Since {label.foundedYear}
              </span>
            )}
            {label.releaseCount !== undefined && <span>{label.releaseCount} releases</span>}
            {label.lastReleaseDate && <span>Last: {formatDate(label.lastReleaseDate)}</span>}
          </div>

          {label.genres && label.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {label.genres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--color-border)] text-text-secondary">
                  {g}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <DemoStatusBadge status={label.demoStatus} />
            {label.activeContests && label.activeContests.length > 0 && (
              <ContestBadge count={label.activeContests.length} />
            )}
          </div>
        </div>
      </div>

      {label.description && (
        <p className="mt-4 text-sm text-text-secondary leading-relaxed">{label.description}</p>
      )}
    </div>
  );
}
