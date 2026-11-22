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
      { error: "Please sign in to view your saved history." },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ analyses: [] });
  }

  try {
    const { data, error } = await supabase
      .from("analyses")
      .select("id, title, created_at, language, reading_level, trust_verdict, deadline, input_type, saved_original_text, result")
      .eq("user_id", sessionUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ analyses: data || [] });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Could not fetch saved history." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
      .from("analyses")
      .delete()
      .eq("user_id", sessionUser.id);

    if (error) throw error;

    return NextResponse.json({ ok: true, message: "All history cleared." });
  } catch {
    return NextResponse.json(
      { error: "Could not clear history." },
      { status: 500 }
    );
  }
}
