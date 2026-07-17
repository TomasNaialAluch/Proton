import Link from "next/link";
import { LABEL_MANAGER_NAV_LINKS } from "@/lib/dashboard/dashboardShellRouting";
import { dashboardLinks, linkIsActive } from "./navData";

/** Primary shell nav: producer dashboard vs label-manager workspace. */
export default function SidebarPrimaryNav({
  pathname,
  collapsed,
  isLabelManager,
  hasPendingContracts,
}: {
  pathname: string;
  collapsed: boolean;
  isLabelManager: boolean;
  hasPendingContracts: boolean;
}) {
  return (
    <div className={collapsed ? "px-2" : "px-4"}>
      {!collapsed && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2 px-1">
          {isLabelManager ? "Label workspace" : "Dashboard"}
        </p>
      )}
      <ul className="space-y-0.5">
        {isLabelManager
          ? LABEL_MANAGER_NAV_LINKS.map(({ label, icon: Icon, href }) => {
              const active = linkIsActive(pathname, href);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    title={collapsed ? label : undefined}
                    className={`flex items-center rounded-lg text-sm transition-colors
                      ${collapsed ? "min-h-10 w-full justify-center px-0 py-0" : "gap-3 px-3 py-2.5"}
                      ${active
                        ? "bg-accent/10 text-accent font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"
                      }`}
                  >
                    <span className={`inline-flex shrink-0 items-center justify-center ${collapsed ? "size-9" : ""}`}>
                      <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
                    </span>
                    {!collapsed && label}
                  </Link>
                </li>
              );
            })
          : dashboardLinks.map((link) => {
              const { label, icon: Icon, href } = link;
              const activePrefix = "activePrefix" in link ? link.activePrefix : undefined;
              const active = linkIsActive(pathname, href, activePrefix);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    title={collapsed ? label : undefined}
                    className={`flex items-center rounded-lg text-sm transition-colors
                      ${collapsed ? "min-h-10 w-full justify-center px-0 py-0" : "gap-3 px-3 py-2.5"}
                      ${active
                        ? "bg-accent/10 text-accent font-semibold"
                        : "text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"
                      }`}
                  >
                    <span className={`relative inline-flex shrink-0 items-center justify-center ${collapsed ? "size-9" : ""}`}>
                      <Icon size={16} strokeWidth={active ? 2.5 : 1.75} />
                      {label === "Contracts" && hasPendingContracts && (
                        <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-amber-500" />
                      )}
                    </span>
                    {!collapsed && label}
                  </Link>
                </li>
              );
            })}
      </ul>
    </div>
  );
}
