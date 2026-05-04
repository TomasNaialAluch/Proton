"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

function NavbarSearchFields() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(() =>
    pathname === "/search" ? (searchParams.get("q") ?? "") : ""
  );
  const [expanded, setExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (pathname !== "/search") setExpanded(false);
  }, [pathname]);

  /** Sincronizar con la URL solo al entrar a /search (no en cada `router.replace` mientras escribís en la página). */
  useEffect(() => {
    if (pathname !== "/search") {
      setValue("");
    } else if (prevPathname.current !== "/search") {
      setValue(searchParams.get("q") ?? "");
    }
    prevPathname.current = pathname;
  }, [pathname, searchParams]);

  useLayoutEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setExpanded(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  return (
    <div ref={rootRef} className="hidden lg:flex items-center shrink-0">
      {!expanded ? (
        <button
          type="button"
          className="p-2 rounded-lg border transition-colors hover:bg-[var(--color-border)]"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
          aria-label="Abrir búsqueda"
          aria-expanded={false}
          onClick={() => setExpanded(true)}
        >
          <Search size={18} strokeWidth={2} />
        </button>
      ) : (
        <form
          className="flex items-center gap-1 min-w-0 transition-opacity duration-150"
          onSubmit={(e) => {
            e.preventDefault();
            const q = value.trim();
            router.push(q === "" ? "/search" : `/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <div className="relative w-[min(220px,28vw)]">
            <Search
              size={15}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-secondary)" }}
            />
            <input
              ref={inputRef}
              name="q"
              type="search"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Buscar"
              autoComplete="off"
              aria-label="Buscar"
              className="w-full rounded-lg border py-1.5 pl-8 pr-8 text-xs outline-none
                focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text-primary)",
              }}
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]"
              aria-label="Cerrar búsqueda"
              onClick={() => setExpanded(false)}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function NavbarSearch() {
  return (
    <Suspense
      fallback={
        <div
          className="hidden lg:block size-9 shrink-0 rounded-lg"
          style={{ background: "var(--color-border)" }}
          aria-hidden
        />
      }
    >
      <NavbarSearchFields />
    </Suspense>
  );
}
