"use client";

import { ChevronDown } from "lucide-react";

export default function LoadMoreButton({
  onClick,
  remaining,
  pageSize,
}: {
  onClick: () => void;
  remaining: number;
  pageSize: number;
}) {
  return (
    <div className="px-5 py-3 border-t border-[var(--color-border)] flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-border)] text-xs
          font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        <ChevronDown size={13} />
        Load {Math.min(pageSize, remaining)} more ({remaining} remaining)
      </button>
    </div>
  );
}
