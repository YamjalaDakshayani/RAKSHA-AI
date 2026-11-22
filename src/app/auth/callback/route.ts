import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/history";

  if (code) {
    const supabase = createServerSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          return NextResponse.redirect(`${origin}${next}`);
        }
      } catch {
        // Fallback to login with error notice
      }
    }
  }

  // Return to login with friendly error message if code exchange failed
  return NextResponse.redirect(
    `${origin}/login?error=That+link+has+expired.+We+can+send+a+new+one.`
  );
}
