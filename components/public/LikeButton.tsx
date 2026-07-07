"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { isLiked, toggleLike } from "@/lib/player/likes";

interface LikeButtonProps {
  mixId: string;
  /** Set when the button sits inside an element that also handles clicks
   *  (e.g. MixCard's whole-card onClick) so tapping like doesn't also play it. */
  stopPropagation?: boolean;
  className?: string;
}

export default function LikeButton({
  mixId,
  stopPropagation = false,
  className = "",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);

  // Read localStorage only after mount — avoids SSR/client mismatch (no localStorage on the server).
  useEffect(() => {
    setLiked(isLiked(mixId));
  }, [mixId]);

  return (
    <button
      type="button"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        setLiked(toggleLike(mixId));
      }}
      aria-label={liked ? "Unlike" : "Like"}
      aria-pressed={liked}
      className={`flex items-center justify-center transition-colors ${className}`}
    >
      <Heart
        size={16}
        className={liked ? "text-[var(--color-accent)]" : "text-white"}
        fill={liked ? "var(--color-accent)" : "none"}
      />
    </button>
  );
}
