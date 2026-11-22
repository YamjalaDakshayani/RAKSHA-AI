import { NextRequest, NextResponse } from "next/server";
import { askSafetyCoachWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, history = [] } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "A question or situation is required." },
        { status: 400 }
      );
    }

    if (prompt.length > 2500) {
      return NextResponse.json(
        { error: "Question exceeds maximum character limit of 2,500 characters." },
        { status: 400 }
      );
    }

    const { reply, is_local_demo } = await askSafetyCoachWithGemini(
      prompt.trim(),
      history
    );

    return NextResponse.json({
      success: true,
      reply,
      isLocalDemo: Boolean(is_local_demo),
    });
  } catch (err: any) {
    console.error("[RAKSHA AI] AI Safety Coach Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to consult AI Safety Coach." },
      { status: 500 }
    );
  }
}
