"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Bell, Music, DollarSign, FileText, TrendingUp, CheckCheck, MessageSquareText, Users, MessageCircle, BellRing } from "lucide-react";
import { useContractsStore } from "@/lib/store/contractsStore";
import { useLabelFollowsStore } from "@/lib/store/labelFollowsStore";
import { mockLabelNews } from "@/lib/mock/labelNews";
import { mockLabels } from "@/lib/mock/labels";

interface Notification {
  id: number | string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  /** Route to navigate to when the notification is clicked. */
  href?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: -1,
    icon: MessageCircle,
    iconColor: "#1ABC9C",
    title: "You're connected with Darko",
    description: "You both said yes — you can message each other now.",
    time: "30 min ago",
    read: false,
    href: "/dashboard/connections/chat/convo-1",
  },
  {
    id: -2,
    icon: Users,
    iconColor: "#9B59B6",
    title: "New connection suggested",
    description: "We think you and Vesna would make a great pair — see why.",
    time: "1 h ago",
    read: false,
    href: "/dashboard/connections/conn-1",
  },
  {
    id: 0,
    icon: MessageSquareText,
    iconColor: "#E67E22",
    title: "New feedback received",
    description: "Lume left feedback on \"Emotional Damage\".",
    time: "2 h ago",
    read: false,
    href: "/dashboard/feedback/fb-1",
  },
  {
    id: 1,
    icon: Music,
    iconColor: "#A78BFA",
    title: "New release approved",
    description: "\"Midnight Drive\" has been approved and is now in distribution.",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    icon: DollarSign,
    iconColor: "#34D399",
    title: "Royalties available",
    description: "You have $1,240.00 USD ready to withdraw this month.",
    time: "2 h ago",
    read: false,
  },
  {
    id: 3,
    icon: TrendingUp,
    iconColor: "#60A5FA",
    title: "Streams spike",
    description: "\"Neon Sky\" surpassed 50K plays this week.",
    time: "6 h ago",
    read: false,
  },
  {
    id: 5,
    icon: Music,
    iconColor: "#F87171",
    title: "Release rejected",
    description: "\"Echo Chamber\" was rejected. Review the details.",
    time: "2 days ago",
    read: true,
  },
];

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  /**
   * "right" (default) — full-height drawer sliding in from the right edge, used on mobile.
   * "sidebar" — compact popover anchored under the bell button in the left sidebar, so it
   * opens right where the cursor already is on desktop instead of forcing a look/reach to
   * the far side of the screen.
   */
  anchor?: "right" | "sidebar";
  /** Left offset (in px) to anchor the popover next to the sidebar. Only used when anchor="sidebar". */
  sidebarWidth?: number;
}

export default function NotificationsPanel({
  open,
  onClose,
  anchor = "right",
  sidebarWidth = 256,
}: NotificationsPanelProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  // Select the stable `contracts` array reference and filter in render, not inside the
  // selector — a selector returning a freshly-filtered array every call breaks zustand's
  // useSyncExternalStore (infinite "getServerSnapshot" loop).
  const contracts = useContractsStore((s) => s.contracts);
  const pendingContracts = contracts.filter((c) => c.status === "pending_signature");
  const following = useLabelFollowsStore((s) => s.following);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /**
   * Pending-contract notifications are derived from real data, not stored —
   * they reflect a contract that's actually waiting on a signature, so
   * "Clear all" (which only clears the static mock notifications below)
   * doesn't dismiss them. They disappear on their own once the contract is
   * signed, same as the nav badge.
   */
  const contractNotifications: Notification[] = pendingContracts.map((contract) => ({
    id: `contract-${contract.id}`,
    icon: FileText,
    iconColor: "#F59E0B",
    title: "Pending contract",
    description: `The contract with ${contract.label} requires your signature.`,
    time: "Awaiting signature",
    read: false,
    href: `/dashboard/contracts/${contract.id}`,
  }));

  /**
   * News from a followed label — only surfaced if it happened after the
   * producer started following (see `since` in labelFollowsStore). Derived,
   * like the pending-contract notifications above: it reflects real followed
   * state, so "Clear all" doesn't dismiss it, and it goes away on its own
   * once there's no more unseen news for that label.
   */
  const labelNewsNotifications: Notification[] = mockLabelNews
    .filter((n) => following.some((f) => f.slug === n.labelSlug && n.date >= f.since))
    .map((n) => ({
      id: `label-news-${n.id}`,
      icon: n.type === "new_release" ? Music : BellRing,
      iconColor: "#34D399",
      title: n.title,
      description: n.description,
      time: n.time,
      read: false,
      href: `/dashboard/labels/${n.labelSlug}`,
    }));

  const allNotifications = [...contractNotifications, ...labelNewsNotifications, ...notifications];
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const clearAll = () => setNotifications([]);

  const isSidebar = anchor === "sidebar";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel — full-height drawer from the right (mobile), or a compact popover
          anchored next to the sidebar bell (desktop) so it opens where the mouse already is */}
      <aside
        style={isSidebar ? { left: sidebarWidth + 12 } : undefined}
        className={
          isSidebar
            ? `fixed top-4 z-50 flex max-h-[min(32rem,calc(100vh-2rem))] w-80 flex-col
               rounded-xl bg-surface border border-[var(--color-border)]
               shadow-2xl transition-all duration-200 ease-out origin-top-left
               ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`
            : `fixed top-0 right-0 z-50 h-full w-80 flex flex-col
               bg-surface border-l border-[var(--color-border)]
               shadow-2xl transition-transform duration-300 ease-in-out
               ${open ? "translate-x-0" : "translate-x-full"}`
        }
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-text-primary" />
            <span className="font-semibold text-sm text-text-primary">Notifications</span>
            {unreadCount > 0 && (
              <span className="flex items-center justify-center size-5 rounded-full bg-accent text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {allNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-text-secondary px-6 text-center">
              <CheckCheck size={36} className="opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {allNotifications.map(({ id, icon: Icon, iconColor, title, description, time, read, href }) => (
                <li
                  key={id}
                  onClick={
                    href
                      ? () => {
                          onClose();
                          router.push(href);
                        }
                      : undefined
                  }
                  className={`flex gap-3 px-5 py-4 transition-colors hover:bg-[var(--color-border)]/40 ${
                    !read ? "bg-accent/5" : ""
                  } ${href ? "cursor-pointer" : ""}`}
                >
                  {/* Icon */}
                  <div
                    className="mt-0.5 flex-shrink-0 size-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${iconColor}20` }}
                  >
                    <Icon size={14} style={{ color: iconColor }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${read ? "text-text-secondary" : "text-text-primary font-medium"}`}>
                        {title}
                      </p>
                      {!read && (
                        <span className="flex-shrink-0 mt-1.5 size-1.5 rounded-full bg-accent" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">
                      {description}
                    </p>
                    <p className="text-[11px] text-text-secondary/60 mt-1">{time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — Clear all (only clears the static ones, see contractNotifications comment) */}
        {notifications.length > 0 && (
          <div className="px-5 py-4 border-t border-[var(--color-border)]">
            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                text-sm text-text-secondary hover:text-text-primary
                hover:bg-[var(--color-border)] transition-colors"
            >
              <CheckCheck size={15} />
              Clear all notifications
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
