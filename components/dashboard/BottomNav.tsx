"use client";

import { User, TrendingUp, DollarSign, FileText } from "lucide-react";

const navItems = [
  { label: "Artists",     icon: User,        active: true  },
  { label: "Performance", icon: TrendingUp,  active: false },
  { label: "Royalties",   icon: DollarSign,  active: false },
  { label: "Contracts",   icon: FileText,    active: false },
] as const;

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden
      bg-surface/90 backdrop-blur-md
      border-t border-[var(--color-border)]">
      <ul className="flex items-stretch h-16 max-w-lg mx-auto">
        {navItems.map(({ label, icon: Icon, active }) => (
          <li key={label} className="flex-1">
            <button
              className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? "text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-accent" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
