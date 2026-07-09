"use client";

import { useRef } from "react";
import Moveable from "react-moveable";

export interface OverlayFrame {
  /** All in px, relative to the positioned ancestor (the PDF page surface). */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

/**
 * The signature image as a draggable/resizable/rotatable object sitting on top of
 * the current PDF page. Fully controlled — `frame` is the single source of truth,
 * Moveable just reports deltas back through `onChange`.
 */
export default function SignatureOverlay({
  imageUrl,
  frame,
  onChange,
}: {
  imageUrl: string;
  frame: OverlayFrame;
  onChange: (frame: OverlayFrame) => void;
}) {
  const targetRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={targetRef}
        className="absolute cursor-move"
        style={{
          left: frame.x,
          top: frame.y,
          width: frame.width,
          height: frame.height,
          transform: `rotate(${frame.rotation}deg)`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Your signature"
          className="h-full w-full select-none drop-shadow"
          draggable={false}
        />
      </div>
      <Moveable
        target={targetRef}
        draggable
        resizable
        rotatable
        keepRatio
        throttleDrag={0}
        throttleResize={0}
        throttleRotate={0}
        onDrag={({ left, top }) => onChange({ ...frame, x: left, y: top })}
        onResize={({ width, height, drag }) =>
          onChange({ ...frame, width, height, x: drag.left, y: drag.top })
        }
        onRotate={({ rotation }) => onChange({ ...frame, rotation })}
      />
    </>
  );
}
