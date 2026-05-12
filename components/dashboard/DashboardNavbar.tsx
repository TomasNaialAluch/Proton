"use client";

import { useState } from "react";
import { Bell, Menu, CircleHelp } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import NotificationsPanel from "./NotificationsPanel";
import { useHelpAssistantStore } from "@/lib/store/helpAssistantStore";
import { usePrototypeViewStore } from "@/lib/store/prototypeViewStore";
import LabelScopeSwitcher from "@/components/dashboard/label-manager/LabelScopeSwitcher";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const openAssistant = useHelpAssistantStore((s) => s.openAssistant);
  const view = usePrototypeViewStore((s) => s.view);

  return (
    <>
      <header
        className="sticky top-0 z-30 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-[var(--color-border)] bg-background/80 px-3 py-3
        backdrop-blur-md transition-colors duration-200 sm:gap-3 sm:px-5 sm:py-4 lg:hidden"
      >

        <button
          onClick={() => setMenuOpen(true)}
          className="justify-self-start rounded-lg p-2 text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
          aria-label="Open menu"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>

        {/* Center: brand + label scope (aligned to grid center column) */}
        <div className="flex min-w-0 flex-col items-center justify-center gap-1 text-center">
          <span className="font-display font-bold tracking-widest text-sm text-text-primary uppercase">
            Proton
          </span>
          {view === "label_manager" && (
            <div className="w-full max-w-[min(17rem,78vw)]">
              <LabelScopeSwitcher hintAlign="center" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={openAssistant}
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Help and support"
          >
            <CircleHelp size={20} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setNotifOpen(true)}
            className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-accent" />
          </button>
        </div>
      </header>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
