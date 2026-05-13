import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/feedback
 * Simple feedback collector. Logs to console for now,
 * can be extended to email or database.
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      message: string;
      page?: string;
      email?: string;
    };

    if (!body.message || body.message.trim().length < 3) {
      return NextResponse.json(
        { error: "Message too short" },
        { status: 400 },
      );
    }

    // Log to Vercel logs (viewable in Vercel dashboard → Logs)
    console.log(
      `[FEEDBACK] page=${body.page || "?"} email=${body.email || "?"} | ${body.message}`,
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
