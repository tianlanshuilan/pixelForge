"use client";

import { useState, useCallback } from "react";
import UploadZone from "@/components/UploadZone";
import { convertFormat } from "@/lib/image-tools";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";

const FORMATS = [
  { ext: "png", mime: "image/png", label: "PNG", desc: "Lossless, transparent support" },
  { ext: "jpg", mime: "image/jpeg", label: "JPEG", desc: "Smaller file, good for photos" },
  { ext: "webp", mime: "image/webp", label: "WebP", desc: "Modern, best compression" },
] as const;

export default function FormatConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState<string>("png");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ used: number; remaining: number; limit: number } | null>(null);

  const handleUpload = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setError(null);
    try {
      const res = await fetch("/api/tools/format-convert", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setUsage(data.usage); setError("Free limit reached"); return; }
      setUsage(data.usage);

      const fmt = FORMATS.find((f) => f.ext === target)!;
      const blob = await convertFormat(file, fmt.mime);
      setResult(URL.createObjectURL(blob));
    } catch {
      setError("Conversion failed. Please try again.");
    }
  }, [file, target]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Image Format Converter</h1>
        <p className="mt-3 text-gray-400">Convert between PNG, JPEG, and WebP — right in your browser.</p>
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
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <p className="text-sm text-gray-400 mb-3">Convert <span className="text-white">{file.name}</span> to:</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt.ext}
                  onClick={() => { setTarget(fmt.ext); setResult(null); }}
                  className={`rounded-lg border p-4 text-left transition-all ${target === fmt.ext ? "border-purple-500 bg-purple-500/10" : "border-gray-700 hover:border-gray-500"}`}
                >
                  <p className="font-semibold text-white">.{fmt.ext.toUpperCase()}</p>
                  <p className="mt-1 text-xs text-gray-500">{fmt.desc}</p>
                </button>
              ))}
            </div>
            <button onClick={handleConvert} className="mt-6 w-full rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500">
              Convert to {target.toUpperCase()}
            </button>
          </div>

          {result && (
            <div className="flex justify-center gap-3">
              <a href={result} download={`converted.${target}`} className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500">
                <Download className="h-4 w-4" /> Download {target.toUpperCase()}
              </a>
              <button onClick={() => { setFile(null); setResult(null); }} className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm text-gray-300 hover:border-gray-500">
                Convert Another
              </button>
            </div>
          )}
        </div>
      )}

      <section className="mt-24 border-t border-gray-800 pt-16">
        <h2 className="text-2xl font-bold text-white">Free Online Image Format Converter</h2>
        <p className="mt-4 text-gray-400">Convert PNG to JPG, JPG to WebP, and more. All processing is done in your browser — your files never leave your computer.</p>
      </section>
    </div>
  );
}
