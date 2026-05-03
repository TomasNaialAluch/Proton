"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Radio, Tv2, BarChart2, Tag, LayoutDashboard } from "lucide-react";

const PUBLIC_LOGO_SRC = "/Logo%20ISO.png";

const NAV_LINKS = [
  { label: "Radio", href: "/", icon: Radio },
  { label: "Shows", href: "/shows", icon: Tv2 },
  { label: "Charts", href: "/charts", icon: BarChart2 },
  { label: "Labels", href: "/labels", icon: Tag },
];

interface HamburgerMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function HamburgerMenu({ open, onClose }: HamburgerMenuProps) {
  const pathname = usePathname();

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col
          bg-surface border-r border-[var(--color-border)] shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <Link
            href="/"
            onClick={onClose}
            className="m-0 flex min-w-0 flex-1 items-center gap-0 p-0 mr-2"
            aria-label="Proton Radio — Home"
          >
            <span className="inline-flex h-10 shrink-0 items-center m-0 p-0">
              <Image
                src={PUBLIC_LOGO_SRC}
                alt=""
                width={160}
                height={110}
                className="h-10 w-auto max-h-10 object-contain object-right"
                sizes="48px"
              />
            </span>
            <span className="font-display m-0 min-w-0 truncate p-0 text-left text-sm font-bold uppercase leading-none tracking-normal text-text-primary">
              Proton
            </span>
          </Link>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto flex flex-col gap-0.5 px-3 py-4">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "text-accent bg-accent/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"}`}
              >
                <Icon size={16} className={active ? "text-accent" : "text-text-secondary"} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* For Artists CTA */}
        <div className="px-4 py-5 border-t border-[var(--color-border)]">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold text-white bg-accent transition-opacity hover:opacity-90"
          >
            <LayoutDashboard size={16} />
            For Artists
          </Link>
        </div>
      </aside>
    </>
  );
}
