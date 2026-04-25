"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, TrendingUp, DollarSign, FileText } from "lucide-react";

const navItems = [
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden
      bg-surface/90 backdrop-blur-md
      border-t border-[var(--color-border)]">
      <ul className="flex items-stretch h-16 max-w-lg mx-auto">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = isActive(pathname, href);
          return (
            <li key={label} className="flex-1 relative">
              <Link
                href={href}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-accent" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
              {active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent" />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
