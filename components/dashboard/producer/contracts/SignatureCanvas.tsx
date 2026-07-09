"use client";

import { useRef, useState } from "react";
import { Pen, Type, Upload, Trash2, Sparkles, Loader2 } from "lucide-react";
import type { SavedSignature } from "@/types/signature";
import { extractSignatureFromPhoto } from "@/lib/pdf/extractSignatureFromPhoto";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 160;

type Method = SavedSignature["method"];

function pointerPos(canvas: HTMLCanvasElement, e: React.PointerEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH,
    y: ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
  };
}

function renderTypedSignature(text: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "#111827";
  ctx.font = "italic 52px 'Brush Script MT', cursive";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  return canvas.toDataURL("image/png");
}

/**
 * Captures a signature by drawing, typing, or uploading an image, and hands the
 * resulting data URL back to the caller. Stateless about persistence — callers
 * decide where it's saved (account settings, or inline during a contract sign).
 */
export default function SignatureCanvas({
  onSave,
}: {
  onSave: (signature: Pick<SavedSignature, "method" | "imageDataUrl">) => void;
}) {
  const [method, setMethod] = useState<Method>("drawn");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [uploadedDataUrl, setUploadedDataUrl] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHasDrawn(false);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    setHasDrawn(true);
    const ctx = canvas.getContext("2d")!;
    const { x, y } = pointerPos(canvas, e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    const { x, y } = pointerPos(canvas, e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError(null);
    setPhotoDataUrl(null);
    setExtracting(true);
    try {
      setPhotoDataUrl(await extractSignatureFromPhoto(file));
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Couldn't process that photo.");
    } finally {
      setExtracting(false);
    }
  };

  const canSave =
    (method === "drawn" && hasDrawn) ||
    (method === "typed" && typedText.trim().length > 0) ||
    (method === "uploaded" && uploadedDataUrl !== null) ||
    (method === "photo" && photoDataUrl !== null);

  const handleSave = () => {
    if (method === "drawn" && canvasRef.current) {
      onSave({ method, imageDataUrl: canvasRef.current.toDataURL("image/png") });
    } else if (method === "typed") {
      onSave({ method, imageDataUrl: renderTypedSignature(typedText.trim()) });
    } else if (method === "uploaded" && uploadedDataUrl) {
      onSave({ method, imageDataUrl: uploadedDataUrl });
    } else if (method === "photo" && photoDataUrl) {
      onSave({ method, imageDataUrl: photoDataUrl });
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-surface p-5">
      <div className="mb-4 flex gap-1.5 rounded-lg bg-[var(--color-border)]/40 p-1">
        {([
          { id: "drawn", label: "Draw", icon: Pen },
          { id: "typed", label: "Type", icon: Type },
          { id: "uploaded", label: "Upload", icon: Upload },
          { id: "photo", label: "From photo", icon: Sparkles },
        ] as const).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMethod(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors
              ${method === id ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"}`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {method === "drawn" && (
        <div>
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="w-full touch-none rounded-lg border border-dashed border-[var(--color-border)] bg-white"
            style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
          />
          <button
            type="button"
            onClick={clearCanvas}
            className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary"
          >
            <Trash2 size={12} /> Clear
          </button>
        </div>
      )}

      {method === "typed" && (
        <div>
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type your full name"
            className="w-full rounded-lg border border-[var(--color-border)] bg-background px-4 py-3 text-2xl italic text-text-primary placeholder:text-base placeholder:not-italic placeholder:text-text-secondary/60"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          />
        </div>
      )}

      {method === "uploaded" && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="w-full text-xs text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-accent"
          />
          {uploadedDataUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={uploadedDataUrl}
              alt="Uploaded signature preview"
              className="mt-3 h-24 rounded-lg border border-[var(--color-border)] bg-white object-contain p-2"
            />
          )}
        </div>
      )}

      {method === "photo" && (
        <div>
          <p className="mb-2 text-xs text-text-secondary">
            Sign on plain white paper, photograph it in good light — we'll cut out the
            background and keep just the signature.
          </p>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            className="w-full text-xs text-text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-accent/10 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-accent"
          />
          {extracting && (
            <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
              <Loader2 size={13} className="animate-spin" /> Extracting signature…
            </div>
          )}
          {photoError && (
            <p className="mt-3 text-xs text-red-500">{photoError}</p>
          )}
          {photoDataUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={photoDataUrl}
              alt="Extracted signature preview"
              className="mt-3 h-24 rounded-lg border border-[var(--color-border)] bg-white object-contain p-2"
            />
          )}
        </div>
      )}

      <button
        type="button"
        disabled={!canSave}
        onClick={handleSave}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Save signature
      </button>
    </div>
  );
}
