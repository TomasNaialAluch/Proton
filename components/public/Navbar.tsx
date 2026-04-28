"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";

const PUBLIC_LOGO_SRC = "/logo%20complete.png";

const NAV_LINKS = [
  { label: "Radio", href: "/" },
  { label: "Shows", href: "/shows" },
  { label: "Charts", href: "/charts" },
  { label: "Labels", href: "/labels" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-30 h-14 flex items-center px-4 md:px-6"
        style={{
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Mobile: hamburger */}
        <button
          className="lg:hidden p-2 -ml-2 rounded transition-colors hover:bg-white/10"
          style={{ color: "var(--color-text-secondary)" }}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo — asset en /public/logo complete.png */}
        <Link
          href="/"
          className="relative mx-auto lg:mx-0 block h-9 w-[104px] sm:w-[118px] shrink-0"
          aria-label="Proton Radio — Home"
        >
          <Image
            src={PUBLIC_LOGO_SRC}
            alt="Proton Radio"
            fill
            className="object-contain object-center lg:object-left"
            priority
            sizes="120px"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1 ml-8 flex-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-1.5 rounded text-sm font-medium transition-colors"
                style={{
                  color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
                  background: active ? "rgba(230,126,34,0.1)" : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop: For Artists CTA */}
        <Link
          href="/dashboard"
          className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 ml-auto"
          style={{ background: "var(--color-accent)" }}
        >
          <LayoutDashboard size={15} />
          For Artists
        </Link>
      </header>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
