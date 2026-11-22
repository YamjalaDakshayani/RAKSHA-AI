import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        configured: false,
        scans: [],
        message: "Supabase credentials not configured. Local Demo Mode active.",
      });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        configured: false,
        scans: [],
        message: "Supabase client initialization failed.",
      });
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({
        configured: true,
        authenticated: false,
        scans: [],
        message: "User not authenticated. Showing local scans if available.",
      });
    }

    const { data: scans, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      configured: true,
      authenticated: true,
      scans: scans || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch scan history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        saved: false,
        message: "Supabase not configured. Saved to client storage instead.",
      });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({
        saved: false,
        message: "User not authenticated. Saved to client storage instead.",
      });
    }

    const body = await req.json();
    const { scan_type, submitted_content, risk_level, risk_score, findings, recommendation } = body;

    const { data, error } = await supabase.from("scans").insert({
      user_id: user.id,
      scan_type,
      submitted_content: (submitted_content || "").slice(0, 500),
      risk_level,
      risk_score,
      findings: findings || {},
      recommendation: recommendation || "Review security guidance",
    }).select().single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ saved: true, scan: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
