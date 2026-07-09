export interface SavedSignature {
  method: "drawn" | "typed" | "uploaded" | "photo";
  /** PNG/SVG data URL — rendered wherever the signature appears. */
  imageDataUrl: string;
  createdAt: string;
}

/** Where the signature sits on the signed PDF page, in % of page width/height so it survives zoom/resize. */
export interface SignaturePlacement {
  page: number;
  xPct: number;
  yPct: number;
  widthPct: number;
  rotation: number;
}
