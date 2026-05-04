"use client";

import { useEffect, useState } from "react";
import {
  X,
  Radio,
  Tag,
  Disc3,
  DollarSign,
  Link as LinkIcon,
  BarChart3,
  Mic2,
  User,
  TrendingUp,
  FileText,
  Settings,
  Moon,
  Sun,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  CircleHelp,
} from "lucide-react";
import { useThemeStore } from "@/lib/store/themeStore";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { platformHubLinkActive } from "@/lib/dashboard/platformHub";
import { useHelpAssistantStore } from "@/lib/store/helpAssistantStore";

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

const LEAVES_DASHBOARD_HINT =
  "Opens the public site — you will leave the artist dashboard.";

const producerToolLinks = [
  { label: "Release Links", href: "/dashboard/settings/account/notifications", icon: LinkIcon, dot: null, leavesDashboard: false, externalGlyph: false },
] as const;

const platformLinks = [
  {
    label: "Shows",
    href: "/dashboard/platform?tab=shows",
    icon: Radio,
    dot: "#E67E22",
    leavesDashboard: false,
    externalGlyph: false,
    platformTab: "shows" as const,
  },
  {
    label: "Labels",
    href: "/dashboard/platform?tab=labels",
    icon: Tag,
    dot: "#1ABC9C",
    leavesDashboard: false,
    externalGlyph: false,
    platformTab: "labels" as const,
  },
  {
    label: "DJ Mixes",
    href: "/dashboard/platform?tab=dj-mixes",
    icon: Disc3,
    dot: "#9B59B6",
    leavesDashboard: false,
    externalGlyph: false,
    platformTab: "dj-mixes" as const,
  },
] as const;

const publicSiteLinks = [
  { label: "Radio", href: "/", icon: Radio },
  { label: "Shows", href: "/shows", icon: Mic2 },
  { label: "Charts", href: "/charts/progressive", icon: BarChart3 },
  { label: "Labels", href: "/labels", icon: Tag },
] as const;

const dashboardLinks = [
  { label: "Artists",     icon: User,       href: "/dashboard"                        },
  { label: "Performance", icon: TrendingUp, href: "/dashboard/performance"            },
  { label: "Royalties",   icon: DollarSign, href: "/dashboard/royalties"              },
  { label: "Contracts",   icon: FileText,   href: "/dashboard/contracts"              },
  { label: "Settings",    icon: Settings,   href: "/dashboard/settings/account"       },
];

