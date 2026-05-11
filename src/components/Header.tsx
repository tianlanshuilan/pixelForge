"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Wand2, ChevronDown } from "lucide-react";

const aiTools = [
  { name: "Remove Background", href: "/remove-background" },
  { name: "Image Upscaler", href: "/image-upscaler" },
  { name: "Photo Restoration", href: "/photo-restoration" },
];

const basicTools = [
  { name: "Image Compressor", href: "/image-compress" },
  { name: "Format Converter", href: "/format-convert" },
  { name: "Image Cropper", href: "/image-crop" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const allTools = [...aiTools, ...basicTools];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Wand2 className="h-6 w-6 text-purple-500" />
          PixelForge
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {/* Tools dropdown */}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              Tools <ChevronDown className="h-3 w-3" />
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-gray-700 bg-gray-900 py-2 shadow-xl">
                <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">AI Powered</p>
                {aiTools.map((t) => (
                  <Link key={t.href} href={t.href} className="block px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                    {t.name}
                  </Link>
                ))}
                <div className="my-1 border-t border-gray-800" />
                <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Free Tools</p>
                {basicTools.map((t) => (
                  <Link key={t.href} href={t.href} className="block px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                    {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">Blog</Link>
          <Link href="/pricing" className="rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500">
            Pricing
          </Link>
        </nav>

        <button className="text-gray-400 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-800 px-4 pb-4 md:hidden">
          <p className="pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">AI Powered</p>
          {aiTools.map((t) => (
            <Link key={t.href} href={t.href} className="block py-2 text-sm text-gray-400" onClick={() => setOpen(false)}>{t.name}</Link>
          ))}
          <p className="pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Free Tools</p>
          {basicTools.map((t) => (
            <Link key={t.href} href={t.href} className="block py-2 text-sm text-gray-400" onClick={() => setOpen(false)}>{t.name}</Link>
          ))}
          <Link href="/blog" className="block py-2 text-sm text-gray-400" onClick={() => setOpen(false)}>Blog</Link>
          <Link href="/pricing" className="mt-2 block rounded-lg bg-purple-600 px-4 py-2 text-center text-sm font-semibold text-white" onClick={() => setOpen(false)}>
            View Pricing
          </Link>
        </div>
      )}
    </header>
  );
}
