"use client";

import { useState, useCallback } from "react";
import UploadZone from "@/components/UploadZone";
import { compressImage, formatSize } from "@/lib/image-tools";
import { ArrowRight, Download, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function ImageCompressPage() {
  const [result, setResult] = useState<{
    url: string;
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ used: number; remaining: number; limit: number } | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    try {
      // Track usage
      const res = await fetch("/api/tools/image-compress", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setUsage(data.usage);
        setError(data.error === "FREE_LIMIT_REACHED" ? `Free limit reached. ${data.usage?.remaining || 0} remaining today.` : "Error");
        return;
      }
      setUsage(data.usage);

      // Compress client-side
      const { blob, originalSize, compressedSize } = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.8,
        format: "image/jpeg",
      });
      setResult({ url: URL.createObjectURL(blob), originalSize, compressedSize });
    } catch {
      setError("Processing failed. Please try again.");
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Image Compressor</h1>
        <p className="mt-3 text-gray-400">Compress PNG, JPG, and WebP images. Reduce file size without visible quality loss.</p>
        {usage && <UsageBar {...usage} />}
      </div>

      {error && <ErrorBox error={error} onReset={() => setResult(null)} />}

      {result ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
            <div className="text-5xl font-bold text-purple-400">
              {Math.round((1 - result.compressedSize / result.originalSize) * 100)}%
            </div>
            <p className="mt-2 text-sm text-gray-400">size reduction</p>
            <div className="mt-4 flex justify-center gap-8 text-sm">
              <div><span className="text-gray-500">Original:</span> <span className="text-white">{formatSize(result.originalSize)}</span></div>
              <div><span className="text-gray-500">Compressed:</span> <span className="text-green-400">{formatSize(result.compressedSize)}</span></div>
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <a href={result.url} download="compressed.jpg" className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500">
              <Download className="h-4 w-4" /> Download Compressed
            </a>
            <button onClick={() => setResult(null)} className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 hover:border-gray-500">
              Compress Another
            </button>
          </div>
        </div>
      ) : (
        <UploadZone onUpload={handleUpload} />
      )}

      <SeoSection />
    </div>
  );
}

function UsageBar({ used, remaining, limit }: { used: number; remaining: number; limit: number }) {
  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-1.5 text-xs text-gray-400">
      <span>{remaining} / {limit} free today</span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-800">
        <div className="h-full rounded-full bg-purple-500" style={{ width: `${((limit - remaining) / limit) * 100}%` }} />
      </div>
    </div>
  );
}

function ErrorBox({ error, onReset }: { error: string; onReset: () => void }) {
  return (
    <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
      <p className="text-sm text-red-400">{error}</p>
      {error.includes("limit") && (
        <Link href="/pricing" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-purple-400 hover:text-purple-300">
          Upgrade to Pro <ArrowRight className="h-3 w-3" />
        </Link>
      )}
      <button onClick={onReset} className="mt-2 block w-full text-xs text-gray-500">Try again</button>
    </div>
  );
}

function SeoSection() {
  return (
    <section className="mt-24 border-t border-gray-800 pt-16">
      <h2 className="text-2xl font-bold text-white">Free Online Image Compressor — No Upload to Server</h2>
      <p className="mt-4 text-gray-400">All compression happens in your browser. Your images never leave your device.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3 text-center">
        {["Drag & drop or click to upload", "Adjust quality and dimensions", "Download the compressed file"].map((s, i) => (
          <div key={i} className="rounded-lg border border-gray-800 p-4">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/20 text-sm font-bold text-purple-400">{i + 1}</div>
            <p className="mt-3 text-sm text-gray-300">{s}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
