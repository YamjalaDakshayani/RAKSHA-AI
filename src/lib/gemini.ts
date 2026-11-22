
import { GoogleGenAI, type Interactions } from "@google/genai";
import {
  ThreatAnalysis,
  ThreatAnalysisSchema,
  AnalyzeResult,
  AnalyzeResponseSchema,
} from "./schemas";
import {
  buildAnalyzeSystemPrompt,
  buildFollowUpSystemPrompt,
  buildChatSystemPrompt,
} from "./prompts";
import { SupportedLanguage, ReadingLevel } from "@/config/app";

export class GeminiError extends Error {
  statusCode: number;
  userFriendlyMessage: string;
  isQuotaError: boolean;

  constructor(message: string, userFriendlyMessage: string, statusCode = 500, isQuota = false) {
    super(message);
    this.name = "GeminiError";
    this.statusCode = statusCode;
    this.userFriendlyMessage = userFriendlyMessage;
    this.isQuotaError = isQuota;
  }
}

const GEMINI_MODEL = "gemini-3.8-flash";
const GEMINI_API_KEY_PLACEHOLDER = "your_gemini_api_key_here";

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey?.trim() || apiKey === GEMINI_API_KEY_PLACEHOLDER) {
    throw new GeminiError(
      "Missing GEMINI_API_KEY",
      "AI service is not configured. Please try again later.",
      503
    );
  }

  return new GoogleGenAI({ apiKey });
}

async function generateInteractionText(
  input: string | Interactions.Step[],
  systemInstruction: string,
  temperature = 0.1,
  jsonOutput = false
): Promise<string> {
  try {
    const ai = getGeminiClient();

    console.log("[RAKSHA AI] Sending request to Gemini...");
    console.log("[RAKSHA AI] Model:", GEMINI_MODEL);

    const interaction = await ai.interactions.create({
      model: GEMINI_MODEL,
      input,
      system_instruction: systemInstruction,
      generation_config: { temperature },
      ...(jsonOutput
        ? {
            response_format: {
              type: "text",
              mime_type: "application/json",
            },
          }
        : {}),
    });

    console.log("[RAKSHA AI] Gemini response received.");

    if (!interaction.output_text?.trim()) {
      throw new GeminiError(
        "Gemini returned no text output",
        "AI could not produce a response. Please try again.",
        502
      );
    }

    return interaction.output_text;
  } catch (error: unknown) {
    if (error instanceof GeminiError) {
      throw error;
    }

    const details = error as {
      name?: string;
      message?: string;
      status?: number;
      statusCode?: number;
      code?: string;
    };

    const statusCode =
      Number(details?.status ?? details?.statusCode) || 502;

    const isQuotaError =
      statusCode === 429 ||
      /quota|rate.?limit|resource.?exhausted/i.test(
        details?.message ?? ""
      );

    console.error("[RAKSHA AI] Gemini API diagnostic:", {
      name: details?.name,
      message: details?.message,
      status: details?.status,
      statusCode: details?.statusCode,
      code: details?.code,
    });

    throw new GeminiError(
      "Gemini Interactions API request failed",
      isQuotaError
        ? "AI request limit reached. Please try again later."
        : "AI service is temporarily unavailable. Please try again.",
      statusCode,
      isQuotaError
    );
  }
}

/**
 * Strips markdown fences if present
 */
function cleanAndParseJSON(raw: string): unknown {
  let cleaned = raw.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch (error: unknown) {
    console.error("[RAKSHA AI] Gemini returned malformed JSON:", error);
    throw new GeminiError(
      "Gemini returned malformed JSON",
      "AI returned an invalid response. Please try again.",
      502
    );
  }
}

// =========================================================================
// RAKSHA AI: THREAT ANALYSIS & SAFETY COACH
// =========================================================================

