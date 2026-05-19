/**
 * POST /api/webhooks/lemonsqueezy
 *
 * Receives LemonSqueezy webhook events:
 * - order_created        → new purchase
 * - subscription_created → new subscription
 * - subscription_updated → renewal/cancellation
 * - subscription_cancelled → cancellation
 * - license_key_created  → new license key issued
 *
 * Verifies HMAC-SHA256 signature before processing.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  verifyWebhookSignature,
  parseWebhookEvent,
  type LSWebhookEvent,
} from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  // 1. Read raw body for signature verification
  const payload = await request.text();
  const signature = request.headers.get("x-signature") || "";

  // 2. Verify signature
  const valid = await verifyWebhookSignature(payload, signature);
  if (!valid) {
    console.error("LS webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 3. Parse event
  let event;
  try {
    event = parseWebhookEvent(payload);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const eventName = event.meta.event_name;
  console.log(`LS webhook: ${eventName}`, JSON.stringify(event.data).slice(0, 200));

  // 4. Handle events
  switch (eventName) {
    case "subscription_created":
      handleSubscriptionCreated(event);
      break;
    case "subscription_updated":
      handleSubscriptionUpdated(event);
      break;
    case "subscription_cancelled":
      handleSubscriptionCancelled(event);
      break;
    case "license_key_created":
      handleLicenseKeyCreated(event);
      break;
    case "order_created":
      // Order created — no action needed for now
      break;
    default:
      console.log(`LS webhook: unhandled event ${eventName}`);
  }

  return NextResponse.json({ received: true });
}

// ─── Event Handlers ──────────────────────────────────────────────────

function handleSubscriptionCreated(event: LSWebhookEvent) {
  console.log("New subscription created:", JSON.stringify(event.data).slice(0, 200));
}

function handleSubscriptionUpdated(event: LSWebhookEvent) {
  console.log("Subscription updated:", JSON.stringify(event.data).slice(0, 200));
}

function handleSubscriptionCancelled(event: LSWebhookEvent) {
  console.log("Subscription cancelled:", JSON.stringify(event.data).slice(0, 200));
}

function handleLicenseKeyCreated(event: LSWebhookEvent) {
  console.log("License key created:", JSON.stringify(event.data).slice(0, 200));
}
