"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { fetchLabels } from "@/lib/api/labels";
import { fetchLatestMixes } from "@/lib/api/mixes";
import type { ProtonLabel } from "@/types/label";
import type { ProtonMix } from "@/types/mix";
import { searchPublicIndex } from "@/lib/search/publicSearch";
import HighlightedText from "@/components/public/search/HighlightedText";
import SearchShowRow from "@/components/public/search/SearchShowRow";

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function SearchResultGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2
          className="text-sm font-bold uppercase tracking-wide"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-semibold"
          style={{
            background: "rgba(230,126,34,0.15)",
            color: "var(--color-accent)",
          }}
        >
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

export default function SearchView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  /** Estado local único: NO sincronizar cada cambio de URL → texto (el replace debounced iba “atrás” del teclado y borraba lo que escribías). */
  const [text, setText] = useState(() => searchParams.get("q") ?? "");
  const debouncedText = useDebouncedValue(text, 260);

  useEffect(() => {
    const q = debouncedText.trim();
    const urlQ = (searchParams.get("q") ?? "").trim();
    if (q === urlQ) return;
    const next = q === "" ? "/search" : `/search?q=${encodeURIComponent(q)}`;
    router.replace(next, { scroll: false });
  }, [debouncedText, router, searchParams]);

  const [mixes, setMixes] = useState<ProtonMix[] | null>(null);
  const [labels, setLabels] = useState<ProtonLabel[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    Promise.all([fetchLatestMixes(100), fetchLabels()])
      .then(([m, l]) => {
        if (!cancelled) {
          setMixes(m);
          setLabels(l);
        }
      })
        .catch(() => {
        if (!cancelled)
          setLoadError("No se pudo cargar el catálogo. Probá de nuevo más tarde.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeQuery = text.trim();
  const results = useMemo(() => {
    if (!mixes || !labels || !activeQuery) return null;
    return searchPublicIndex(mixes, labels, activeQuery);
  }, [mixes, labels, activeQuery]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = text.trim();
      router.push(q === "" ? "/search" : `/search?q=${encodeURIComponent(q)}`);
    },
    [router, text]
  );

  const loadingIndex = mixes === null || labels === null;

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-8">
      <div>
        <h1
          className="text-2xl md:text-3xl font-bold italic"
          style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-display)" }}
        >
          Búsqueda
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          Buscá artistas, sellos y shows sobre los últimos datos cargados (MVP).
        </p>
      </div>

      <form onSubmit={onSubmit} className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--color-text-secondary)" }}
        />
        <input
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué estás buscando?"
          autoComplete="off"
          aria-label="Buscar"
          className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-shadow
            focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
          }}
        />
      </form>

      {loadError && (
        <p className="text-sm rounded-lg border px-4 py-3" style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
          {loadError}
        </p>
      )}

      {loadingIndex && !loadError && (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Cargando catálogo…
        </p>
      )}

      {!loadingIndex && !loadError && !activeQuery && (
        <div
          className="rounded-2xl border px-6 py-12 text-center flex flex-col gap-2"
          style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
            Escribí un término para buscar en artistas, sellos y shows.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Se filtra sobre los últimos episodios y el listado de sellos.
          </p>
        </div>
      )}

      {!loadingIndex && !loadError && activeQuery && results && (
        <>
          {results.artists.length === 0 &&
            results.labels.length === 0 &&
            results.shows.length === 0 && (
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Sin resultados para{" "}
                <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                  «{activeQuery}»
                </span>
                .
              </p>
            )}

          <div className="flex flex-col gap-10">
            <SearchResultGroup title="Artistas" count={results.artists.length}>
              {results.artists.map((a) => (
                <Link
                  key={a.id}
                  href={a.href}
                  className="flex items-center gap-3 rounded-xl border p-3 no-underline transition-colors hover:opacity-95"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-surface)",
                  }}
                >
                  <div
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(26,188,156,0.12)",
                      color: "#1ABC9C",
                    }}
                  >
                    {a.image?.url ? (
                      <Image
                        src={a.image.url}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      a.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    <HighlightedText text={a.name} query={activeQuery} />
                  </span>
                </Link>
              ))}
            </SearchResultGroup>

            <SearchResultGroup title="Sellos" count={results.labels.length}>
              {results.labels.map((label) => (
                <Link
                  key={label.id}
                  href={label.href}
                  className="flex items-center gap-3 rounded-xl border p-3 no-underline transition-colors hover:opacity-95"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-surface)",
                  }}
                >
                  <div
                    className="h-12 w-12 shrink-0 rounded-lg overflow-hidden flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "rgba(26,188,156,0.12)",
                      color: "#1ABC9C",
                    }}
                  >
                    {label.image?.url ? (
                      <Image
                        src={label.image.url}
                        alt=""
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    ) : (
                      label.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    <HighlightedText text={label.name} query={activeQuery} />
                  </span>
                </Link>
              ))}
            </SearchResultGroup>

            <SearchResultGroup title="Shows" count={results.shows.length}>
              {results.shows.map((row) => (
                <SearchShowRow key={row.id} row={row} query={activeQuery} />
              ))}
            </SearchResultGroup>
          </div>
        </>
      )}
    </div>
  );
}
