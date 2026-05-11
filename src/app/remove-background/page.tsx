"use client";

import { useState, useCallback } from "react";
import type { Metadata } from "next";
import UploadZone from "@/components/UploadZone";
import ResultView from "@/components/ResultView";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface UsageInfo {
  used: number;
  remaining: number;
  limit: number;
}

export default function RemoveBackgroundPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);

    // Show original preview
    const preview = URL.createObjectURL(file);
    setOriginalUrl(preview);

    // Upload to our API
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/remove-background", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as {
        resultUrl?: string;
        usage?: UsageInfo;
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        if (data.error === "FREE_LIMIT_REACHED") {
          setUsage(data.usage ?? null);
          setError(data.message ?? "Free limit reached");
        } else {
          setError(data.message ?? data.error ?? "Something went wrong");
        }
        return;
      }

      setResultUrl(data.resultUrl ?? null);
      setUsage(data.usage ?? null);
    } catch {
      setError("Network error. Please try again.");
    }
  }, []);

  const handleReset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Remove Image Background
        </h1>
        <p className="mt-3 text-gray-400">
          AI-powered background removal. Upload an image and get a
          transparent PNG in seconds.
        </p>

        {/* Usage bar */}
        {usage && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-1.5 text-xs text-gray-400">
            <span>
              {usage.remaining} / {usage.limit} free uses remaining today
            </span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-purple-500 transition-all"
                style={{
                  width: `${((usage.limit - usage.remaining) / usage.limit) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
          {error.includes("free") && (
            <Link
              href="/pricing"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-purple-400 hover:text-purple-300"
            >
              Upgrade to Pro <ArrowRight className="h-3 w-3" />
            </Link>
          )}
          <button
            onClick={handleReset}
            className="mt-2 block w-full text-xs text-gray-500 hover:text-gray-400"
          >
            Try a different image
          </button>
        </div>
      )}

      {resultUrl && originalUrl ? (
        <ResultView
          originalUrl={originalUrl}
          resultUrl={resultUrl}
          onReset={handleReset}
        />
      ) : (
        <UploadZone onUpload={handleUpload} />
      )}

      {/* SEO Content */}
      <section className="mt-24 border-t border-gray-800 pt-16">
        <h2 className="text-2xl font-bold text-white">
          How to Remove Background from Image — Free Online Tool
        </h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          <StepCard
            step={1}
            title="Upload Your Image"
            description="Drag and drop or click to upload. Supports PNG, JPG, and WebP formats up to 10MB."
          />
          <StepCard
            step={2}
            title="AI Processing"
            description="Our AI automatically detects the subject and removes the background in seconds."
          />
          <StepCard
            step={3}
            title="Download Result"
            description="Get a clean transparent PNG. Use it for products, profiles, presentations, and more."
          />
        </div>

        <div className="mt-16 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
          <h3 className="text-lg font-semibold text-white">
            Frequently Asked Questions
          </h3>
          <div className="mt-6 space-y-6">
            <FaqItem
              question="Is this really free?"
              answer="Yes! You get 3 free background removals every day with no signup required. Need more? Upgrade to Pro for unlimited use."
            />
            <FaqItem
              question="What image formats are supported?"
              answer="We support PNG, JPG, JPEG, and WebP. The output is always a high-quality transparent PNG."
            />
            <FaqItem
              question="How does the AI background removal work?"
              answer="We use state-of-the-art deep learning models that have been trained on millions of images to accurately detect and separate foreground subjects from backgrounds."
            />
            <FaqItem
              question="Are my images stored?"
              answer="No. Images are processed in-memory and deleted immediately. We never store your uploaded images."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20 text-lg font-bold text-purple-400">
        {step}
      </div>
      <h3 className="mt-4 font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div>
      <h4 className="font-medium text-white">{question}</h4>
      <p className="mt-1 text-sm text-gray-400">{answer}</p>
    </div>
  );
}
