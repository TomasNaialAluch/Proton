"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, TrendingUp, Building2, Tag, Compass, MoreHorizontal } from "lucide-react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { useContractsStore } from "@/lib/store/contractsStore";
import { useMobileMenuStore } from "@/lib/store/mobileMenuStore";
import { LABEL_MANAGER_NAV_LINKS } from "@/lib/dashboard/dashboardShellRouting";

const producerNavItems = [
  { label: "Artists",     icon: User,       href: "/dashboard"             },
  { label: "Performance", icon: TrendingUp, href: "/dashboard/performance" },
  { label: "Discover",    icon: Compass,    href: "/dashboard/discover"    },
  { label: "Contracts",   icon: Building2,  href: "/dashboard/contracts"   },
  { label: "Labels", icon: Tag,        href: "/dashboard/labels"      },
];

/**
 * Label-manager has grown to 7 nav entries (Roster, Scouting, Requests,
 * Catalog, Releases, Revenue, Statements) — too many for a mobile bottom
 * bar (icons and labels get unreadably cramped). Show only the 4 most
 * used day-to-day, plus a "More" tab that opens the full hamburger menu
 * (which already lists all of LABEL_MANAGER_NAV_LINKS). Desktop sidebar
 * is unaffected — it has room for the full list.
 */
const LABEL_MANAGER_BOTTOM_NAV_COUNT = 4;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNav() {
  const pathname = usePathname();
  const view = usePrototypeViewStore((s) => s.view);
  const setMenuOpen = useMobileMenuStore((s) => s.setOpen);
  const isLabelManager = view === "label_manager";
  const navItems = isLabelManager
    ? LABEL_MANAGER_NAV_LINKS.slice(0, LABEL_MANAGER_BOTTOM_NAV_COUNT)
    : producerNavItems;
  const overflowItems = isLabelManager
    ? LABEL_MANAGER_NAV_LINKS.slice(LABEL_MANAGER_BOTTOM_NAV_COUNT)
    : [];
  const moreActive = overflowItems.some((item) => isActive(pathname, item.href));
  const hasPendingContracts = useContractsStore((s) =>
    s.contracts.some((c) => c.status === "pending_signature")
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[var(--color-border)] bg-surface/90 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex h-[4.25rem] max-w-lg items-stretch">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = isActive(pathname, href);
          return (
            <li key={label} className="relative min-w-0 flex-1">
              <Link
                href={href}
                className={`flex h-full min-h-0 w-full flex-col items-center justify-center gap-0.5 px-0.5 pt-1 pb-1.5 transition-colors ${
                  active ? "text-accent" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
                  <Icon size={19} strokeWidth={active ? 2.5 : 1.75} className="shrink-0" />
                  {label === "Contracts" && hasPendingContracts && (
                    <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-red-500" />
                  )}
                </span>
                <span className="max-w-full truncate text-center text-[9px] font-medium leading-tight tracking-tight">
                  {label}
                </span>
              </Link>
              {active && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </li>
          );
        })}
        {overflowItems.length > 0 && (
          <li className="relative min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`flex h-full min-h-0 w-full flex-col items-center justify-center gap-0.5 px-0.5 pt-1 pb-1.5 transition-colors ${
                moreActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <span className="relative inline-flex size-6 shrink-0 items-center justify-center">
                <MoreHorizontal size={19} strokeWidth={moreActive ? 2.5 : 1.75} className="shrink-0" />
              </span>
              <span className="max-w-full truncate text-center text-[9px] font-medium leading-tight tracking-tight">
                More
              </span>
            </button>
            {moreActive && (
              <span className="absolute bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-accent" />
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
