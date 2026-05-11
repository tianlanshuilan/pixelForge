import { NextRequest, NextResponse } from "next/server";
import { canUseTool, getUsage, incrementUsage } from "@/lib/usage";
import { isDemoMode, simulateProcessing } from "@/lib/demo";

/**
 * POST /api/remove-background
 *
 * Receives a FormData with an image file, sends it to Replicate for
 * background removal, and returns the processed image URL.
 *
 * Free tier: 3 uses per day per tool (tracked via cookie).
 */
export async function POST(request: NextRequest) {
  const toolName = "remove-background";

  // 1. Check usage
  const usage = await getUsage(toolName);
  if (usage.remaining <= 0) {
    return NextResponse.json(
      {
        error: "FREE_LIMIT_REACHED",
        message: `You've used all ${usage.limit} free background removals today. Upgrade to Pro for unlimited use.`,
        usage,
      },
      { status: 429 },
    );
  }

  // 2. Parse the uploaded file
  let imageUrl: string;
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 },
      );
    }

    // Convert File to base64 data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mime = file.type || "image/png";
    imageUrl = `data:${mime};base64,${base64}`;
  } else if (contentType.includes("application/json")) {
    // Allow sending image as a URL in JSON body
    const body = (await request.json()) as { imageUrl?: string };
    if (!body.imageUrl) {
      return NextResponse.json(
        { error: "No imageUrl in request body" },
        { status: 400 },
      );
    }
    imageUrl = body.imageUrl;
  } else {
    return NextResponse.json(
      { error: "Unsupported content type. Use multipart/form-data or application/json" },
      { status: 415 },
    );
  }

  // 3. Demo mode: skip Replicate, return original image
  if (isDemoMode()) {
    await simulateProcessing();
    const newUsage = await incrementUsage(toolName);
    return NextResponse.json({
      resultUrl: imageUrl,
      usage: newUsage,
      demo: true,
    });
  }

  // 4. Call Replicate
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;
  if (!replicateApiToken) {
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 503 },
    );
  }

  try {
    const prediction = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${replicateApiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // rmbg-1.4: best free background removal model on Replicate
        version:
          "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
        input: {
          image: imageUrl,
        },
      }),
    });

    if (!prediction.ok) {
      const errText = await prediction.text();
      console.error("Replicate API error:", errText);
      return NextResponse.json(
        { error: "AI processing failed" },
        { status: 502 },
      );
    }

    const predictionData = (await prediction.json()) as {
      id: string;
      output: string | null;
      status: string;
    };

    // Replicate may return immediately with status "processing"
    // Poll until done (with timeout)
    if (predictionData.status === "processing" || predictionData.status === "starting") {
      const result = await pollPrediction(predictionData.id, replicateApiToken);
      if (!result) {
        return NextResponse.json(
          { error: "AI processing timed out" },
          { status: 504 },
        );
      }

      // Increment usage on success
      const newUsage = await incrementUsage(toolName);
      return NextResponse.json({
        resultUrl: result,
        usage: newUsage,
      });
    }

    // If already completed
    if (predictionData.output) {
      const newUsage = await incrementUsage(toolName);
      return NextResponse.json({
        resultUrl: predictionData.output,
        usage: newUsage,
      });
    }

    return NextResponse.json(
      { error: "Unexpected prediction status: " + predictionData.status },
      { status: 500 },
    );
  } catch (err) {
    console.error("Background removal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function pollPrediction(
  predictionId: string,
  token: string,
  maxAttempts = 30,
  intervalMs = 1000,
): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));
    const res = await fetch(
      `https://api.replicate.com/v1/predictions/${predictionId}`,
      {
        headers: { Authorization: `Token ${token}` },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { status: string; output: string | null };
    if (data.status === "succeeded") return data.output as string;
    if (data.status === "failed" || data.status === "canceled") return null;
  }
  return null;
}

/** GET: return current usage for this tool */
export async function GET() {
  const usage = await getUsage("remove-background");
  return NextResponse.json(usage);
}
