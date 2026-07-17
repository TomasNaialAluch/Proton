import { ChevronDown } from "lucide-react";
import SidebarToolLink from "./SidebarToolLink";
import { publicSiteLinks, LEAVES_DASHBOARD_HINT } from "./navData";

/** Collapsible "Public site" section — leaves `/dashboard` for the public radio app. */
export default function SidebarPublicSiteSection({
  collapsed,
  open,
  onToggle,
}: {
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={collapsed ? "px-2" : "px-4"}>
      {!collapsed && (
        <button
          type="button"
          id="sidebar-public-site-heading"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="sidebar-public-site-links"
          aria-label="Public site: Radio, Shows, Charts, Labels — opens the public app"
          className="mb-2 flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left
            text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
        >
          <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest">Public site</span>
            <span className="w-full truncate text-[9px] font-medium normal-case tracking-normal text-text-secondary/85">
              Radio · Shows · Charts · Labels
            </span>
          </span>
          <ChevronDown
            size={14}
            className={`shrink-0 opacity-70 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
            aria-hidden
          />
        </button>
      )}
      <ul
        id="sidebar-public-site-links"
        className={`space-y-0.5 ${!collapsed && !open ? "hidden" : ""}`}
      >
        {publicSiteLinks.map(({ label, href, icon }) => (
          <SidebarToolLink
            key={label}
            label={label}
            href={href}
            icon={icon}
            active={false}
            collapsed={collapsed}
            trailingExternal
            title={collapsed ? `${label}. ${LEAVES_DASHBOARD_HINT}` : LEAVES_DASHBOARD_HINT}
            ariaLabel={`${label}. ${LEAVES_DASHBOARD_HINT}`}
          />
        ))}
      </ul>
    </div>
  );
}
