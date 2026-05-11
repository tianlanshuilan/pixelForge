/**
 * Cookie-based daily usage tracking for freemium model.
 *
 * Strategy: store a JSON cookie with per-tool usage counts and date.
 * Reset counts when the date changes.
 * Free tier: 3 uses per tool per day.
 */

import { cookies } from "next/headers";

const FREE_LIMIT = 3;
const COOKIE_NAME = "pf_usage";

interface UsageData {
  date: string; // YYYY-MM-DD
  counts: Record<string, number>; // toolName -> count
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

async function readUsage(): Promise<UsageData> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) {
    return { date: getToday(), counts: {} };
  }
  try {
    const data = JSON.parse(raw) as UsageData;
    // Reset if the date has changed
    if (data.date !== getToday()) {
      return { date: getToday(), counts: {} };
    }
    return data;
  } catch {
    return { date: getToday(), counts: {} };
  }
}

export async function getUsage(toolName: string): Promise<{
  used: number;
  remaining: number;
  limit: number;
}> {
  const data = await readUsage();
  const used = data.counts[toolName] ?? 0;
  return {
    used,
    remaining: Math.max(0, FREE_LIMIT - used),
    limit: FREE_LIMIT,
  };
}

export async function incrementUsage(
  toolName: string,
): Promise<{ used: number; remaining: number; limit: number }> {
  const data = await readUsage();
  const used = (data.counts[toolName] ?? 0) + 1;
  data.counts[toolName] = used;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return {
    used,
    remaining: Math.max(0, FREE_LIMIT - used),
    limit: FREE_LIMIT,
  };
}

/** Check if user has remaining free uses. Call before processing. */
export async function canUseTool(toolName: string): Promise<boolean> {
  const { remaining } = await getUsage(toolName);
  return remaining > 0;
}
