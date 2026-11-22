import { NextRequest, NextResponse } from "next/server";
import {
  getServerSessionUser,
  createServerSupabaseClient,
} from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  try {
    const { error } = await supabase
      .from("chat_threads")
      .delete()
      .eq("id", params.id)
      .eq("user_id", sessionUser.id);

    if (error) throw error;

    return NextResponse.json({ ok: true, message: "Thread deleted." });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete thread." },
      { status: 500 }
    );
  }
}
