"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Wand2 } from "lucide-react";

const tools = [
  { name: "Remove Background", href: "/remove-background" },
  { name: "Image Upscaler", href: "/image-upscaler" },
  { name: "Photo Restoration", href: "/photo-restoration" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <Wand2 className="h-6 w-6 text-purple-500" />
          PixelForge
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="text-sm text-gray-400 transition-colors hover:text-white"
            >
              {tool.name}
            </Link>
          ))}
          <Link
            href="/blog"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
          >
            Pricing
          </Link>
        </nav>

        <button
          className="text-gray-400 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-800 px-4 pb-4 md:hidden">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block py-2 text-sm text-gray-400"
              onClick={() => setOpen(false)}
            >
              {tool.name}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="mt-2 block rounded-lg bg-purple-600 px-4 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setOpen(false)}
          >
            View Pricing
          </Link>
        </div>
      )}
    </header>
  );
}
