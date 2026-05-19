/**
 * POST /api/checkout
 *
 * Creates a LemonSqueezy checkout session and returns the URL.
 * Body (optional): { email?: string }
 * Response: { url: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { createCheckout } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const params: { email?: string } = {};

    if (body.email && typeof body.email === "string") {
      params.email = body.email;
    }

    const url = await createCheckout(params);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Checkout creation error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 },
    );
  }
}
