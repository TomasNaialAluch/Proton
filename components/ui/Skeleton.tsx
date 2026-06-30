"use client";

export default function Skeleton({
  className = "",
  circle = false,
}: {
  className?: string;
  circle?: boolean;
}) {
  return (
    <div
      className={`animate-pulse bg-[var(--color-border)] ${circle ? "rounded-full" : "rounded-lg"} ${className}`}
      aria-hidden
    />
  );
}
