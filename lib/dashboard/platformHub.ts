/** Sidebar / drawer active state for `/dashboard/platform?tab=…` links. */
export function platformHubLinkActive(
  pathname: string,
  urlTab: string | null,
  tile: "shows" | "labels" | "dj-mixes"
): boolean {
  if (pathname !== "/dashboard/platform") return false;
  if (tile === "shows") return urlTab === "shows" || urlTab === null || urlTab === "";
  return urlTab === tile;
}
