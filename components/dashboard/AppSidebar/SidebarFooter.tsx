import Link from "next/link";
import { Radio, Settings, Sun, Moon, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { mockArtist } from "@/lib/mock/artist";
import { mockLabelManagerProfile } from "@/lib/mock/label-manager/labelManagerProfile";
import { LABEL_MANAGER_ROLE_LABEL } from "@/types/labelManagerProfile";
import { mockLabels } from "@/lib/mock/labels";

const activeLabel = mockLabels.find((l) => l.id === mockLabelManagerProfile.labelId) ?? null;

/** Proton Radio shortcut, profile/settings row, dark mode toggle, collapse button. */
export default function SidebarFooter({
  collapsed,
  isLabelManager,
  isDark,
  onToggleTheme,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  isLabelManager: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleCollapsed: () => void;
}) {
  return (
    <div className={`border-t border-[var(--color-border)] py-3 ${collapsed ? "flex flex-col items-center gap-1 px-2" : "px-3"}`}>
      <Link
        href="/"
        title="Proton Radio"
        className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white bg-accent transition-opacity hover:opacity-90 mb-2
          ${collapsed ? "w-full px-0" : "w-full"}`}
      >
        <Radio size={16} className="shrink-0" />
        {!collapsed && <span>Proton Radio</span>}
      </Link>

      {isLabelManager ? (
        !collapsed && (
          <Link
            href="/dashboard/settings/account"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-border)] transition-colors mb-1"
          >
            <div
              className="size-7 rounded-full p-[1.5px] shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-accent), transparent)" }}
            >
              <div className="size-full rounded-full bg-surface flex items-center justify-center">
                <span className="text-[10px] font-bold text-accent">{mockLabelManagerProfile.name.charAt(0)}</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{mockLabelManagerProfile.name}</p>
              <p className="text-xs text-text-secondary truncate">
                {LABEL_MANAGER_ROLE_LABEL[mockLabelManagerProfile.role]}
                {activeLabel && ` · ${activeLabel.name}`}
              </p>
            </div>
          </Link>
        )
      ) : (
        !collapsed && (
          <Link
            href="/dashboard/settings/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-border)] transition-colors mb-1"
          >
            <div
              className="size-7 rounded-full p-[1.5px] shrink-0"
              style={{ background: "linear-gradient(135deg, var(--color-accent), transparent)" }}
            >
              <div className="size-full rounded-full bg-surface flex items-center justify-center">
                <span className="text-[10px] font-bold text-accent">{mockArtist.name.charAt(0)}</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{mockArtist.name}</p>
              <p className="text-xs text-text-secondary">Edit profile</p>
            </div>
          </Link>
        )
      )}

      {isLabelManager && collapsed && (
        <Link
          href="/dashboard/settings/account"
          title="Settings — account · sign out"
          aria-label="Settings — account, sign out"
          className="mb-1 flex w-full justify-center"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-lg text-accent transition-colors hover:bg-[var(--color-border)]">
            <Settings size={18} strokeWidth={1.75} aria-hidden />
          </span>
        </Link>
      )}

      {!collapsed ? (
        <div className="mb-2 flex items-center justify-between gap-2 px-3 py-2">
          <span className="text-xs font-medium text-text-primary">Dark mode</span>
          <div className="flex items-center gap-2 shrink-0">
            <Sun size={14} className="text-text-secondary" />
            <button
              type="button"
              onClick={onToggleTheme}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              className={`relative h-6 w-12 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isDark ? "bg-accent" : "bg-text-secondary/25"
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full shadow-md transition-all duration-300 ${
                  isDark ? "left-7 bg-background" : "left-1 bg-white"
                }`}
              />
            </button>
            <Moon size={14} className={isDark ? "text-accent" : "text-text-secondary"} />
          </div>
        </div>
      ) : (
        <div className="mb-1 flex w-full flex-col items-center gap-0.5">
          <button
            type="button"
            onClick={onToggleTheme}
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            title="Dark mode"
            className={`relative h-6 w-12 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isDark ? "bg-accent" : "bg-text-secondary/25"
            }`}
          >
            <span
              className={`absolute top-1 size-4 rounded-full shadow-md transition-all duration-300 ${
                isDark ? "left-7 bg-background" : "left-1 bg-white"
              }`}
            />
          </button>
        </div>
      )}

      <button
        onClick={onToggleCollapsed}
        className="flex w-full items-center justify-center rounded-lg py-2.5
          text-text-secondary hover:text-text-primary hover:bg-[var(--color-border)]
          transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>
    </div>
  );
}
