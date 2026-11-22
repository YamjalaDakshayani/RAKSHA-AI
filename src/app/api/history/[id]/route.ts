import { NextRequest, NextResponse } from "next/server";
import {
  getServerSessionUser,
  createServerSupabaseClient,
} from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser?.id) {
    return NextResponse.json(
      { error: "Please sign in to view this item." },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  try {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", sessionUser.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ item: data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

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
      .from("analyses")
      .delete()
      .eq("id", params.id)
      .eq("user_id", sessionUser.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, message: "Item deleted." });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
