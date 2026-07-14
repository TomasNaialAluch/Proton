"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Uses router history so it returns to wherever the user actually came from
 *  (Browse, a genre view, search results) instead of a hardcoded route. */
export default function BackButton({
  fallbackHref,
  href,
  label = "Back",
}: {
  fallbackHref: string;
  /**
   * When set, always navigates here directly instead of using browser
   * history — use on pages reachable from more than one real parent (e.g.
   * Track Detail, linked from a label's releases AND an artist's track
   * list) where the caller knows exactly where "back" should go (typically
   * a `from` query param), since `router.back()`/`history.length` isn't
   * reliable to fall back on in every navigation context.
   */
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
      return;
    }
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors mb-3"
    >
      <ArrowLeft size={13} />
      {label}
    </button>
  );
}
