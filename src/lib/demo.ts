/**
 * Demo / development mode helper.
 *
 * When DEMO_MODE=true in .env.local, API routes skip Replicate and
 * return the uploaded image as-is after a simulated delay.
 * This lets you test the full upload → result → download flow
 * without needing a paid Replicate account.
 *
 * Remove DEMO_MODE from .env.local when your payment method is ready.
 */

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}

/** Simulate processing delay (1-2 seconds) */
export async function simulateProcessing(): Promise<void> {
  const ms = 1000 + Math.random() * 1000;
  await new Promise((r) => setTimeout(r, ms));
}