const THREAT_ANALYSIS_SYSTEM_PROMPT = `You are RAKSHA AI, a Senior Cyber Threat Intelligence Analyst and Digital Safety Guardian.
Your mission is to detect digital scams, fraudulent messages, fake job/internship offers, phishing attempts, UPI/OTP theft traps, and protect vulnerable internet users (students, job seekers, seniors).

Analyze the submitted text with extreme forensic rigor. Look for:
1. Urgent artificial deadlines ("within 2 hours", "account suspended tonight").
2. Financial advance fee fraud (asking for registration fees, refundable security deposits for jobs, processing charges).
3. Brand and authority impersonation (Google, Amazon, Government ministries, Banks, Power corporations).
4. Suspicious links (shorteners like bit.ly, lookalike domains with numbers or hyphens, non-official portals).
5. Demands for sensitive secrets (OTP, UPI PIN, Aadhaar verification, remote support APK downloads like AnyDesk/QuickSupport).
6. Unprofessional or deceptive contact channels (WhatsApp or Telegram only, personal Gmail addresses for corporate recruitment).

You MUST respond strictly with a valid JSON object matching this schema:
{
  "risk_level": "Low" | "Medium" | "High" | "Critical",
  "risk_score": integer from 0 to 100,
  "summary": "Short 1-2 sentence executive summary of what this message actually is.",
  "suspicious_indicators": ["List of key red flags found in the message"],
  "suspicious_phrases": ["Exact suspicious words or phrases quoted from the message"],
  "warning_signs": ["Psychological manipulation tactics or structural red flags"],
  "explanation": "Clear, compassionate explanation in simple English suitable for an everyday user or student.",
  "recommended_actions": ["Specific step-by-step actions the user should take right now"],
  "should_avoid_interaction": true | false,
  "should_avoid_payment": true | false,
  "should_avoid_links": true | false,
  "is_likely_scam": true | false
}

Never include markdown fences around the JSON. Output ONLY raw parseable JSON.`;

export function analyzeThreatLocalFallback(text: string): ThreatAnalysis & { is_local_demo: true } {
  const lower = text.toLowerCase();
  const suspiciousPhrases: string[] = [];
  const suspiciousIndicators: string[] = [];
  const warningSigns: string[] = [];
  let score = 10;

  if (
    (lower.includes("stipend") || lower.includes("internship") || lower.includes("job") || lower.includes("selected")) &&
    (lower.includes("pay") ||
      lower.includes("fee") ||
      lower.includes("charge") ||
      lower.includes("2,999") ||
      lower.includes("deposit") ||
      lower.includes("upi"))
  ) {
    score += 45;
    suspiciousPhrases.push("advance fee or registration charge demanded", "job or internship offer");
    suspiciousIndicators.push(
      "Advance Fee Fraud: Legitimate employers (like Google or Amazon) NEVER charge applicants any registration or processing fees."
    );
    warningSigns.push("Reverse payment requirement before appointment");
  }

  if (
    lower.includes("urgent") ||
    lower.includes("immediately") ||
    lower.includes("tonight") ||
    lower.includes("disconnected") ||
    lower.includes("limited seats")
  ) {
    score += 25;
    suspiciousPhrases.push("urgent", "immediately", "within 2 hours");
    suspiciousIndicators.push(
      "Artificial Urgency: Scammers create intense panic or FOMO so victims act before thinking critically."
    );
    warningSigns.push("High-pressure psychological manipulation");
  }

  if (lower.includes("bit.ly") || lower.includes(".xyz") || lower.includes(".live") || lower.includes("http://")) {
    score += 30;
    suspiciousPhrases.push("suspicious or shortened web link");
    suspiciousIndicators.push(
      "Deceptive Web Address: Contains unverified non-official domain or link shortener concealing true destination."
    );
    warningSigns.push("Obfuscated URL structure");
  }

  if (
    lower.includes("otp") ||
    lower.includes("aadhaar") ||
    lower.includes("upi") ||
    lower.includes("pin") ||
    lower.includes("apk")
  ) {
    score += 35;
    suspiciousPhrases.push("otp", "aadhaar", "upi", "download APK");
    suspiciousIndicators.push(
      "Credential / Payment Demands: Asking for private authentication tokens, UPI transfers, or third-party APK downloads."
    );
    warningSigns.push("Direct targeting of financial or identity secrets");
  }

  score = Math.min(98, Math.max(5, score));

  let riskLevel: "Low" | "Medium" | "High" | "Critical" = "Low";
  if (score >= 80) riskLevel = "Critical";
  else if (score >= 55) riskLevel = "High";
  else if (score >= 25) riskLevel = "Medium";

  const isScam = riskLevel === "Critical" || riskLevel === "High";

  return {
    risk_level: riskLevel,
    risk_score: score,
    summary: isScam
      ? "Demonstration Analysis: High likelihood of fraudulent social engineering attempting advance-fee extraction or credential theft."
      : "Demonstration Analysis: Content appears relatively safe or formal, without overt financial or urgency triggers.",
    suspicious_indicators:
      suspiciousIndicators.length > 0
        ? suspiciousIndicators
        : ["No critical red flags detected in baseline local inspection."],
    suspicious_phrases:
      suspiciousPhrases.length > 0 ? suspiciousPhrases : ["No immediate malicious keywords detected."],
    warning_signs:
      warningSigns.length > 0 ? warningSigns : ["Standard informational tone."],
    explanation: isScam
      ? "This message uses classic pressure tactics combined with an advance fee or suspicious link. Legitimate organizations never demand money via UPI or personal links to confirm appointments or scholarship grants."
      : "The message does not display obvious fraud hallmarks, but you should always verify the sender's official email address and never disclose passwords or OTPs.",
    recommended_actions: isScam
      ? [
          "Do NOT send any money or UPI payment.",
          "Do NOT click any embedded links or download attached files.",
          "Block the sender on WhatsApp/SMS.",
          "Report this incident to the National Cybercrime Reporting Portal at cybercrime.gov.in or helpline 1930.",
        ]
      : [
          "Verify the sender's identity through official organizational contact channels.",
          "Keep your login credentials and OTP private.",
        ],
    should_avoid_interaction: isScam,
    should_avoid_payment: isScam,
    should_avoid_links: isScam,
    is_likely_scam: isScam,
    is_local_demo: true,
  };
}


