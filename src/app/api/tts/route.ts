import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
};

function createWavPcm(pcmBase64: string, sampleRate = 24000): string {
  const pcm = Buffer.from(pcmBase64, "base64");
  const wav = Buffer.alloc(44 + pcm.length);
  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + pcm.length, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(pcm.length, 40);
  pcm.copy(wav, 44);
  return wav.toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const language =
      typeof body.language === "string" && body.language in LANGUAGE_NAMES
        ? body.language
        : "en";

    if (!text) {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }
    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Speech text is too long. Please listen to a shorter section." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          error:
            "Cloud speech is unavailable because GEMINI_API_KEY is not configured.",
        },
        { status: 503 }
      );
    }

    const model =
      process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Read the following naturally in ${LANGUAGE_NAMES[language]}, preserving punctuation and pronunciation:\n\n${text}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: "Kore" },
              },
            },
          },
        }),
      }
    );
    const response = await apiResponse.json();
    if (!apiResponse.ok) {
      const detail =
        response?.error?.message ||
        `Gemini TTS returned HTTP ${apiResponse.status}.`;
      return NextResponse.json(
        { error: `Cloud speech generation failed: ${detail}` },
        { status: apiResponse.status === 429 ? 429 : 502 }
      );
    }

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        const inline = part.inlineData;
        if (!inline?.data) continue;
        const mime = inline.mimeType || "audio/wav";
        if (mime.includes("L16") || mime.includes("pcm")) {
          return NextResponse.json({
            audioBase64: createWavPcm(inline.data),
            mimeType: "audio/wav",
          });
        }
        return NextResponse.json({
          audioBase64: inline.data,
          mimeType: mime,
        });
      }
    }

    return NextResponse.json(
      { error: "Gemini did not return generated speech audio." },
      { status: 502 }
    );
  } catch (error) {
    console.error("TTS generation failed:", error);
    const detail = error instanceof Error ? error.message : "Unknown TTS error";
    return NextResponse.json(
      { error: `Cloud speech generation failed: ${detail}` },
      { status: 502 }
    );
  }
}
