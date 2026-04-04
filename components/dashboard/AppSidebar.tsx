"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, TrendingUp, DollarSign, FileText,
  Radio, Tag, Disc3, Link as LinkIcon,
  Settings, Bell, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { mockArtist } from "@/lib/mock/artist";

const navItems = [
  { label: "Artists",      icon: User,       href: "/dashboard"                  },
  { label: "Performance",  icon: TrendingUp, href: "/dashboard/performance"      },
  { label: "Royalties",    icon: DollarSign, href: "/dashboard/royalties"        },
  { label: "Contracts",    icon: FileText,   href: "/dashboard/contracts"        },
  { label: "Shows",        icon: Radio,      href: "#"                           },
  { label: "Labels",       icon: Tag,        href: "#"                           },
  { label: "DJ Mixes",     icon: Disc3,      href: "#"                           },
  { label: "Release Links",icon: LinkIcon,   href: "#"                           },
  { label: "Settings",     icon: Settings,   href: "/dashboard/settings/account" },
];

const ACTIVE_HREF = "/dashboard";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Persist collapse preference
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

      {/* ── Artist header ── */}
      <Link
        href="/dashboard/settings/profile"
        className={`flex items-center gap-3 border-b border-[var(--color-border)]
          hover:bg-[var(--color-border)] transition-colors
          ${collapsed ? "justify-center px-0 py-4" : "px-5 py-4"}`}
      >
        {/* Avatar */}
        <div
          className="size-9 rounded-full p-[1.5px] shrink-0"
          style={{ background: "linear-gradient(135deg, var(--color-accent), transparent)" }}
        >
          <div className="size-full rounded-full bg-surface flex items-center justify-center">
            <span className="text-xs font-bold text-accent">
              {mockArtist.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Name — hidden when collapsed */}
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate leading-tight">
              {mockArtist.name}
            </p>
            <p className="text-xs text-text-secondary">for Artists</p>
          </div>
        )}
      </Link>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = href === ACTIVE_HREF;
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
                  <Icon size={18} strokeWidth={active ? 2.5 : 1.75} className="shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer: bell + collapse toggle ── */}
      <div className={`flex items-center border-t border-[var(--color-border)] py-3 px-2
        ${collapsed ? "flex-col gap-1" : "justify-between gap-2"}`}>

        <button
          className={`flex items-center justify-center rounded-lg
            text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
            transition-colors relative
            ${collapsed ? "w-full py-2.5" : "size-9"}`}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-accent" />
        </button>

        <button
          onClick={toggle}
          className={`flex items-center justify-center rounded-lg
            text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
            transition-colors
            ${collapsed ? "w-full py-2.5" : "size-9"}`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed
            ? <PanelLeftOpen size={18} />
            : <PanelLeftClose size={18} />
          }
        </button>
      </div>

    </aside>
  );
}