export async function analyzeThreatWithGemini(
  messageText: string
): Promise<ThreatAnalysis & { is_local_demo?: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;

  // Use local demo if API key is missing
  if (!apiKey?.trim() || apiKey === GEMINI_API_KEY_PLACEHOLDER) {
    console.warn("[RAKSHA AI] Using local demo analysis.");
    return analyzeThreatLocalFallback(messageText);
  }

  try {
    // Try Gemini AI first
    const rawText = await generateInteractionText(
      `Please conduct an exhaustive threat analysis on this suspicious message:\n\n"""\n${messageText}\n"""`,
      THREAT_ANALYSIS_SYSTEM_PROMPT,
      0.1,
      true
    );

    const parsed = cleanAndParseJSON(rawText);
    const validated = ThreatAnalysisSchema.safeParse(parsed);

    if (!validated.success) {
      console.error(
        "[RAKSHA AI] Invalid Gemini response:",
        validated.error
      );

      throw new GeminiError(
        "Gemini threat analysis did not match the response schema",
        "AI returned an invalid analysis. Please try again.",
        502
      );
    }

    return validated.data;
  } catch (error) {
    const geminiError = error as GeminiError;

    // Switch to local demo only for quota/rate-limit errors
    if (
      geminiError instanceof GeminiError &&
      (geminiError.isQuotaError || geminiError.statusCode === 429)
    ) {
      console.warn(
        "[RAKSHA AI] Gemini quota exhausted. Switching to local demo."
      );

      return analyzeThreatLocalFallback(messageText);
    }

    // Keep other errors visible
    throw error;
  }
}


