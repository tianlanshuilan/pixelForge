"use client";

import { useCallback, useState, type DragEvent } from "react";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  accept?: string;
}

/** Resize image to max 1920px, convert to JPEG if large, to stay under 4MB */
async function preprocessImage(file: File): Promise<File> {
  // Skip small files
  if (file.size < 2 * 1024 * 1024 && file.type !== "image/png") return file;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const maxDim = 1920;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file); // fallback
            return;
          }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.85,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export default function UploadZone({
  onUpload,
  disabled,
  accept = "image/*",
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizing, setResizing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled || isProcessing) return;
      setIsProcessing(true);
      try {
        // Preprocess large images before upload
        let uploadFile = file;
        if (file.size > 2 * 1024 * 1024 || file.type === "image/png") {
          setResizing(true);
          uploadFile = await preprocessImage(file);
          setResizing(false);
        }
        await onUpload(uploadFile);
      } finally {
        setIsProcessing(false);
        setResizing(false);
      }
    },
    [disabled, isProcessing, onUpload],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all",
        isDragging
          ? "border-purple-500 bg-purple-500/10"
          : "border-gray-700 hover:border-gray-500",
        (disabled || isProcessing) && "pointer-events-none opacity-50",
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          <p className="text-sm text-gray-400">
            {resizing ? "Resizing image..." : "Processing your image..."}
          </p>
        </>
      ) : (
        <>
          <div className="rounded-full bg-gray-800 p-4">
            <Upload className="h-8 w-8 text-purple-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">
              Drop your image here or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, WebP — automatically resized for fast upload
            </p>
          </div>
        </>
      )}
      <input
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleInputChange}
      />
    </label>
  );
}
