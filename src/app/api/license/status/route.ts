/**
 * GET /api/license/status
 *
 * Returns current Pro status from cookie.
 * Used by client components to check Pro state.
 *
 * Response: { pro: boolean, expiresAt: string | null }
 */

import { NextResponse } from "next/server";
import { getProPayload } from "@/lib/pro";

export async function GET() {
  const payload = await getProPayload();

  if (!payload) {
    return NextResponse.json({ pro: false, expiresAt: null });
  }

  return NextResponse.json({
    pro: true,
    expiresAt: payload.expiresAt,
    activatedAt: payload.activatedAt,
  });
}
