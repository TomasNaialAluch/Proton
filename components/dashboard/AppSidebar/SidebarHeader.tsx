import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { LABEL_MANAGER_ENTRY } from "@/lib/dashboard/dashboardShellRouting";

/** Logo + notifications bell — brand only, same for both shells. Identity
 *  (who you are / which label you manage) lives in SidebarFooter instead,
 *  mirroring where the producer's own name already lives. */
export default function SidebarHeader({
  collapsed,
  isLabelManager,
  onOpenNotifications,
}: {
  collapsed: boolean;
  isLabelManager: boolean;
  onOpenNotifications: () => void;
}) {
  return (
    <div className={`border-b border-[var(--color-border)] py-4 ${collapsed ? "px-0" : "px-5"}`}>
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <Link
            href={isLabelManager ? LABEL_MANAGER_ENTRY : "/dashboard"}
            className="relative block h-8 shrink-0 min-w-0 max-w-[11rem]"
            aria-label="Proton — Home"
          >
            <Image
              src="/logo%20txt.png"
              alt="Proton Soundsystem"
              width={220}
              height={56}
              className="h-8 w-auto max-h-8 object-contain object-left"
              priority
            />
          </Link>
        )}
        <button
          onClick={onOpenNotifications}
          className="relative text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-accent" />
        </button>
      </div>
    </div>
  );
}
