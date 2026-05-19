"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Zap, Loader2, ArrowRight, Crown, ExternalLink } from "lucide-react";
import LicenseKeyInput from "@/components/LicenseKeyInput";

interface ProStatus {
  pro: boolean;
  expiresAt: string | null;
  activatedAt?: string;
}

export default function PricingPage() {
  const [proStatus, setProStatus] = useState<ProStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Load Pro status on mount
  useEffect(() => {
    fetch("/api/license/status")
      .then((res) => res.json())
      .then((data) => setProStatus(data as ProStatus))
      .catch(() => setProStatus({ pro: false, expiresAt: null }))
      .finally(() => setLoading(false));
  }, []);

  async function handleCheckout() {
    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout");
      }

      const data = (await res.json()) as { url?: string; error?: string };

      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Checkout creation failed");
      }
    } catch {
      setCheckoutError("Network error. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  function handleLicenseActivated(expiresAt: string | null) {
    setProStatus({ pro: true, expiresAt });
  }

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  // Pro user — show status
  if (proStatus?.pro) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
            <Crown className="h-8 w-8 text-purple-400" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            You are a Pro Member
          </h1>
          <p className="mt-3 text-gray-400">
            Unlimited access to all AI tools. Enjoy priority processing and HD quality.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 text-center">
            <p className="text-sm text-gray-400">Plan</p>
            <p className="mt-1 text-lg font-semibold text-white">PixelForge Pro</p>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 text-center">
            <p className="text-sm text-gray-400">Price</p>
            <p className="mt-1 text-lg font-semibold text-white">$9.99/month</p>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-6 text-center">
            <p className="text-sm text-gray-400">Status</p>
            <p className="mt-1 text-lg font-semibold text-green-400 flex items-center justify-center gap-1.5">
              <Check className="h-4 w-4" />
              Active
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/remove-background"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
          >
            Start Using Pro Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Free user — show pricing
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-3 text-gray-400">
          Start free. Upgrade when you need more.
        </p>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        {/* Free Tier */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8">
          <h2 className="text-xl font-semibold text-white">Free</h2>
          <p className="mt-1 text-sm text-gray-400">
            Perfect for trying out the tools.
          </p>
          <p className="mt-6">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="text-gray-400">/month</span>
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "3 uses per tool per day",
              "Background removal",
              "Image upscaling (4x)",
              "Photo restoration",
              "Standard quality output",
              "No signup required",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/remove-background"
            className="mt-8 block rounded-lg border border-gray-700 px-6 py-3 text-center text-sm font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
          >
            Start Free
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="relative rounded-2xl border-2 border-purple-500 bg-gradient-to-b from-purple-950/20 to-gray-900/50 p-8">
          <div className="absolute -top-3 right-6 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
            Most Popular
          </div>
          <h2 className="text-xl font-semibold text-white">Pro</h2>
          <p className="mt-1 text-sm text-gray-400">
            For creators, sellers, and professionals.
          </p>
          <p className="mt-6">
            <span className="text-4xl font-bold text-white">$9.99</span>
            <span className="text-gray-400">/month</span>
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Unlimited uses — all tools",
              "Background removal",
              "Image upscaling (4x)",
              "Photo restoration",
              "HD quality output",
              "Priority processing",
              "No watermarks",
              "Email support",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkoutLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            Subscribe with LemonSqueezy — $9.99/mo
          </button>

          {checkoutError && (
            <p className="mt-2 text-center text-xs text-red-400">{checkoutError}</p>
          )}

          <p className="mt-3 text-center text-xs text-gray-500">
            Secured by LemonSqueezy. Credit card, PayPal, Apple Pay accepted.
            Cancel anytime.
          </p>
        </div>
      </div>

      {/* License Key Section */}
      <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
        <h3 className="text-center text-lg font-semibold text-white">
          Already Subscribed?
        </h3>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter the license key from your purchase email to activate Pro.
        </p>
        <LicenseKeyInput
          onActivated={handleLicenseActivated}
          className="mt-6 mx-auto max-w-xl"
        />
      </div>

      {/* FAQ */}
      <div className="mt-24 rounded-xl border border-gray-800 bg-gray-900/50 p-8">
        <h3 className="text-lg font-semibold text-white">
          Billing Questions
        </h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="font-medium text-white">Can I cancel anytime?</h4>
            <p className="mt-1 text-sm text-gray-400">
              Yes. Cancel with one click from your LemonSqueezy customer portal. No questions asked.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">Is there a refund policy?</h4>
            <p className="mt-1 text-sm text-gray-400">
              We offer a 7-day money-back guarantee handled through LemonSqueezy.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">What payment methods do you accept?</h4>
            <p className="mt-1 text-sm text-gray-400">
              Credit/debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay via LemonSqueezy.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">How does the license key work?</h4>
            <p className="mt-1 text-sm text-gray-400">
              After subscribing, you receive a license key by email. Enter it here to unlock Pro features across your browser. No account signup needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
