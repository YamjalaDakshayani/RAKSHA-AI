import { NextRequest, NextResponse } from "next/server";
import { FollowUpRequestSchema } from "@/lib/schemas";
import { answerFollowUpWithGemini, GeminiError } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";
import { getServerSessionUser } from "@/lib/supabaseServer";

export const runtime = "nodejs";

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = FollowUpRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid follow-up request", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const sessionUser = await getServerSessionUser();
    const clientIp = getClientIp(req);

    // Rate Limit check
    const rateLimit = await checkRateLimit({
      userId: sessionUser?.id,
      clientIp,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait a moment before asking another question.",
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let answer = "";

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // In offline/sample mode without API key, provide helpful contextual answer
      const q = data.question.toLowerCase();
      if (q.includes("deadline") || q.includes("date") || q.includes("last")) {
        answer = "The submission deadline is strictly indicated in the document summary above. Please check with your college office before the date expires.";
      } else if (q.includes("fee") || q.includes("pay") || q.includes("money")) {
        answer = "Official fees must only be paid through the official college portal or SBI Collect. Never pay to personal UPI accounts.";
      } else {
        answer = "This is not mentioned in the document. Please confirm directly with your college administrative counter.";
      }
    } else {
      answer = await answerFollowUpWithGemini({
        documentContext: data.documentContext,
        question: data.question,
        language: data.language,
        level: data.level,
        history: data.history,
      });
    }

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    if (err instanceof GeminiError) {
      return NextResponse.json(
        { error: err.userFriendlyMessage },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Unable to process follow-up question right now. Please try again." },
      { status: 500 }
    );
  }
}
