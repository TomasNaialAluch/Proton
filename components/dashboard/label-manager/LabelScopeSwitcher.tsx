"use client";

import { useMemo } from "react";
import { ChevronDown, Layers } from "lucide-react";
import { mockLabels } from "@/lib/mock/labels";
import { useLabelScopeStore } from "@/lib/store/label-manager/labelScopeStore";

const shell =
  "group flex h-10 w-full min-w-0 items-stretch overflow-hidden rounded-xl border border-[var(--color-border)] bg-surface " +
  "transition-colors hover:bg-[var(--color-border)] focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/20";

const iconCol = "flex w-9 shrink-0 items-center justify-center text-text-secondary";

const selectInner =
  "min-h-0 min-w-0 flex-1 cursor-pointer border-0 bg-transparent py-0 pl-0 pr-0 text-xs font-semibold leading-none " +
  "text-text-primary outline-none ring-0 focus:ring-0 focus-visible:outline-none";

export default function LabelScopeSwitcher({ hintAlign }: { hintAlign?: "start" | "center" }) {
  const mode = useLabelScopeStore((s) => s.mode);
  const activeLabelId = useLabelScopeStore((s) => s.activeLabelId);
  const setAllLabels = useLabelScopeStore((s) => s.setAllLabels);
  const setActiveLabel = useLabelScopeStore((s) => s.setActiveLabel);

  const activeLabel = useMemo(
    () => mockLabels.find((l) => l.id === activeLabelId) ?? null,
    [activeLabelId]
  );

  const value = mode === "all_labels" ? "__all__" : activeLabelId ?? "__all__";
  const hintAlignClass = hintAlign === "center" ? "text-center" : "text-left";

  return (
    <div className="w-full min-w-0">
      <label className="sr-only" htmlFor="label-scope">
        Active label scope
      </label>

      <div className={shell}>
        <div className={iconCol} aria-hidden>
          <Layers size={14} strokeWidth={1.75} className="shrink-0" />
        </div>

        <div className="flex min-w-0 flex-1 items-center">
          <select
            id="label-scope"
            value={value}
            onChange={(e) => {
              const next = e.target.value;
              if (next === "__all__") setAllLabels();
              else setActiveLabel(next);
            }}
            className={`${selectInner} h-10 w-full appearance-none`}
          >
            <option value="__all__">All labels</option>
            {mockLabels.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        <div className={iconCol} aria-hidden>
          <ChevronDown size={14} strokeWidth={1.75} className="shrink-0" />
        </div>
      </div>

      <p className={`mt-1.5 text-[10px] text-text-secondary ${hintAlignClass}`}>
        {mode === "all_labels"
          ? "Overview across all labels"
          : `Scoped to ${activeLabel?.name ?? "selected label"}`}
      </p>
    </div>
  );
}
