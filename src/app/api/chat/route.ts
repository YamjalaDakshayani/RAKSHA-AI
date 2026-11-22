import { NextRequest, NextResponse } from "next/server";
import { ChatRequestSchema } from "@/lib/schemas";
import { talkToNovaWithGemini, GeminiError } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rateLimit";
import {
  getServerSessionUser,
  createServerSupabaseClient,
} from "@/lib/supabaseServer";

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
    const parseResult = ChatRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid chat payload", details: parseResult.error.flatten() },
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
          error:
            "Nova is receiving many requests. Please wait a moment before sending another message.",
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let reply = "";

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      // Offline fallback demo answers
      const lower = data.message.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
        reply =
          data.language === "hi"
            ? "नमस्ते! मैं नोवा हूँ। मैं कॉलेज फॉर्म, छात्रवृत्ति और नोटिस को आसान भाषा में समझाने में आपकी मदद कर सकती हूँ।"
            : data.language === "te"
            ? "నమస్కారం! నేను నోవా. కాలేజీ నోటీసులు, స్కాలర్‌షిప్‌లు మరియు ఫారాలను సులభంగా అర్థం చేసుకోవడంలో నేను మీకు సహాయం చేయగలను."
            : data.language === "ta"
            ? "வணக்கம்! நான் நோவா. கல்லூரி அறிவிப்புகள், கல்வி உதவித்தொகை மற்றும் படிவங்களை எளிமையாக புரிந்து கொள்ள உங்களுக்கு உதவுவேன்."
            : "Hello! I am Nova, your college accessibility companion. Ask me anything about notices, scholarships, forms, or campus safety.";
      } else if (lower.includes("who are you") || lower.includes("what is nova")) {
        reply =
          "I am Nova, an AI assistant built for universal accessibility and inclusion. I help students and parents understand official letters and avoid fee scams.";
      } else {
        reply =
          data.language === "hi"
            ? "मैं आपकी बात समझ गई। किसी भी जरूरी फीस या स्कॉलरशिप के लिए हमेशा अपने कॉलेज कार्यालय से पुष्टि करें। क्या आपके पास कोई और सवाल है?"
            : data.language === "te"
            ? "మీరు చెప్పినది నాకు అర్థమైంది. ఏదైనా ముఖ్యమైన ఫీజు లేదా స్కాలర్‌షిప్ వివరాల కోసం ఎల్లప్పుడూ మీ కాలేజీ కార్యాలయాన్ని సంప్రదించండి."
            : data.language === "ta"
            ? "உங்கள் கேள்வி புரிந்தது. முக்கியமான கட்டணம் அல்லது உதவித்தொகை விவரங்களுக்கு எப்போதும் உங்கள் கல்லூரி அலுவலகத்தை அணுகவும்."
            : "I understand your question. For any important fee or scholarship deadlines, always verify directly with your college administration office. How else can I help?";
      }
    } else {
      reply = await talkToNovaWithGemini({
        message: data.message,
        language: data.language,
        level: data.level,
        documentContext: data.documentContext,
        history: data.history,
      });
    }

    // Save chat to Supabase if authenticated
    if (sessionUser?.id) {
      const supabase = createServerSupabaseClient();
      if (supabase) {
        try {
          // Find or create thread
          let threadId: string | null = null;
          const { data: existingThread } = await supabase
            .from("chat_threads")
            .select("id")
            .eq("user_id", sessionUser.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (existingThread) {
            threadId = existingThread.id;
          } else {
            const { data: newThread } = await supabase
              .from("chat_threads")
              .insert({
                user_id: sessionUser.id,
                title: "Voice Conversation with Nova",
              })
              .select("id")
              .single();
            if (newThread) {
              threadId = newThread.id;
            }
          }

          if (threadId) {
            await supabase.from("chat_messages").insert([
              {
                thread_id: threadId,
                role: "user",
                content: data.message,
              },
              {
                thread_id: threadId,
                role: "nova",
                content: reply,
              },
            ]);
          }
        } catch {
          // Ignore chat persistence errors gracefully
        }
      }
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    if (err instanceof GeminiError) {
      return NextResponse.json(
        { error: err.userFriendlyMessage },
        { status: err.statusCode }
      );
    }
    return NextResponse.json(
      { error: "Nova could not answer right now. Please try again." },
      { status: 500 }
    );
  }
}
