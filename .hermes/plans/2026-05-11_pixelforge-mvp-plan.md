# PixelForge — AI Image Toolkit MVP Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build an AI image toolkit website with 3 tools (background removal, upscaling, photo restoration), Freemium model with LemonSqueezy payments, SEO-optimized for global English traffic.

**Architecture:** Next.js 14 App Router with Tailwind CSS, server-side API routes proxying to Replicate AI APIs, LemonSqueezy for payments/subscriptions, Vercel Blob for image storage. Each tool is a separate route acting as its own SEO landing page with a client-side interactive widget.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Replicate API, LemonSqueezy, Vercel (deploy + blob storage)

---

## Competitive Context

- **remove.bg**: Pricing ~CN¥53-233/mo, credits-based, Canva-owned. Differentiate: multi-tool suite + lower price point + no forced account for first use.
- **Photoroom**: $4MM MRR, mobile-first. Differentiate: web-first, simpler, cheaper.
- **Our angle**: One site = multiple tools, $9.99/mo flat unlimited for all tools, free tier = 3/day.

---

## Phase 1: Project Scaffold (Tasks 1-4)

### Task 1: Create Next.js project with TypeScript and Tailwind

**Objective:** Bootstrap the project with all core dependencies.

**Files:**
- Create: `/Users/hamsun/Documents/工作/project_one/` (entire project)

**Step 1: Create Next.js app**

```bash
cd /Users/hamsun/Documents/工作/project_one
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

**Step 2: Install additional dependencies**

```bash
npm install replicate lemon-squeezy-hooks @lemonsqueezy/lemonsqueezy.js @vercel/blob lucide-react clsx tailwind-merge
npm install -D @types/node prettier prettier-plugin-tailwindcss
```

**Step 3: Verify dev server starts**

```bash
npm run dev
# Open http://localhost:3000 — should show Next.js default page
```

**Step 4: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with TypeScript and Tailwind"
```

---

### Task 2: Configure environment variables and Replicate client

**Objective:** Set up .env.local with secrets and create a Replicate API helper.

**Files:**
- Create: `.env.local`
- Create: `src/lib/replicate.ts`

**Step 1: Create .env.local**

```bash
echo 'REPLICATE_API_TOKEN=your_token_here
LEMONSQUEEZY_API_KEY=your_key_here
LEMONSQUEEZY_STORE_ID=your_store_id
BLOB_READ_WRITE_TOKEN=your_token_here' > .env.local
echo '.env.local' >> .gitignore
```

**Step 2: Create Replicate client helper** (`src/lib/replicate.ts`)

```typescript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

interface RunPredictionOptions {
  model: `${string}/${string}` | `${string}/${string}:${string}`;
  input: Record<string, unknown>;
}

export async function runPrediction({ model, input }: RunPredictionOptions) {
  const output = await replicate.run(model as `${string}/${string}`, { input });
  return output;
}

export { replicate };
export type { RunPredictionOptions };
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Replicate client and env config"
```

---

### Task 3: Create core layout with navigation and branding

**Objective:** Build the main layout shell: header with logo, nav, and mobile menu. Footer with links.

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/app/globals.css` (if not auto-generated)

**Step 1: Update tailwind config and globals.css**

Ensure tailwind.config.ts has content paths set, then update `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-950 text-gray-100 antialiased;
  }
}
```

**Step 2: Create Header component** (`src/components/Header.tsx`)

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Wand2 } from "lucide-react";

const tools = [
  { name: "Background Removal", href: "/remove-background" },
  { name: "Image Upscaler", href: "/image-upscaler" },
  { name: "Photo Restoration", href: "/photo-restoration" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
          <Wand2 className="h-6 w-6 text-purple-500" />
          PixelForge
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="text-sm text-gray-400 hover:text-white transition-colors">
              {tool.name}
            </Link>
          ))}
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-800 px-4 pb-4">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="block py-2 text-sm text-gray-400" onClick={() => setOpen(false)}>
              {tool.name}
            </Link>
          ))}
          <Link href="/pricing" className="block py-2 text-sm text-gray-400" onClick={() => setOpen(false)}>Pricing</Link>
        </div>
      )}
    </header>
  );
}
```

**Step 3: Create Footer component** (`src/components/Footer.tsx`)

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} PixelForge. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/pricing" className="hover:text-gray-300">Pricing</Link>
          <Link href="/privacy" className="hover:text-gray-300">Privacy</Link>
          <Link href="/terms" className="hover:text-gray-300">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
