import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema } from "@/lib/schemas";
import { analyzeDocumentWithGemini, GeminiError } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  getServerSessionUser,
  createServerSupabaseClient,
  createServiceRoleClient,
} from "@/lib/supabaseServer";
import {
  SAMPLE_DOCUMENTS,
  getCachedSampleResult,
  SampleDocument,
} from "@/lib/samples";

export const runtime = "nodejs";

// Extract client IP address securely
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks if submitted text corresponds to one of the 3 cached samples
 */
function findMatchingSample(text?: string): SampleDocument | null {
  if (!text) return null;
  const normalized = text.trim().toLowerCase();

  for (const sample of SAMPLE_DOCUMENTS) {
    // Check by raw text match or key snippet
    const sampleNorm = sample.rawText.trim().toLowerCase();
    if (
      normalized === sampleNorm ||
      (sample.id === "scholarship" &&
        normalized.includes("commissioner of collegiate education") &&
        normalized.includes("post-matric")) ||
      (sample.id === "exam_fee" &&
        normalized.includes("controller of examinations") &&
        normalized.includes("sbi collect")) ||
      (sample.id === "scam_alert" &&
        normalized.includes("scholarship will be permanently cancelled today") &&
        normalized.includes("500"))
    ) {
      return sample;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await req.json();
    const parseResult = AnalyzeRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Validate image size if provided (5 MB limit decoded)
    if (data.imageBase64) {
      const stringLength = data.imageBase64.length;
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383687;
      if (sizeInBytes > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            error: "Image exceeds 5 MB limit. Please use a smaller or compressed photo.",
          },
          { status: 400 }
        );
      }
    }

    // Verify authenticated user on the server (never trust client)
    const sessionUser = await getServerSessionUser();
    const clientIp = getClientIp(req);

    // Rate Limiting
    const rateLimit = await checkRateLimit({
      userId: sessionUser?.id,
      clientIp,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "You have made too many requests. Please wait a moment before trying again.",
          retryAfter: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    // Check if input matches one of our 3 precomputed samples
    const matchingSample = findMatchingSample(data.text);
    let result;

    if (matchingSample) {
      result = getCachedSampleResult(
        matchingSample.id,
        data.language,
        data.level
      );
    } else {
      // If no API key configured, check if user provided sample text or fall back to sample
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "your_gemini_api_key_here") {
        // Return friendly offline/demo sample response
        result = getCachedSampleResult("scholarship", data.language, data.level);
      } else {
        result = await analyzeDocumentWithGemini({
          text: data.text,
          imageBase64: data.imageBase64,
          imageMime: data.imageMime,
          language: data.language,
          level: data.level,
        });
      }
    }

    const durationMs = Date.now() - startTime;
    let savedAnalysisId: string | undefined = undefined;

    // Save to Supabase for signed-in users (NEVER save images)
    if (sessionUser?.id) {
      const supabase = createServerSupabaseClient();
      if (supabase) {
        try {
          const inputType = data.imageBase64 ? "image" : "text";
          const { data: inserted, error: insertErr } = await supabase
            .from("analyses")
            .insert({
              user_id: sessionUser.id,
              title: result.title,
              input_type: inputType,
              language: data.language,
              reading_level: data.level,
              trust_verdict: result.trust_check.verdict,
              deadline: result.deadline,
              result: result,
              saved_original_text: data.saveOriginalText ? data.text : null,
              duration_ms: durationMs,
            })
            .select("id")
            .single();

          if (!insertErr && inserted) {
            savedAnalysisId = inserted.id;
          }
        } catch {
          // Log or handle gracefully without failing user request
        }
      }
    }

    // Anonymous analytics row (no text, no image, no user id)
    const serviceClient = createServiceRoleClient();
    if (serviceClient) {
      try {
        await serviceClient.from("analyses").insert({
          user_id: null,
          title: "Anonymous Analysis",
          input_type: data.imageBase64 ? "image" : "text",
          language: data.language,
          reading_level: data.level,
          trust_verdict: result.trust_check.verdict,
          deadline: result.deadline,
          result: { verdict: result.trust_check.verdict },
          saved_original_text: null,
          duration_ms: durationMs,
        });
      } catch {
        // Ignore analytics failure
      }
    }

    return NextResponse.json(
      {
        result,
        analysisId: savedAnalysisId,
        cached: Boolean(matchingSample),
      },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (err: unknown) {
    if (err instanceof GeminiError) {
      return NextResponse.json(
        {
          error: err.userFriendlyMessage,
          isQuota: err.isQuotaError,
        },
        { status: err.statusCode }
      );
    }

    return NextResponse.json(
      {
        error:
          "Nova is unable to analyze this document right now. Please try again in a few moments.",
      },
      { status: 500 }
    );
  }
}
