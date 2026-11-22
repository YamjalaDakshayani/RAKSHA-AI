import { NextRequest, NextResponse } from "next/server";
import { analyzeUrlHeuristics } from "@/lib/linkAnalyzer";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, scanType = "link" } = body;

    if (!url || typeof url !== "string" || url.trim().length === 0) {
      return NextResponse.json(
        { error: "URL destination is required" },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    if (trimmedUrl.length > 2048) {
      return NextResponse.json(
        { error: "URL exceeds maximum permitted length of 2048 characters." },
        { status: 400 }
      );
    }

    const analysis = analyzeUrlHeuristics(trimmedUrl);

    // Save to database if Supabase configured & authenticated
    let savedToDatabase = false;
    try {
      const supabase = createServerSupabaseClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from("scans").insert({
            user_id: user.id,
            scan_type: scanType === "qr" ? "qr" : "link",
            submitted_content: trimmedUrl.slice(0, 500),
            risk_level: analysis.risk_level,
            risk_score: analysis.risk_score,
            findings: {
              domain: analysis.domain,
              protocol: analysis.protocol,
              is_https: analysis.is_https,
              is_shortener: analysis.is_shortener,
              is_ip_address: analysis.is_ip_address,
              is_suspicious_tld: analysis.is_suspicious_tld,
              warnings: analysis.warnings,
              explanation: analysis.explanation,
              recommendations: analysis.recommendations,
            },
            recommendation: analysis.recommendations[0] || "Do not visit unverified links",
          });
          if (!error) {
            savedToDatabase = true;
          }
        }
      }
    } catch (dbErr) {
      console.warn("[RAKSHA AI] Could not save link scan to Supabase:", dbErr);
    }

    return NextResponse.json({
      success: true,
      analysis,
      savedToDatabase,
    });
  } catch (err: any) {
    console.error("[RAKSHA AI] Link Scan API Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze link" },
      { status: 500 }
    );
  }
}
