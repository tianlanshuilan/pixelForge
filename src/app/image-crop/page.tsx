"use client";

import { useState, useCallback, useRef, useEffect, type MouseEvent as RMouseEvent } from "react";
import UploadZone from "@/components/UploadZone";
import { loadImage, canvasToBlob } from "@/lib/image-tools";
import { ArrowRight, Download, Crop as CropIcon, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function ImageCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ used: number; remaining: number; limit: number } | null>(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, w: 200, h: 200 });
  const [dragging, setDragging] = useState<"move" | "se" | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleUpload = useCallback(async (f: File) => {
    setError(null);
    setResult(null);
    setFile(f);
    const image = await loadImage(f);
    setImg(image);
    const s = Math.min(image.width, image.height, 400);
    setCrop({ x: (image.width - s) / 2, y: (image.height - s) / 2, w: s, h: s });
  }, []);

  // Draw canvas
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const scale = Math.min(600 / img.width, 400 / img.height, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Darken outside crop area
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sx = crop.x * scale, sy = crop.y * scale, sw = crop.w * scale, sh = crop.h * scale;
    ctx.clearRect(sx, sy, sw, sh);
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, sx, sy, sw, sh);
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, sw, sh);

    // Handle
    ctx.fillStyle = "#a855f7";
    ctx.fillRect(sx + sw - 6, sy + sh - 6, 12, 12);
  }, [img, crop]);

  const scale = img ? Math.min(600 / img.width, 400 / img.height, 1) : 1;

  const getCanvasPos = (e: RMouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left) / scale, y: (e.clientY - rect.top) / scale };
  };

  const handleMouseDown = (e: RMouseEvent) => {
    const pos = getCanvasPos(e);
    const handleSize = 12 / scale;
    if (pos.x > crop.x + crop.w - handleSize && pos.x < crop.x + crop.w + handleSize && pos.y > crop.y + crop.h - handleSize && pos.y < crop.y + crop.h + handleSize) {
      setDragging("se");
    } else if (pos.x > crop.x && pos.x < crop.x + crop.w && pos.y > crop.y && pos.y < crop.y + crop.h) {
      setDragging("move");
    }
    setDragStart(pos);
  };

  const handleMouseMove = (e: RMouseEvent) => {
    if (!dragging) return;
    const pos = getCanvasPos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;
    if (dragging === "move") {
      setCrop((c) => ({ ...c, x: Math.max(0, c.x + dx), y: Math.max(0, c.y + dy) }));
    } else if (dragging === "se") {
      setCrop((c) => ({ ...c, w: Math.max(20, c.w + dx), h: Math.max(20, c.h + dy) }));
    }
    setDragStart(pos);
  };

  const handleCrop = useCallback(async () => {
    if (!file) return;
    try {
      const res = await fetch("/api/tools/image-crop", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setUsage(data.usage); setError("Free limit reached"); return; }
      setUsage(data.usage);

      const imgEl = await loadImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = crop.w;
      canvas.height = crop.h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(imgEl, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      const blob = await canvasToBlob(canvas, "image/png");
      setResult(URL.createObjectURL(blob));
    } catch {
      setError("Crop failed.");
    }
  }, [file, crop]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Image Cropper</h1>
        <p className="mt-3 text-gray-400">Crop images online — free, fast, and no upload to server.</p>
        {usage && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-1.5 text-xs text-gray-400">
            <span>{usage.remaining} / {usage.limit} free today</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-800">
              <div className="h-full rounded-full bg-purple-500" style={{ width: `${((usage.limit - usage.remaining) / usage.limit) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Link href="/pricing" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-purple-400">
            Upgrade to Pro <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {!file ? (
        <UploadZone onUpload={handleUpload} />
      ) : (
        <div className="space-y-6">
          <div ref={containerRef} className="flex justify-center">
            <canvas ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={() => setDragging(null)} onMouseLeave={() => setDragging(null)}
              className="cursor-move rounded-lg max-w-full" />
          </div>
          <p className="text-center text-xs text-gray-500">Drag to move. Drag bottom-right corner to resize.</p>

          <div className="flex justify-center gap-3">
            <button onClick={handleCrop} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500">
              <CropIcon className="h-4 w-4" /> Crop Image
            </button>
            <button onClick={() => { setFile(null); setResult(null); }} className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm text-gray-300 hover:border-gray-500">
              <RotateCcw className="h-4 w-4" /> New Image
            </button>
          </div>

          {result && (
            <div className="flex justify-center">
              <a href={result} download="cropped.png" className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-500">
                <Download className="h-4 w-4" /> Download Cropped
              </a>
            </div>
          )}
        </div>
      )}

      <section className="mt-24 border-t border-gray-800 pt-16">
        <h2 className="text-2xl font-bold text-white">Free Online Image Cropper</h2>
        <p className="mt-4 text-gray-400">Crop images to any size. Everything happens in your browser — no files are uploaded to any server.</p>
      </section>
    </div>
  );
}
