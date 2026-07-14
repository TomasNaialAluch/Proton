"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import DashboardBreadcrumb from "@/components/dashboard/_shared/DashboardBreadcrumb";
import BackButton from "@/components/dashboard/_shared/BackButton";
import LoadMoreButton from "@/components/dashboard/_shared/LoadMoreButton";
import { mockRosterArtists } from "@/lib/mock/label-manager/rosterArtists";
import { mockLabels } from "@/lib/mock/labels";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";

const PAGE_SIZE = 25;

function labelSlugFromPath(pathname: string): string {
  const m = pathname.match(/\/dashboard\/labels\/([^/]+)\/roster\/?$/);
  return m?.[1] ?? "";
}

export default function LabelRosterPage() {
  const pathname = usePathname();
  const slug = labelSlugFromPath(pathname);
  const label = mockLabels.find((l) => l.slug === slug);
  if (!label) notFound();

  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filtered = query
    ? mockRosterArtists.filter((a) => a.name.toLowerCase().includes(query))
    : mockRosterArtists;

  const { visibleItems: pagedArtists, hasMore, remaining, loadMore } = usePaginatedList(filtered, PAGE_SIZE, query);

  return (
    <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10 lg:max-w-2xl lg:px-10 flex flex-col gap-6">
      <BackButton fallbackHref={`/dashboard/labels/${label.slug}`} label="Back" />

      <DashboardBreadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Labels", href: "/dashboard/labels" },
        { label: label.name, href: `/dashboard/labels/${label.slug}` },
        { label: "Roster" },
      ]} />

      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">Artist roster</h1>
        <p className="text-sm text-text-secondary">{label.name}</p>
      </div>

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search artists…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-[var(--color-border)]/40 text-sm
            text-text-primary placeholder:text-text-secondary
            border border-transparent focus:border-accent/50 outline-none transition-colors"
        />
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-surface overflow-hidden">
        {pagedArtists.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-text-secondary">No artists match &ldquo;{search}&rdquo;.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {pagedArtists.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/dashboard/artists/${a.id}?via=${label.slug}&from=${encodeURIComponent(pathname)}`}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-[var(--color-border)]/30 transition-colors"
                >
                  <span className="size-9 rounded-full flex items-center justify-center text-xs font-bold bg-accent/10 text-accent shrink-0">
                    {a.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-primary truncate">{a.name}</p>
                    <p className="text-xs text-text-secondary truncate">{a.genres.join(" · ")}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {hasMore && <LoadMoreButton onClick={loadMore} remaining={remaining} pageSize={PAGE_SIZE} />}
      </div>
    </main>
  );
}
