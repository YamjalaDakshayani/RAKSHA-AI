import { NextRequest, NextResponse } from "next/server";
import {
  getServerSessionUser,
  createServerSupabaseClient,
} from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ threads: [] });
  }

  try {
    const { data: threads, error } = await supabase
      .from("chat_threads")
      .select("id, title, created_at, chat_messages(id, role, content, created_at)")
      .eq("user_id", sessionUser.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ threads: threads || [] });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch chat threads." },
      { status: 500 }
    );
  }
}
