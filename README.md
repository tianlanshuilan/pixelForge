# PixelForge — Free AI Image Tools Online

**No signup. No credit card. Just upload and go.**

[![Website](https://img.shields.io/badge/website-pixel--forge--jain.vercel.app-purple)](https://pixel-forge-jain.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

PixelForge is a collection of 6 free AI-powered image tools that work directly in your browser.

## Tools

| Tool | Type | Description |
|------|------|-------------|
| 🎯 Background Removal | AI | Remove backgrounds instantly with AI |
| 🔍 Image Upscaler | AI | Enlarge images up to 4x without quality loss |
| 📸 Photo Restoration | AI | Restore old, damaged photos to HD |
| 📦 Image Compressor | Free | Compress PNG/JPG/WebP without visible loss |
| 🔄 Format Converter | Free | Convert between PNG, JPEG, WebP |
| ✂️ Image Cropper | Free | Crop to any size or aspect ratio |

## Pricing

- **Free**: 3 uses per tool per day
- **Pro**: $9.99/month — unlimited usage, HD quality, priority processing

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **AI Models**: Replicate (real-esrgan, rembg, GFPGAN)
- **Payments**: LemonSqueezy
- **Hosting**: Vercel
- **Analytics**: Vercel Analytics

## Features

- 🔒 Privacy-first — free tools run locally in your browser
- ⚡ Instant results — no queue, no waiting
- 🎨 Clean, responsive UI
- 🌙 Dark mode
- 📱 Mobile-friendly
- ♿ Accessible

## Local Development

```bash
git clone https://github.com/tianlanshuilan/pixelForge.git
cd pixelForge
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.local.example` to `.env.local`:

```env
REPLICATE_API_TOKEN=your_replicate_token
LEMONSQUEEZY_API_KEY=your_ls_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_VARIANT_ID=your_variant_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

## Deploy

Pushes to `main` auto-deploy to Vercel.

## License

MIT
