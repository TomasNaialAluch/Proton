"use client";

import { useEffect, useState } from "react";
import { X, Bell, Music, DollarSign, FileText, TrendingUp, CheckCheck } from "lucide-react";

interface Notification {
  id: number;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
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
    id: 4,
    icon: FileText,
    iconColor: "#F59E0B",
    title: "Pending contract",
    description: "The contract with Stellar Records requires your signature.",
    time: "Yesterday",
    read: true,
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
}

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const clearAll = () => setNotifications([]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer — slides from the right */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-80 flex flex-col
          bg-surface border-l border-[var(--color-border)]
          shadow-2xl transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
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
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-text-secondary px-6 text-center">
              <CheckCheck size={36} className="opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {notifications.map(({ id, icon: Icon, iconColor, title, description, time, read }) => (
                <li
                  key={id}
                  className={`flex gap-3 px-5 py-4 transition-colors hover:bg-[var(--color-border)]/40 ${
                    !read ? "bg-accent/5" : ""
                  }`}
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

        {/* Footer — Clear all */}
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
