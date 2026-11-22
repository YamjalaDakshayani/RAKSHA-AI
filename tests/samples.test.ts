import { describe, it, expect } from "vitest";
import {
  SAMPLE_DOCUMENTS,
  getCachedSampleResult,
  PRECOMPUTED_SAMPLE_RESULTS,
} from "@/lib/samples";
import { AnalyzeResponseSchema } from "@/lib/schemas";
import { SupportedLanguage, ReadingLevel } from "@/config/app";

describe("Cached Sample Documents", () => {
  it("provides exactly three required samples", () => {
    expect(SAMPLE_DOCUMENTS).toHaveLength(3);
    const ids = SAMPLE_DOCUMENTS.map((s) => s.id);
    expect(ids).toContain("scholarship");
    expect(ids).toContain("exam_fee");
    expect(ids).toContain("scam_alert");
  });

  const languages: SupportedLanguage[] = ["en", "hi", "te", "ta"];
  const levels: ReadingLevel[] = ["simple", "very_simple", "child_friendly"];
  const sampleIds: Array<"scholarship" | "exam_fee" | "scam_alert"> = [
    "scholarship",
    "exam_fee",
    "scam_alert",
  ];

  sampleIds.forEach((sampleId) => {
    languages.forEach((lang) => {
      levels.forEach((lvl) => {
        it(`returns a schema-valid result for sample ${sampleId} in language "${lang}" at level "${lvl}"`, () => {
          const result = getCachedSampleResult(sampleId, lang, lvl);
          expect(result).toBeDefined();

          const validation = AnalyzeResponseSchema.safeParse(result);
          if (!validation.success) {
            console.error(`Validation failed for ${sampleId}_${lang}_${lvl}:`, validation.error);
          }
          expect(validation.success).toBe(true);

          // Verify specific required contents
          expect(result.title.length).toBeGreaterThan(0);
          expect(result.summary.length).toBeGreaterThan(0);
          expect(result.steps.length).toBeGreaterThan(0);
          expect(result.deadline.length).toBeGreaterThan(0);
          expect(result.trust_check).toBeDefined();
          expect(result.glossary.length).toBeGreaterThan(0);
          expect(result.quiz.length).toBeGreaterThan(0);
          expect(result.draft_reply.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it("verifies the suspicious payment sample flags 'scam' verdict", () => {
    const scamResult = getCachedSampleResult("scam_alert", "en", "simple");
    expect(scamResult.trust_check.verdict).toBe("scam");
    expect(scamResult.trust_check.tip).toMatch(/1930|cybercrime\.gov\.in/i);
  });

  it("verifies official scholarship sample flags 'genuine' verdict", () => {
    const scholarshipResult = getCachedSampleResult("scholarship", "en", "simple");
    expect(scholarshipResult.trust_check.verdict).toBe("genuine");
  });
});
