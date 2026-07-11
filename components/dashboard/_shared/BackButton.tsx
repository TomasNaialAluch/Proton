"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Uses router history so it returns to wherever the user actually came from
 *  (Browse, a genre view, search results) instead of a hardcoded route. */
export default function BackButton({ fallbackHref, label = "Back" }: { fallbackHref: string; label?: string }) {
  const router = useRouter();

  const handleClick = () => {
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
