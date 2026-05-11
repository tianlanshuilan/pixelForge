"use client";

import { useState, useCallback } from "react";
import UploadZone from "@/components/UploadZone";
import ResultView from "@/components/ResultView";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface UsageInfo {
  used: number; remaining: number; limit: number;
}

export default function PhotoRestorationPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setOriginalUrl(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/photo-restoration", { method: "POST", body: formData });
      const data = (await res.json()) as { resultUrl?: string; usage?: UsageInfo; error?: string; message?: string };
      if (!res.ok) {
        setUsage(data.usage ?? null);
        setError(data.message ?? data.error ?? "Something went wrong");
        return;
      }
      setResultUrl(data.resultUrl ?? null);
      setUsage(data.usage ?? null);
    } catch {
      setError("Network error. Please try again.");
    }
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">AI Photo Restoration</h1>
        <p className="mt-3 text-gray-400">Restore old, damaged, or low-quality photos with AI. Bring faded memories back to life.</p>
        {usage && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-1.5 text-xs text-gray-400">
            <span>{usage.remaining} / {usage.limit} free uses remaining today</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-800">
              <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${((usage.limit - usage.remaining) / usage.limit) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          {error.includes("free") && (
            <Link href="/pricing" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-purple-400 hover:text-purple-300">
              Upgrade to Pro <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}

      {resultUrl && originalUrl ? (
        <ResultView originalUrl={originalUrl} resultUrl={resultUrl} onReset={() => { setOriginalUrl(null); setResultUrl(null); setError(null); }} />
      ) : (
        <UploadZone onUpload={handleUpload} />
      )}

      {/* SEO Section */}
      <section className="mt-24 border-t border-gray-800 pt-16">
        <h2 className="text-2xl font-bold text-white">Restore Old Photos Online — Free AI Restoration Tool</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3 text-center">
          {[
            { step: 1, title: "Upload Old Photo", desc: "Scan or photograph your faded, scratched, or blurry old photo." },
            { step: 2, title: "AI Restoration", desc: "GFP-GAN AI repairs scratches, sharpens faces, and restores color." },
            { step: 3, title: "Download Restored", desc: "Get a beautifully restored photo — ready to share, print, or frame." },
          ].map((s) => (
            <div key={s.step}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20 text-lg font-bold text-purple-400">{s.step}</div>
              <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
          <h3 className="text-lg font-semibold text-white">Frequently Asked Questions</h3>
          <div className="mt-6 space-y-6">
            <div><h4 className="font-medium text-white">What kinds of damage can it fix?</h4><p className="mt-1 text-sm text-gray-400">Scratches, noise, blur, fading, and low resolution. Works on scanned prints and digital photos.</p></div>
            <div><h4 className="font-medium text-white">How good are the results?</h4><p className="mt-1 text-sm text-gray-400">GFP-GAN is state-of-the-art for face restoration. Results are often dramatic — try it and see!</p></div>
            <div><h4 className="font-medium text-white">Is it free?</h4><p className="mt-1 text-sm text-gray-400">Yes, 3 free restorations per day with no signup. Upgrade to Pro for unlimited use.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
