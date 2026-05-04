"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { clearDemoSessionCookie } from "@/lib/auth/demoSession";

/** Clears prototype demo session cookie and returns to the public site. */
export default function DemoSignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        clearDemoSessionCookie();
        router.push("/");
      }}
      className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-[var(--color-border)] hover:text-text-primary"
    >
      <LogOut size={16} className="shrink-0 opacity-80" aria-hidden />
      Sign out (demo)
    </button>
  );
}
