import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Restore Old Photos with AI — Free Photo Restoration (2026)",
  description:
    "Bring faded, scratched, and damaged photos back to life with AI. Repair faces, remove noise, and enhance detail in seconds. Free to try.",
};

export default function BlogPost() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-300">
        &larr; Back to Blog
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
        How to Restore Old Photos with AI — Free Photo Restoration Guide
      </h1>
      <p className="mt-4 text-gray-400">
        Published: May 2026 &middot; 5 min read
      </p>

      <div className="prose prose-invert mt-8 max-w-none text-gray-300 space-y-6">
        <p>
          Old family photos fade. They get scratched, torn, and discolored. For
          decades, restoring them meant hiring a professional retoucher — a slow
          and expensive process. AI photo restoration changes everything: upload
          a scan, and in seconds, you get a beautifully restored photo.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10">
          How AI Photo Restoration Works
        </h2>
        <p>
          Our restoration tool uses <strong>GFP-GAN</strong>, a deep learning
          model specifically designed for face and photo restoration. It has
          been trained on thousands of degraded/clean photo pairs to learn how
          to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Remove scratches, dust, and noise</li>
          <li>Sharpen blurred faces and features</li>
          <li>Enhance faded colors and contrast</li>
          <li>Upscale low-resolution scans</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-10">
          How to Restore a Photo (3 Steps)
        </h2>

        <h3 className="text-lg font-medium text-white mt-6">
          1. Scan or Photograph Your Old Photo
        </h3>
        <p>
          For best results, use a flatbed scanner at 300 DPI or higher. If you
          don&apos;t have a scanner, a smartphone photo in good lighting works
          too — just make sure the image is straight and well-lit.
        </p>

        <h3 className="text-lg font-medium text-white mt-6">
          2. Upload to the Restoration Tool
        </h3>
        <p>
          Open{" "}
          <Link
            href="/photo-restoration"
            className="text-purple-400 hover:text-purple-300"
          >
            PixelForge Photo Restoration
          </Link>{" "}
          and drag your scanned image onto the upload area. The AI starts
          processing immediately.
        </p>

        <h3 className="text-lg font-medium text-white mt-6">
          3. Download the Restored Photo
        </h3>
        <p>
          Within seconds, you&apos;ll see a side-by-side comparison of the
          original and restored versions. Click Download to save the enhanced
          photo.
        </p>

        <h2 className="text-xl font-semibold text-white mt-10">
          Tips for Best Results
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Scan at 300+ DPI for the most detail to restore</li>
          <li>Avoid heavily creased or torn areas if possible — the AI works best with moderate damage</li>
          <li>Black-and-white photos often produce the most dramatic results</li>
          <li>Try multiple scans of the same photo and pick the best input</li>
        </ul>

        <div className="mt-8 rounded-lg border border-purple-500/30 bg-purple-500/5 p-6">
          <p className="text-lg font-semibold text-white">
            Restore your first photo — free
          </p>
          <Link
            href="/photo-restoration"
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition-colors"
          >
            Restore Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
