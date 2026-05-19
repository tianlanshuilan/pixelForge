/**
 * POST /api/license/activate
 *
 * Sets the Pro cookie after license key has been validated.
 * Body: { licenseKey: string, expiresAt: string | null }
 *
 * This endpoint exists because cookies can only be set server-side.
 * The client calls /api/license/validate first, then this endpoint.
 */

import { NextRequest, NextResponse } from "next/server";
import { setProCookie } from "@/lib/pro";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      licenseKey?: string;
      expiresAt?: string | null;
    };

    if (!body.licenseKey) {
      return NextResponse.json(
        { error: "licenseKey is required" },
        { status: 400 },
      );
    }

    await setProCookie(body.licenseKey, body.expiresAt ?? null);

    return NextResponse.json({ activated: true });
  } catch (err) {
    console.error("License activation error:", err);
    return NextResponse.json(
      { error: "Activation failed" },
      { status: 500 },
    );
  }
}
