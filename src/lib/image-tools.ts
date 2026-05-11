/**
 * Client-side image processing utilities.
 * All operations run in the browser using Canvas API — no server needed.
 */

/** Load an image File into an HTMLImageElement */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/** Convert a canvas to a Blob in the specified format and quality */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: "image/png" | "image/jpeg" | "image/webp" = "image/png",
  quality = 0.9,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      format,
      quality,
    );
  });
}

/** Compress an image by resizing and/or reducing quality */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: "image/jpeg" | "image/webp";
  } = {},
): Promise<{ blob: Blob; originalSize: number; compressedSize: number }> {
  const img = await loadImage(file);
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8, format = "image/jpeg" } = options;

  let { width, height } = img;
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, format, quality);
  return { blob, originalSize: file.size, compressedSize: blob.size };
}

/** Convert an image from one format to another */
export async function convertFormat(
  file: File,
  targetFormat: "image/png" | "image/jpeg" | "image/webp",
  quality = 0.92,
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, targetFormat, quality);
}

/** Crop an image to the specified rectangle */
export async function cropImage(
  file: File,
  crop: { x: number; y: number; width: number; height: number },
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
  return canvasToBlob(canvas, "image/png");
}

/** Format a byte size to human-readable string */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