```

**Step 4: Update root layout** (`src/app/layout.tsx`)

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PixelForge — Free AI Image Tools Online",
  description: "Remove backgrounds, upscale images, restore old photos — all with AI. No signup required. Free to try.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Header, Footer, and root layout with branding"
```

---

### Task 4: Create homepage with hero and tool cards

**Objective:** Build the landing page showcasing all tools.

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Create homepage** (`src/app/page.tsx`)

```tsx
import Link from "next/link";
import { ArrowRight, Image, Sparkles, Zap } from "lucide-react";

const tools = [
  {
    name: "Background Removal",
    description: "Remove image backgrounds instantly with AI. Perfect for product photos, profile pictures, and more.",
    href: "/remove-background",
    icon: Image,
  },
  {
    name: "Image Upscaler",
    description: "Enlarge images up to 4x without losing quality. AI-powered super-resolution for crisp, clear results.",
    href: "/image-upscaler",
    icon: Zap,
  },
  {
    name: "Photo Restoration",
    description: "Restore old, damaged, or low-quality photos with AI. Bring your memories back to life.",
    href: "/photo-restoration",
    icon: Sparkles,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="px-4 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
          AI-Powered Image Tools
          <br />
          <span className="text-purple-400">Free to Try</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">
          Remove backgrounds, upscale images, and restore old photos — all in your browser.
          No signup required. Get started in seconds.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/remove-background" className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
            Try Background Removal <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/image-upscaler" className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition-colors">
            Upscale an Image
          </Link>
        </div>
      </section>

      {/* Tools grid */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <h2 className="text-2xl font-bold text-white text-center mb-12">All Tools</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group rounded-xl border border-gray-800 bg-gray-900 p-8 hover:border-purple-500/50 transition-all">
              <tool.icon className="h-10 w-10 text-purple-500 mb-4" />
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">{tool.name}</h3>
              <p className="mt-2 text-sm text-gray-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "feat: add homepage with hero section and tool cards"
```

---

## Phase 2: Tool Page Template + First Tool (Tasks 5-9)

### Task 5: Create shared ToolPage component

**Objective:** Build a reusable tool page wrapper with upload, processing state, before/after result display.

**Files:**
- Create: `src/components/ToolPage.tsx`

This component accepts:
- `title`, `description` (SEO)
- `toolName` (for API routing)
- `acceptedTypes` (file types)
- `beforeLabel` / `afterLabel`
- `children` (for any custom controls)

It handles: file upload → calls API route → shows before/after → tracks usage count → shows upgrade prompt when limit hit.

Let me write this as a comprehensive component. Actually, let me break this into smaller, more focused tasks:

### Task 5: Create image upload hook

### Task 6: Create the tool API route

### Task 7: Create background removal tool page

### Task 8: Create result display component

### Task 9: Add usage tracking

This is getting detailed. Let me structure the rest more concisely.

---

## Phase 2 (continued): Core Features

### Task 5: Image upload hook (`src/hooks/useImageUpload.ts`)

Handles file selection, drag-and-drop, preview URL generation, and upload to API.

### Task 6: API route for background removal (`src/app/api/remove-background/route.ts`)

POST handler: receives image → calls Replicate rmbg-1.4 model → returns processed image URL.

### Task 7: Background removal tool page (`src/app/remove-background/page.tsx`)

Full tool page with SEO metadata, upload widget, before/after comparison.

### Task 8: Result display component (`src/components/ResultView.tsx`)

Before/after slider comparison, download button, share button.

### Task 9: Usage counter (`src/lib/usage.ts`)

Cookie-based daily usage tracking. Free tier: 3/day. Counts per tool.

---

## Phase 3: Remaining Tools + Pricing (Tasks 10-14)

### Task 10: Image upscaler API route
### Task 11: Image upscaler tool page
### Task 12: Photo restoration API route
### Task 13: Photo restoration tool page
### Task 14: Pricing page with LemonSqueezy integration

---

## Phase 4: Polish + Launch (Tasks 15-18)

### Task 15: Blog/SEO content pages
### Task 16: Analytics (Vercel Analytics)
### Task 17: Error handling and loading states
### Task 18: Deploy to Vercel

---

**Total estimated tasks:** 18
**Estimated effort:** 2-3 days of focused work
**Tools per phase:** Phase 1 (scaffold) → Phase 2 (first tool + reusable components) → Phase 3 (remaining 2 tools + payments) → Phase 4 (polish + launch)
