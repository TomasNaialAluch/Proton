"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, TrendingUp, DollarSign, FileText } from "lucide-react";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { LABEL_MANAGER_NAV_LINKS } from "@/lib/dashboard/dashboardShellRouting";

const producerNavItems = [
  { label: "Artists",     icon: User,       href: "/dashboard"             },
  { label: "Performance", icon: TrendingUp, href: "/dashboard/performance" },
  { label: "Royalties",   icon: DollarSign, href: "/dashboard/royalties"   },
  { label: "Contracts",   icon: FileText,   href: "/dashboard/contracts"   },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNav() {
  const pathname = usePathname();
  const view = usePrototypeViewStore((s) => s.view);
  const navItems = view === "label_manager" ? LABEL_MANAGER_NAV_LINKS : producerNavItems;

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
                <span className="inline-flex size-6 shrink-0 items-center justify-center">
                  <Icon size={19} strokeWidth={active ? 2.5 : 1.75} className="shrink-0" />
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
      </ul>
    </nav>
  );
}
