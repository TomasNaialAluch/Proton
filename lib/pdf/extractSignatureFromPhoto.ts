function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const LUMINANCE_THRESHOLD = 140; // below this = ink; above = paper
const CROP_PADDING = 12;

/**
 * Turns a photo of a signature on paper into a clean transparent-background PNG:
 * dark pixels (ink) are kept and darkened to solid black, light pixels (paper) are
 * made transparent, then the result is cropped to the ink's bounding box.
 *
 * Simple luminance threshold, not a real segmentation model — good enough for a
 * dark pen on white paper in decent light, which covers the common case.
 */
export async function extractSignatureFromPhoto(file: File): Promise<string> {
  const img = await loadImage(file);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let minX = width, minY = height, maxX = 0, maxY = 0;
  let foundInk = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (luminance < LUMINANCE_THRESHOLD) {
        data[i] = data[i + 1] = data[i + 2] = 17;
        data[i + 3] = 255;
        foundInk = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        data[i + 3] = 0;
      }
    }
  }

  if (!foundInk) {
    throw new Error("Couldn't find a signature in that photo — try better lighting and contrast.");
  }

  ctx.putImageData(imageData, 0, 0);

  const cropX = Math.max(0, minX - CROP_PADDING);
  const cropY = Math.max(0, minY - CROP_PADDING);
  const cropWidth = Math.min(width, maxX + CROP_PADDING) - cropX;
  const cropHeight = Math.min(height, maxY + CROP_PADDING) - cropY;

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;
  cropCanvas
    .getContext("2d")!
    .drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return cropCanvas.toDataURL("image/png");
}
