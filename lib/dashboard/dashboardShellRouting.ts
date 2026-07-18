import type { LucideIcon } from "lucide-react";
import { Home, User, TrendingUp, Disc3, Music2, DollarSign, Radar, Inbox, Trophy, ClipboardList } from "lucide-react";

/** Default landing when switching into the label-manager prototype shell —
 *  now a real Home (`LabelDashboardHome`), same URL the producer shell's
 *  own Home already used. Was `/dashboard/roster` — label-manager had no
 *  Home page at all before this. See
 *  docs/README-label-manager-rebuild-plan.md, section 6. */
export const LABEL_MANAGER_ENTRY = "/dashboard";

/** Default landing for the artist / producer shell. */
export const PRODUCER_ENTRY = "/dashboard";

/** Primary routes for the label-manager prototype shell (sidebar, bottom nav, hamburger). */
export const LABEL_MANAGER_NAV_LINKS: readonly {
  label: string;
  icon: LucideIcon;
  href: string;
}[] = [
  { label: "Home", icon: Home, href: LABEL_MANAGER_ENTRY },
  { label: "Roster", icon: User, href: "/dashboard/roster" },
  { label: "Scouting", icon: Radar, href: "/dashboard/scouting" },
  { label: "Requests", icon: Inbox, href: "/dashboard/requests" },
  { label: "Catalog", icon: Disc3, href: "/dashboard/catalog" },
  { label: "Contests", icon: Trophy, href: "/dashboard/contests" },
  { label: "Releases", icon: Music2, href: "/dashboard/releases" },
  { label: "Revenue", icon: TrendingUp, href: "/dashboard/revenue" },
  { label: "Statements", icon: DollarSign, href: "/dashboard/statements" },
  { label: "Demo policy", icon: ClipboardList, href: "/dashboard/demo-policy" },
];

/**
 * `/dashboard/labels/{slug}...` (a specific label's own page, and its
 * releases/roster/contests sub-routes) is a universal entity page, viewable
 * by both shells — see "Resolved: these pages don't need a label-manager UI
 * mode at all" in docs/README-routing-architecture.md. Only `/dashboard/labels`
 * itself (Browse) and these producer-scoped sub-workflows stay producer-only.
 */
const LABELS_PRODUCER_ONLY_SUBPATHS = ["submissions", "messages", "chat"];

/**
 * Producer-only routes: not used by the label-manager MVP shell (except
 * `/dashboard` and `/dashboard/releases`, both shared and branching
 * in-page — see `app/(dashboard)/dashboard/page.tsx`).
 *
 * `/dashboard/settings` is deliberately excluded here — it's shared by both shells (it's
 * where sign-out lives), so it must not bounce a label-manager user back to Home.
 */
export function isProducerShellPath(pathname: string): boolean {
  if (pathname.startsWith("/dashboard/performance")) return true;
  if (pathname.startsWith("/dashboard/royalties")) return true;
  if (pathname.startsWith("/dashboard/labels")) {
    const rest = pathname.slice("/dashboard/labels".length);
    if (rest === "" || rest === "/") return true;
    const firstSegment = rest.split("/")[1];
    return LABELS_PRODUCER_ONLY_SUBPATHS.includes(firstSegment);
  }
  if (pathname.startsWith("/dashboard/contracts")) return true;
  if (pathname.startsWith("/dashboard/platform")) return true;
  return false;
}

/** Label-manager MVP routes (excluding shared `/dashboard/releases`). */
export function isLabelShellPath(pathname: string): boolean {
  if (pathname.startsWith("/dashboard/roster")) return true;
  if (pathname.startsWith("/dashboard/scouting")) return true;
  if (pathname.startsWith("/dashboard/requests")) return true;
  if (pathname.startsWith("/dashboard/contests")) return true;
  if (pathname.startsWith("/dashboard/demo-policy")) return true;
  if (pathname.startsWith("/dashboard/catalog")) return true;
  if (pathname.startsWith("/dashboard/revenue")) return true;
  if (pathname.startsWith("/dashboard/statements")) return true;
  return false;
}
