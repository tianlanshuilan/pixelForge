/**
 * POST /api/license/validate
 *
 * Validates a LemonSqueezy license key server-side.
 * Body: { licenseKey: string }
 * Returns: { valid: boolean, expiresAt: string | null }
 *
 * Client calls this when user enters their license key,
 * then sets the pf_pro cookie on success.
 */

import { NextRequest, NextResponse } from "next/server";
import { validateLicenseKey } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { licenseKey?: string };

    if (!body.licenseKey || typeof body.licenseKey !== "string") {
      return NextResponse.json(
        { error: "licenseKey is required" },
        { status: 400 },
      );
    }

    const key = body.licenseKey.trim();

    // Basic format check (LS keys look like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    if (key.length < 20) {
      return NextResponse.json(
        { valid: false, error: "Invalid license key format" },
        { status: 200 },
      );
    }

    const result = await validateLicenseKey(key);

    return NextResponse.json(result);
  } catch (err) {
    console.error("License validation error:", err);
    return NextResponse.json(
      { valid: false, error: "Validation failed" },
      { status: 500 },
    );
  }
}
