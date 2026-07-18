import type { ReadonlyURLSearchParams } from "next/navigation";

/**
 * The current page's full URL (path + query), suitable for encoding into a
 * child link's `?from=` so "back" from wherever the user drills into next
 * unwinds the whole trail instead of just the last hop — see
 * docs/README-navigation-back-flow.md.
 */
export function backChainForward(pathname: string, searchParams: ReadonlyURLSearchParams): string {
  const qs = searchParams.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/**
 * Pulls a label slug out of a `/dashboard/labels/{slug}...` path — used to
 * give Track/Artist Detail's breadcrumb a label to show even when the
 * entity itself has no `labelSlug` of its own (most of the shared sample
 * catalog doesn't — see lib/mock/labelSampleCatalog.ts), by falling back to
 * whatever label page the user actually browsed here from.
 *
 * The immediate referrer isn't always a label page directly — e.g. Track
 * reached via Artist reached via Label — so this walks the whole `from`
 * chain (each hop nests the previous one's query string, see
 * `backChainForward`), not just the first link, decoding one level at a
 * time until it finds a `/dashboard/labels/{slug}` segment anywhere in it.
 * See docs/README-navigation-back-flow.md.
 */
export function labelSlugFromReferrer(path: string | null, depth = 0): string | undefined {
  if (!path || depth > 5) return undefined;
  const direct = path.match(/^\/dashboard\/labels\/([^/?]+)/)?.[1];
  if (direct) return direct;
  const [, query] = path.split("?");
  if (!query) return undefined;
  const nestedFrom = new URLSearchParams(query).get("from");
  return labelSlugFromReferrer(nestedFrom, depth + 1);
}
