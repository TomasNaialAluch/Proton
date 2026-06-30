interface SkeletonProps {
  className?: string;
  /** Renders as a circle (avatars) instead of a rounded rectangle. */
  circle?: boolean;
}

export default function Skeleton({ className = "", circle = false }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-border)] ${circle ? "rounded-full" : "rounded-lg"} ${className}`}
    />
  );
}
