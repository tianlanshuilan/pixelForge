import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PixelForge — Free AI Image Tools Online",
    template: "%s — PixelForge",
  },
  description:
    "Remove backgrounds, upscale images, restore old photos — all with AI. No signup required. Free to try.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "PixelForge — Free AI Image Tools Online",
    description:
      "Remove backgrounds, upscale images, restore old photos — all with AI. No signup required.",
    url: "https://pixelforge.ai",
    siteName: "PixelForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelForge — Free AI Image Tools Online",
    description:
      "Remove backgrounds, upscale images, restore old photos — with AI. Free to try.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
