"use client";

import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import NotificationsPanel from "./NotificationsPanel";

export default function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

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

        <button
          onClick={() => setNotifOpen(true)}
          className="relative text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-accent" />
        </button>
      </header>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
