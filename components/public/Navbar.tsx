"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, LogIn } from "lucide-react";
import HamburgerMenu from "./HamburgerMenu";
import NavbarSearch from "./NavbarSearch";
import PublicThemeToggle from "./PublicThemeToggle";

const PUBLIC_LOGO_SRC = "/Logo%20ISO.png";

const NAV_LINKS = [
  { label: "Radio", href: "/" },
  { label: "Shows", href: "/shows" },
  { label: "Charts", href: "/charts/progressive" },
  { label: "Labels", href: "/labels" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const loginActive = pathname === "/login";

  return (
    <>
      <header
        className="relative sticky top-0 z-30 h-16 flex items-center px-5 md:px-6
          border-b border-[var(--color-border)] bg-background/80 backdrop-blur-md
          transition-colors duration-200"
      >
        {/* Mobile: hamburger (fijo a la izquierda; la marca se centra en el viewport aparte) */}
        <button
          type="button"
          className="relative z-10 lg:hidden p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)] transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Marca: gap 0 — el PNG ya trae aire interno; sin márgenes extra entre icono y texto */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 z-0 m-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-0 p-0
            max-w-[calc(100%-5rem)] min-w-0
            lg:static lg:z-auto lg:translate-x-0 lg:translate-y-0 lg:max-w-none"
          aria-label="Proton Radio — Home"
        >
          <span className="inline-flex h-11 shrink-0 items-center m-0 p-0">
            <Image
              src={PUBLIC_LOGO_SRC}
              alt=""
              width={160}
              height={110}
              className="h-11 w-auto max-h-11 object-contain object-right lg:object-left"
              priority
              sizes="(max-width: 1023px) 72px, 56px"
            />
          </span>
          <span className="font-display m-0 min-w-0 truncate p-0 text-left text-sm font-bold uppercase leading-none tracking-normal text-text-primary sm:text-base">
            Proton
          </span>
        </Link>

        {/* Desktop: nav (en móvil el tema solo está en el menú hamburguesa) */}
        <div className="hidden lg:flex items-center gap-4 flex-1 min-w-0 ml-8">
          <nav className="flex items-center gap-1 shrink-0">
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
        </div>

        {/* Desktop: búsqueda + tema + Sign in (§8.7) + For Artists */}
        <div className="hidden lg:flex items-center gap-3 ml-auto shrink-0">
          <NavbarSearch />
          <PublicThemeToggle variant="compact" />
          <Link
            href="/login"
            aria-current={loginActive ? "page" : undefined}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold shrink-0 border transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]
              ${
                loginActive
                  ? "border-accent/40 text-accent bg-accent/10"
                  : "border-[var(--color-border)] text-text-primary hover:bg-[var(--color-border)] hover:text-text-primary"
              }`}
          >
            <LogIn size={15} strokeWidth={2} aria-hidden />
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-accent transition-opacity hover:opacity-90"
          >
            <LayoutDashboard size={15} />
            For Artists
          </Link>
        </div>
      </header>

      <HamburgerMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
