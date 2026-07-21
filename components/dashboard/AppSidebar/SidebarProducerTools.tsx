import SidebarToolLink from "./SidebarToolLink";
import { producerToolLinks, linkIsActive, LEAVES_DASHBOARD_HINT } from "./navData";
import { platformHubLinkActive } from "@/lib/dashboard/platformHub";

/** Producer shell only. */
export default function SidebarProducerTools({
  pathname,
  urlTab,
  collapsed,
}: {
  pathname: string;
  urlTab: string | null;
  collapsed: boolean;
}) {
  return (
    <div className={collapsed ? "px-2" : "px-4"}>
      {!collapsed && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2 px-1">
          Producer tools
        </p>
      )}
      <ul className="space-y-0.5">
        {producerToolLinks.map(({ label, href, icon, dot, leavesDashboard, externalGlyph, platformTab }) => {
          const active = platformTab
            ? platformHubLinkActive(pathname, urlTab, platformTab)
            : linkIsActive(pathname, href);
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
      </ul>
    </div>
  );
}
