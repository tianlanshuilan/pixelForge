import { NextRequest, NextResponse } from "next/server";
import { canUseTool, getUsage, incrementUsage } from "@/lib/usage";
import { isDemoMode, simulateProcessing } from "@/lib/demo";

const TOOL_NAME = "image-upscaler";

/**
 * POST /api/image-upscaler
 * Upscales an image using Real-ESRGAN via Replicate.
 */
export async function POST(request: NextRequest) {
  const usage = await getUsage(TOOL_NAME);
  if (usage.remaining <= 0) {
    return NextResponse.json(
      {
        error: "FREE_LIMIT_REACHED",
        message: `You've used all ${usage.limit} free upscales today. Upgrade to Pro for unlimited use.`,
        usage,
      },
      { status: 429 },
    );
  }

  let imageUrl: string;
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    if (!file)
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mime = file.type || "image/png";
    imageUrl = `data:${mime};base64,${base64}`;
  } else if (contentType.includes("application/json")) {
    const body = (await request.json()) as { imageUrl?: string };
    if (!body.imageUrl)
      return NextResponse.json({ error: "No imageUrl in request body" }, { status: 400 });
    imageUrl = body.imageUrl;
  } else {
    return NextResponse.json(
      { error: "Unsupported content type" },
      { status: 415 },
    );
  }

  // Demo mode: skip Replicate
  if (isDemoMode()) {
    await simulateProcessing();
    const newUsage = await incrementUsage(TOOL_NAME);
    return NextResponse.json({ resultUrl: imageUrl, usage: newUsage, demo: true });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token)
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });

  try {
    const prediction = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8",
        input: {
          image: imageUrl,
          scale: 4,
          face_enhance: true,
        },
      }),
    });

    if (!prediction.ok)
      return NextResponse.json({ error: "AI processing failed" }, { status: 502 });

    const data = (await prediction.json()) as {
      id: string; output: string | null; status: string;
    };

    let output: string | null = data.output;

    if (data.status === "processing" || data.status === "starting") {
      output = await pollPrediction(data.id, token);
      if (!output)
        return NextResponse.json({ error: "AI processing timed out" }, { status: 504 });
    }

    if (output) {
      const newUsage = await incrementUsage(TOOL_NAME);
      return NextResponse.json({ resultUrl: output, usage: newUsage });
    }

    return NextResponse.json({ error: "Unexpected status" }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function pollPrediction(id: string, token: string): Promise<string | null> {
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { status: string; output: string | null };
    if (data.status === "succeeded") return data.output as string;
    if (data.status === "failed" || data.status === "canceled") return null;
  }
  return null;
}

export async function GET() {
  return NextResponse.json(await getUsage(TOOL_NAME));
}
