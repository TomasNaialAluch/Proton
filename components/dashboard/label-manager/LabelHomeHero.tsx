"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";
import { mockLabels } from "@/lib/mock/labels";
import { mockLabelManagerProfile } from "@/lib/mock/label-manager/labelManagerProfile";
import { LABEL_MANAGER_ROLE_LABEL } from "@/types/labelManagerProfile";

/** Fixed identity hero — mirrors `DashboardContent.tsx`'s Artist Hero, but
 *  a label account has two identities to show (the label, and the person
 *  managing it), where the producer side only ever has one. See
 *  docs/README-label-manager-rebuild-plan.md, section 6.2. */
export default function LabelHomeHero() {
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);

  const label = useMemo(() => mockLabels.find((l) => l.id === activeLabelId) ?? null, [activeLabelId]);

  return (
    <section className="flex items-center gap-5 pt-8 pb-6 lg:pt-10 lg:gap-7">
      <div className="relative shrink-0">
        <div
          className="size-20 rounded-full p-[2px] lg:size-24"
          style={{ background: "linear-gradient(135deg, var(--color-accent) 0%, transparent 100%)" }}
        >
          <div className="size-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
            {label?.image?.url ? (
              <Image src={label.image.url} alt={label.name} width={96} height={96} className="size-full object-cover rounded-full" priority />
            ) : (
              <span className="font-display font-bold text-2xl text-accent">{(label?.name ?? "?").charAt(0)}</span>
            )}
          </div>
        </div>
        <span className="absolute bottom-1 right-1 size-3 rounded-full bg-accent border-2 border-background" />
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="font-display font-bold italic text-3xl text-text-primary leading-tight truncate lg:text-4xl">
          {label?.name ?? "Label"}
        </h1>
        <p className="text-text-secondary text-sm mt-0.5">{label?.genres?.join(" · ")}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent">
            {mockLabelManagerProfile.name.charAt(0)}
          </span>
          <p className="text-xs text-text-secondary truncate">
            <span className="font-medium text-text-primary">{mockLabelManagerProfile.name}</span>
            {" · "}
            {LABEL_MANAGER_ROLE_LABEL[mockLabelManagerProfile.role]}
          </p>
        </div>
      </div>
    </section>
  );
}
