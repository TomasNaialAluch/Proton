import { PDFDocument, degrees } from "pdf-lib";
import type { SignaturePlacement } from "@/types/signature";

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? dataUrl;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Burns the signature PNG into the given PDF page at `placement` and returns the
 * resulting file's bytes. `placement` coordinates are top-left-origin percentages
 * of the page (screen space) — converted here to pdf-lib's bottom-left-origin points.
 */
export async function embedSignatureInPdf(
  originalPdfBytes: ArrayBuffer,
  signaturePngDataUrl: string,
  placement: SignaturePlacement
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  const pngImage = await pdfDoc.embedPng(dataUrlToBytes(signaturePngDataUrl));

  const page = pdfDoc.getPages()[placement.page - 1];
  if (!page) throw new Error(`Page ${placement.page} does not exist in this document`);
  const { width: pageWidth, height: pageHeight } = page.getSize();

  const imgWidth = (placement.widthPct / 100) * pageWidth;
  const imgHeight = imgWidth * (pngImage.height / pngImage.width);

  const x = (placement.xPct / 100) * pageWidth;
  const yFromTop = (placement.yPct / 100) * pageHeight;
  const y = pageHeight - yFromTop - imgHeight;

  page.drawImage(pngImage, {
    x,
    y,
    width: imgWidth,
    height: imgHeight,
    // Screen rotation is clockwise-positive; pdf-lib's `degrees()` rotates counter-clockwise.
    rotate: degrees(-placement.rotation),
  });

  return pdfDoc.save();
}
