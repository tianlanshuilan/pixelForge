# LemonSqueezy Payment Integration Plan

## Goal
Replace PayPal Standard (pending approval) with LemonSqueezy for PixelForge's subscription payment system. Enable Pro users to bypass the 3-use daily limit via a license-key + cookie flow.

## Current State
- `@lemonsqueezy/lemonsqueezy.js` v4 already installed but unused
- Usage tracking is cookie-based (`pf_usage`), 3 uses per tool per day
- Pricing page uses PayPal Standard button (no callback/webhook)
- No user auth system — Pro status must work without signup
- FAQ already mentions "LemonSqueezy" but not implemented
- LS version: `https://api.lemonsqueezy.com/v1`

## Architecture

```
User clicks "Upgrade" → LS Checkout page → User pays
                                                ↓
                                    LS webhook → /api/webhooks/lemonsqueezy
                                                ↓
                                    Verify signature, store subscription
                                                ↓
                                    User gets license key via LS email
                                                ↓
User enters key on /pricing → Validate via LS API → Set pf_pro cookie
                                                ↓
API routes: if pf_pro cookie valid → skip usage limit
```

## Key Design Decision: License Key Flow

No auth system, so Pro identification uses:
1. **License Key** (LemonSqueezy native feature) — each purchase generates a key
2. **pf_pro cookie** — stores validated license key + expiry
3. **Validation endpoint** — `/api/license/validate` checks key against LS API
4. **Usage bypass** — `usage.ts` checks pf_pro cookie before enforcing limits

## Files to Change

### New files:
- `src/app/api/webhooks/lemonsqueezy/route.ts` — Receive subscription events
- `src/app/api/license/validate/route.ts` — Validate license keys
- `src/app/api/license/status/route.ts` — Check current Pro status
- `src/lib/lemonsqueezy.ts` — LS API client + webhook signature verification
- `src/lib/pro.ts` — Pro status cookie management
- `src/components/LicenseKeyInput.tsx` — License key input UI component

### Modified files:
- `src/lib/usage.ts` — Add Pro bypass logic
- `src/app/pricing/page.tsx` — Replace PayPal button, add license key input
- `src/app/remove-background/page.tsx` — Add pro status display (minor)
- `src/app/image-upscaler/page.tsx` — Same
- `src/app/photo-restoration/page.tsx` — Same
- `.env.local` — Add LS env vars

## Step-by-Step Plan

### Step 1: LemonSqueezy Dashboard Setup
- Sign up at lemonsqueezy.com
- Create a Store
- Create a Product: "PixelForge Pro"
- Create a Variant: $9.99/month subscription
- Get Store ID, Product ID, Variant ID
- Create API key
- Set webhook URL to `https://pixel-forge-jain.vercel.app/api/webhooks/lemonsqueezy`
- Set signing secret

### Step 2: Environment Variables
```
LEMONSQUEEZY_API_KEY=ey...
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_VARIANT_ID=67890
LEMONSQUEEZY_WEBHOOK_SECRET=whsec_...
```

### Step 3: Build LS Client Library (`src/lib/lemonsqueezy.ts`)
- Webhook signature verification (HMAC-SHA256)
- License key validation (GET /v1/licenses/validate)
- Subscription status check (GET /v1/subscriptions/:id)
- Create checkout (POST /v1/checkouts)

### Step 4: Webhook Endpoint
- POST /api/webhooks/lemonsqueezy
- Verify X-Signature header
- Handle events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `license_key_created`
- Store subscription state in memory or file (no DB — use in-memory Map + persistence)

### Step 5: License Key Validation
- POST /api/license/validate
- Accept `{ licenseKey: string }`
- Call LS API to validate
- Return `{ valid: boolean, expiresAt: string, plan: string }`
- On success, client sets pf_pro cookie

### Step 6: Pro Cookie Library (`src/lib/pro.ts`)
- `getProStatus()` — read pf_pro cookie, check expiry
- `setProCookie(licenseKey, expiresAt)` — set cookie
- `clearProCookie()` — remove cookie

### Step 7: Update Usage Tracking
- Modify `src/lib/usage.ts`:
  - `canUseTool()` and `getUsage()` check Pro status first
  - If Pro: return { remaining: Infinity, limit: Infinity }

### Step 8: Update Pricing Page
- Replace PayPal button with LS Checkout
- Add LicenseKeyInput component
- Add "Already subscribed?" section
- Handle checkout redirect

### Step 9: Update Tool Pages
- Show "Pro" badge in usage bar when Pro is active
- Change "Upgrade to Pro" link behavior for Pro users

### Step 10: Test Flow
- Create test checkout
- Verify webhook receives events
- Validate license key flow
- Confirm Pro bypass works

## Risks & Tradeoffs
- **Cookie-based Pro**: User loses Pro on cookie clear / different browser. Acceptable for MVP.
- **No DB**: Subscription state in memory resets on deployment. Webhook replay handles recovery.
- **License key UX**: Extra step for user (enter key after purchase). Could be improved later with checkout redirect params.
- **Security**: License keys validated server-side against LS API — no client-side bypass possible.
