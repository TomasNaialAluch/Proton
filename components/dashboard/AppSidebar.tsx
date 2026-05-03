"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User, TrendingUp, DollarSign, FileText, Settings,
  Radio, Tag, Disc3, Link as LinkIcon, BarChart3,
  Bell, PanelLeftClose, PanelLeftOpen, ExternalLink,
  Sun, Moon,
} from "lucide-react";
import { mockArtist } from "@/lib/mock/artist";
import { useThemeStore } from "@/lib/store/themeStore";
import NotificationsPanel from "./NotificationsPanel";

const dashboardLinks = [
  { label: "Artists",     icon: User,       href: "/dashboard" },
  { label: "Performance", icon: TrendingUp, href: "/dashboard/performance" },
  { label: "Royalties",   icon: DollarSign, href: "/dashboard/royalties" },
  { label: "Contracts",   icon: FileText,   href: "/dashboard/contracts" },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings/account",
    /** Highlight for any settings sub-route (profile, account, etc.) */
    activePrefix: "/dashboard/settings",
  },
] as const;

function linkIsActive(
  pathname: string,
  href: string,
  activePrefix?: string
): boolean {
  if (activePrefix) {
    return pathname === activePrefix || pathname.startsWith(`${activePrefix}/`);
  }
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Shown on Quick Access links that open the public (non-dashboard) area */
const QUICK_ACCESS_PUBLIC_HINT =
  "Opens the public Proton Radio site — you will leave the artist dashboard.";

const quickLinks = [
  { label: "Shows",         href: "/shows",                                     icon: Radio,    dot: "#E67E22", leavesDashboard: true },
  { label: "Labels",        href: "/labels",                                    icon: Tag,      dot: "#1ABC9C", leavesDashboard: true },
  { label: "DJ Mixes",      href: "/shows",                                     icon: Disc3,      dot: "#9B59B6", leavesDashboard: true },
  { label: "Charts",        href: "/dashboard/performance",                     icon: BarChart3,  dot: "#3498DB", leavesDashboard: false },
  { label: "Release Links", href: "/dashboard/settings/account/notifications", icon: LinkIcon,   dot: null,       leavesDashboard: false },
] as const;

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  useEffect(() => {
    const stored = localStorage.getItem("proton-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("proton-sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  return (
    <>
    <aside
      className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0
        bg-surface border-r border-[var(--color-border)]
        transition-[width] duration-300 ease-in-out overflow-hidden
        ${collapsed ? "w-16" : "w-64"}`}
    >

      {/* ── Header: logo + bell ── */}
      <div className={`flex items-center border-b border-[var(--color-border)] py-4
        ${collapsed ? "justify-center px-0" : "justify-between px-5"}`}>
        {!collapsed && (
          <Link
            href="/dashboard"
            className="relative block h-8 shrink-0 min-w-0 max-w-[11rem]"
            aria-label="Proton — Home"
          >
            <Image
              src="/logo%20txt.png"
              alt="Proton Soundsystem"
              width={220}
              height={56}
              className="h-8 w-auto max-h-8 object-contain object-left"
              priority
            />
          </Link>
        )}
        <button
          onClick={() => setNotifOpen(true)}
          className="relative text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-accent" />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5">

        {/* Dashboard section */}
        <div className={collapsed ? "px-2" : "px-4"}>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2 px-1">
              Dashboard
            </p>
          )}
          <ul className="space-y-0.5">
            {dashboardLinks.map((link) => {
              const { label, icon: Icon, href } = link;
              const activePrefix = "activePrefix" in link ? link.activePrefix : undefined;
              const active = linkIsActive(pathname, href, activePrefix);
              return (
              <li key={label}>
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`flex items-center rounded-lg text-sm transition-colors
                    ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"}
                    ${active
                      ? "bg-accent/10 text-accent font-semibold"
                      : "text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"
                    }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.5 : 1.75} className="shrink-0" />
                  {!collapsed && label}
                </Link>
              </li>
            );
            })}
          </ul>
        </div>

        {/* Quick Access section */}
        <div className={collapsed ? "px-2" : "px-4"}>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-text-secondary mb-2 px-1">
              Quick Access
            </p>
          )}
          <ul className="space-y-0.5">
            {quickLinks.map(({ label, href, icon: Icon, dot, leavesDashboard }) => {
              const active = linkIsActive(pathname, href);
              const title = leavesDashboard
                ? QUICK_ACCESS_PUBLIC_HINT
                : collapsed
                  ? label
                  : undefined;
              const ariaLabel = leavesDashboard ? `${label}. ${QUICK_ACCESS_PUBLIC_HINT}` : label;
              return (
              <li key={label}>
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
                  {!collapsed && leavesDashboard && (
                    <ExternalLink size={12} className="shrink-0 opacity-40" aria-hidden />
                  )}
                </Link>
              </li>
            );
            })}
          </ul>
        </div>
      </nav>

      {/* ── Footer: back to public + artist + collapse ── */}
      <div className={`border-t border-[var(--color-border)] py-3
        ${collapsed ? "flex flex-col items-center gap-1 px-2" : "px-3"}`}>

        <Link
          href="/"
          title="Proton Radio"
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white bg-accent transition-opacity hover:opacity-90 mb-2
            ${collapsed ? "w-full px-0" : "w-full"}`}
        >
          <Radio size={16} className="shrink-0" />
          {!collapsed && <span>Proton Radio</span>}
        </Link>

        {!collapsed && (
          <Link
            href="/dashboard/settings/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg
              hover:bg-[var(--color-border)] transition-colors mb-1"
          >
            <div
              className="size-7 rounded-full p-[1.5px] shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-accent), transparent)" }}
            >
              <div className="size-full rounded-full bg-surface flex items-center justify-center">
                <span className="text-[10px] font-bold text-accent">
                  {mockArtist.name.charAt(0)}
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{mockArtist.name}</p>
              <p className="text-xs text-text-secondary">Edit profile</p>
            </div>
          </Link>
        )}

        {!collapsed ? (
          <div className="mb-2 flex items-center justify-between gap-2 px-3 py-2">
            <span className="text-xs font-medium text-text-primary">Dark mode</span>
            <div className="flex items-center gap-2 shrink-0">
              <Sun size={14} className="text-text-secondary" />
              <button
                type="button"
                onClick={toggleTheme}
                role="switch"
                aria-checked={isDark}
                aria-label="Toggle dark mode"
                className={`relative h-6 w-12 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
        ) : (
          <div className="mb-1 flex w-full flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              title="Dark mode"
              className={`relative h-6 w-12 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isDark ? "bg-accent" : "bg-text-secondary/25"
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full shadow-md transition-all duration-300 ${
                  isDark ? "left-7 bg-background" : "left-1 bg-white"
                }`}
              />
            </button>
          </div>
        )}

        <button
          onClick={toggleCollapsed}
          className={`flex items-center justify-center rounded-lg
            text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
            transition-colors
            ${collapsed ? "w-full py-2.5" : "size-8"}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

    </aside>

      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
