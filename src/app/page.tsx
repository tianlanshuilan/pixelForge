import Link from "next/link";
import { ArrowRight, Image as ImageIcon, Sparkles, Zap, Shrink, FileImage, Crop } from "lucide-react";

const aiTools = [
  {
    name: "Remove Background",
    description: "Remove image backgrounds instantly with AI. Perfect for product photos, profile pictures, and e-commerce.",
    href: "/remove-background", icon: ImageIcon, color: "from-pink-500 to-rose-600",
  },
  {
    name: "Image Upscaler",
    description: "Enlarge images up to 4x without losing quality. AI-powered super-resolution for crisp, clear results.",
    href: "/image-upscaler", icon: Zap, color: "from-amber-500 to-orange-600",
  },
  {
    name: "Photo Restoration",
    description: "Restore old, damaged, or low-quality photos with AI. Bring faded memories back to life in seconds.",
    href: "/photo-restoration", icon: Sparkles, color: "from-emerald-500 to-teal-600",
  },
];

const basicTools = [
  {
    name: "Image Compressor",
    description: "Compress PNG, JPG, WebP images. Reduce file size without visible quality loss — in your browser.",
    href: "/image-compress", icon: Shrink, color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Format Converter",
    description: "Convert between PNG, JPEG, and WebP formats. No upload needed — all processed locally.",
    href: "/format-convert", icon: FileImage, color: "from-violet-500 to-purple-600",
  },
  {
    name: "Image Cropper",
    description: "Crop images to any size or aspect ratio. Simple drag-and-drop cropping right in your browser.",
    href: "/image-crop", icon: Crop, color: "from-orange-500 to-yellow-600",
  },
];

function ToolCard({ tool }: { tool: (typeof aiTools)[0] }) {
  return (
    <Link href={tool.href} className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-purple-500/50 hover:bg-gray-900">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${tool.color} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
      <tool.icon className="relative mb-4 h-10 w-10 text-purple-500" />
      <h3 className="relative text-lg font-semibold text-white transition-colors group-hover:text-purple-400">{tool.name}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-gray-400">{tool.description}</p>
      <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
        Try it free <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 text-center sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            6 Free Image Tools
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">No Signup Required</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Remove backgrounds, upscale images, compress photos, convert formats, restore old pictures, and crop — all right in your browser.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/remove-background" className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-8 py-3 text-sm font-semibold text-white hover:bg-purple-500">
              Try Background Removal <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/image-compress" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-700 px-8 py-3 text-sm font-semibold text-gray-300 hover:border-gray-500 hover:text-white">
              Compress an Image
            </Link>
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-lg font-semibold uppercase tracking-wider text-purple-400">AI Powered</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((tool) => (<ToolCard key={tool.href} tool={tool} />))}
        </div>
      </section>

      {/* Basic Tools */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-lg font-semibold uppercase tracking-wider text-gray-500">Free Tools</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {basicTools.map((tool) => (<ToolCard key={tool.href} tool={tool} />))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-800 bg-gray-900/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Why PixelForge?</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[{ emoji: "⚡", title: "Instant Results", desc: "AI processes your images in seconds. No waiting, no queues." },
              { emoji: "🔒", title: "Privacy First", desc: "All free tools run in your browser. Your images never leave your device." },
              { emoji: "💡", title: "No Signup Required", desc: "Start editing right away. Create an account only when you need more." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-800 p-8">
                <div className="text-3xl">{f.emoji}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
