import { ChevronDown, CircleHelp } from "lucide-react";
import { platformHubLinkActive } from "@/lib/dashboard/platformHub";
import SidebarToolLink from "./SidebarToolLink";
import { extrasLinks, LEAVES_DASHBOARD_HINT } from "./navData";

/**
 * Collapsible "Extras" section — deliberately separate from "Producer
 * tools": applying to launch a label isn't something you do with your
 * producer account, it's a different Proton relationship entirely. Shows
 * and DJ Mixes used to live here too but moved to Producer tools (see
 * docs/analisis-platform-integracion.md) since those genuinely are
 * things a producer does with their own account. Also hosts Help &
 * support, unrelated to either grouping but needing a home.
 */
export default function SidebarExtrasSection({
  pathname,
  urlTab,
  collapsed,
  open,
  onToggle,
  onOpenHelp,
}: {
  pathname: string;
  urlTab: string | null;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  onOpenHelp: () => void;
}) {
  const platformHubActive = pathname === "/dashboard/platform";

  return (
    <div className={collapsed ? "px-2" : "px-4"}>
      {!collapsed && (
        <button
          type="button"
          id="sidebar-platform-heading"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="sidebar-platform-links"
          title="Not about your producer account — apply to launch your own label."
          className={`mb-2 flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left
            text-[10px] font-semibold uppercase tracking-widest transition-colors
            ${platformHubActive && !open
              ? "text-accent bg-accent/10"
              : "text-text-secondary hover:bg-[var(--color-border)] hover:text-text-primary"
            }`}
        >
          <span>Extras</span>
          <ChevronDown
            size={14}
            className={`shrink-0 opacity-70 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
            aria-hidden
          />
        </button>
      )}
      <ul
        id="sidebar-platform-links"
        className={`space-y-0.5 ${!collapsed && !open ? "hidden" : ""}`}
      >
        {extrasLinks.map((item) => {
          const { label, href, icon, dot, leavesDashboard, externalGlyph, platformTab } = item;
          const active = platformHubLinkActive(pathname, urlTab, platformTab);
          const trailingExternal = leavesDashboard || Boolean(externalGlyph);
          const title = leavesDashboard ? LEAVES_DASHBOARD_HINT : collapsed ? label : undefined;
          const ariaLabel = leavesDashboard ? `${label}. ${LEAVES_DASHBOARD_HINT}` : label;
          return (
            <SidebarToolLink
              key={label}
              label={label}
              href={href}
              icon={icon}
              active={active}
              collapsed={collapsed}
              dot={dot}
              trailingExternal={trailingExternal}
              title={title}
              ariaLabel={ariaLabel}
            />
          );
        })}
        <li key="help-support">
          <button
            type="button"
            onClick={onOpenHelp}
            title={collapsed ? "Help & support" : undefined}
            aria-label="Help & support"
            className={`flex w-full items-center rounded-lg text-sm font-medium text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary
              ${collapsed ? "justify-center px-0 py-3" : "justify-start gap-3 px-3 py-2.5"}`}
          >
            <CircleHelp size={16} strokeWidth={1.75} className="shrink-0" />
            {!collapsed && (
              <span className="min-w-0 flex-1 truncate text-left">Help & support</span>
            )}
          </button>
        </li>
      </ul>
    </div>
  );
}
