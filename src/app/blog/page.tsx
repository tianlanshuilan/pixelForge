import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — AI Image Tools Guides & Tutorials",
  description:
    "Learn how to use AI to remove backgrounds, upscale images, and restore old photos. Free step-by-step guides.",
};

const posts = [
  {
    title: "Free Background Remover — No Signup, Instant AI Removal (2026)",
    slug: "free-background-remover-no-signup",
    description:
      "Remove image backgrounds instantly with AI. No signup, no credit card. Works on product photos, portraits, and complex images. Free 3 uses per day.",
    href: "/blog/free-background-remover-no-signup",
    icon: ImageIcon,
  },
  {
    title: "Compress Image Online Free — No Quality Loss (2026)",
    slug: "compress-image-online-free",
    description:
      "Compress PNG, JPG, WebP images by up to 80% without visible quality loss. Works entirely in your browser — no upload needed.",
    href: "/blog/compress-image-online-free",
    icon: Zap,
  },
  {
    title: "Convert PNG to JPG Free Online — Instant, No Upload (2026)",
    slug: "convert-png-to-jpg-free",
    description:
      "Convert between PNG, JPG, and WebP formats instantly in your browser. No signup, no upload, no quality loss. All 6 conversion directions supported.",
    href: "/blog/convert-png-to-jpg-free",
    icon: Sparkles,
  },
  {
    title: "6 Free AI Image Tools Every Content Creator Needs (2026)",
    slug: "free-ai-image-tools-for-content-creators",
    description:
      "Discover 6 free AI-powered image tools — remove backgrounds, upscale photos, compress images, convert formats, crop, and restore old pictures. No signup required.",
    href: "/blog/free-ai-image-tools-for-content-creators",
    icon: Sparkles,
  },
  {
    title: "How to Remove Background from Image — Free AI Tool (2026 Guide)",
    slug: "how-to-remove-background-from-image",
    description:
      "Learn how to instantly remove image backgrounds using AI. No Photoshop required. Free online tool with step-by-step instructions for e-commerce, social media, and more.",
    href: "/blog/how-to-remove-background-from-image",
    icon: ImageIcon,
  },
  {
    title: "How to Upscale Images Online — AI Image Upscaler Guide",
    slug: "how-to-upscale-images",
    description:
      "Enlarge images up to 4x without losing quality. Our AI upscaler adds detail instead of just stretching pixels. Perfect for print, web, and social media.",
    href: "/blog/how-to-upscale-images",
    icon: Zap,
  },
  {
    title: "How to Restore Old Photos with AI — Photo Restoration Guide",
    slug: "how-to-restore-old-photos",
    description:
      "Bring faded, scratched, and damaged photos back to life. AI photo restoration repairs faces, removes noise, and enhances detail in seconds.",
    href: "/blog/how-to-restore-old-photos",
    icon: Sparkles,
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          AI Image Tools Blog
        </h1>
        <p className="mt-3 text-gray-400">
          Guides, tutorials, and tips for getting the most out of AI image tools.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.href}
            className="group rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-purple-500/50"
          >
            <post.icon className="mb-4 h-8 w-8 text-purple-500" />
            <h2 className="text-base font-semibold text-white group-hover:text-purple-400 transition-colors">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-400 line-clamp-3">
              {post.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
              Read more <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
