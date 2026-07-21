import {
  User, TrendingUp, DollarSign, Building2, Settings,
  Radio, Tag, Disc3, Link as LinkIcon, BarChart3, Mic2,
  Compass, MessageSquareText, Users,
} from "lucide-react";

export const dashboardLinks = [
  { label: "Artists",     icon: User,       href: "/dashboard" },
  { label: "Performance", icon: TrendingUp, href: "/dashboard/performance" },
  { label: "Royalties",   icon: DollarSign, href: "/dashboard/royalties" },
  { label: "Contracts",   icon: Building2,  href: "/dashboard/contracts" },
  { label: "Labels", icon: Tag,        href: "/dashboard/labels" },
  { label: "Discover",    icon: Compass,    href: "/dashboard/discover" },
  { label: "Feedback",    icon: MessageSquareText, href: "/dashboard/feedback" },
  { label: "Connections", icon: Users,      href: "/dashboard/connections" },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings/account",
    /** Highlight for any settings sub-route (profile, account, etc.) */
    activePrefix: "/dashboard/settings",
  },
] as const;

export function linkIsActive(
  pathname: string,
  href: string,
  activePrefix?: string
): boolean {
  if (activePrefix) {
    return pathname === activePrefix || pathname.startsWith(`${activePrefix}/`);
  }
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Tooltip / aria for links that open the public app (user leaves the artist dashboard). */
export const LEAVES_DASHBOARD_HINT =
  "Opens the public site — you will leave the artist dashboard.";

/**
 * Producer tools — things a producer who already has a Proton artist
 * account actively does with it. Shows and DJ Mixes moved here from the
 * old "Platform" grouping (see docs/analisis-platform-integracion.md,
 * "Roadmap decidido: Shows + DJ Mixes se mudan a Producer tools"): both
 * are actions a logged-in producer takes to get content out through
 * Proton's own channels (a radio show, a DJ mix on Spotify/Apple),
 * same nature as Release Links — not reference copy.
 */
export const producerToolLinks = [
  {
    label: "Release Links",
    href: "/dashboard/settings/account/notifications",
    icon: LinkIcon,
    dot: null,
    leavesDashboard: false,
    externalGlyph: false,
    platformTab: null,
  },
  {
    label: "Shows",
    href: "/dashboard/platform?tab=shows",
    icon: Radio,
    dot: "#E67E22" as const,
    leavesDashboard: false,
    externalGlyph: false,
    platformTab: "shows" as const,
  },
  {
    label: "DJ Mixes",
    href: "/dashboard/platform?tab=dj-mixes",
    icon: Disc3,
    dot: "#9B59B6" as const,
    leavesDashboard: false,
    externalGlyph: false,
    platformTab: "dj-mixes" as const,
  },
] as const;

/**
 * Extras — not producer-tool actions. Applying to launch a label isn't
 * something a producer does with their own artist account; it's a
 * separate Proton business relationship (see
 * docs/analisis-platform-integracion.md, "Labels — seguimos pensando
 * dónde va"). Kept in its own, clearly-separate section instead of mixed
 * in with Producer tools until that placement question is resolved.
 */
export const extrasLinks = [
  {
    label: "Labels",
    href: "/dashboard/platform?tab=labels",
    icon: Tag,
    dot: "#1ABC9C" as const,
    leavesDashboard: false,
    externalGlyph: false,
    platformTab: "labels" as const,
  },
] as const;

/** Public routes (same app, outside `/dashboard`). */
export const publicSiteLinks = [
  { label: "Radio", href: "/", icon: Radio },
  { label: "Shows", href: "/shows", icon: Mic2 },
  { label: "Charts", href: "/charts/progressive", icon: BarChart3 },
  { label: "Labels", href: "/labels", icon: Tag },
] as const;
