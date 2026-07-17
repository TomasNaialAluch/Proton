import Link from "next/link";
import { ExternalLink, ChevronRight, type LucideIcon } from "lucide-react";

/**
 * One row shared by the Producer tools / Platform / Public site sections —
 * those three were three copies of the same JSX (icon + optional colored
 * dot, label, trailing chevron-or-external-glyph) before this split. See
 * docs/README-codebase-architecture-review.md.
 */
export default function SidebarToolLink({
  label,
  href,
  icon: Icon,
  active,
  collapsed,
  dot,
  trailingExternal = false,
  title,
  ariaLabel,
}: {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  dot?: string | null;
  trailingExternal?: boolean;
  title?: string;
  ariaLabel?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        title={title}
        aria-label={ariaLabel}
        className={`flex items-center rounded-lg text-sm transition-colors
          ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"}
          ${active
            ? "bg-accent/10 text-accent font-semibold"
            : "text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"
          }`}
      >
        <div className="relative shrink-0">
          <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
          {dot && (
            <span
              className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
              style={{ backgroundColor: dot }}
            />
          )}
        </div>
        {!collapsed && (
          <span className="min-w-0 flex-1 truncate text-left">{label}</span>
        )}
        {!collapsed && trailingExternal && (
          <ExternalLink size={12} className="shrink-0 opacity-40" aria-hidden />
        )}
        {!collapsed && !trailingExternal && (
          <ChevronRight size={12} className="shrink-0 opacity-40" aria-hidden />
        )}
      </Link>
    </li>
  );
}
