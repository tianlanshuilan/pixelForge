import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pixel-forge-jain.vercel.app";

  const tools = [
    "remove-background",
    "image-upscaler",
    "photo-restoration",
    "image-compress",
    "format-convert",
    "image-crop",
  ];

  const blogPosts = [
    "how-to-remove-background-from-image",
    "how-to-upscale-images",
    "how-to-restore-old-photos",
    "free-ai-image-tools-for-content-creators",
  ];

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...tools.map((t) => ({
      url: `${baseUrl}/${t}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...blogPosts.map((b) => ({
      url: `${baseUrl}/blog/${b}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
