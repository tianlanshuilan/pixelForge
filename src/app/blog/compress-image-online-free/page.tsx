import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Compress Image Online Free — No Quality Loss (2026)",
  description:
    "Compress PNG, JPG, WebP images online free. Reduce file size by up to 80% without visible quality loss. Works in your browser — no upload, no signup, instant results.",
};

export default function Page() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blog" className="text-sm text-purple-400 hover:text-purple-300">← Back to Blog</Link>

      <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
        Compress Image Online Free — No Quality Loss
      </h1>
      <p className="mt-3 text-gray-400">Published June 22, 2026 • 5 min read</p>

      <div className="mt-8 rounded-xl bg-purple-600/10 border border-purple-500/20 p-6">
        <p className="text-purple-300 font-semibold">TL;DR</p>
        <p className="mt-2 text-gray-300">
          PixelForge offers a <strong>free online image compressor</strong> that works entirely in your
          browser — your files never leave your device. Compress PNG, JPG, and WebP images by up to 80%
          with no visible quality loss. No upload, no signup, instant.
        </p>
        <Link href="/image-compress" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500">
          Compress an Image <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Why Image Compression Matters</h2>
        <p className="mt-4 text-gray-300 leading-relaxed">
          Large images slow down your website. Google uses page speed as a ranking factor.
          A single uncompressed product photo can be 5-10MB — multiply that by 20 products and your
          page takes 10+ seconds to load.
        </p>
        <p className="mt-3 text-gray-300 leading-relaxed">
          PixelForge solves this: <strong>drag, drop, done</strong>. Your compressed image is ready
          instantly, and because everything runs locally in your browser, there is zero privacy risk.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">How It Works</h2>
        <ol className="mt-4 space-y-3 text-gray-300">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm text-white">1</span>
            <span><strong>Select</strong> — Drop a PNG, JPG, or WebP file (up to 20MB).</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm text-white">2</span>
            <span><strong>Compress</strong> — Processing happens locally in your browser. No upload.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm text-white">3</span>
            <span><strong>Download</strong> — Get your optimized image with file size reduced by up to 80%.</span>
          </li>
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-white">Why Choose PixelForge Over Other Compressors</h2>
        <ul className="mt-4 space-y-3">
          {[
            "100% client-side — your images never leave your device",
            "No file size limits for free tier (up to 20MB per file)",
            "Supports PNG, JPG, and WebP formats",
            "Batch processing — compress multiple images at once",
            "Instant results — no server queue, no waiting",
            "No ads, no watermarks, no signup walls",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-300">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 rounded-xl bg-purple-600/10 border border-purple-500/20 p-6 text-center">
        <h3 className="text-lg font-semibold text-white">Compress your first image now</h3>
        <p className="mt-2 text-gray-400">Free. No signup. Works in your browser.</p>
        <Link href="/image-compress" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500">
          Start Compressing <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
