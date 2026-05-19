"use client";

import { useState, useCallback } from "react";
import UploadZone from "@/components/UploadZone";
import ResultView from "@/components/ResultView";
import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

interface UsageInfo {
  used: number; remaining: number; limit: number;
}

export default function ImageUpscalerPage() {
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
      const res = await fetch("/api/image-upscaler", { method: "POST", body: formData });
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
        <h1 className="text-3xl font-bold text-white sm:text-4xl">AI Image Upscaler</h1>
        <p className="mt-3 text-gray-400">Enlarge images up to 4x without losing quality. AI super-resolution at your fingertips.</p>
        {usage && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-1.5 text-xs text-gray-400">
            {usage.limit > 999 ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="h-3 w-3 text-purple-400" />
                  Pro — Unlimited
                </span>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-purple-500/30">
                  <div className="h-full w-full rounded-full bg-purple-500" />
                </div>
              </>
            ) : (
              <>
                <span>{usage.remaining} / {usage.limit} free uses remaining today</span>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-800">
                  <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: `${((usage.limit - usage.remaining) / usage.limit) * 100}%` }} />
                </div>
              </>
            )}
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
        <h2 className="text-2xl font-bold text-white">How to Upscale Images Online — Free AI Tool</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3 text-center">
          {[
            { step: 1, title: "Upload", desc: "Drop your low-res image. Supports PNG, JPG, WebP." },
            { step: 2, title: "AI Enhance", desc: "Real-ESRGAN upscales by 4x while preserving detail." },
            { step: 3, title: "Download HD", desc: "Get a crisp, high-resolution image ready for print or web." },
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
            <div><h4 className="font-medium text-white">How much can you upscale?</h4><p className="mt-1 text-sm text-gray-400">Our AI upscales images by 4x. A 500x500 image becomes 2000x2000 — crisp and print-ready.</p></div>
            <div><h4 className="font-medium text-white">Will quality degrade?</h4><p className="mt-1 text-sm text-gray-400">No. Real-ESRGAN adds detail rather than just stretching pixels, so quality actually improves.</p></div>
            <div><h4 className="font-medium text-white">What about face enhancement?</h4><p className="mt-1 text-sm text-gray-400">Face enhancement is enabled by default — perfect for portraits and group photos.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