export default function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  const openAssistant = useHelpAssistantStore((s) => s.openAssistant);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");
  const { theme, toggle } = useThemeStore();
  const isDark = theme === "dark";
  const [platformSectionOpen, setPlatformSectionOpen] = useState(true);
  const [publicSiteSectionOpen, setPublicSiteSectionOpen] = useState(true);

  useEffect(() => {
    const p = localStorage.getItem("proton-sidebar-platform-open");
    if (p === "false") setPlatformSectionOpen(false);
    if (p === "true") setPlatformSectionOpen(true);
    const s = localStorage.getItem("proton-sidebar-public-site-open");
    if (s === "false") setPublicSiteSectionOpen(false);
    if (s === "true") setPublicSiteSectionOpen(true);
  }, []);

  const togglePlatformSection = () => {
    setPlatformSectionOpen((prev) => {
      const next = !prev;
      localStorage.setItem("proton-sidebar-platform-open", String(next));
      return next;
    });
  };

  const togglePublicSiteSection = () => {
    setPublicSiteSectionOpen((prev) => {
      const next = !prev;
      localStorage.setItem("proton-sidebar-public-site-open", String(next));
      return next;
    });
  };

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
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-[70] h-full w-72 flex flex-col
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

          {/* Dashboard nav — mismo orden que AppSidebar (desktop) */}
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

          {/* Producer tools */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2 px-1">
              Producer tools
            </p>
            <ul className="space-y-0.5">
              {producerToolLinks.map(({ label, href, icon: Icon, dot, leavesDashboard, externalGlyph }) => {
                const title = leavesDashboard ? LEAVES_DASHBOARD_HINT : undefined;
                const ariaLabel = leavesDashboard ? `${label}. ${LEAVES_DASHBOARD_HINT}` : label;
                const trailingExternal = leavesDashboard || externalGlyph;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={onClose}
                      title={title}
                      aria-label={ariaLabel}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
                        transition-colors text-sm"
                    >
                      <div className="relative shrink-0">
                        <Icon size={16} />
                        {dot && (
                          <span
                            className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
                            style={{ backgroundColor: dot }}
                          />
                        )}
                      </div>
                      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                      {trailingExternal ? (
                        <ExternalLink size={12} className="shrink-0 opacity-40" aria-hidden />
                      ) : (
                        <ChevronRight size={12} className="shrink-0 opacity-40" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <button
              type="button"
              onClick={togglePlatformSection}
              aria-expanded={platformSectionOpen}
              aria-controls="drawer-platform-links"
              className="mb-2 flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left
                text-xs font-medium uppercase tracking-wider text-text-secondary
                hover:bg-[var(--color-border)] hover:text-text-primary transition-colors"
            >
              <span>Platform</span>
              <ChevronDown
                size={14}
                className={`shrink-0 opacity-70 transition-transform duration-200 ${
                  platformSectionOpen ? "rotate-0" : "-rotate-90"
                }`}
                aria-hidden
              />
            </button>
            <ul
              id="drawer-platform-links"
              className={`space-y-0.5 ${platformSectionOpen ? "" : "hidden"}`}
            >
              {platformLinks.map((link) => {
                const { label, href, icon: Icon, dot, leavesDashboard, externalGlyph } = link;
                const platformTab = link.platformTab;
                const active = platformHubLinkActive(pathname, urlTab, platformTab);
                const title = leavesDashboard ? LEAVES_DASHBOARD_HINT : undefined;
                const ariaLabel = leavesDashboard ? `${label}. ${LEAVES_DASHBOARD_HINT}` : label;
                const trailingExternal = leavesDashboard || externalGlyph;
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={onClose}
                      title={title}
                      aria-label={ariaLabel}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-colors text-sm
                        ${active
                          ? "bg-[var(--color-border)] text-text-primary font-medium"
                          : "text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"
                        }`}
                    >
                      <div className="relative shrink-0">
                        <Icon size={16} />
                        {dot && (
                          <span
                            className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full"
                            style={{ backgroundColor: dot }}
                          />
                        )}
                      </div>
                      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                      {trailingExternal ? (
                        <ExternalLink size={12} className="shrink-0 opacity-40" aria-hidden />
                      ) : (
                        <ChevronRight size={12} className="shrink-0 opacity-40" aria-hidden />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Public site */}
          <div>
            <button
              type="button"
              onClick={togglePublicSiteSection}
              aria-expanded={publicSiteSectionOpen}
              aria-controls="drawer-public-site-links"
              aria-label="Public site: Radio, Shows, Charts, Labels — opens the public app"
              className="mb-2 flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left
                text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
            >
              <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
                <span className="text-xs font-medium uppercase tracking-wider">Public site</span>
                <span className="w-full truncate text-[10px] font-medium normal-case tracking-normal text-text-secondary/85">
                  Radio · Shows · Charts · Labels
                </span>
              </span>
              <ChevronDown
                size={14}
                className={`shrink-0 opacity-70 transition-transform duration-200 ${
                  publicSiteSectionOpen ? "rotate-0" : "-rotate-90"
                }`}
                aria-hidden
              />
            </button>
            <ul
              id="drawer-public-site-links"
              className={`space-y-0.5 ${publicSiteSectionOpen ? "" : "hidden"}`}
            >
              {publicSiteLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={onClose}
                    title={LEAVES_DASHBOARD_HINT}
                    aria-label={`${label}. ${LEAVES_DASHBOARD_HINT}`}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                      text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
                      transition-colors"
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-left">{label}</span>
                    <ExternalLink size={12} className="shrink-0 opacity-50" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="border-t border-[var(--color-border)] px-4 py-3">
          <button
            type="button"
            onClick={() => {
              openAssistant();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
          >
            <CircleHelp size={18} aria-hidden />
            Help & support
          </button>
        </div>

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
