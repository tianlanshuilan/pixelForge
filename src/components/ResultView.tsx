"use client";

import Image from "next/image";
import { Download, ArrowLeftRight } from "lucide-react";
import { useState } from "react";

interface ResultViewProps {
  originalUrl: string;
  resultUrl: string;
  onReset: () => void;
}

export default function ResultView({
  originalUrl,
  resultUrl,
  onReset,
}: ResultViewProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const handleDownload = async () => {
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pixelforge-no-bg.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      {/* Before / After */}
      <div className="relative overflow-hidden rounded-xl bg-gray-900">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Original */}
          <div className="p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              Original
            </p>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[url('/transparent-bg.svg')] bg-repeat">
              <Image
                src={originalUrl}
                alt="Original image"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>

          {/* Result */}
          <div className="p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              Background Removed
            </p>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[url('/transparent-bg.svg')] bg-repeat">
              <Image
                src={resultUrl}
                alt="Background removed"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
        >
          <Download className="h-4 w-4" />
          Download Result
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Try Another
        </button>
      </div>
    </div>
  );
}
