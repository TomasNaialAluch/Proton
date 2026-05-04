"use client";

type ResizeHandlers = {
  onResizePointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onResizePointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onResizePointerUp: (e: React.PointerEvent<HTMLButtonElement>) => void;
  onResizePointerCancel: (e: React.PointerEvent<HTMLButtonElement>) => void;
};

/** Icono en esquina superior izquierda (sugiere agarre para redimensionar). */
export function ResizeCornerGlyph({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M2 2 L2 9 M2 2 L9 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2 6 L6 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  );
}

/** Botón de arrastre en esquina superior izquierda del panel de vídeo. */
export function YoutubeResizeCorner({
  onResizePointerDown,
  onResizePointerMove,
  onResizePointerUp,
  onResizePointerCancel,
  ringOffsetClassName = "ring-offset-black",
}: ResizeHandlers & { ringOffsetClassName?: string }) {
  return (
    <button
      type="button"
      aria-label="Redimensionar vídeo"
      title="Arrastra la esquina superior izquierda para agrandar o achicar el vídeo"
      className={`absolute left-0 top-0 z-20 flex h-9 w-9 cursor-nwse-resize touch-none select-none items-start justify-start rounded-br-md border-0 bg-gradient-to-br from-black/55 via-black/15 to-transparent p-1 text-white/90 transition-opacity hover:from-black/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${ringOffsetClassName}`}
      onPointerDown={onResizePointerDown}
      onPointerMove={onResizePointerMove}
      onPointerUp={onResizePointerUp}
      onPointerCancel={onResizePointerCancel}
    >
      <ResizeCornerGlyph className="pointer-events-none drop-shadow-sm" />
    </button>
  );
}
