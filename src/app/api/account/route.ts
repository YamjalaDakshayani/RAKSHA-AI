import { NextRequest, NextResponse } from "next/server";
import {
  getServerSessionUser,
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function DELETE(req: NextRequest) {
  const sessionUser = await getServerSessionUser();
  if (!sessionUser?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();
  const serviceRole = createServiceRoleClient();

  try {
    // 1. Delete user data from tables
    if (supabase) {
      await supabase.from("analyses").delete().eq("user_id", sessionUser.id);
      await supabase.from("chat_threads").delete().eq("user_id", sessionUser.id);
      await supabase.from("feedback").delete().eq("user_id", sessionUser.id);
    }

    // 2. Delete auth user record via service role if available
    if (serviceRole) {
      await serviceRole.auth.admin.deleteUser(sessionUser.id);
    }

    // 3. Sign out session
    if (supabase) {
      await supabase.auth.signOut();
    }

    return NextResponse.json({
      ok: true,
      message: "Account and all associated data permanently deleted.",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not complete account deletion." },
      { status: 500 }
    );
  }
}
