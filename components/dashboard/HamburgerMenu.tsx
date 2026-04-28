"use client";

import { useEffect } from "react";
import {
  X,
  Radio,
  Tag,
  Disc3,
  DollarSign,
  Link as LinkIcon,
  User,
  TrendingUp,
  FileText,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useThemeStore } from "@/lib/store/themeStore";
import Link from "next/link";

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

const quickLinks = [
  { label: "Shows",        icon: Radio,      dot: "#E67E22" },
  { label: "Labels",       icon: Tag,        dot: "#1ABC9C" },
  { label: "DJ Mixes",     icon: Disc3,      dot: "#9B59B6" },
  { label: "Account",      icon: DollarSign, dot: "#27AE60" },
  { label: "Release Links",icon: LinkIcon,   dot: null      },
];

const dashboardLinks = [
  { label: "Artists",     icon: User,       href: "/dashboard"                        },
  { label: "Performance", icon: TrendingUp, href: "/dashboard/performance"            },
  { label: "Royalties",   icon: DollarSign, href: "/dashboard/royalties"              },
  { label: "Contracts",   icon: FileText,   href: "/dashboard/contracts"              },
  { label: "Settings",    icon: Settings,   href: "/dashboard/settings/account"       },
];

export default function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  const { theme, toggle } = useThemeStore();
  const isDark = theme === "dark";

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col
          bg-surface border-r border-[var(--color-border)]
          shadow-2xl transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <span className="font-display font-bold tracking-widest text-sm text-text-primary uppercase">
            Proton
          </span>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

          {/* Quick access */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2 px-1">
              Quick Access
            </p>
            <ul className="space-y-0.5">
              {quickLinks.map(({ label, icon: Icon, dot }) => (
                <li key={label}>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
                    transition-colors text-sm">
                    <div className="relative">
                      <Icon size={16} />
                      {dot && (
                        <span
                          className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
                          style={{ backgroundColor: dot }}
                        />
                      )}
                    </div>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard nav */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2 px-1">
              Dashboard
            </p>
            <ul className="space-y-0.5">
              {dashboardLinks.map(({ label, icon: Icon, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
                      transition-colors text-sm"
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ── Back to public site (same hierarchy as “For Artists” on the radio) ── */}
        <div className="px-4 pt-4 border-t border-[var(--color-border)]">
          <Link
            href="/"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white bg-accent transition-opacity hover:opacity-90"
          >
            <Radio size={16} />
            Proton Radio
          </Link>
        </div>

        {/* ── Theme toggle — fondo del drawer ── */}
        <div className="px-4 py-5 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Dark mode</span>

            {/* Sun / toggle pill / Moon */}
            <div className="flex items-center gap-2">
              <Sun size={14} className="text-text-secondary" />

              <button
                onClick={toggle}
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isDark ? "bg-accent" : "bg-text-secondary/25"
                }`}
              >
                <span
                  className={`absolute top-1 size-4 rounded-full shadow-md transition-all duration-300 ${
                    isDark ? "left-7 bg-background" : "left-1 bg-white"
                  }`}
                />
              </button>

              <Moon size={14} className={isDark ? "text-accent" : "text-text-secondary"} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
