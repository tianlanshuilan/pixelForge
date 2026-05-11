"use client";

import { useCallback, useState, type DragEvent } from "react";
import { Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  accept?: string;
}

export default function UploadZone({
  onUpload,
  disabled,
  accept = "image/*",
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (disabled || isProcessing) return;
      setIsProcessing(true);
      try {
        await onUpload(file);
      } finally {
        setIsProcessing(false);
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
          <p className="text-sm text-gray-400">Processing your image...</p>
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
              PNG, JPG, WebP up to 10MB
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
