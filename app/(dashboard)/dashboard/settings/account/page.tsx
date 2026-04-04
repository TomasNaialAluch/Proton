import {
  User, Star, CreditCard, Zap, Link2,
  Download, Bell, Sparkles, ChevronRight, ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { mockAccount } from "@/lib/mock/account";

const sections = [
  {
    label:   "Basic Info",
    icon:    User,
    href:    "/dashboard/settings/account/basic",
    summary: `${mockAccount.username} · ${mockAccount.email}`,
  },
  {
    label:   "Pro Access",
    icon:    Star,
    href:    "/dashboard/settings/account/pro",
    summary: "Artists, labels, shows",
  },
  {
    label:   "Payment Settings",
    icon:    CreditCard,
    href:    "/dashboard/settings/account/payment",
    summary: `${mockAccount.paymentMethod} · ${mockAccount.paymentToken}`,
  },
  {
    label:   "Subscriptions",
    icon:    Zap,
    href:    "/dashboard/settings/account/subscriptions",
    summary: "Manage your plan",
  },
  {
    label:   "Connections",
    icon:    Link2,
    href:    "/dashboard/settings/account/connections",
    summary: mockAccount.connections
      .filter((c) => c.connected)
      .map((c) => c.platform)
      .join(" · "),
  },
  {
    label:   "Downloads",
    icon:    Download,
    href:    "/dashboard/settings/account/downloads",
    summary: `${mockAccount.downloadFormat} · ${mockAccount.downloadLocation}`,
  },
  {
    label:   "Notifications",
    icon:    Bell,
    href:    "/dashboard/settings/account/notifications",
    summary: `Newsletter ${mockAccount.notifications.newsletter ? "on" : "off"} · Promos ${mockAccount.notifications.newPromos ? "on" : "off"}`,
  },
  {
    label:   "Discovery Mode",
    icon:    Sparkles,
    href:    "/dashboard/settings/account/discovery",
    summary: mockAccount.discoveryMode.optedIn ? "Opted in" : "Not opted in",
  },
];

export default function AccountSettingsPage() {
  return (
    <div className="min-h-screen bg-background">

      <header className="sticky top-0 z-30 flex items-center gap-3 px-5 py-4
        border-b border-[var(--color-border)] bg-background/80 backdrop-blur-md">
        <Link
          href="/dashboard"
          className="size-8 rounded-full flex items-center justify-center
            bg-[var(--color-border)] hover:opacity-80 transition-opacity shrink-0"
        >
          <ChevronLeft size={16} className="text-text-primary" />
        </Link>
        <div>
          <h1 className="text-base font-semibold text-text-primary">Account Settings</h1>
          <p className="text-xs text-text-secondary">Private — only visible to you</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-6 pb-24 lg:pb-10">
        <div className="bg-surface rounded-2xl border border-[var(--color-border)] overflow-hidden">
          {sections.map(({ label, icon: Icon, href, summary }, i) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-4 px-4 py-4
                hover:bg-[var(--color-border)] transition-colors
                ${i > 0 ? "border-t border-[var(--color-border)]" : ""}`}
            >
              <div className="size-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{label}</p>
                <p className="text-xs text-text-secondary mt-0.5 truncate">{summary}</p>
              </div>
              <ChevronRight size={14} className="text-text-secondary shrink-0" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
