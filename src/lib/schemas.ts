import { z } from "zod";

// =========================================================================
// RAKSHA AI SCHEMAS
// =========================================================================

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export const ThreatAnalysisSchema = z.object({
  risk_level: z.enum(["Low", "Medium", "High", "Critical"]),
  risk_score: z.number().min(0).max(100),
  summary: z.string(),
  suspicious_indicators: z.array(z.string()),
  suspicious_phrases: z.array(z.string()).optional().default([]),
  warning_signs: z.array(z.string()).optional().default([]),
  explanation: z.string(),
  recommended_actions: z.array(z.string()),
  should_avoid_interaction: z.boolean(),
  should_avoid_payment: z.boolean().optional().default(false),
  should_avoid_links: z.boolean().optional().default(false),
  is_likely_scam: z.boolean().optional().default(false),
});

export type ThreatAnalysis = z.infer<typeof ThreatAnalysisSchema>;

export const LinkAnalysisSchema = z.object({
  url: z.string(),
  risk_level: z.enum(["Low", "Medium", "High", "Critical"]),
  risk_score: z.number().min(0).max(100),
  domain: z.string(),
  protocol: z.string(),
  is_https: z.boolean(),
  is_shortener: z.boolean(),
  is_ip_address: z.boolean(),
  is_suspicious_tld: z.boolean(),
  has_punycode: z.boolean(),
  has_excessive_subdomains: z.boolean(),
  typosquatting_detected: z.boolean(),
  detected_brand: z.string().nullable().optional(),
  warnings: z.array(z.string()),
  explanation: z.string(),
  recommendations: z.array(z.string()),
  safe_to_visit: z.boolean(),
});

export type LinkAnalysis = z.infer<typeof LinkAnalysisSchema>;

export const ScanRecordSchema = z.object({
  id: z.string(),
  user_id: z.string().nullable().optional(),
  scan_type: z.enum(["message", "link", "qr"]),
  submitted_content: z.string(),
  risk_level: z.enum(["Low", "Medium", "High", "Critical"]),
  risk_score: z.number().min(0).max(100),
  findings: z.record(z.string(), z.any()),
  recommendation: z.string(),
  created_at: z.string(),
});

export type ScanRecord = z.infer<typeof ScanRecordSchema>;

// =========================================================================
// BACKWARD-COMPATIBLE SCHEMAS
// =========================================================================

const supportedLangs = ["en", "hi", "te", "ta"] as const;
const readingLevels = ["simple", "very_simple", "child_friendly"] as const;

export const AnalyzeRequestSchema = z
  .object({
    text: z.string().max(8000).optional(),
    imageBase64: z.string().optional(),
    imageMime: z.string().optional(),
    language: z.enum(supportedLangs).default("en"),
    level: z.enum(readingLevels).default("simple"),
    saveOriginalText: z.boolean().optional().default(false),
  })
  .refine((data) => Boolean(data.text?.trim() || data.imageBase64), {
    message: "Either text or image must be provided",
  });

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

export const AnalyzeResponseSchema = z.object({
  title: z.string(),
  summary: z.string(),
  steps: z.array(z.string()),
  deadline: z.string(),
  documents_needed: z.array(z.string()),
  risks_if_ignored: z.string(),
  trust_check: z.object({
    verdict: z.enum(["genuine", "careful", "scam"]),
    reason: z.string(),
    tip: z.string(),
  }),
  glossary: z.array(
    z.object({
      term: z.string(),
      meaning: z.string(),
    })
  ),
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      answer_index: z.number(),
      simpler_explanation: z.string(),
    })
  ),
  draft_reply: z.string().optional().default(""),
});

export type AnalyzeResult = z.infer<typeof AnalyzeResponseSchema>;

export const FollowUpRequestSchema = z.object({
  documentContext: z.string().min(1),
  question: z.string().min(1).max(1000),
  language: z.enum(supportedLangs).default("en"),
  level: z.enum(readingLevels).default("simple"),
  analysisId: z.string().uuid().optional(),
  history: z.array(z.any()).optional(),
});

export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  threadId: z.string().uuid().optional(),
  analysisId: z.string().uuid().optional(),
  language: z.enum(supportedLangs).default("en"),
  level: z.enum(readingLevels).default("simple"),
  documentContext: z.string().optional(),
  history: z.array(z.any()).optional(),
});

export const FeedbackRequestSchema = z.object({
  analysisId: z.string().uuid().optional(),
  rating: z.enum(["up", "down"]),
  comment: z.string().max(1000).optional(),
});
