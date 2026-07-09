"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Browse",      href: "/dashboard/labels" },
  { label: "Submissions", href: "/dashboard/labels/submissions" },
  { label: "Contracts",   href: "/dashboard/contracts" },
] as const;

/**
 * Sub-nav for the Labels section (Browse / Submissions). Contracts lives in
 * its own top-level section now — kept as a shortcut tab here since people
 * land on Labels looking for it, but it links out instead of being a sibling
 * route under /dashboard/labels/*.
 */
export default function LabelsTabs() {
  const pathname = usePathname();

  const isBrowseActive =
    pathname === "/dashboard/labels" ||
    (pathname.startsWith("/dashboard/labels/") &&
      !pathname.startsWith("/dashboard/labels/submissions"));

  return (
    <div className="mb-6 flex gap-1.5 rounded-lg bg-[var(--color-border)]/40 p-1">
      {TABS.map(({ label, href }) => {
        const active = href === "/dashboard/labels" ? isBrowseActive : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition-colors
              ${active ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
