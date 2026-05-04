"use client";

import { useState } from "react";
import { Bell, Menu, CircleHelp } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import NotificationsPanel from "./NotificationsPanel";
import { useHelpAssistantStore } from "@/lib/store/helpAssistantStore";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const openAssistant = useHelpAssistantStore((s) => s.openAssistant);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4
        border-b border-[var(--color-border)]
        bg-background/80 backdrop-blur-md transition-colors duration-200
        lg:hidden">

        <button
          onClick={() => setMenuOpen(true)}
          className="text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo — replace inner content with <Image> once asset is provided */}
        <span className="font-display font-bold tracking-widest text-sm text-text-primary uppercase">
          Proton
        </span>

        <div className="flex items-center gap-1">
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
