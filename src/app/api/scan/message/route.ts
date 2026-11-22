
import { NextRequest, NextResponse } from "next/server";
import { analyzeThreatWithGemini, GeminiError } from "@/lib/gemini";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    if (message.length > 10000) {
      return NextResponse.json(
        { error: "Message exceeds maximum character limit of 10,000 characters." },
        { status: 400 }
      );
    }

    // Measure Gemini analysis time
    console.time("[RAKSHA AI] Gemini analysis");

    const result = await analyzeThreatWithGemini(message.trim());

    console.timeEnd("[RAKSHA AI] Gemini analysis");

    // Measure database save time
    console.time("[RAKSHA AI] Database save");

    let savedToDatabase = false;

    try {
      const supabase = createServerSupabaseClient();

      if (supabase) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error } = await supabase.from("scans").insert({
            user_id: user.id,
            scan_type: "message",
            submitted_content: message.slice(0, 500),
            risk_level: result.risk_level,
            risk_score: result.risk_score,
            findings: {
              summary: result.summary,
              suspicious_indicators: result.suspicious_indicators,
              suspicious_phrases: result.suspicious_phrases,
              warning_signs: result.warning_signs,
              explanation: result.explanation,
              recommended_actions: result.recommended_actions,
            },
            recommendation:
              result.recommended_actions[0] || "Review warnings carefully",
          });

          if (!error) {
            savedToDatabase = true;
          } else {
            console.warn("[RAKSHA AI] Database insert failed:", error);
          }
        }
      }
    } catch (dbErr) {
      console.warn("[RAKSHA AI] Could not save scan to Supabase:", dbErr);
    }

    console.timeEnd("[RAKSHA AI] Database save");

    return NextResponse.json({
      success: true,
      analysis: result,
      savedToDatabase,
      isLocalDemo: Boolean(result.is_local_demo),
    });
  } catch (err: unknown) {
    console.error("[RAKSHA AI] Message Scan API Error:", err);

    if (err instanceof GeminiError) {
      return NextResponse.json(
        { error: err.userFriendlyMessage },
        { status: err.statusCode }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze message threat. Please try again." },
      { status: 500 }
    );
  }
}
