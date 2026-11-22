import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function GET() {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.trim() !== "" &&
      process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  );

  const supabaseConfigured = isSupabaseConfigured();

  return NextResponse.json({
    ok: true,
    geminiConfigured,
    supabaseConfigured,
    timestamp: new Date().toISOString(),
  });
}
