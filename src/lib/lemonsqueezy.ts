/**
 * LemonSqueezy API client for PixelForge.
 *
 * Handles:
 * - Checkout creation (POST /v1/checkouts)
 * - License key validation (POST /v1/licenses/validate)
 * - Subscription status (GET /v1/subscriptions/:id)
 * - Webhook signature verification (HMAC-SHA256)
 *
 * All calls are server-side only — API key never reaches the client.
 */

const LS_BASE = "https://api.lemonsqueezy.com/v1";

function apiKey(): string {
  const key = process.env.LEMONSQUEEZY_API_KEY;
  if (!key) {
    throw new Error("LEMONSQUEEZY_API_KEY is not set");
  }
  return key;
}

function headers(): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey()}`,
  };
}

/** Generic LS API response wrapper */
interface LSApiResponse<T> {
  data: T;
}

interface CheckoutAttributes {
  url: string;
}

interface CheckoutData {
  type: "checkouts";
  id: string;
  attributes: CheckoutAttributes;
}

interface LicenseKeyAttributes {
  key: string;
  status: string;
  expires_at: string | null;
  instance_id: string | null;
}

interface LicenseKeyData {
  type: "licenses";
  id: string;
  attributes: LicenseKeyAttributes;
}

interface LicenseValidateResponse {
  valid: boolean;
  license_key: LicenseKeyData;
  instance?: { id: string };
  meta: {
    store_id: number;
    order_id: number;
    product_id: number;
    variant_id: number;
    customer_id: number;
    product_name: string;
    variant_name: string;
  };
}

interface SubscriptionAttributes {
  status: "active" | "cancelled" | "expired" | "past_due" | "paused";
  ends_at: string | null;
  renews_at: string | null;
  cancelled: boolean;
}

interface SubscriptionData {
  type: "subscriptions";
  id: string;
  attributes: SubscriptionAttributes;
}

// ─── Checkout ────────────────────────────────────────────────────────

export async function createCheckout(params: {
  email?: string;
}): Promise<string> {
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;
  if (!variantId) {
    throw new Error("LEMONSQUEEZY_VARIANT_ID is not set");
  }

  const body = {
    data: {
      type: "checkouts",
      attributes: {
        checkout_data: {
          email: params.email || undefined,
          custom: {},
        },
        product_options: {
          redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://pixelforge.ai"}/pricing?checkout=success`,
        },
        checkout_options: {
          subscription_preview: true,
        },
      },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: String(process.env.LEMONSQUEEZY_STORE_ID || ""),
          },
        },
        variant: {
          data: {
            type: "variants",
            id: String(variantId),
          },
        },
      },
    },
  };

  const res = await fetch(`${LS_BASE}/checkouts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LemonSqueezy checkout error: ${res.status} ${text}`);
  }

  const json: LSApiResponse<CheckoutData> = await res.json();
  return json.data.attributes.url;
}

// ─── License Key Validation ──────────────────────────────────────────

export async function validateLicenseKey(
  licenseKey: string,
): Promise<{
  valid: boolean;
  expiresAt: string | null;
  subscriptionStatus?: string;
}> {
  const res = await fetch(`${LS_BASE}/licenses/validate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ license_key: licenseKey }),
  });

  if (!res.ok) {
    return { valid: false, expiresAt: null };
  }

  const json: LicenseValidateResponse = await res.json();

  if (!json.valid) {
    return { valid: false, expiresAt: null };
  }

  return {
    valid: true,
    expiresAt: json.license_key.attributes.expires_at,
    subscriptionStatus: json.license_key.attributes.status,
  };
}

// ─── Subscription Status ─────────────────────────────────────────────

export async function getSubscription(
  subscriptionId: string,
): Promise<SubscriptionAttributes> {
  const res = await fetch(`${LS_BASE}/subscriptions/${subscriptionId}`, {
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch subscription: ${res.status}`);
  }

  const json: LSApiResponse<SubscriptionData> = await res.json();
  return json.data.attributes;
}

// ─── Webhook Signature Verification ──────────────────────────────────

export async function verifyWebhookSignature(
  payload: string,
  signature: string,
): Promise<boolean> {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured");
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const data = encoder.encode(payload) as BufferSource;
    return await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBytes(signature) as BufferSource,
      data,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return false;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// ─── Webhook Event Types ─────────────────────────────────────────────

export interface LSWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: Record<string, unknown>;
  };
  data: {
    id: string;
    type: string;
    attributes: Record<string, unknown>;
  };
}

export function parseWebhookEvent(payload: string): LSWebhookEvent {
  return JSON.parse(payload) as LSWebhookEvent;
}
