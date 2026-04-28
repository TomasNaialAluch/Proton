"use client";

import Link from "next/link";

interface GenreChipProps {
  label: string;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function GenreChip({ label, active = false, href, onClick }: GenreChipProps) {
  const base =
    "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-colors whitespace-nowrap cursor-pointer select-none";

  const style = active
    ? { background: "var(--color-accent)", color: "#fff", borderColor: "var(--color-accent)" }
    : { background: "transparent", color: "var(--color-text-secondary)", borderColor: "var(--color-border)" };

  if (href) {
    return (
      <Link href={href} className={base} style={style}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base} style={style}>
      {label}
    </button>
  );
}