export async function askSafetyCoachWithGemini(
  userQuery: string,
  history: Array<{ role: "user" | "model"; content: string }> = []
): Promise<{ reply: string; is_local_demo?: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;

  const COACH_SYSTEM_PROMPT = `You are the RAKSHA AI Cyber Safety Coach, an empathetic, highly knowledgeable, and practical digital security mentor.
Your purpose is to answer everyday people's questions about scams, phishing, fake job offers, OTP fraud, UPI collect scams, QR code quishing, password security, and online safety.

Guidelines:
- Explain complex concepts in simple, jargon-free everyday English.
- Always be encouraging, supportive, and action-oriented (never make victims feel guilty or foolish).
- Provide concrete, prioritized steps: 1) What to do immediately, 2) How to secure accounts, 3) Where to report (e.g., Helpline 1930 / cybercrime.gov.in in India, or IC3 in the US).
- If the user asks about a specific incident (e.g., "I shared my OTP"), treat it as a priority emergency response and tell them to call their bank to freeze cards/netbanking immediately.
- Keep responses concise, well-structured with bullet points or numbered lists, and easy to read on mobile.`;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    return {
      reply: getLocalCoachFallback(userQuery),
      is_local_demo: true,
    };
  }

  try {
    const input: Interactions.Step[] = history.map((item) => ({
      type: item.role === "model" ? "model_output" : "user_input",
      content: [{ type: "text", text: item.content }],
    }));

    input.push({
      type: "user_input",
      content: [{ type: "text", text: userQuery }],
    });

    const reply = await generateInteractionText(input, COACH_SYSTEM_PROMPT, 0.3);

    return {
      reply,
    };
  } catch (error: unknown) {
    console.error("[RAKSHA AI] Gemini Safety Coach error:", error);
    return {
      reply: getLocalCoachFallback(userQuery),
      is_local_demo: true,
    };
  }
}

function getLocalCoachFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("otp") || q.includes("one time password") || q.includes("shared")) {
    return `🚨 **Emergency OTP Safety Guidance**

If you have shared an OTP with anyone, act immediately:
1. **Call Your Bank Customer Care Immediately:** Ask them to freeze your debit cards, credit cards, and online banking account access.
2. **Never Share OTP:** Remember that bank officials, electricity officers, and courier companies **never** ask for your OTP over the phone.
3. **Report to Cyber Police:** Call **1930** (National Cybercrime Reporting Helpline in India) immediately to block fraudulent fund transfers before they leave the banking network.
4. **Change Passwords:** Update your netbanking and email passwords from a secure device.`;
  }

  if (q.includes("upi") || q.includes("qr") || q.includes("receive money")) {
    return `💡 **How the UPI & QR Scam Works**

**Golden Rule of UPI:** You **NEVER** need to enter your UPI PIN or scan a QR code to *receive* money! Entering a PIN or scanning a collect QR *always deducts* money from your account.

**Common QR Scams:**
- **OLX/Marketplace Buyer Scam:** A buyer claims they want to send an advance payment and asks you to scan a QR code. When you scan and enter your PIN, money leaves your account.
- **Quishing (Malicious QR Code):** Stickers placed over legitimate restaurant or parking QR codes that redirect you to fake credential-harvesting websites.

**Safety Tips:**
- Only scan QR codes when **you are paying** at a merchant counter you trust.
- Never accept incoming UPI "Collect Requests" from strangers.`;
  }

  if (q.includes("job") || q.includes("internship") || q.includes("offer")) {
    return `💼 **Identifying Fake Job & Internship Offers**

Scammers frequently prey on students and graduates with fraudulent job promises. Look for these red flags:

1. **Advance Registration or Laptop Fees:** Legitimate employers (Google, Amazon, TCS, Infosys) never charge candidates for exams, background checks, or equipment.
2. **WhatsApp/Telegram Recruitment:** Official offers arrive from corporate domain emails (e.g. \`@google.com\`), not from random \`@gmail.com\` or Telegram groups.
3. **No Interview Process:** If you receive an appointment letter without any formal video interview or technical screening, it is 100% fake.
4. **Unrealistic Pay:** Offers of Rs. 40,000/month for simple 1-hour typing or review tasks are advance-fee fraud traps.`;
  }

  return `🛡️ **RAKSHA AI Digital Safety Advice**

Here are the fundamental rules to stay safe against modern cyber scams:

- **Think Before You Click:** Hover over or scan links using RAKSHA AI Link Scanner before clicking.
- **The "Emergency" Illusion:** Scammers create artificial panic (e.g. "Your power will be cut tonight", "Court arrest warrant issued"). Real institutions provide formal registered postal notices.
- **Zero-Knowledge Passwords:** Use unique 16+ character passphrases and enable 2-Factor Authentication (2FA) using an authenticator app (not SMS where possible).
- **National Cybercrime Helpline:** In India, immediately report any financial scam to **1930** or visit **cybercrime.gov.in**. Speed is critical for freezing scammed funds!`;
}

