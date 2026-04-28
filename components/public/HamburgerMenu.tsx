"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, Radio, Tv2, BarChart2, Tag, LayoutDashboard } from "lucide-react";

const PUBLIC_LOGO_SRC = "/logo%20complete.png";

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
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--color-surface)", borderRight: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <Link
            href="/"
            onClick={onClose}
            className="relative block h-8 w-[96px] shrink-0"
            aria-label="Proton Radio — Home"
          >
            <Image
              src={PUBLIC_LOGO_SRC}
              alt="Proton Radio"
              fill
              className="object-contain object-left"
              sizes="96px"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded transition-colors hover:bg-white/10"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 pt-4">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: active ? "var(--color-accent)" : "var(--color-text-primary)",
                  background: active ? "rgba(230,126,34,0.1)" : "transparent",
                }}
              >
                <Icon size={18} style={{ color: active ? "var(--color-accent)" : "var(--color-text-secondary)" }} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* For Artists CTA */}
        <div className="px-4 py-5" style={{ borderTop: "1px solid var(--color-border)" }}>
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-accent)" }}
          >
            <LayoutDashboard size={16} />
            For Artists
          </Link>
        </div>
      </div>
    </>
  );
}
