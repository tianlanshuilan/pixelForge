import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Convert PNG to JPG Free Online — Instant, No Upload (2026)",
  description:
    "Convert PNG to JPG online free. Works in your browser — no upload, no signup, instant. Also supports PNG to WebP, JPG to PNG, and WebP to JPG conversion.",
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blog" className="text-sm text-purple-400 hover:text-purple-300">← Back to Blog</Link>

      <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
        Convert PNG to JPG Free Online — Instant, No Upload
      </h1>
      <p className="mt-3 text-gray-400">Published June 22, 2026 • 5 min read</p>

      <div className="mt-8 rounded-xl bg-purple-600/10 border border-purple-500/20 p-6">
        <p className="text-purple-300 font-semibold">TL;DR</p>
        <p className="mt-2 text-gray-300">
          PixelForge converts images between <strong>PNG, JPG, and WebP</strong> formats instantly,
          entirely in your browser. No upload, no signup, no quality loss. Convert single files or
          batch process multiple images.
        </p>
        <Link href="/format-convert" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500">
          Convert Formats <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">When to Convert PNG to JPG</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          PNG files are great for graphics with transparency, but they are often <strong>5-10x larger</strong> than
          equivalent JPG files. Converting PNG to JPG can reduce file size from 5MB to 500KB — critical
          for web performance, email attachments, and storage.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Supported Conversions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { from: "PNG", to: "JPG" },
            { from: "PNG", to: "WebP" },
            { from: "JPG", to: "PNG" },
            { from: "JPG", to: "WebP" },
            { from: "WebP", to: "PNG" },
            { from: "WebP", to: "JPG" },
          ].map(({ from, to }) => (
            <div key={`${from}-${to}`} className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
              <span className="text-white font-medium">{from}</span>
              <ArrowRight className="h-4 w-4 text-gray-500" />
              <span className="text-purple-400 font-medium">{to}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Why PixelForge Format Converter</h2>
        <ul className="mt-4 space-y-3">
          {[
            "Local processing — your images never leave your browser",
            "Instant conversion — no server upload or download wait",
            "Batch convert multiple images at once",
            "Preserves image quality — no additional compression",
            "No file size limits within browser memory constraints",
            "Completely free, no signup required",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-300">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 rounded-xl bg-purple-600/10 border border-purple-500/20 p-6 text-center">
        <h3 className="text-lg font-semibold text-white">Convert your first image now</h3>
        <Link href="/format-convert" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500">
          Start Converting <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
