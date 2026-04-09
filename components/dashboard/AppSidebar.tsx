"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  User, TrendingUp, DollarSign, FileText, Settings,
  Radio, Tag, Disc3, Link as LinkIcon,
  Bell, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { mockArtist } from "@/lib/mock/artist";

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

const quickLinks = [
  { label: "Shows",         icon: Radio,    dot: "#E67E22" },
  { label: "Labels",        icon: Tag,      dot: "#1ABC9C" },
  { label: "DJ Mixes",      icon: Disc3,    dot: "#9B59B6" },
  { label: "Release Links", icon: LinkIcon, dot: null      },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("proton-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem("proton-sidebar-collapsed", String(!prev));
      return !prev;
    });
  };

  return (
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
            aria-label="Proton — Inicio"
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
            {quickLinks.map(({ label, icon: Icon, dot }) => (
              <li key={label}>
                <button
                  title={collapsed ? label : undefined}
                  className={`w-full flex items-center rounded-lg text-sm transition-colors
                    text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
                    ${collapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5"}`}
                >
                  <div className="relative shrink-0">
                    <Icon size={16} strokeWidth={1.75} />
                    {dot && (
                      <span
                        className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
                        style={{ backgroundColor: dot }}
                      />
                    )}
                  </div>
                  {!collapsed && label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Footer: artist + collapse ── */}
      <div className={`border-t border-[var(--color-border)] py-3
        ${collapsed ? "flex flex-col items-center gap-1 px-2" : "px-3"}`}>

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

        <button
          onClick={toggle}
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
  );
}
