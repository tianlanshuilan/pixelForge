export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PixelForge",
    url: "https://pixel-forge-jain.vercel.app",
    description:
      "Free AI image tools — remove backgrounds, upscale images 4x, restore old photos, compress, convert formats, and crop. No signup required.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "PixelForge",
    },
    browserRequirements: "Requires JavaScript",
    featureList: [
      "AI Background Removal",
      "Image Upscaling (4x)",
      "Photo Restoration",
      "Image Compression",
      "Format Conversion (PNG, JPEG, WebP)",
      "Image Cropping",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
