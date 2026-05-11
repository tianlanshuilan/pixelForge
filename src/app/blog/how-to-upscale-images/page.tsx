import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Upscale Images Online — AI Image Upscaler Guide (2026)",
  description:
    "Enlarge images up to 4x without losing quality. Our free AI upscaler adds detail instead of stretching pixels. Perfect for print, web, and social media.",
};

export default function BlogPost() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-300">
        &larr; Back to Blog
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
        How to Upscale Images Online — AI Image Upscaler Guide
      </h1>
      <p className="mt-4 text-gray-400">
        Published: May 2026 &middot; 4 min read
      </p>

      <div className="prose prose-invert mt-8 max-w-none text-gray-300 space-y-6">
        <p>
          Have a small or blurry image you need to enlarge? Traditional
          upscaling just stretches pixels — making everything look soft and
          pixelated. AI upscaling is different: it <em>adds</em> detail using
          machine learning, turning low-res images into crisp, high-resolution
          versions.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10">
          What is AI Image Upscaling?
        </h2>
        <p>
          AI upscaling (also called super-resolution) uses deep learning models
          trained on millions of image pairs. The model learns what details
          should exist in a high-resolution version and fills them in —
          sharpening edges, restoring textures, and enhancing faces.
        </p>
        <p>
          Our tool uses <strong>Real-ESRGAN</strong>, one of the most popular
          open-source super-resolution models. It can upscale images by up to 4x
          their original size.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10">
          How to Upscale an Image (3 Steps)
        </h2>

        <h3 className="text-lg font-medium text-white mt-6">
          1. Open the Upscaler
        </h3>
        <p>
          Go to{" "}
          <Link
            href="/image-upscaler"
            className="text-purple-400 hover:text-purple-300"
          >
            PixelForge Image Upscaler
          </Link>
          . No account required.
        </p>

        <h3 className="text-lg font-medium text-white mt-6">
          2. Upload Your Image
        </h3>
        <p>
          Drag and drop a PNG, JPG, or WebP. The tool works best with images
          that are at least 100x100 pixels. Anything from old digital photos to
          AI-generated art works great.
        </p>

        <h3 className="text-lg font-medium text-white mt-6">
          3. Download the Upscaled Version
        </h3>
        <p>
          After a few seconds of processing, download your 4x larger, crisp
          image. A 500x500 image becomes 2000x2000 — ready for printing or
          high-DPI displays.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10">
          When to Use Image Upscaling
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Enlarging old digital photos for printing</li>
          <li>Improving AI-generated images for commercial use</li>
          <li>Upscaling screenshots for documentation or presentations</li>
          <li>Preparing images for large-format prints and posters</li>
          <li>Sharpening compressed JPEGs from social media</li>
        </ul>

        <div className="mt-8 rounded-lg border border-purple-500/30 bg-purple-500/5 p-6">
          <p className="text-lg font-semibold text-white">
            Try upscaling your first image for free
          </p>
          <Link
            href="/image-upscaler"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Upscale Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
