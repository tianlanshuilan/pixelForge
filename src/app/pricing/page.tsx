import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — PixelForge",
  description:
    "Simple, transparent pricing. Start free, upgrade to Pro for unlimited AI image tools.",
};

export default function PricingPage() {
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

          <a
            href="https://www.paypal.com/webscr?cmd=_xclick-subscriptions&business=864304493@qq.com&item_name=PixelForge+Pro&a3=9.99&p3=1&t3=M&currency_code=USD&no_note=1&src=1&sra=1"
            className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-500"
          >
            <Zap className="h-4 w-4" />
            Upgrade to Pro — $9.99/mo
          </a>
          <p className="mt-3 text-center text-xs text-gray-500">
            Cancel anytime. 7-day money-back guarantee.
          </p>
        </div>
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
              Yes, absolutely. Cancel your subscription with one click. No questions asked.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">Is there a refund policy?</h4>
            <p className="mt-1 text-sm text-gray-400">
              We offer a 7-day money-back guarantee. If you&apos;re not satisfied, we&apos;ll refund your payment.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">What payment methods do you accept?</h4>
            <p className="mt-1 text-sm text-gray-400">
              Credit/debit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay via LemonSqueezy.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">Can I switch plans?</h4>
            <p className="mt-1 text-sm text-gray-400">
              You can upgrade from Free to Pro anytime. Pro-rated billing for upgrades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
