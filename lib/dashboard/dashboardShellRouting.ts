import type { LucideIcon } from "lucide-react";
import { User, TrendingUp, Disc3, Music2, DollarSign } from "lucide-react";

/** Default landing when switching into the label-manager prototype shell. */
export const LABEL_MANAGER_ENTRY = "/dashboard/roster";

/** Default landing for the artist / producer shell. */
export const PRODUCER_ENTRY = "/dashboard";

/** Primary routes for the label-manager prototype shell (sidebar, bottom nav, hamburger). */
export const LABEL_MANAGER_NAV_LINKS: readonly {
  label: string;
  icon: LucideIcon;
  href: string;
}[] = [
  { label: "Roster", icon: User, href: LABEL_MANAGER_ENTRY },
  { label: "Catalog", icon: Disc3, href: "/dashboard/catalog" },
  { label: "Releases", icon: Music2, href: "/dashboard/releases" },
  { label: "Revenue", icon: TrendingUp, href: "/dashboard/revenue" },
  { label: "Statements", icon: DollarSign, href: "/dashboard/statements" },
];

/**
 * Producer-only routes: not used by the label-manager MVP shell (except `/dashboard/releases`,
 * which is shared and branches in-page).
 */
export function isProducerShellPath(pathname: string): boolean {
  if (pathname === "/dashboard") return true;
  if (pathname.startsWith("/dashboard/performance")) return true;
  if (pathname.startsWith("/dashboard/royalties")) return true;
  if (pathname.startsWith("/dashboard/contracts")) return true;
  if (pathname.startsWith("/dashboard/platform")) return true;
  if (pathname.startsWith("/dashboard/settings")) return true;
  return false;
}

/** Label-manager MVP routes (excluding shared `/dashboard/releases`). */
export function isLabelShellPath(pathname: string): boolean {
  if (pathname.startsWith("/dashboard/roster")) return true;
  if (pathname.startsWith("/dashboard/catalog")) return true;
  if (pathname.startsWith("/dashboard/revenue")) return true;
  if (pathname.startsWith("/dashboard/statements")) return true;
  return false;
}
