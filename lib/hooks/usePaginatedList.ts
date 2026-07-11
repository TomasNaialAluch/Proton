import { useEffect, useState } from "react";

/**
 * Client-side "load more" pagination for lists we render entirely in memory
 * (mock data, no backend pagination yet).
 *
 * `resetKey` should be a primitive that changes only when the underlying
 * result set actually changes (e.g. `${search}-${sortDir}-${filter}`) — NOT
 * the `items` array itself, since callers typically rebuild that array (via
 * `.slice().sort()`/`.filter()`) on every render, which would reset the page
 * back to the first `pageSize` items right after "load more" is clicked.
 */
export function usePaginatedList<T>(items: T[], pageSize: number, resetKey: string | number = "") {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [resetKey, pageSize]);

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return {
    visibleItems,
    hasMore,
    remaining: items.length - visibleItems.length,
    loadMore: () => setVisibleCount((c) => c + pageSize),
  };
}
