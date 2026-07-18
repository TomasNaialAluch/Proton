"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useDashboardSidebarStore } from "@/lib/store/dashboardSidebarStore";
import { useThemeStore } from "@/lib/store/themeStore";
import { useHelpAssistantStore } from "@/lib/store/helpAssistantStore";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import { useContractsStore } from "@/lib/store/contractsStore";
import NotificationsPanel from "../NotificationsPanel";
import SidebarHeader from "./SidebarHeader";
import SidebarPrimaryNav from "./SidebarPrimaryNav";
import SidebarProducerTools from "./SidebarProducerTools";
import SidebarPlatformSection from "./SidebarPlatformSection";
import SidebarPublicSiteSection from "./SidebarPublicSiteSection";
import SidebarFooter from "./SidebarFooter";

/**
 * Desktop sidebar composer — was one 631-line file before this split (see
 * docs/README-codebase-architecture-review.md). Owns the shared state
 * (collapsed, section-open flags, theme, notifications panel) and passes it
 * down; each section below is its own file so a change to e.g. the
 * Platform section can't accidentally touch collapse behavior.
 */
export default function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab");
  const collapsed = useDashboardSidebarStore((s) => s.collapsed);
  const setCollapsedGlobal = useDashboardSidebarStore((s) => s.setCollapsed);
  const [notifOpen, setNotifOpen] = useState(false);
  /** Expanded sidebar only: hide Platform links to reduce visual noise. */
  const [platformSectionOpen, setPlatformSectionOpen] = useState(false);
  /** Expanded sidebar only: hide public-site shortcuts. */
  const [publicSiteSectionOpen, setPublicSiteSectionOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useThemeStore();
  const isDark = theme === "dark";
  const openAssistant = useHelpAssistantStore((s) => s.openAssistant);
  const view = usePrototypeViewStore((s) => s.view);
  const isLabelManager = view === "label_manager";
  const hasPendingContracts = useContractsStore((s) =>
    s.contracts.some((c) => c.status === "pending_signature")
  );

  useEffect(() => {
    const stored = localStorage.getItem("proton-sidebar-collapsed");
    setCollapsedGlobal(stored === "true");
  }, [setCollapsedGlobal]);

  useEffect(() => {
    const stored = localStorage.getItem("proton-sidebar-platform-open");
    if (stored === "true") setPlatformSectionOpen(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("proton-sidebar-public-site-open");
    if (stored === "true") setPublicSiteSectionOpen(true);
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

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsedGlobal(next);
    localStorage.setItem("proton-sidebar-collapsed", String(next));
  };

  return (
    <>
      <aside
        className={`hidden lg:flex flex-col shrink-0 h-screen sticky top-0
          bg-surface border-r border-[var(--color-border)]
          transition-[width] duration-300 ease-in-out overflow-hidden
          ${collapsed ? "w-16" : "w-64"}`}
      >
        <SidebarHeader
          collapsed={collapsed}
          isLabelManager={isLabelManager}
          onOpenNotifications={() => setNotifOpen(true)}
        />

        <nav className="flex-1 overflow-y-auto py-4 space-y-5">
          <SidebarPrimaryNav
            pathname={pathname}
            collapsed={collapsed}
            isLabelManager={isLabelManager}
            hasPendingContracts={hasPendingContracts}
          />

          {!isLabelManager && (
            <SidebarProducerTools pathname={pathname} collapsed={collapsed} />
          )}

          <SidebarPlatformSection
            pathname={pathname}
            urlTab={urlTab}
            collapsed={collapsed}
            open={platformSectionOpen}
            onToggle={togglePlatformSection}
            onOpenHelp={openAssistant}
          />

          <SidebarPublicSiteSection
            collapsed={collapsed}
            open={publicSiteSectionOpen}
            onToggle={togglePublicSiteSection}
          />
        </nav>

        <SidebarFooter
          collapsed={collapsed}
          isLabelManager={isLabelManager}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onToggleCollapsed={toggleCollapsed}
        />
      </aside>

      <NotificationsPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        anchor="sidebar"
        sidebarWidth={collapsed ? 64 : 256}
      />
    </>
  );
}
