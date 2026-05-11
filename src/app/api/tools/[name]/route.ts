import { NextResponse } from "next/server";
import { getUsage, incrementUsage } from "@/lib/usage";

/**
 * GET /api/tools/[name]/usage
 * Simple usage tracking endpoint for client-side tools
 * (compression, conversion, cropping — no server AI needed)
 */

const VALID_TOOLS = ["image-compress", "format-convert", "image-crop"];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!VALID_TOOLS.includes(name)) {
    return NextResponse.json({ error: "Unknown tool" }, { status: 404 });
  }
  return NextResponse.json(await getUsage(name));
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!VALID_TOOLS.includes(name)) {
    return NextResponse.json({ error: "Unknown tool" }, { status: 404 });
  }

  const usage = await getUsage(name);
  if (usage.remaining <= 0) {
    return NextResponse.json(
      { error: "FREE_LIMIT_REACHED", usage },
      { status: 429 },
    );
  }

  const newUsage = await incrementUsage(name);
  return NextResponse.json({ usage: newUsage });
}
