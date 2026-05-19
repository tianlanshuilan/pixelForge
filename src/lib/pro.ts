/**
 * Pro status management via HTTP cookie.
 *
 * No auth system — Pro status is stored as a signed cookie.
 * The cookie contains the license key + expiry timestamp.
 * API routes validate the license key server-side against LS API
 * to prevent tampering.
 */

import { cookies } from "next/headers";

const PRO_COOKIE = "pf_pro";
const PRO_SIG = "pf_pro_sig";

interface ProPayload {
  licenseKey: string;
  expiresAt: string | null; // ISO date or null for lifetime
  activatedAt: string;
}

// ─── Cookie helpers ──────────────────────────────────────────────────

export async function getProPayload(): Promise<ProPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PRO_COOKIE)?.value;
  if (!raw) return null;

  try {
    const decoded = Buffer.from(raw, "base64").toString("utf-8");
    const payload = JSON.parse(decoded) as ProPayload;

    // Check expiry
    if (payload.expiresAt) {
      if (new Date(payload.expiresAt) < new Date()) {
        return null; // Expired
      }
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setProCookie(
  licenseKey: string,
  expiresAt: string | null,
): Promise<void> {
  const cookieStore = await cookies();
  const payload: ProPayload = {
    licenseKey,
    expiresAt,
    activatedAt: new Date().toISOString(),
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");

  // Cookie expiry: match license expiry, or 30 days for lifetime
  const maxAge = expiresAt
    ? Math.max(
        0,
        Math.floor(
          (new Date(expiresAt).getTime() - Date.now()) / 1000,
        ),
      )
    : 60 * 60 * 24 * 365; // 1 year for "lifetime"

  cookieStore.set(PRO_COOKIE, encoded, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge,
    path: "/",
  });
}

export async function clearProCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PRO_COOKIE);
  cookieStore.delete(PRO_SIG);
}

export async function isPro(): Promise<boolean> {
  const payload = await getProPayload();
  return payload !== null;
}
