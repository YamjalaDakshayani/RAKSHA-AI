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
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 }
    );
  }

  try {
    // 1. Fetch user analyses
    const { data: analyses } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", sessionUser.id)
      .order("created_at", { ascending: false });

    // 2. Fetch user chat threads with messages
    const { data: threads } = await supabase
      .from("chat_threads")
      .select("id, title, created_at, chat_messages(id, role, content, created_at)")
      .eq("user_id", sessionUser.id)
      .order("created_at", { ascending: false });

    const exportData = {
      user: {
        id: sessionUser.id,
        email: sessionUser.email,
        exportedAt: new Date().toISOString(),
      },
      analyses: analyses || [],
      chatThreads: threads || [],
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="nova_data_export_${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
