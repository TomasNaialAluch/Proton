"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

/**
 * Searchable single-select dropdown. Chips don't scale past a handful of
 * options — this is for filters with dozens of values (Beatport-style genre
 * taxonomy, label rosters) where a niche producer needs to type to narrow down
 * rather than scan a wall of buttons.
 */
export default function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClickOutside);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const filteredOptions = options.filter((o) =>
    o.toLowerCase().includes(query.trim().toLowerCase())
  );

  const select = (option: string | null) => {
    onChange(option);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors
          ${value
            ? "border-accent bg-accent/10 text-accent"
            : "border-[var(--color-border)] bg-surface text-text-secondary hover:text-text-primary"
          }`}
      >
        <span className="max-w-40 truncate">{value ?? label}</span>
        {value ? (
          <X
            size={12}
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              select(null);
            }}
          />
        ) : (
          <ChevronDown size={12} className="shrink-0" />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-64 rounded-xl border border-[var(--color-border)]
          bg-surface shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-3 py-2">
            <Search size={13} className="text-text-secondary shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            <li>
              <button
                type="button"
                onClick={() => select(null)}
                className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-border)]/40
                  ${value === null ? "text-accent font-medium" : "text-text-primary"}`}
              >
                All {label.toLowerCase()}s
              </button>
            </li>
            {filteredOptions.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => select(option)}
                  className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--color-border)]/40
                    ${value === option ? "text-accent font-medium" : "text-text-primary"}`}
                >
                  {option}
                </button>
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="px-3 py-2 text-sm text-text-secondary">No matches.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
