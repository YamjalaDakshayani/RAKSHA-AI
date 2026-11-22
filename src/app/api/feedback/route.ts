import { NextRequest, NextResponse } from "next/server";
import { FeedbackRequestSchema } from "@/lib/schemas";
import { getServerSessionUser, createServiceRoleClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = FeedbackRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid feedback payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { analysisId, rating, comment } = parseResult.data;
    const sessionUser = await getServerSessionUser();
    const serviceClient = createServiceRoleClient();

    if (serviceClient) {
      try {
        await serviceClient.from("feedback").insert({
          user_id: sessionUser?.id || null,
          analysis_id: analysisId || null,
          rating,
          comment: comment || null,
        });
      } catch {
        // Ignore DB error for feedback
      }
    }

    return NextResponse.json({ ok: true, message: "Feedback recorded" });
  } catch {
    return NextResponse.json({ ok: true }); // Always return friendly ok
  }
}