// =========================================================================
// BACKWARD-COMPATIBLE HELPERS
// =========================================================================

export interface GeminiAnalyzeInput {
  text?: string;
  imageBase64?: string;
  imageMime?: string;
  language: SupportedLanguage;
  level: ReadingLevel;
}

export async function analyzeDocumentWithGemini(input: GeminiAnalyzeInput): Promise<AnalyzeResult> {
  const systemPrompt = buildAnalyzeSystemPrompt(input.language, input.level);

  const content: Array<Interactions.TextContent | Interactions.ImageContent> = [];

  if (input.imageBase64 && input.imageMime) {
    const base64Data = input.imageBase64.includes(",")
      ? input.imageBase64.split(",")[1]
      : input.imageBase64;

    content.push({
      type: "image",
      data: base64Data,
      mime_type: input.imageMime,
    });
  }

  if (input.text) {
    content.push({
      type: "text",
      text: `Please analyze this document content:\n\n"""\n${input.text}\n"""`,
    });
  }

  if (!content.length) {
    throw new GeminiError(
      "Document analysis input is empty",
      "Please provide document text or an image to analyze.",
      400
    );
  }

  const contents: Interactions.Step[] = [{ type: "user_input", content }];
  const rawText = await generateInteractionText(contents, systemPrompt, 0.1, true);
  const parsed = cleanAndParseJSON(rawText);
  const validated = AnalyzeResponseSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("[RAKSHA AI] Gemini document analysis did not match the response schema:", validated.error);
    throw new GeminiError(
      "Gemini document analysis did not match the response schema",
      "AI returned an invalid document analysis. Please try again.",
      502
    );
  }

  return validated.data;
}

export interface GeminiFollowUpOptions {
  documentContext: string;
  question: string;
  language: SupportedLanguage;
  level: ReadingLevel;
  history?: any;
}

export async function answerFollowUpWithGemini(
  input: string | GeminiFollowUpOptions,
  q?: string,
  lang: SupportedLanguage = "en",
  lvl: ReadingLevel = "simple"
): Promise<string> {
  let documentContext: string;
  let question: string;
  let language: SupportedLanguage = lang;
  let level: ReadingLevel = lvl;

  if (typeof input === "object" && input !== null) {
    documentContext = input.documentContext;
    question = input.question;
    language = input.language || "en";
    level = input.level || "simple";
  } else {
    documentContext = input;
    question = q || "";
  }

  return generateInteractionText(
    question,
    buildFollowUpSystemPrompt(documentContext, language, level)
  );
}

export interface GeminiChatOptions {
  message: string;
  history?: Array<{ role: "user" | "nova"; content: string }>;
  language?: SupportedLanguage;
  level?: ReadingLevel;
  documentContext?: string;
}

export async function talkToNovaWithGemini(
  input: string | GeminiChatOptions,
  historyOrOpts?: Array<{ role: "user" | "nova"; content: string }>,
  lang: SupportedLanguage = "en",
  lvl: ReadingLevel = "simple",
  docContext?: string
): Promise<string> {
  let message: string;
  let history: Array<{ role: "user" | "nova"; content: string }> = [];
  let language: SupportedLanguage = lang;
  let level: ReadingLevel = lvl;
  let documentContext: string | undefined = docContext;

  if (typeof input === "object" && input !== null) {
    message = input.message;
    history = input.history || [];
    language = input.language || "en";
    level = input.level || "simple";
    documentContext = input.documentContext;
  } else {
    message = input;
    history = historyOrOpts || [];
  }

  const interactionInput: Interactions.Step[] = history.map((item) => ({
    type: item.role === "nova" ? "model_output" : "user_input",
    content: [{ type: "text", text: item.content }],
  }));

  interactionInput.push({
    type: "user_input",
    content: [{ type: "text", text: message }],
  });

  return generateInteractionText(
    interactionInput,
    buildChatSystemPrompt(language, level, documentContext)
  );
}
